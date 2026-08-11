import { useDragAndDrop as useReactAriaDragAndDrop } from 'react-aria-components/useDragAndDrop';

import type { DragAndDropHooks, DragAndDropOptions } from './types';

/**
 * Provides the hooks required to enable drag and drop behavior for a drag and
 * drop compatible collection component.
 *
 * This exposes the public React Aria Components drag-and-drop API.
 */
export function useDragAndDrop(options: DragAndDropOptions): DragAndDropHooks {
  return useReactAriaDragAndDrop(options);
}
