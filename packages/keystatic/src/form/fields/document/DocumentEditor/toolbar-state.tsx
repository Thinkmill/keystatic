import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { Editor, Range, Text } from 'slate';
import { useSlate } from 'slate-react';
import { DocumentFeatures } from './document-features';
import { ComponentBlock } from '../../../api';
import { DocumentFeaturesForChildField } from './component-blocks/utils';
import { isListNode } from './lists/with-list';

import {
  allMarks,
  getAncestorComponentChildFieldDocumentFeatures,
  isElementActive,
  Mark,
  nodeTypeMatcher,
} from './utils';
import { isBlock } from './editor';

type BasicToolbarItem = { isSelected: boolean; isDisabled: boolean };

// component blocks are not in the ToolbarState because they're inserted in the closest available place and the selected state is not shown in the toolbar

// note that isDisabled being false here does not mean the action should be allowed
// it means that the action should be allowed if isDisabled is false AND the relevant document feature is enabled
// (because things are hidden if they're not enabled in the editor document features)
export type ToolbarState = {
  textStyles: {
    selected: 'normal' | 1 | 2 | 3 | 4 | 5 | 6;
    allowedHeadingLevels: (1 | 2 | 3 | 4 | 5 | 6)[];
  };
  marks: {
    [key in Mark]: BasicToolbarItem;
  };
  clearFormatting: {
    isDisabled: boolean;
  };
  alignment: {
    selected: 'start' | 'center' | 'end';
    isDisabled: boolean;
  };
  lists: { ordered: BasicToolbarItem; unordered: BasicToolbarItem };
  links: BasicToolbarItem;
  blockquote: BasicToolbarItem;
  // note that layouts can't be disabled because they are inserted
  // so they will be inserted to the closest valid location
  // unlike the other things here which wrap elements
  layouts: { isSelected: boolean };
  dividers: { isDisabled: boolean };
  code: BasicToolbarItem;
  editor: Editor;
  editorDocumentFeatures: DocumentFeatures;
};

const ToolbarStateContext = React.createContext<null | ToolbarState>(null);

export function useToolbarState() {
  const toolbarState = useContext(ToolbarStateContext);
  if (!toolbarState) {
    throw new Error('ToolbarStateProvider must be used to use useToolbarState');
  }
  return toolbarState;
}

