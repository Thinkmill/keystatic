import {
  DragPreview,
  DroppableCollectionOptions,
  isVirtualDragging,
  useDraggableCollection,
  useDraggableItem,
  useDropIndicator,
  useDroppableCollection,
  useDroppableItem,
} from '@react-aria/dnd';
import {
  DraggableCollectionStateOptions,
  DroppableCollectionState,
  DroppableCollectionStateOptions,
  useDraggableCollectionState,
  useDroppableCollectionState,
} from '@react-stately/dnd';
import { RefObject, useMemo } from 'react';

import {
  DragAndDropHooks,
  DragAndDropOptions,
  DragHooks,
  DropHooks,
} from './types';

/**
 * Provides the hooks required to enable drag and drop behavior for a drag and
 * drop compatible component.
 */
// NOTE: if more components become drag-n-droppable move elsewhere.
export function useDragAndDrop(options: DragAndDropOptions): DragAndDropHooks {
  let dragAndDropHooks = useMemo(() => {
    let { onDrop, onInsert, onItemDrop, onReorder, onRootDrop, getItems } =
      options;

    let isDraggable = !!getItems;
    let isDroppable = !!(
      onDrop ||
      onInsert ||
      onItemDrop ||
      onReorder ||
      onRootDrop
    );

    let hooks = {} as DragHooks &
      DropHooks & { isVirtualDragging?: () => boolean };
    if (isDraggable) {
      // @ts-expect-error
      hooks.useDraggableCollectionState =
        function useDraggableCollectionStateOverride(
          props: DraggableCollectionStateOptions
        ) {
          return useDraggableCollectionState({ ...props, ...options });
        };
      hooks.useDraggableCollection = useDraggableCollection;
      hooks.useDraggableItem = useDraggableItem;
      hooks.DragPreview = DragPreview;
    }

    if (isDroppable) {
      // eslint-disable-next-line no-unused-expressions
      (hooks.useDroppableCollectionState =
        function useDroppableCollectionStateOverride(
          props: DroppableCollectionStateOptions
        ) {
          return useDroppableCollectionState({ ...props, ...options });
        }),
        (hooks.useDroppableItem = useDroppableItem);
      hooks.useDroppableCollection = function useDroppableCollectionOverride(
        props: DroppableCollectionOptions,
        state: DroppableCollectionState,
        ref: RefObject<HTMLElement>
      ) {
        return useDroppableCollection({ ...props, ...options }, state, ref);
      };
      hooks.useDropIndicator = useDropIndicator;
    }

    if (isDraggable || isDroppable) {
      hooks.isVirtualDragging = isVirtualDragging;
    }

    return hooks;
  }, [options]);

  return { dragAndDropHooks };
}
