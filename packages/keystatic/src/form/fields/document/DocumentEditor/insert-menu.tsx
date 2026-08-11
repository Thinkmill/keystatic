import { Fragment, ReactNode, useRef } from 'react';
import { Transforms, Text, Editor, Path, Point, Node } from 'slate';
import { ReactEditor } from 'slate-react';
import { matchSorter } from 'match-sorter';

import { EditorListbox, EditorListboxItem } from '@keystar/ui/editor';
import { Popover } from '@keystar/ui/overlays';
import { css, tokenSchema } from '@keystar/ui/style';

import { insertComponentBlock } from './component-blocks';
import { ComponentBlock } from '../../../api';
import { insertLayout } from './layouts/layouts-ui';
import {
  ToolbarState,
  useDocumentEditorConfig,
  useToolbarState,
} from './toolbar-state';
import { insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading } from './ui-utils';
import { getUploadedImage } from '../../image/ui';
import { isBlock } from './editor';
import { insertTable } from './table/table-ui';

type Option = {
  label: string;
  keywords?: string[];
  insert: (editor: Editor) => void;
};

function getOptions(
  toolbarState: ToolbarState,
  componentBlocks: Record<string, ComponentBlock>
): Option[] {
  const options: (Option | boolean)[] = [
    ...Object.keys(componentBlocks).map(key => ({
      label: componentBlocks[key].label,
      insert: (editor: Editor) => {
        insertComponentBlock(editor, componentBlocks, key);
      },
    })),
    ...toolbarState.textStyles.allowedHeadingLevels
      .filter(a =>
        toolbarState.editorDocumentFeatures.formatting.headings.levels.includes(
          a
        )
      )
      .map(level => ({
        label: `Heading ${level}`,
        insert(editor: Editor) {
          insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
            type: 'heading',
            level,
            children: [{ text: '' }],
          });
        },
      })),
    !toolbarState.blockquote.isDisabled &&
      toolbarState.editorDocumentFeatures.formatting.blockTypes.blockquote && {
        label: 'Blockquote',
        insert(editor) {
          insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
            type: 'blockquote',
            children: [{ text: '' }],
          });
        },
      },
    !toolbarState.code.isDisabled &&
      toolbarState.editorDocumentFeatures.formatting.blockTypes.code && {
        label: 'Code block',
        insert(editor) {
          insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
            type: 'code',
            children: [{ text: '' }],
          });
        },
      },
    !!toolbarState.editorDocumentFeatures.images && {
      label: 'Image',
      async insert(editor) {
        const image = await getUploadedImage();
        if (image) {
          insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
            type: 'image',
            src: image,
            alt: '',
            title: '',
            children: [{ text: '' }],
          });
        }
      },
    },
    !!toolbarState.editorDocumentFeatures.tables && {
      label: 'Table',
      insert: insertTable,
    },
    !toolbarState.dividers.isDisabled &&
      toolbarState.editorDocumentFeatures.dividers && {
        label: 'Divider',
        insert(editor) {
          insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
            type: 'divider',
            children: [{ text: '' }],
          });
        },
      },
    !!toolbarState.editorDocumentFeatures.layouts.length && {
      label: 'Layout',
      insert(editor) {
        insertLayout(editor, toolbarState.editorDocumentFeatures.layouts[0]);
      },
    },
    !toolbarState.lists.ordered.isDisabled &&
      toolbarState.editorDocumentFeatures.formatting.listTypes.ordered && {
        label: 'Numbered List',
        keywords: ['ordered list'],
        insert(editor) {
          insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
            type: 'ordered-list',
            children: [{ text: '' }],
          });
        },
      },
    !toolbarState.lists.unordered.isDisabled &&
      toolbarState.editorDocumentFeatures.formatting.listTypes.unordered && {
        label: 'Bullet List',
        keywords: ['unordered list'],
        insert(editor) {
          insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
            type: 'unordered-list',
            children: [{ text: '' }],
          });
        },
      },
  ];
  return options.filter(
    (x): x is Exclude<typeof x, boolean> => typeof x !== 'boolean'
  );
}

function insertOption(editor: Editor, text: Text, option: Option) {
  const path = ReactEditor.findPath(editor, text);
  Transforms.delete(editor, {
    at: {
      focus: Editor.start(editor, path),
      anchor: Editor.end(editor, path),
    },
  });
  option.insert(editor);
}

