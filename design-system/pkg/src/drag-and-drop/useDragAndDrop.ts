/* eslint-disable react-compiler/react-compiler */
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
import type { Key } from '@react-types/shared';
import { RefObject, useMemo } from 'react';

import {
  DragAndDropHooks,
  DragAndDropOptions,
  DragHooks,
  DropHooks,
} from './types';

/**
 * Provides the hooks required to enable drag and drop behavior for a drag and drop compatible React Spectrum component.
 */
export function useDragAndDrop(options: DragAndDropOptions): DragAndDropHooks {
  let dragAndDropHooks = useMemo(() => {
    let {
      onDrop,
      onInsert,
      onItemDrop,
      onReorder,
      onRootDrop,
      getItems,
      renderPreview,
    } = options;

    let isDraggable = !!getItems;
    let isDroppable = !!(
      onDrop ||
      onInsert ||
      onItemDrop ||
      onReorder ||
      onRootDrop
    );

    let hooks = {} as DragHooks &
      DropHooks & {
        isVirtualDragging?: () => boolean;
        renderPreview?: (keys: Set<Key>, draggedKey: Key | null) => JSX.Element;
      };
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
      hooks.renderPreview = renderPreview;
    }

    if (isDroppable) {
      hooks.useDroppableCollectionState =
        function useDroppableCollectionStateOverride(
          props: DroppableCollectionStateOptions
        ) {
          return useDroppableCollectionState({ ...props, ...options });
        };
      hooks.useDroppableItem = useDroppableItem;
      hooks.useDroppableCollection = function useDroppableCollectionOverride(
        props: DroppableCollectionOptions,
        state: DroppableCollectionState,
        ref: RefObject<HTMLElement | null>
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
