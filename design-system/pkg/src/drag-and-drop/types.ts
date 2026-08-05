import type {
  DragAndDropHooks as ReactAriaDragAndDropHooks,
  DragAndDropOptions as ReactAriaDragAndDropOptions,
} from 'react-aria-components/useDragAndDrop';

export interface DragAndDropHooks {
  /** Drag and drop hooks for the collection element. */
  dragAndDropHooks: ReactAriaDragAndDropHooks;
}

export interface DragAndDropOptions extends ReactAriaDragAndDropOptions {}
