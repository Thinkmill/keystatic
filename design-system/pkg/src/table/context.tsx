import type { DragAndDropHooks } from '@keystar/ui/drag-and-drop';

import type {
  DraggableCollectionState,
  DroppableCollectionState,
} from '@react-stately/dnd';
import { TableState } from '@react-stately/table';
import type { ColumnSize } from '@react-types/table';
import type { Key } from '@react-types/shared';
import {
  type HTMLAttributes,
  type ReactElement,
  type RefObject,
  createContext,
  useContext,
} from 'react';

import { TableViewLayout } from './TableViewLayout';
import { TableCosmeticConfig } from './types';

export type TableContextValue<T> = {
  cosmeticConfig: TableCosmeticConfig;
  dragAndDropHooks?: DragAndDropHooks['dragAndDropHooks'];
  dragState?: DraggableCollectionState;
  dropState?: DroppableCollectionState;
  headerMenuOpen: boolean;
  headerRowHovered: boolean;
  isEmpty: boolean;
  isInResizeMode: boolean;
  isTableDraggable: boolean;
  isTableDroppable: boolean;
  layout: TableViewLayout<T>;
  onFocusedResizer: () => void;
  onResize: (widths: Map<Key, ColumnSize>) => void;
  onResizeEnd: (widths: Map<Key, ColumnSize>) => void;
  onResizeStart: (widths: Map<Key, ColumnSize>) => void;
  renderEmptyState?: () => ReactElement;
  setHeaderMenuOpen: (val: boolean) => void;
  setIsInResizeMode: (val: boolean) => void;
  state: TableState<T>;
};

export const TableContext = createContext<TableContextValue<unknown> | null>(
  null
);
export function useTableContext() {
  const context = useContext(TableContext);
  if (context === null) {
    throw new Error('TableContext not found');
  }
  return context;
}

type VirtualizerContextValue = {
  key: Key | null;
  width: number;
};
export const VirtualizerContext = createContext<VirtualizerContextValue | null>(
  null
);
export function useVirtualizerContext() {
  const context = useContext(VirtualizerContext);
  if (context === null) {
    throw new Error('VirtualizerContext not found');
  }
  return context;
}

type TableRowContextValue = {
  dragButtonProps: HTMLAttributes<HTMLDivElement>;
  dragButtonRef: RefObject<HTMLDivElement>;
  isFocusVisibleWithin: boolean;
  isHovered: boolean;
};
export const TableRowContext = createContext<TableRowContextValue | null>(null);
export function useTableRowContext() {
  const context = useContext(TableRowContext);
  if (context === null) {
    throw new Error('TableRowContext not found');
  }
  return context;
}
