import { Fragment, ReactNode, useEffect, useRef } from 'react';
import { Transforms, Text, Editor, Path, Point, Node } from 'slate';
import { ReactEditor } from 'slate-react';
import { matchSorter } from 'match-sorter';
import scrollIntoView from 'scroll-into-view-if-needed';
import { useOverlayTrigger } from '@react-aria/overlays';
import { useListState } from '@react-stately/list';
import { useOverlayTriggerState } from '@react-stately/overlays';

import { Item, ListBoxBase, useListBoxLayout } from '@keystar/ui/listbox';
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

  const stateRef = useRef({ options, text });

  useEffect(() => {
    stateRef.current = { options, text };
  });

  const listenerRef = useRef((_event: KeyboardEvent) => {});
  useEffect(() => {
    listenerRef.current = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      switch (event.key) {
        case 'ArrowDown': {
          if (stateRef.current.options.length) {
            event.preventDefault();
            state.selectionManager.setFocused(true);
            state.selectionManager.setFocusedKey(
              (Number(state.selectionManager.focusedKey) ===
              stateRef.current.options.length - 1
                ? 0
                : Number(state.selectionManager.focusedKey) + 1
              ).toString()
            );
          }
          return;
        }
        case 'ArrowUp': {
          if (stateRef.current.options.length) {
            event.preventDefault();
            state.selectionManager.setFocused(true);
            state.selectionManager.setFocusedKey(
              (state.selectionManager.focusedKey === '0'
                ? stateRef.current.options.length - 1
                : Number(state.selectionManager.focusedKey) - 1
              ).toString()
            );
          }
          return;
        }
        case 'Enter': {
          const option =
            stateRef.current.options[Number(state.selectionManager.focusedKey)];
          if (option) {
            insertOption(editor, stateRef.current.text, option);
            event.preventDefault();
          }
          return;
        }
        case 'Escape': {
          const path = ReactEditor.findPath(editor, stateRef.current.text);
          Transforms.unsetNodes(editor, 'insertMenu', { at: path });
          event.preventDefault();
          return;
        }
      }
    };
  });

  useEffect(() => {
    const domNode = ReactEditor.toDOMNode(editor, editor);
    let listener = (event: KeyboardEvent) => listenerRef.current(event);
    domNode.addEventListener('keydown', listener);
    return () => {
      domNode.removeEventListener('keydown', listener);
    };
  }, [editor]);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const overlayState = useOverlayTriggerState({ isOpen: true });
  const {
    triggerProps: { onPress, ...triggerProps },
    overlayProps,
  } = useOverlayTrigger({ type: 'listbox' }, overlayState, triggerRef);
  let state = useListState({
    items: options,
    children: item => <Item key={item.index}>{item.label}</Item>,
  });

  useEffect(() => {
    if (!state.selectionManager.isFocused && state.collection.size) {
      state.selectionManager.setFocused(true);
      state.selectionManager.setFocusedKey('0');
    }
  }, [state]);
  const scrollableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = scrollableRef.current?.querySelector(
      '[role="listbox"] [role="presentation"]'
    )?.children[state.selectionManager.focusedKey as number];
    if (element) {
      scrollIntoView(element, {
        scrollMode: 'if-needed',
        boundary: scrollableRef.current,
        block: 'nearest',
      });
    }
  }, [state.selectionManager.focusedKey]);
  const listboxRef = useRef(null);
  let layout = useListBoxLayout();
  return (
    <Fragment>
      <span
        {...triggerProps}
        role="button"
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
        isNonModal
        hideArrow
        {...overlayProps}
        state={overlayState}
        triggerRef={triggerRef}
      >
        <div
          className={css({ overflow: 'scroll', maxHeight: 300 })}
          ref={scrollableRef}
        >
          <ListBoxBase
            aria-label="Insert block"
            state={state}
            shouldUseVirtualFocus
            layout={layout}
            ref={listboxRef}
            onAction={key => {
              insertOption(editor, text, options[key as number]);
            }}
          />
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