export const createToolbarState = (
  editor: Editor,
  componentBlocks: Record<string, ComponentBlock>,
  editorDocumentFeatures: DocumentFeatures
): ToolbarState => {
  const locationDocumentFeatures: DocumentFeaturesForChildField =
    getAncestorComponentChildFieldDocumentFeatures(
      editor,
      editorDocumentFeatures,
      componentBlocks
    ) || {
      kind: 'block',
      inlineMarks: 'inherit',
      documentFeatures: {
        dividers: true,
        formatting: {
          alignment: { center: true, end: true },
          blockTypes: {
            blockquote: true,
            code: editorDocumentFeatures.formatting.blockTypes.code,
          },
          headings: editorDocumentFeatures.formatting.headings,
          listTypes: { ordered: true, unordered: true },
        },
        layouts: editorDocumentFeatures.layouts,
        links: true,
        images: editorDocumentFeatures.images,
        tables: true,
      },
      softBreaks: true,
      componentBlocks: true,
    };

  let [maybeCodeBlockEntry] = Editor.nodes(editor, {
    match: node => node.type !== 'code' && isBlock(node),
  });
  const editorMarks = Editor.marks(editor) || {};
  const marks = Object.fromEntries(
    allMarks.map(mark => [
      mark,
      {
        isDisabled:
          (locationDocumentFeatures.inlineMarks !== 'inherit' &&
            !locationDocumentFeatures.inlineMarks[mark]) ||
          !maybeCodeBlockEntry,
        isSelected: !!editorMarks[mark],
      },
    ])
  ) as ToolbarState['marks'];

  // Editor.marks is "what are the marks that would be applied if text was inserted now"
  // that's not really the UX we want, if we have some a document like this
  // <paragraph>
  //   <text>
  //     <anchor />
  //     content
  //   </text>
  //   <text bold>bold</text>
  //   <text>
  //     content
  //     <focus />
  //   </text>
  // </paragraph>

  // we want bold to be shown as selected even though if you inserted text from that selection, it wouldn't be bold
  // so we look at all the text nodes in the selection to get their marks
  // but only if the selection is expanded because if you're in the middle of some text
  // with your selection collapsed with a mark but you've removed it(i.e. editor.removeMark)
  // the text nodes you're in will have the mark but the ui should show the mark as not being selected
  if (editor.selection && Range.isExpanded(editor.selection)) {
    for (const node of Editor.nodes(editor, { match: Text.isText })) {
      for (const key of Object.keys(node[0])) {
        if (key === 'insertMenu' || key === 'text') {
          continue;
        }
        if (key in marks) {
          marks[key as Mark].isSelected = true;
        }
      }
    }
  }

  let [headingEntry] = Editor.nodes(editor, {
    match: nodeTypeMatcher('heading'),
  });

  let [listEntry] = Editor.nodes(editor, {
    match: isListNode,
  });

  let [alignableEntry] = Editor.nodes(editor, {
    match: nodeTypeMatcher('paragraph', 'heading'),
  });

  // (we're gonna use markdown here because the equivelant slate structure is quite large and doesn't add value here)
  // let's imagine a document that looks like this:
  // - thing
  //   1. something<cursor />
  // in the toolbar, you don't want to see that both ordered and unordered lists are selected
  // you want to see only ordered list selected, because
  // - you want to know what list you're actually in, you don't really care about the outer list
  // - when you want to change the list to a unordered list, the unordered list button should be inactive to show you can change to it
  const listTypeAbove = getListTypeAbove(editor);

  return {
    marks,
    textStyles: {
      selected: headingEntry ? headingEntry[0].level : 'normal',
      allowedHeadingLevels:
        locationDocumentFeatures.kind === 'block' && !listEntry
          ? locationDocumentFeatures.documentFeatures.formatting.headings.levels
          : [],
    },
    code: {
      isSelected: isElementActive(editor, 'code'),
      isDisabled: !(
        locationDocumentFeatures.kind === 'block' &&
        locationDocumentFeatures.documentFeatures.formatting.blockTypes.code
      ),
    },
    lists: {
      ordered: {
        isSelected:
          isElementActive(editor, 'ordered-list') &&
          (listTypeAbove === 'none' || listTypeAbove === 'ordered-list'),
        isDisabled: !(
          locationDocumentFeatures.kind === 'block' &&
          locationDocumentFeatures.documentFeatures.formatting.listTypes
            .ordered &&
          !headingEntry
        ),
      },
      unordered: {
        isSelected:
          isElementActive(editor, 'unordered-list') &&
          (listTypeAbove === 'none' || listTypeAbove === 'unordered-list'),
        isDisabled: !(
          locationDocumentFeatures.kind === 'block' &&
          locationDocumentFeatures.documentFeatures.formatting.listTypes
            .unordered &&
          !headingEntry
        ),
      },
    },
    alignment: {
      isDisabled:
        !alignableEntry &&
        !(
          locationDocumentFeatures.kind === 'block' &&
          locationDocumentFeatures.documentFeatures.formatting.alignment
        ),
      selected: alignableEntry?.[0].textAlign || 'start',
    },
    blockquote: {
      isDisabled: !(
        locationDocumentFeatures.kind === 'block' &&
        locationDocumentFeatures.documentFeatures.formatting.blockTypes
          .blockquote
      ),
      isSelected: isElementActive(editor, 'blockquote'),
    },
    layouts: { isSelected: isElementActive(editor, 'layout') },
    links: {
      isDisabled:
        !editor.selection ||
        Range.isCollapsed(editor.selection) ||
        !locationDocumentFeatures.documentFeatures.links,
      isSelected: isElementActive(editor, 'link'),
    },
    editor,
    dividers: {
      isDisabled:
        locationDocumentFeatures.kind === 'inline' ||
        !locationDocumentFeatures.documentFeatures.dividers,
    },
    clearFormatting: {
      isDisabled: !(
        Object.values(marks).some(x => x.isSelected) ||
        !!hasBlockThatClearsOnClearFormatting(editor)
      ),
    },
    editorDocumentFeatures,
  };
};

function hasBlockThatClearsOnClearFormatting(editor: Editor) {
  const [node] = Editor.nodes(editor, {
    match: node =>
      node.type === 'heading' ||
      node.type === 'code' ||
      node.type === 'blockquote',
  });
  return !!node;
}

export function getListTypeAbove(
  editor: Editor
): 'none' | 'ordered-list' | 'unordered-list' {
  const listAbove = Editor.above(editor, { match: isListNode });
  if (!listAbove) {
    return 'none';
  }
  return listAbove[0].type;
}

export const DocumentEditorConfigContext = createContext<null | {
  documentFeatures: DocumentFeatures;
  componentBlocks: Record<string, ComponentBlock>;
}>(null);

export function useDocumentEditorConfig() {
  const context = useContext(DocumentEditorConfigContext);
  if (!context) {
    throw new Error(
      'useDocumentEditorConfig must be used within a DocumentEditorConfigContext.Provider'
    );
  }
  return context;
}

export const ToolbarStateProvider = ({
  children,
  componentBlocks,
  editorDocumentFeatures,
}: {
  children: ReactNode;
  componentBlocks: Record<string, ComponentBlock>;
  editorDocumentFeatures: DocumentFeatures;
}) => {
  const editor = useSlate();

  return (
    <DocumentEditorConfigContext.Provider
      value={useMemo(
        () => ({ componentBlocks, documentFeatures: editorDocumentFeatures }),
        [componentBlocks, editorDocumentFeatures]
      )}
    >
      <ToolbarStateContext.Provider
        value={createToolbarState(
          editor,
          componentBlocks,
          editorDocumentFeatures
        )}
      >
        {children}
      </ToolbarStateContext.Provider>
    </DocumentEditorConfigContext.Provider>
  );
};
