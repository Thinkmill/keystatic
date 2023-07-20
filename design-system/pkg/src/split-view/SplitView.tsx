import {
  classNames,
  css,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';
import { useLocale } from '@react-aria/i18n';
// import { useLayoutEffect } from '@react-aria/utils';
import {
  ForwardedRef,
  HTMLAttributes,
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';

import { resetGlobalCursorStyle, setGlobalCursorStyle } from './cursor';
import { defaultStorage } from './storage';
import {
  CursorState,
  SplitPanePrimaryProps,
  SplitPaneSecondaryProps,
  SplitViewProps,
} from './types';
import { filterDOMProps } from '@react-aria/utils';

const SplitViewContext = createContext<{
  id: string;
  activity: 'pointer' | 'keyboard' | undefined;
}>({
  id: '',
  activity: undefined,
});
function useSplitView() {
  return useContext(SplitViewContext);
}

const WIDTH_PROP = '--primary-pane-width';
const MIN_WIDTH_PROP = '--primary-pane-min-width';
const MAX_WIDTH_PROP = '--primary-pane-max-width';
const WIDTH_VAR = `var(${WIDTH_PROP})`;
const MIN_WIDTH_VAR = `var(${MIN_WIDTH_PROP})`;
const MAX_WIDTH_VAR = `var(${MAX_WIDTH_PROP})`;

function px(value: number) {
  return `${value}px`;
}
function toUnit(value: number) {
  return isFinite(value) ? `${value}px` : '100%';
}

export function SplitView(props: SplitViewProps) {
  let {
    autoSaveId,
    children,
    defaultSize,
    minSize,
    maxSize,
    onResize,
    storage = defaultStorage,
  } = props;
  const [startPane, endPane] = children;

  const id = useId();
  const { direction } = useLocale();
  const styleProps = useStyleProps(props);

  const [isDragging, setDragging] = useState(false);
  const [handleIsFocused, setHandleFocus] = useState(false);
  const [size, setSize] = useState(() => {
    let size = defaultSize;
    if (autoSaveId) {
      let savedSize = storage.getItem(autoSaveId);
      console.log(savedSize);
      if (savedSize) {
        size = Number.parseInt(savedSize);
      }
    }
    return size;
  });
  console.log(size);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const dragOffsetRef = useRef(0);
  const adjustedRef = useRef(0);

  // drag logic is reversed when the primary pane is on the right or RTL
  const isReversed = useMemo(() => {
    // @ts-expect-error FIXME: this feels super dodgy
    let startType = startPane.type.pane;
    return direction === 'rtl'
      ? startType === 'primary'
      : startType === 'secondary';
  }, [direction, startPane]);

  // sync primary pane size with subscribers
  useEffect(() => {
    wrapperRef.current?.style.setProperty(WIDTH_PROP, px(size));
    onResize?.(size);
    if (autoSaveId) {
      storage.setItem(autoSaveId, px(size));
    }
  }, [autoSaveId, onResize, size, storage]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const resizeHandle = resizeHandleRef.current;
    const primaryPane: HTMLDivElement | null | undefined =
      wrapperRef.current?.querySelector(`[data-split-pane-primary]`);

    if (!wrapper || !resizeHandle || !primaryPane) {
      return;
    }

    const onMove = (e: ResizeEvent) => {
      if (e.defaultPrevented) {
        return;
      }

      e.preventDefault();

      let delta = getPosition(e) - dragOffsetRef.current;

      if (isReversed) {
        delta = delta * -1;
      }

      let movement = size + delta;

      // snap to the default width when the user drags near it
      if (Math.abs(movement - defaultSize) < 16) {
        movement = defaultSize;
      }

      adjustedRef.current = movement;
      wrapper.style.setProperty(WIDTH_PROP, px(adjustedRef.current));

      let cursorStyle: CursorState = 'horizontal';
      if (adjustedRef.current < minSize) {
        cursorStyle = 'horizontal-min';
      }
      if (adjustedRef.current > maxSize) {
        cursorStyle = 'horizontal-max';
      }
      setGlobalCursorStyle(cursorStyle, isReversed);
    };

    const stopDragging = () => {
      document.body.removeEventListener('mousemove', onMove);
      document.body.removeEventListener('touchmove', onMove);
      resizeHandle.blur();
      // set computed width
      setSize(Number.parseInt(getComputedStyle(primaryPane).width));
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

      setDragging(true);
      dragOffsetRef.current = getPosition(e);

      document.body.addEventListener('mousemove', onMove);
      document.body.addEventListener('touchmove', onMove);
      window.addEventListener('mouseup', stopDragging);
      window.addEventListener('touchend', stopDragging);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      // allow 10 steps between the min and max
      const step = (maxSize - minSize) / 10;

      // TODO: support RTL
      switch (e.key) {
        case 'Home':
          e.preventDefault();
          setSize(minSize);
          break;
        case 'End':
          e.preventDefault();
          setSize(maxSize);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (isReversed) {
            setSize(size => Math.min(size + step, maxSize));
          } else {
            setSize(size => Math.max(size - step, minSize));
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (isReversed) {
            setSize(size => Math.max(size - step, minSize));
          } else {
            setSize(size => Math.min(size + step, maxSize));
          }
      }
    };

    // attach mouse, touch and keyboard event handlers
    resizeHandle.addEventListener('mousedown', startDragging, {
      passive: true,
    });
    resizeHandle.addEventListener('touchstart', startDragging, {
      passive: true,
    });
    resizeHandle.addEventListener('keydown', onKeyDown);

    return () => {
      resizeHandle.removeEventListener('mousedown', startDragging);
      resizeHandle.removeEventListener('touchstart', startDragging);
      resizeHandle.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchend', stopDragging);
    };
  }, [maxSize, minSize, defaultSize, isReversed, size]);

  return (
    <SplitViewContext.Provider
      value={{
        id,
        activity: isDragging
          ? 'pointer'
          : handleIsFocused
          ? 'keyboard'
          : undefined,
      }}
    >
      <div
        {...styleProps}
        {...filterDOMProps(props)}
        data-split-view={id}
        ref={wrapperRef}
        className={classNames(
          css({
            display: 'flex',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
            [MIN_WIDTH_PROP]: toUnit(minSize),
            [MAX_WIDTH_PROP]: toUnit(maxSize),
            [WIDTH_PROP]: toUnit(defaultSize),
          }),
          styleProps.className
        )}
      >
        {startPane}
        <SplitViewResizeHandle
          onBlur={() => setHandleFocus(false)}
          onFocus={() => setHandleFocus(true)}
          onDoubleClick={() => setSize(defaultSize)}
          aria-controls={`primary-pane-${id}`}
          // set min, max, and now values as percentages of the total width
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={getAriaValueNow(size, minSize, maxSize)}
          aria-label="Resize"
          ref={resizeHandleRef}
        />
        {endPane}
      </div>
    </SplitViewContext.Provider>
  );
}

// integer between 0 and 100
function getAriaValueNow(value: number, min: number, max: number) {
  return Math.round(((value - min) / (max - min)) * 100);
}

// Styled components
// -----------------------------------------------------------------------------

type ResizeHandleProps = HTMLAttributes<HTMLDivElement> & {};

export function SplitPanePrimary(props: SplitPanePrimaryProps) {
  let { id, activity } = useSplitView();
  let styleProps = useStyleProps(props);

  return (
    <div
      {...styleProps}
      {...filterDOMProps(props)}
      id={`primary-pane-${id}`}
      data-split-pane-primary={id}
      data-split-view-activity={activity}
      className={classNames(
        css({
          containerType: 'inline-size',
          overflow: 'hidden',
          width: `clamp(${MIN_WIDTH_VAR},${WIDTH_VAR},${MAX_WIDTH_VAR})`,
          // prevent the secondary pane from collapsing completely, regardless of
          // consumer preference. losing the drag handle is a bad experience.
          maxWidth: `calc(100% - 100px)`,
          minWidth: `100px`,

          '&[data-split-view-activity=pointer]': {
            pointerEvents: 'none',
          },
        }),
        styleProps.className
      )}
    >
      {props.children}
    </div>
  );
}
SplitPanePrimary.pane = 'primary';
export function SplitPaneSecondary(props: SplitPaneSecondaryProps) {
  let { id, activity } = useSplitView();
  let styleProps = useStyleProps(props);

  return (
    <div
      {...styleProps}
      {...filterDOMProps(props)}
      data-split-pane-secondary={id}
      data-split-view-activity={activity}
      className={classNames(
        css({
          containerType: 'inline-size',
          flex: `1 1 0`,
          overflow: 'hidden',

          '&[data-split-view-activity=pointer]': {
            pointerEvents: 'none',
          },
        }),
        styleProps.className
      )}
    >
      {props.children}
    </div>
  );
}
SplitPaneSecondary.pane = 'secondary';
const SplitViewResizeHandle = forwardRef(function SplitViewResizeHandle(
  props: ResizeHandleProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { id, activity } = useSplitView();

  return (
    <div
      {...props}
      ref={forwardedRef}
      data-split-view-resize-handle={id}
      data-split-view-activity={activity}
      role="separator"
      aria-orientation="vertical"
      tabIndex={0}
      className={css({
        backgroundColor: tokenSchema.color.border.muted,
        boxSizing: 'border-box',
        cursor: 'ew-resize',
        flexShrink: 0,
        // outline: 0,
        position: 'relative',
        touchAction: 'none',
        transition: transition('background-color'),
        userSelect: 'none',
        width: tokenSchema.size.border.regular,
        zIndex: 1,

        // hide when disabled
        '&[aria-disabled]': {
          position: 'absolute', // take no space when hidden
          visibility: 'hidden',
        },

        // increase hit area
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: `calc(${tokenSchema.size.space.small} * -1)`,
        },

        // drag indicator
        '&::after': {
          backgroundColor: tokenSchema.color.alias.backgroundHovered,
          content: '""',
          insetBlock: 0,
          insetInline: `calc(${tokenSchema.size.border.medium} * -1)`,
          opacity: 0,
          position: 'absolute',
          transition: transition('opacity'),
        },
        // delay to avoid flicker. user may just be mousing around the screen; wait for intent
        '&:hover': {
          backgroundColor: tokenSchema.color.border.neutral,
          transitionDelay: tokenSchema.animation.duration.regular,

          '&::after': {
            opacity: 1,
            transitionDelay: tokenSchema.animation.duration.regular,
          },
        },
        '&[data-split-view-activity]::after': {
          backgroundColor: tokenSchema.color.background.accentEmphasis,
          insetInline: `calc(${tokenSchema.size.border.regular} * -1)`,
          opacity: 1,
        },
      })}
    />
  );
});

// Utils
// -----------------------------------------------------------------------------

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
