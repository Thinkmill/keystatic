import { ReactNode, RefObject, useEffect, useRef } from 'react';

export type ScrollLockTarget =
  | RefObject<Element | null>
  | (() => Element | null);

type ActiveLockEntry = {
  id: symbol;
  getContainer: () => Element | null;
};

const activeLocks: ActiveLockEntry[] = [];
let listenersAttached = false;
let lastTouch: { x: number; y: number } | null = null;

function isScrollableOverflow(overflow: string): boolean {
  return overflow === 'auto' || overflow === 'scroll' || overflow === 'overlay';
}

function canScrollAxis(
  el: Element,
  axis: 'x' | 'y',
  delta: number,
  overflow: string,
  isRtl: boolean
): boolean {
  if (delta === 0 || !isScrollableOverflow(overflow)) {
    return false;
  }
  if (axis === 'y') {
    const maxScroll = el.scrollHeight - el.clientHeight;
    if (maxScroll <= 1) {
      return false;
    }
    return delta > 0 ? el.scrollTop < maxScroll - 1 : el.scrollTop > 0;
  }

  const maxScroll = el.scrollWidth - el.clientWidth;
  if (maxScroll <= 1) {
    return false;
  }
  if (isRtl) {
    return delta < 0 ? el.scrollLeft > -(maxScroll - 1) : el.scrollLeft < 0;
  }
  return delta > 0 ? el.scrollLeft < maxScroll - 1 : el.scrollLeft > 0;
}

function canElementScrollInDirection(
  el: Element,
  deltaX: number,
  deltaY: number
): boolean {
  const style = window.getComputedStyle(el);
  const isRtl = style.direction === 'rtl';
  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);
  if (absY >= absX && absY > 0) {
    return canScrollAxis(el, 'y', deltaY, style.overflowY, isRtl);
  }
  if (absX > 0) {
    return canScrollAxis(el, 'x', deltaX, style.overflowX, isRtl);
  }
  return false;
}

function hasAnyScrollableOverflow(el: Element): boolean {
  const style = window.getComputedStyle(el);
  return (
    (isScrollableOverflow(style.overflowY) &&
      el.scrollHeight - el.clientHeight > 1) ||
    (isScrollableOverflow(style.overflowX) &&
      el.scrollWidth - el.clientWidth > 1)
  );
}

function canTargetScrollInsideContainer(
  container: Element,
  target: Element | null,
  deltaX: number,
  deltaY: number,
  allowUnknownDeltaOverflow: boolean
): boolean {
  if (!target || !container.contains(target)) {
    return false;
  }

  let el: Element | null = target;
  while (el) {
    if (allowUnknownDeltaOverflow && deltaX === 0 && deltaY === 0) {
      if (hasAnyScrollableOverflow(el)) {
        return true;
      }
    } else if (canElementScrollInDirection(el, deltaX, deltaY)) {
      return true;
    }
    if (el === container) {
      break;
    }
    el = el.parentElement;
  }
  return false;
}

function onTouchStart(event: TouchEvent) {
  if (event.touches.length === 1) {
    const touch = event.touches[0];
    lastTouch = { x: touch.clientX, y: touch.clientY };
  } else {
    lastTouch = null;
  }
}

function onWheel(event: WheelEvent) {
  const top = activeLocks[activeLocks.length - 1];
  const container = top?.getContainer() ?? null;
  if (!container) {
    return;
  }
  const target = event.target instanceof Element ? event.target : null;
  if (
    !canTargetScrollInsideContainer(
      container,
      target,
      event.deltaX,
      event.deltaY,
      false
    )
  ) {
    event.preventDefault();
  }
}

function onTouchMove(event: TouchEvent) {
  const top = activeLocks[activeLocks.length - 1];
  const container = top?.getContainer() ?? null;
  if (!container) {
    return;
  }
  if (event.touches.length > 1) {
    // Allow multi-touch gestures (e.g., pinch-zoom) to pass through natively.
    return;
  }

  const target = event.target instanceof Element ? event.target : null;
  const touch = event.touches[0];
  let deltaX = 0;
  let deltaY = 0;
  let hadPreviousTouch = false;
  if (touch && lastTouch) {
    deltaX = lastTouch.x - touch.clientX;
    deltaY = lastTouch.y - touch.clientY;
    hadPreviousTouch = true;
  }
  if (touch) {
    lastTouch = { x: touch.clientX, y: touch.clientY };
  }

  if (
    !canTargetScrollInsideContainer(
      container,
      target,
      deltaX,
      deltaY,
      !hadPreviousTouch
    )
  ) {
    event.preventDefault();
  }
}

function syncDocumentListeners() {
  if (typeof document === 'undefined') {
    return;
  }
  if (activeLocks.length > 0 && !listenersAttached) {
    document.addEventListener('touchstart', onTouchStart, {
      passive: true,
      capture: true,
    });
    document.addEventListener('wheel', onWheel, {
      passive: false,
      capture: true,
    });
    document.addEventListener('touchmove', onTouchMove, {
      passive: false,
      capture: true,
    });
    listenersAttached = true;
  } else if (activeLocks.length === 0 && listenersAttached) {
    document.removeEventListener('touchstart', onTouchStart, {
      capture: true,
    });
    document.removeEventListener('wheel', onWheel, { capture: true });
    document.removeEventListener('touchmove', onTouchMove, { capture: true });
    listenersAttached = false;
    lastTouch = null;
  }
}

function resolveTarget(target: ScrollLockTarget): Element | null {
  return typeof target === 'function' ? target() : target.current;
}

/**
 * Prevents background wheel and touch scrolling while an overlay/dropdown is
 * open, while allowing scrollable content inside `target` to scroll until its
 * bounds are reached.
 */
export function usePreventBackgroundScroll(
  target: ScrollLockTarget,
  isActive: boolean
) {
  const targetRef = useRef(target);
  useEffect(() => {
    targetRef.current = target;
  });

  useEffect(() => {
    if (!isActive) {
      return;
    }

    const id = Symbol('background-scroll-lock');
    activeLocks.push({
      id,
      getContainer: () => resolveTarget(targetRef.current),
    });
    syncDocumentListeners();

    return () => {
      const index = activeLocks.findIndex(entry => entry.id === id);
      if (index !== -1) {
        activeLocks.splice(index, 1);
      }
      syncDocumentListeners();
    };
  }, [isActive]);
}

/**
 * Locks background wheel/touch scrolling while mounted (or when `isActive` is
 * true), scoping allowed scrolling to `target` or an automatic `display: contents`
 * wrapper around `children`.
 */
export function PreventBackgroundScroll({
  children,
  isActive = true,
  target,
}: {
  children?: ReactNode;
  isActive?: boolean;
  target?: ScrollLockTarget;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  usePreventBackgroundScroll(target ?? wrapperRef, isActive);

  if (children === undefined) {
    return null;
  }

  return (
    <div ref={wrapperRef} style={{ display: 'contents' }}>
      {children}
    </div>
  );
}
