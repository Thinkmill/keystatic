import { useMemo } from 'react';
import { Editor } from 'slate';
import { RenderElementProps, useSelected } from 'slate-react';

import { ActionButton } from '@voussoir/button';
import { Box } from '@voussoir/layout';
import { css, tokenSchema } from '@voussoir/style';
import { Tooltip, TooltipTrigger } from '@voussoir/tooltip';
import { Text, Kbd } from '@voussoir/typography';

import { useToolbarState } from './toolbar-state';
import { insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading } from './utils';
import { Icon } from '@voussoir/icon';
import { minusIcon } from '@voussoir/icon/icons/minusIcon';

export function insertDivider(editor: Editor) {
  insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading(editor, {
    type: 'divider',
    children: [{ text: '' }],
  });
  Editor.insertNode(editor, { type: 'paragraph', children: [{ text: '' }] });
}

const DividerButton = () => {
  const {
    editor,
    dividers: { isDisabled },
  } = useToolbarState();
  return useMemo(
    () => (
      <ActionButton
        prominence="low"
        isDisabled={isDisabled}
        onPress={() => {
          insertDivider(editor);
        }}
      >
        <Icon src={minusIcon} />
      </ActionButton>
    ),
    [editor, isDisabled]
  );
};

export const dividerButton = (
  <TooltipTrigger delay={200}>
    <DividerButton />
    <Tooltip>
      <Text>Divider</Text>
      <Kbd>---</Kbd>
    </Tooltip>
  </TooltipTrigger>
);

export function withDivider(editor: Editor): Editor {
  const { isVoid } = editor;
  editor.isVoid = node => {
    return node.type === 'divider' || isVoid(node);
  };
  return editor;
}

export function DividerElement({ attributes, children }: RenderElementProps) {
  const selected = useSelected();
  return (
    <Box
      {...attributes}
      paddingY="medium"
      UNSAFE_className={css({
        caretColor: 'transparent',
      })}
    >
      <hr
        className={css({
          backgroundColor: selected
            ? tokenSchema.color.alias.borderSelected
            : tokenSchema.color.alias.borderIdle,
          border: 0,
          height: 2,
        })}
      />
      {children}
    </Box>
  );
}
