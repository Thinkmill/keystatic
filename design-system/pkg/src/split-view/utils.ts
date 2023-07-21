import { ResizeEvent } from './types';

export function getPosition(e: ResizeEvent) {
  if (isMouseEvent(e)) {
    return e.clientX;
  } else if (isTouchEvent(e)) {
    return e.touches[0].clientX;
  }
  return 0;
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

export function px(value: number) {
  return `${value}px`;
}
