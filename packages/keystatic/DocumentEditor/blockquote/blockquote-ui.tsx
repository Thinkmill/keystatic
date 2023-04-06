import { useMemo } from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';

import { ActionButton } from '@voussoir/button';
import { quoteIcon } from '@voussoir/icon/icons/quoteIcon';
import { Icon } from '@voussoir/icon';
import { css, tokenSchema } from '@voussoir/style';
import { TooltipTrigger, Tooltip } from '@voussoir/tooltip';
import { Kbd, Text } from '@voussoir/typography';

import { useToolbarState } from '../toolbar-state';
import { isElementActive } from '../utils';

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

export const BlockquoteElement = ({
  attributes,
  children,
}: RenderElementProps) => {
  return (
    <blockquote
      className={css({
        borderInlineStart: `0.25em solid ${tokenSchema.color.border.neutral}`,
        paddingInline: '1em',
        margin: '2em',
        marginLeft: 0,
        marginRight: 0,
        position: 'relative',
      })}
      {...attributes}
    >
      {children}
    </blockquote>
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
