import { act, useState, useRef } from 'react';
import { describe, expect, it } from 'vitest';
import { useOverlayTriggerState } from 'react-stately/useOverlayTriggerState';

import { ActionButton } from '@keystar/ui/button';
import { Item, Menu, MenuTrigger } from '@keystar/ui/menu';
import { fireEvent, firePress, renderWithProvider } from '#test-utils';

import { Popover, PreventBackgroundScroll } from '..';

function mockVerticalScrollMetrics(
  el: HTMLElement,
  {
    clientHeight,
    scrollHeight,
    scrollTop = 0,
  }: { clientHeight: number; scrollHeight: number; scrollTop?: number }
) {
  Object.defineProperty(el, 'clientHeight', {
    configurable: true,
    value: clientHeight,
  });
  Object.defineProperty(el, 'scrollHeight', {
    configurable: true,
    value: scrollHeight,
  });
  el.scrollTop = scrollTop;
}

function dispatchWheel(target: Element, deltaY: number, deltaX = 0) {
  const event = new WheelEvent('wheel', {
    bubbles: true,
    cancelable: true,
    deltaX,
    deltaY,
  });
  target.dispatchEvent(event);
  return event;
}

function dispatchTouchMove(
  target: Element,
  { fromY, toY }: { fromY: number; toY: number }
) {
  const touchStart = new Event('touchstart', {
    bubbles: true,
    cancelable: true,
  });
  Object.defineProperty(touchStart, 'touches', {
    value: [{ clientX: 0, clientY: fromY }],
  });
  target.dispatchEvent(touchStart);

  const touchMove = new Event('touchmove', {
    bubbles: true,
    cancelable: true,
  });
  Object.defineProperty(touchMove, 'touches', {
    value: [{ clientX: 0, clientY: toY }],
  });
  target.dispatchEvent(touchMove);
  return touchMove;
}