export function InsertMenu({
  children,
  text,
}: {
  children: ReactNode;
  text: Text;
}) {
  const toolbarState = useToolbarState();
  const { editor } = toolbarState;
  const { componentBlocks } = useDocumentEditorConfig();
  const options = matchSorter(
    getOptions(toolbarState, componentBlocks),
    text.text.slice(1),
    {
      keys: ['label', 'keywords'],
    }
  ).map((option, index) => ({ ...option, index }));

  const triggerRef = useRef<HTMLSpanElement>(null);
  return (
    <Fragment>
      <span
        className={css({
          color: tokenSchema.color.foreground.accent,
          fontWeight: tokenSchema.typography.fontWeight.medium,
        })}
        ref={triggerRef}
      >
        {children}
      </span>
      <Popover
        width="alias.singleLineWidth"
        placement="bottom start"
        isOpen
        isNonModal
        hideArrow
        triggerRef={triggerRef}
      >
        <div className={css({ overflow: 'scroll', maxHeight: 300 })}>
          <EditorListbox
            aria-label="Insert block"
            items={options}
            onAction={key => {
              insertOption(editor, text, options[key as number]);
            }}
          >
            {item => (
              <EditorListboxItem id={item.index}>
                {item.label}
              </EditorListboxItem>
            )}
          </EditorListbox>
        </div>
      </Popover>
    </Fragment>
  );
}

const nodeListsWithoutInsertMenu = new WeakSet<Node[]>();

const nodesWithoutInsertMenu = new WeakSet<Node>();

function findPathWithInsertMenu(node: Node, path: Path): Path | undefined {
  if (Text.isText(node)) {
    return node.insertMenu ? path : undefined;
  }
  if (nodeListsWithoutInsertMenu.has(node.children)) {
    return;
  }
  for (const [index, child] of node.children.entries()) {
    if (nodesWithoutInsertMenu.has(child)) continue;
    let maybePath = findPathWithInsertMenu(child, [...path, index]);
    if (maybePath) {
      return maybePath;
    }
    nodesWithoutInsertMenu.add(child);
  }
  nodeListsWithoutInsertMenu.add(node.children);
}

function removeInsertMenuMarkWhenOutsideOfSelection(editor: Editor) {
  const path = findPathWithInsertMenu(editor, []);
  if (
    path &&
    !Editor.marks(editor)?.insertMenu &&
    (!editor.selection ||
      !Path.equals(editor.selection.anchor.path, path) ||
      !Path.equals(editor.selection.focus.path, path))
  ) {
    Transforms.unsetNodes(editor, 'insertMenu', { at: path });
    return true;
  }
  return false;
}

export function withInsertMenu(editor: Editor): Editor {
  const { normalizeNode, apply, insertText } = editor;
  editor.normalizeNode = ([node, path]) => {
    if (Text.isText(node) && node.insertMenu) {
      if (node.text[0] !== '/') {
        Transforms.unsetNodes(editor, 'insertMenu', { at: path });
        return;
      }
      const whitespaceMatch = /\s/.exec(node.text);
      if (whitespaceMatch) {
        Transforms.unsetNodes(editor, 'insertMenu', {
          at: {
            anchor: { path, offset: whitespaceMatch.index },
            focus: Editor.end(editor, path),
          },
          match: Text.isText,
          split: true,
        });
        return;
      }
    }
    if (
      Editor.isEditor(editor) &&
      removeInsertMenuMarkWhenOutsideOfSelection(editor)
    ) {
      return;
    }
    normalizeNode([node, path]);
  };

  editor.apply = op => {
    apply(op);
    // we're calling this here AND in normalizeNode
    // because normalizeNode won't be called on selection changes
    // but apply will
    // we're still calling this from normalizeNode though because we want it to happen
    // when normalization happens
    if (op.type === 'set_selection') {
      removeInsertMenuMarkWhenOutsideOfSelection(editor);
    }
  };

  editor.insertText = text => {
    insertText(text);
    if (editor.selection && text === '/') {
      const startOfBlock = Editor.start(
        editor,
        Editor.above(editor, {
          match: isBlock,
        })![1]
      );
      const before = Editor.before(editor, editor.selection.anchor, {
        unit: 'character',
      });
      if (
        before &&
        (Point.equals(startOfBlock, before) ||
          (before.offset !== 0 &&
            /\s/.test(
              (Node.get(editor, before.path) as Text).text[before.offset - 1]
            )))
      ) {
        Transforms.setNodes(
          editor,
          { insertMenu: true },
          {
            at: { anchor: before, focus: editor.selection.anchor },
            match: Text.isText,
            split: true,
          }
        );
      }
    }
  };
  return editor;
}
