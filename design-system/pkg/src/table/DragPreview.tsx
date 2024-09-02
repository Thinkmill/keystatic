import { Text } from '@keystar/ui/typography';
import { Flex } from '@keystar/ui/layout';
import React from 'react';

import { rowDragPreviewClassname } from './styles';

type DragPreviewProps = {
  itemText?: string; // can't guarantee this will be available
  itemCount: number;
  height: number;
  maxWidth?: number;
};

export function DragPreview(props: DragPreviewProps) {
  let { itemText, itemCount, height, maxWidth } = props;
  let isDraggingMultiple = itemCount > 1;
  return (
    /* TODO: export as `DragPreview` from "@keystar/ui/drag-and-drop" for use here and in the list view */
    <Flex
      alignItems="center"
      justifyContent="space-between"
      data-multi={isDraggingMultiple}
      UNSAFE_className={rowDragPreviewClassname}
      UNSAFE_style={{ height, maxWidth }}
    >
      <Text>{itemText}</Text>

      {/* TODO: export as `DragPreviewCount` from "@keystar/ui/drag-and-drop" for use here and in the list view */}
      {isDraggingMultiple && (
        <Flex
          alignItems="center"
          backgroundColor="accentEmphasis"
          borderRadius="small"
          gridArea="badge"
          justifyContent="center"
          minWidth="element.small"
          padding="small"
        >
          <Text align="center" color="inverse" size="small" weight="medium">
            {itemCount}
          </Text>
        </Flex>
      )}
    </Flex>
  );
}
