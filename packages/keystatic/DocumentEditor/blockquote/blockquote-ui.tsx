import { useMemo } from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor, RenderElementProps } from 'slate-react';

import { ActionButton } from '@voussoir/button';
import { quoteIcon } from '@voussoir/icon/icons/quoteIcon';
import { Icon } from '@voussoir/icon';
import { TooltipTrigger, Tooltip } from '@voussoir/tooltip';
import { Kbd, Text } from '@voussoir/typography';

import { useToolbarState } from '../toolbar-state';
import { isElementActive } from '../utils';
import { Box } from '@voussoir/layout';
import { blockElementSpacing } from '../ui-utils';

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
    <Box
      UNSAFE_className={blockElementSpacing}
      borderColor="neutral"
      marginX={0}
      paddingX="large"
      borderStartStyle="solid"
      borderStartWidth="large"
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
