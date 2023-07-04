import type {
  DraggableCollectionState,
  DroppableCollectionState,
} from '@react-stately/dnd';
import { ListLayout } from '@react-stately/layout';
import { ListState } from '@react-stately/list';
import { LoadingState } from '@react-types/shared';
import { Key, createContext, useContext } from 'react';

import { DragAndDropHooks } from '@keystar/ui/drag-and-drop';

interface ListViewContextValue<T> {
  density: 'compact' | 'regular' | 'spacious';
  dragAndDropHooks: DragAndDropHooks['dragAndDropHooks'];
  dragState: DraggableCollectionState;
  dropState: DroppableCollectionState;
  isListDraggable: boolean;
  isListDroppable: boolean;
  layout: ListLayout<T>;
  loadingState: LoadingState;
  onAction: (key: Key) => void;
  overflowMode: 'wrap' | 'truncate';
  state: ListState<T>;
}

export const ListViewContext =
  // @ts-expect-error
  createContext<ListViewContextValue<unknown>>(null);

export const ListViewProvider = ListViewContext.Provider;

export function useListViewContext<T>() {
  let context = useContext(ListViewContext);
  if (!context) {
    throw new Error(
      'Attempt to access `ListViewContext` outside of its provided.'
    );
  }
  return context as ListViewContextValue<T>;
}
