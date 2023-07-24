import { ResizeEvent } from './types';

export function getPosition(e: ResizeEvent) {
  if (isMouseEvent(e)) {
    return e.clientX;
  } else if (isTouchEvent(e)) {
    return e.touches[0].clientX;
  }
  return 0;
}

export function getPercentage(value: number, min: number, max: number) {
  return Math.round(((value - min) / (max - min)) * 100);
}

export function getPrimaryPaneId(id: string) {
  return `primary-pane-${id}`;
}
export function getSecondaryPaneId(id: string) {
  return `secondary-pane-${id}`;
}
export function getResizeHandleId(id: string) {
  return `resize-handle-${id}`;
}
export function getPrimaryPane(id: string) {
  return document.getElementById(getPrimaryPaneId(id));
}
export function getSecondaryPane(id: string) {
  return document.getElementById(getSecondaryPaneId(id));
}
export function getResizeHandle(id: string) {
  return document.getElementById(getResizeHandleId(id));
}

export function px(value: number) {
  return `${value}px`;
}

export function isKeyDown(event: ResizeEvent): event is KeyboardEvent {
  return event.type === 'keydown';
}
export function isMouseEvent(event: ResizeEvent): event is MouseEvent {
  return event.type.startsWith('mouse');
}
export function isTouchEvent(event: ResizeEvent): event is TouchEvent {
  return event.type.startsWith('touch');
}