describe('overlays/scrollLock', () => {
  it('locks background wheel and touch scrolling when a modal Popover is open and contains inner list overscroll', () => {
    function Harness() {
      const triggerRef = useRef<HTMLButtonElement>(null);
      const state = useOverlayTriggerState({ defaultOpen: false });
      return (
        <div
          data-testid="bg-scroll"
          style={{ overflowY: 'auto', height: '200px' }}
        >
          <button ref={triggerRef} onClick={() => state.setOpen(!state.isOpen)}>
            Toggle
          </button>
          <Popover state={state} triggerRef={triggerRef}>
            <div
              data-testid="popover-list"
              style={{ overflowY: 'auto', maxHeight: '150px' }}
            >
              <div>Item 1</div>
            </div>
          </Popover>
        </div>
      );
    }

    const { getByRole, getByTestId } = renderWithProvider(<Harness />);
    const bgScroll = getByTestId('bg-scroll');
    mockVerticalScrollMetrics(bgScroll, {
      clientHeight: 200,
      scrollHeight: 1000,
      scrollTop: 120,
    });

    // Unlocked initially
    expect(dispatchWheel(bgScroll, 80).defaultPrevented).toBe(false);

    // Open popover
    fireEvent.click(getByRole('button', { name: 'Toggle' }));
    const popoverList = getByTestId('popover-list');

    // Background scroll is locked for wheel & touch
    expect(dispatchWheel(bgScroll, 80).defaultPrevented).toBe(true);
    expect(
      dispatchTouchMove(bgScroll, { fromY: 200, toY: 120 }).defaultPrevented
    ).toBe(true);

    // Non-overflowing list inside popover must not leak scroll to background
    mockVerticalScrollMetrics(popoverList, {
      clientHeight: 150,
      scrollHeight: 150,
      scrollTop: 0,
    });
    expect(dispatchWheel(popoverList, 60).defaultPrevented).toBe(true);

    // Overflowing list scrolls internally between bounds, blocks overscroll at edges
    mockVerticalScrollMetrics(popoverList, {
      clientHeight: 150,
      scrollHeight: 400,
      scrollTop: 50,
    });
    expect(dispatchWheel(popoverList, 60).defaultPrevented).toBe(false);
    expect(dispatchWheel(popoverList, -60).defaultPrevented).toBe(false);

    popoverList.scrollTop = 0;
    expect(dispatchWheel(popoverList, -60).defaultPrevented).toBe(true);
    expect(dispatchWheel(popoverList, 60).defaultPrevented).toBe(false);

    popoverList.scrollTop = 250;
    expect(dispatchWheel(popoverList, 60).defaultPrevented).toBe(true);
    expect(dispatchWheel(popoverList, -60).defaultPrevented).toBe(false);

    // Closing releases background scroll
    fireEvent.keyDown(popoverList, { key: 'Escape' });
    expect(dispatchWheel(bgScroll, 80).defaultPrevented).toBe(false);
  });

  it('locks background scroll while MenuTrigger menu is open and releases when dismissed', () => {
    const { getByRole, getByTestId } = renderWithProvider(
      <div
        data-testid="bg-scroll"
        style={{ overflowY: 'auto', height: '200px' }}
      >
        <MenuTrigger>
          <ActionButton>Insert</ActionButton>
          <Menu>
            <Item key="a">Callout</Item>
            <Item key="b">Hero</Item>
          </Menu>
        </MenuTrigger>
      </div>
    );

    const bgScroll = getByTestId('bg-scroll');
    mockVerticalScrollMetrics(bgScroll, {
      clientHeight: 200,
      scrollHeight: 1000,
      scrollTop: 100,
    });

    expect(dispatchWheel(bgScroll, 40).defaultPrevented).toBe(false);

    firePress(getByRole('button', { name: 'Insert' }));
    const menu = getByRole('menu');
    expect(menu).toBeVisible();
    expect(dispatchWheel(bgScroll, 40).defaultPrevented).toBe(true);

    fireEvent.keyDown(menu, { key: 'Escape' });
    expect(dispatchWheel(bgScroll, 40).defaultPrevented).toBe(false);
  });

  it('locks background scroll with PreventBackgroundScroll without mutating documentElement or stealing focus', () => {
    function InlineDropdownHarness() {
      const [open, setOpen] = useState(false);
      return (
        <div
          data-testid="bg-scroll"
          style={{ overflowY: 'auto', height: '200px' }}
        >
          <input
            data-testid="editor-input"
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
          />
          {open && (
            <PreventBackgroundScroll>
              <div
                data-testid="dropdown-list"
                style={{ overflowY: 'auto', maxHeight: '150px' }}
              >
                <div>Option A</div>
              </div>
            </PreventBackgroundScroll>
          )}
        </div>
      );
    }

    const { getByTestId } = renderWithProvider(<InlineDropdownHarness />);
    const bgScroll = getByTestId('bg-scroll');
    const input = getByTestId('editor-input');
    mockVerticalScrollMetrics(bgScroll, {
      clientHeight: 200,
      scrollHeight: 1000,
      scrollTop: 80,
    });

    act(() => {
      input.focus();
    });
    expect(document.activeElement).toBe(input);
    expect(document.documentElement.style.overflow).not.toBe('hidden');
    expect(dispatchWheel(bgScroll, 50).defaultPrevented).toBe(true);
    expect(dispatchWheel(input, 50).defaultPrevented).toBe(true);

    const list = getByTestId('dropdown-list');
    mockVerticalScrollMetrics(list, {
      clientHeight: 150,
      scrollHeight: 350,
      scrollTop: 20,
    });
    expect(dispatchWheel(list, 50).defaultPrevented).toBe(false);

    list.scrollTop = 200;
    expect(dispatchWheel(list, 50).defaultPrevented).toBe(true);

    act(() => {
      input.blur();
    });
    expect(dispatchWheel(bgScroll, 50).defaultPrevented).toBe(false);
  });

  it('tracks stacked locks cleanly when nested overlays open and close', () => {
    function StackedHarness() {
      const [innerOpen, setInnerOpen] = useState(true);
      const outerRef = useRef<HTMLDivElement>(null);
      const innerRef = useRef<HTMLDivElement>(null);
      return (
        <div data-testid="outer-bg">
          <PreventBackgroundScroll target={outerRef} />
          <div
            ref={outerRef}
            data-testid="outer-panel"
            style={{ overflowY: 'auto', height: '150px' }}
          >
            Outer
          </div>
          {innerOpen && (
            <>
              <PreventBackgroundScroll target={innerRef} />
              <div
                ref={innerRef}
                data-testid="inner-panel"
                style={{ overflowY: 'auto', height: '100px' }}
              >
                Inner
              </div>
            </>
          )}
          <button onClick={() => setInnerOpen(false)}>Close inner</button>
        </div>
      );
    }

    const { getByRole, getByTestId } = renderWithProvider(<StackedHarness />);
    const outerBg = getByTestId('outer-bg');
    const outerPanel = getByTestId('outer-panel');
    const innerPanel = getByTestId('inner-panel');

    mockVerticalScrollMetrics(outerPanel, {
      clientHeight: 150,
      scrollHeight: 400,
      scrollTop: 20,
    });
    mockVerticalScrollMetrics(innerPanel, {
      clientHeight: 100,
      scrollHeight: 300,
      scrollTop: 20,
    });

    // While inner lock is on top, inner scrolls freely and outer is blocked
    expect(dispatchWheel(innerPanel, 40).defaultPrevented).toBe(false);
    expect(dispatchWheel(outerPanel, 40).defaultPrevented).toBe(true);
    expect(dispatchWheel(outerBg, 40).defaultPrevented).toBe(true);

    // Closing inner restores outer lock
    fireEvent.click(getByRole('button', { name: 'Close inner' }));
    expect(dispatchWheel(outerPanel, 40).defaultPrevented).toBe(false);
    expect(dispatchWheel(outerBg, 40).defaultPrevented).toBe(true);
  });
});
