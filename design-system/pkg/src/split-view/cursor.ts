import { CursorState } from './types';

let currentState: CursorState | null = null;
let element: HTMLStyleElement | null = null;

export function getCursorStyle(state: CursorState, isReversed: boolean) {
  switch (state) {
    case 'horizontal':
      return 'ew-resize';
    case 'horizontal-max':
      return isReversed ? 'e-resize' : 'w-resize';
    case 'horizontal-min':
      return isReversed ? 'w-resize' : 'e-resize';
  }
}
export function resetGlobalCursorStyle() {
  if (element !== null) {
    document.head.removeChild(element);

    currentState = null;
    element = null;
  }
}
export function setGlobalCursorStyle(state: CursorState, isReversed: boolean) {
  if (currentState === state) {
    return;
  }

  currentState = state;

  const style = getCursorStyle(state, isReversed);

  if (element === null) {
    element = document.createElement('style');

    document.head.appendChild(element);
  }

  element.innerHTML = `*{cursor: ${style}!important;}`;
}
