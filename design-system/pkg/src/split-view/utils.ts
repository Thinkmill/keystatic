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

export function getPrimaryPane(
  wrapper?: Element | null
): HTMLDivElement | null {
  if (!wrapper) return null;
  return wrapper.querySelector('[data-split-pane-primary]');
}
export function getSecondaryPane(
  wrapper?: Element | null
): HTMLDivElement | null {
  if (!wrapper) return null;
  return wrapper.querySelector('[data-split-pane-secondary]');
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
