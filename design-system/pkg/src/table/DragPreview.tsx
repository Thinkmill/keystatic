import { classNames } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { Flex } from '@keystar/ui/layout';
import React from 'react';

import {
  cellClassname,
  cellContentsClassname,
  rowClassname,
  rowDragPreviewClassname,
} from './styles';

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
    <Flex
      alignItems="center"
      justifyContent="space-between"
      data-multiple={isDraggingMultiple}
      UNSAFE_className={classNames(rowClassname, rowDragPreviewClassname)}
      UNSAFE_style={{ height, maxWidth }}
    >
      <div className={cellClassname}>
        <Text UNSAFE_className={cellContentsClassname}>{itemText}</Text>
      </div>

      {/* export as `DragPreviewCount` from "@keystar/ui/drag-and-drop" for use here and in the list view */}
      {isDraggingMultiple && (
        <Flex
          alignItems="center"
          justifyContent="center"
          backgroundColor="accentEmphasis"
          borderRadius="small"
          gridArea="badge"
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
