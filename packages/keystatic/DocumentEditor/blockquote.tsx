import { useMemo } from 'react';
import { Editor, Node, Path, Range, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';

import { ActionButton } from '@voussoir/button';
import { quoteIcon } from '@voussoir/icon/icons/quoteIcon';
import { Icon } from '@voussoir/icon';
import { Box } from '@voussoir/layout';
import { css, tokenSchema } from '@voussoir/style';
import { TooltipTrigger, Tooltip } from '@voussoir/tooltip';
import { Kbd, Text } from '@voussoir/typography';

import { useToolbarState } from './toolbar-state';
import { isElementActive } from './utils';

export const insertBlockquote = (editor: Editor) => {
  const isActive = isElementActive(editor, 'blockquote');
  if (isActive) {
    Transforms.unwrapNodes(editor, {
      match: node => node.type === 'blockquote',
    });
  } else {
    Transforms.wrapNodes(editor, {
      type: 'blockquote',
      children: [],
    });
  }
};

function getDirectBlockquoteParentFromSelection(editor: Editor) {
  if (!editor.selection) return { isInside: false } as const;
  const [, parentPath] = Editor.parent(editor, editor.selection);
  if (!parentPath.length) {
    return { isInside: false } as const;
  }
  const [maybeBlockquoteParent, maybeBlockquoteParentPath] = Editor.parent(
    editor,
    parentPath
  );
  const isBlockquote = maybeBlockquoteParent.type === 'blockquote';
  return isBlockquote
    ? ({ isInside: true, path: maybeBlockquoteParentPath } as const)
    : ({ isInside: false } as const);
}

export function withBlockquote(editor: Editor): Editor {
  const { insertBreak, deleteBackward } = editor;
  editor.deleteBackward = unit => {
    if (editor.selection) {
      const parentBlockquote = getDirectBlockquoteParentFromSelection(editor);
      if (
        parentBlockquote.isInside &&
        Range.isCollapsed(editor.selection) &&
        // the selection is at the start of the paragraph
        editor.selection.anchor.offset === 0 &&
        // it's the first paragraph in the panel
        editor.selection.anchor.path[
          editor.selection.anchor.path.length - 2
        ] === 0
      ) {
        Transforms.unwrapNodes(editor, {
          match: node => node.type === 'blockquote',
          split: true,
        });
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.insertBreak = () => {
    const panel = getDirectBlockquoteParentFromSelection(editor);
    if (editor.selection && panel.isInside) {
      const [node, nodePath] = Editor.node(editor, editor.selection);
      if (Path.isDescendant(nodePath, panel.path) && Node.string(node) === '') {
        Transforms.unwrapNodes(editor, {
          match: node => node.type === 'blockquote',
          split: true,
        });
        return;
      }
    }
    insertBreak();
  };

  return editor;
}

export const BlockquoteElement = ({
  attributes,
  children,
}: RenderElementProps) => {
  return (
    <Box
      paddingStart="xlarge"
      elementType="blockquote"
      position="relative"
      UNSAFE_className={css({
        // fontSize: tokenSchema.fontsize.text.regular.size,
        p: { color: 'inherit', fontSize: 'inherit' },
        '&::before': {
          color: tokenSchema.color.background.accent,
          pointerEvents: 'none',
          userSelect: 'none',
          content: '"\\201C"',
          fontSize: '7em',
          insetBlockStart: 0,
          insetInlineStart: 0,
          lineHeight: 1,
          position: 'absolute',
          transform: 'translate(-55%, -20%)',
          zIndex: -1,
        },
      })}
      {...attributes}
    >
      {children}
    </Box>
  );
};

const BlockquoteButton = () => {
  const {
    editor,
    blockquote: { isDisabled, isSelected },
  } = useToolbarState();
  return useMemo(
    () => (
      <ActionButton
        prominence="low"
        isSelected={isSelected}
        isDisabled={isDisabled}
        onPress={() => {
          insertBlockquote(editor);
          ReactEditor.focus(editor);
        }}
      >
        <Icon src={quoteIcon} />
      </ActionButton>
    ),
    [editor, isDisabled, isSelected]
  );
};
export const blockquoteButton = (
  <TooltipTrigger>
    <BlockquoteButton />
    <Tooltip>
      <Text>Quote</Text>
      <Kbd>{'>⎵'}</Kbd>
    </Tooltip>
  </TooltipTrigger>
);
