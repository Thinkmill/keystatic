import {
  BaseStyleProps,
  classNames,
  css,
  useStyleProps,
} from '@keystar/ui/style';
import { useLayoutEffect } from '@react-aria/utils';
import {
  ReactElement,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

const SplitViewContext = createContext<{
  id: string;
  isDragging: boolean;
}>({
  id: '',
  isDragging: false,
});
function useSplitView() {
  return useContext(SplitViewContext);
}

const WIDTH_PROP = '--fixed-pane-width';
const MIN_WIDTH_PROP = '--fixed-pane-min-width';
const MAX_WIDTH_PROP = '--fixed-pane-max-width';
const WIDTH_VAR = `var(${WIDTH_PROP})`;
const MIN_WIDTH_VAR = `var(${MIN_WIDTH_PROP})`;
const MAX_WIDTH_VAR = `var(${MAX_WIDTH_PROP})`;

function px(value: number) {
  return `${value}px`;
}
function toUnit(value: number | string) {
  return typeof value === 'number' ? `${value}px` : value;
}

export function SplitView(props: { children: [ReactElement, ReactElement] }) {
  const [startPane, endPane] = props.children;

  const id = useId();
  const [isDragging, setDragging] = useState(false);
  const [size, setSize] = useState(180);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef(0);
  const adjustedRef = useRef(0);

  useEffect(() => {
    const fixedPane: HTMLDivElement | null | undefined =
      wrapperRef.current?.querySelector(`[data-split-view-fixed-pane]`);
    fixedPane?.style.setProperty(WIDTH_PROP, px(size));
  }, [size]);

  // const commitSize = (size: number) => {
  //   setSize(clamp(toFixedNumber(size, 2), MIN_WIDTH_VALUE, MAX_WIDTH_VALUE));
  // };

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const resizeHandle = resizeHandleRef.current;
    const fixedPane: HTMLDivElement | null | undefined =
      wrapperRef.current?.querySelector(`[data-split-view-fixed-pane]`);

    if (!wrapper || !resizeHandle || !fixedPane) {
      return;
    }

    const onMove = (e: ResizeEvent) => {
      if (e.defaultPrevented) {
        return;
      }

      e.preventDefault();

      let movement = getPosition(e) - dragOffsetRef.current;

      // Support RTL layouts
      if (isRtl(wrapper)) {
        movement = wrapper.clientWidth - movement;
      }
      adjustedRef.current = movement;
      fixedPane.style.setProperty(WIDTH_PROP, px(adjustedRef.current));

      let cursorStyle: CursorState = 'horizontal';
      // if (adjustedRef.current < MIN_WIDTH_VALUE) {
      //   cursorStyle = 'horizontal-min';
      // }
      // if (adjustedRef.current > MAX_WIDTH_VALUE) {
      //   cursorStyle = 'horizontal-max';
      // }
      setGlobalCursorStyle(cursorStyle);
    };

    const stopDragging = () => {
      document.body.removeEventListener('mousemove', onMove);
      document.body.removeEventListener('touchmove', onMove);
      resizeHandle.blur();
      // set computed width
      setSize(Number.parseInt(getComputedStyle(fixedPane).width));
      // setSize(adjustedRef.current);
      setDragging(false);
      resetGlobalCursorStyle();
    };

    const startDragging = (e: ResizeEvent) => {
      if ('button' in e && e.button !== 0) {
        return;
      }
      if ('touches' in e && e.touches.length !== 1) {
        return;
      }

      e.preventDefault();

      setDragging(true);
      dragOffsetRef.current = getDragOffset(e, resizeHandle);

      document.body.addEventListener('mousemove', onMove);
      document.body.addEventListener('touchmove', onMove);
      window.addEventListener('mouseup', stopDragging);
      window.addEventListener('touchend', stopDragging);
    };

    // attach mouse, touch and keyboard event handlers
    resizeHandle.addEventListener('mousedown', startDragging);
    resizeHandle.addEventListener('touchstart', startDragging);

    return () => {
      resizeHandle.removeEventListener('mousedown', startDragging);
      resizeHandle.removeEventListener('touchstart', startDragging);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchend', stopDragging);
    };

    // TODO
    // resizeHandle.addEventListener('keydown', e => {
    //   e.preventDefault();
    //   if (e.key === 'ArrowRight') {
    //     setSize(size => size + 10);
    //   } else if (e.key === 'ArrowLeft') {
    //     setSize(size => size - 10);
    //   }
    // });
  }, []);

  return (
    <SplitViewContext.Provider value={{ id, isDragging }}>
      <div
        data-resizable-view
        className={css({
          display: 'flex',
          height: '100%',
          width: '100%',
          overflow: 'hidden',
        })}
        ref={wrapperRef}
      >
        {startPane}
        <div
          role="separator"
          aria-orientation="vertical"
          // aria-valuemin={MIN_WIDTH_VALUE}
          // aria-valuemax={MAX_WIDTH_VALUE}
          aria-valuenow={size}
          aria-label="Resize"
          tabIndex={0}
          className={css({
            backgroundColor: '#ccc',
            cursor: 'ew-resize',
            flexShrink: 0,
            touchAction: 'none',
            userSelect: 'none',
            width: 10,
          })}
          ref={resizeHandleRef}
        />
        {endPane}
      </div>
    </SplitViewContext.Provider>
  );
}

