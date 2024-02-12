import { act, fireEvent } from '@testing-library/react';
import { pointerKey } from '@testing-library/user-event';
import { afterAll, beforeAll, jest } from '@jest/globals';

export const KEYS = {
  ArrowLeft: { key: 'ArrowLeft', code: 37, charCode: 37 },
  ArrowUp: { key: 'ArrowUp', code: 38, charCode: 38 },
  ArrowRight: { key: 'ArrowRight', code: 39, charCode: 39 },
  ArrowDown: { key: 'ArrowDown', code: 40, charCode: 40 },
  Enter: { key: 'Enter', code: 13, charCode: 13 },
  Escape: { key: 'Escape', code: 27, charCode: 27 },
  Space: { key: ' ', code: 32, charCode: 32 },
};
export const DEFAULT_LONG_PRESS_TIME = 500;

// Handlers
// -----------------------------------------------------------------------------

export function firePress(
  element: Element | Node | Document | Window,
  opts = {}
) {
  fireEvent.mouseDown(element, { detail: 1, ...opts });
  fireEvent.mouseUp(element, { detail: 1, ...opts });
  fireEvent.click(element, { detail: 1, ...opts });
}
export function fireTouch(
  element: Element | Node | Document | Window,
  opts = {}
) {
  fireEvent.pointerDown(element, { pointerType: 'touch', ...opts });
  fireEvent.pointerUp(element, { pointerType: 'touch', ...opts });
}
export function fireLongPress(
  element: Element | Node | Document | Window,
  opts = {}
) {
  fireEvent.pointerDown(element, { pointerType: 'touch', ...opts });
  act(() => {
    jest.advanceTimersByTime(DEFAULT_LONG_PRESS_TIME);
  });
  fireEvent.pointerUp(element, { pointerType: 'touch', ...opts });
}

// Polyfills
// -----------------------------------------------------------------------------

export let pointerMap: pointerKey[] = [
  {
    name: 'MouseLeft',
    pointerType: 'mouse',
    button: 'primary',
    height: 1,
    width: 1,
    pressure: 0.5,
  },
  { name: 'MouseRight', pointerType: 'mouse', button: 'secondary' },
  { name: 'MouseMiddle', pointerType: 'mouse', button: 'auxiliary' },
  { name: 'TouchA', pointerType: 'touch', height: 1, width: 1 },
  { name: 'TouchB', pointerType: 'touch' },
  { name: 'TouchC', pointerType: 'touch' },
] as unknown as pointerKey[];

export function installPointerEvent() {
  beforeAll(() => {
    // @ts-ignore
    global.PointerEvent = class FakePointerEvent extends MouseEvent {
      _init: {
        pageX: number;
        pageY: number;
        pointerType: string;
        pointerId: number;
        width: number;
        height: number;
      };
      constructor(name: string, init: PointerEvent) {
        super(name, init);
        this._init = init;
      }
      get pointerType() {
        return this._init.pointerType;
      }
      get pointerId() {
        return this._init.pointerId;
      }
      get pageX() {
        return this._init.pageX;
      }
      get pageY() {
        return this._init.pageY;
      }
      get width() {
        return this._init.width;
      }
      get height() {
        return this._init.height;
      }
    };
  });
  afterAll(() => {
    // @ts-ignore
    delete global.PointerEvent;
  });
}
