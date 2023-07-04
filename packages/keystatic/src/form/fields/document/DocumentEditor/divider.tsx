import { useMemo } from 'react';
import { Editor } from 'slate';
import { RenderElementProps, useSelected } from 'slate-react';

import { ActionButton } from '@keystar/ui/button';
import { Box } from '@keystar/ui/layout';
import { css, tokenSchema } from '@keystar/ui/style';
import { Tooltip, TooltipTrigger } from '@keystar/ui/tooltip';
import { Text, Kbd } from '@keystar/ui/typography';

import { useToolbarState } from './toolbar-state';
import { insertNodesButReplaceIfSelectionIsAtEmptyParagraphOrHeading } from './ui-utils';
import { Icon } from '@keystar/ui/icon';
import { minusIcon } from '@keystar/ui/icon/icons/minusIcon';

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