// Styled components
// -----------------------------------------------------------------------------

type PaneProps = {
  children: ReactNode;
} & BaseStyleProps;
type FixedPaneProps = PaneProps & {
  defaultSize?: number | string;
  minSize?: number | string;
  maxSize?: number | string;
};

export function SplitViewFixedPane(props: FixedPaneProps) {
  let { children, defaultSize = '50%', minSize = 0, maxSize = '100%' } = props;
  let { id, isDragging } = useSplitView();
  let styleProps = useStyleProps(props);

  return (
    <div
      {...styleProps}
      data-split-view-fixed-pane={id}
      data-split-view-dragging={isDragging || undefined}
      className={classNames(
        css({
          containerType: 'inline-size',
          overflow: 'hidden',
          width: `clamp(${MIN_WIDTH_VAR},${WIDTH_VAR},${MAX_WIDTH_VAR})`,
          [MIN_WIDTH_PROP]: toUnit(minSize),
          [MAX_WIDTH_PROP]: toUnit(maxSize),
          [WIDTH_PROP]: toUnit(defaultSize),

          '&[data-split-view-dragging]': {
            pointerEvents: 'none',
          },
        }),
        styleProps.className
      )}
    >
      {children}
    </div>
  );
}
export function SplitViewFluidPane(props: PaneProps) {
  let { children } = props;
  let { id, isDragging } = useSplitView();
  let styleProps = useStyleProps(props);

  return (
    <div
      {...styleProps}
      data-split-view-fluid-pane={id}
      data-split-view-dragging={isDragging || undefined}
      className={classNames(
        css({
          containerType: 'inline-size',
          flex: `1 1 0`,
          overflow: 'hidden',

          '&[data-split-view-dragging]': {
            pointerEvents: 'none',
          },
        }),
        styleProps.className
      )}
    >
      {children}
    </div>
  );
}

// Utils
// -----------------------------------------------------------------------------

function getDragOffset(e: ResizeEvent, resizeHandle: Element) {
  let rect = resizeHandle.getBoundingClientRect();
  if (isRtl(resizeHandle)) {
    return getPosition(e) - rect.right;
  }
  return getPosition(e) - rect.left;
}
function getPosition(e: ResizeEvent) {
  if (isMouseEvent(e)) {
    return e.clientX;
  } else if (isTouchEvent(e)) {
    return e.touches[0].clientX;
  }
  return 0;
}

export type ResizeEvent = KeyboardEvent | MouseEvent | TouchEvent;
export function isKeyDown(event: ResizeEvent): event is KeyboardEvent {
  return event.type === 'keydown';
}
export function isMouseEvent(event: ResizeEvent): event is MouseEvent {
  return event.type.startsWith('mouse');
}
export function isTouchEvent(event: ResizeEvent): event is TouchEvent {
  return event.type.startsWith('touch');
}

/** Takes a value and forces it to the closest min/max if it's outside. */
export function clamp(
  value: number,
  min: number = -Infinity,
  max: number = Infinity
): number {
  let newValue = Math.min(Math.max(value, min), max);
  return newValue;
}

/* Takes a value and rounds off to the number of digits. */
export function toFixedNumber(
  value: number,
  digits: number,
  base: number = 10
): number {
  let pow = Math.pow(base, digits);
  return Math.round(value * pow) / pow;
}

// Misc.
// -----------------------------------------------------------------------------

function isRtl(el: Element) {
  let ancestor = el.closest('[dir]');
  return ancestor?.getAttribute('dir') === 'rtl';
}

// Cursor
// -----------------------------------------------------------------------------

type CursorState = 'horizontal' | 'horizontal-max' | 'horizontal-min';

let currentState: CursorState | null = null;
let element: HTMLStyleElement | null = null;

export function getCursorStyle(state: CursorState): string {
  switch (state) {
    case 'horizontal':
      return 'ew-resize';
    case 'horizontal-max':
      return 'w-resize';
    case 'horizontal-min':
      return 'e-resize';
  }
}
export function resetGlobalCursorStyle() {
  if (element !== null) {
    document.head.removeChild(element);

    currentState = null;
    element = null;
  }
}
export function setGlobalCursorStyle(state: CursorState) {
  if (currentState === state) {
    return;
  }

  currentState = state;

  const style = getCursorStyle(state);

  if (element === null) {
    element = document.createElement('style');

    document.head.appendChild(element);
  }

  element.innerHTML = `*{cursor: ${style}!important;}`;
}
