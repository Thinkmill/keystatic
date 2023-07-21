import {
  classNames,
  css,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';
import { useId } from '@keystar/ui/utils';
import { useLocale } from '@react-aria/i18n';
import { filterDOMProps, useUpdateEffect } from '@react-aria/utils';
import { clamp } from '@react-stately/utils';
import {
  ForwardedRef,
  ForwardRefExoticComponent,
  HTMLAttributes,
  Ref,
  forwardRef,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { SplitViewProvider, useSplitView } from './context';
import { resetGlobalCursorStyle, setGlobalCursorStyle } from './cursor';
import { defaultStorage } from './storage';
import {
  CursorState,
  ResizeEvent,
  SplitPanePrimaryProps,
  SplitPaneSecondaryProps,
  SplitViewProps,
} from './types';
import { getPercentage, getPosition, getPrimaryPane, px } from './utils';

const MAX_WIDTH_PROP = '--primary-pane-max-width';
const MAX_WIDTH_VAR = `var(${MAX_WIDTH_PROP})`;
const MIN_WIDTH_PROP = '--primary-pane-min-width';
const MIN_WIDTH_VAR = `var(${MIN_WIDTH_PROP})`;
const WIDTH_PROP = '--primary-pane-width';
const WIDTH_VAR = `var(${WIDTH_PROP})`;
const SNAP_REGION_PX = 32;
const KEYBOARD_ARROW_STEPS = 10;

export function SplitView(props: SplitViewProps) {
  let {
    autoSaveId,
    children,
    defaultSize,
    isCollapsed,
    minSize,
    maxSize,
    onCollapse,
    onResize,
    storage = defaultStorage,
  } = props;
  const [startPane, endPane] = children;

  const id = useId(props.id);
  const { direction } = useLocale();
  const styleProps = useStyleProps(props);

  const [isDragging, setDragging] = useState(false);
  // const [collapseRequested, setCollapseRequested] = useState(false);
  const [handleIsFocused, setHandleFocus] = useState(false);
  const [size, setSize] = useState(() => {
    let size = defaultSize;
    if (autoSaveId) {
      let savedSize = storage.getItem(autoSaveId);
      if (savedSize) {
        size = Number.parseInt(savedSize);
      }
    }
    return size;
  });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const resizeHandleRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const moveRef = useRef(0);

  // drag logic is reversed when the primary pane is on the right or RTL
  const isReversed = useMemo(() => {
    // @ts-expect-error FIXME: this feels super dodgy
    let startType = startPane.type.pane;
    return direction === 'rtl'
      ? startType === 'primary'
      : startType === 'secondary';
  }, [direction, startPane]);

  // sync size with subscribers
  useUpdateEffect(() => onResize?.(size), [size]);
  useEffect(() => {
    wrapperRef.current?.style.setProperty(WIDTH_PROP, px(size));

    if (autoSaveId) {
      storage.setItem(autoSaveId, px(size));
    }
  }, [autoSaveId, onResize, size, storage]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const resizeHandle = resizeHandleRef.current;
    const primaryPane = getPrimaryPane(wrapperRef.current);

    if (!wrapper || !resizeHandle || !primaryPane) {
      return;
    }

    let collapseRequested = false;

    const onMove = (e: ResizeEvent) => {
      if (e.defaultPrevented) {
        return;
      }

      e.preventDefault();

      let delta = getPosition(e) - offsetRef.current;
      if (isReversed) delta = delta * -1;
      let nextWidth = size + delta;

      // snap to the default width when the user drags near it
      if (Math.abs(nextWidth - defaultSize) < SNAP_REGION_PX / 2) {
        nextWidth = defaultSize;
      }

      // soft collapse the primary pane. mimic VS code behavior; collapse when
      // smaller than half of its min-size. collapse state is committed when
      // drag handle is released.
      if (primaryPane.hasAttribute('data-split-view-collapsible')) {
        collapseRequested = nextWidth <= minSize / 2;
      }
      if (collapseRequested) {
        primaryPane.style.setProperty('width', '0px');
      } else {
        primaryPane.style.removeProperty('width');
      }

      moveRef.current = nextWidth;
      wrapper.style.setProperty(WIDTH_PROP, px(moveRef.current));

      let cursorStyle: CursorState = 'horizontal';
      if (moveRef.current < minSize) {
        cursorStyle = 'horizontal-min';
      }
      if (moveRef.current > maxSize) {
        cursorStyle = 'horizontal-max';
      }
      setGlobalCursorStyle(cursorStyle, isReversed);
    };

    const stopDragging = () => {
      resizeHandle.blur();
      setDragging(false);
      resetGlobalCursorStyle();

      if (collapseRequested) {
        onCollapse?.();
        wrapper.style.setProperty(WIDTH_PROP, px(size));
        primaryPane.style.removeProperty('width');
      } else {
        setSize(clamp(moveRef.current, minSize, maxSize));
      }

      collapseRequested = false;

      document.body.removeEventListener('mousemove', onMove);
      document.body.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchend', stopDragging);
    };

    const startDragging = (e: ResizeEvent) => {
      if ('button' in e && e.button !== 0) {
        return;
      }
      if ('touches' in e && e.touches.length !== 1) {
        return;
      }

      setDragging(true);
      offsetRef.current = getPosition(e);

      document.body.addEventListener('mousemove', onMove);
      document.body.addEventListener('touchmove', onMove);
      window.addEventListener('mouseup', stopDragging);
      window.addEventListener('touchend', stopDragging);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      // allow 10 steps between the min and max
      let step = Math.round((maxSize - minSize) / KEYBOARD_ARROW_STEPS);
      let increment = () => setSize(size => Math.min(size + step, maxSize));
      let decrement = () => setSize(size => Math.max(size - step, minSize));

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
            increment();
          } else {
            decrement();
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (isReversed) {
            decrement();
          } else {
            increment();
          }
      }
    };

    let options = { passive: true };
    let reset = () => setSize(defaultSize);
    resizeHandle.addEventListener('mousedown', startDragging, options);
    resizeHandle.addEventListener('touchstart', startDragging, options);
    resizeHandle.addEventListener('dblclick', reset);
    resizeHandle.addEventListener('keydown', onKeyDown);

    return () => {
      resizeHandle.removeEventListener('mousedown', startDragging);
      resizeHandle.removeEventListener('touchstart', startDragging);
      resizeHandle.addEventListener('dblclick', reset);
      resizeHandle.removeEventListener('keydown', onKeyDown);
    };
  }, [maxSize, minSize, defaultSize, isReversed, size, onCollapse]);

  return (
    <SplitViewProvider
      value={{
        id,
        isCollapsed,
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
            [MIN_WIDTH_PROP]: px(minSize),
            [MAX_WIDTH_PROP]: px(maxSize),
            [WIDTH_PROP]: px(defaultSize),
          }),
          styleProps.className
        )}
      >
        {startPane}
        <SplitViewResizeHandle
          onBlur={() => setHandleFocus(false)}
          onFocus={() => setHandleFocus(true)}
          aria-controls={`primary-pane-${id}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={getPercentage(size, minSize, maxSize)}
          aria-label="Resize"
          ref={resizeHandleRef}
        />
        {endPane}
      </div>
    </SplitViewProvider>
  );
}

// Styled components
// -----------------------------------------------------------------------------

type ResizeHandleProps = HTMLAttributes<HTMLDivElement>;

export const SplitPanePrimary: ForwardRefExoticComponent<
  SplitPanePrimaryProps & { ref?: Ref<HTMLDivElement> }
> = forwardRef(function SplitPanePrimary(
  props: SplitPanePrimaryProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { activity, id, isCollapsed } = useSplitView();
  let styleProps = useStyleProps(props);

  return (
    <div
      {...styleProps}
      {...filterDOMProps(props)}
      ref={forwardedRef}
      id={`primary-pane-${id}`}
      data-split-pane-primary={id}
      data-split-view-activity={activity}
      data-split-view-collapsible={
        typeof isCollapsed === 'boolean' || undefined
      }
      data-split-view-collapsed={isCollapsed || undefined}
      className={classNames(
        css({
          containerType: 'inline-size',
          overflow: 'hidden',
          width: `clamp(${MIN_WIDTH_VAR},${WIDTH_VAR},${MAX_WIDTH_VAR})`,
          // prevent the secondary pane from collapsing completely, regardless of
          // consumer preference. losing the drag handle is a bad experience.
          maxWidth: `calc(100% - 100px)`,

          // hide when collapsed
          '&[data-split-view-collapsed]': {
            display: 'none',
          },
          // disable interactive elements during drag
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
});
// @ts-expect-error FIXME: this feels super dodgy
SplitPanePrimary.pane = 'primary';

export const SplitPaneSecondary: ForwardRefExoticComponent<
  SplitPaneSecondaryProps & { ref?: Ref<HTMLDivElement> }
> = forwardRef(function SplitPaneSecondary(
  props: SplitPaneSecondaryProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { id, activity } = useSplitView();
  let styleProps = useStyleProps(props);

  return (
    <div
      {...styleProps}
      {...filterDOMProps(props)}
      ref={forwardedRef}
      data-split-pane-secondary={id}
      data-split-view-activity={activity}
      className={classNames(
        css({
          containerType: 'inline-size',
          flex: `1 1 0`,
          // prevent the secondary pane from collapsing completely, regardless of
          // consumer preference. losing the drag handle is a bad experience.
          minWidth: `100px`,
          overflow: 'hidden',

          // disable interactive elements during drag
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
});
// @ts-expect-error FIXME: this feels super dodgy
SplitPaneSecondary.pane = 'secondary';

const SplitViewResizeHandle = forwardRef(function SplitViewResizeHandle(
  props: ResizeHandleProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { activity, id, isCollapsed } = useSplitView();

  return (
    <div
      {...props}
      ref={forwardedRef}
      data-split-view-resize-handle={id}
      data-split-view-activity={activity}
      data-split-view-collapsed={isCollapsed || undefined}
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

        // hide when collapsed
        '&[data-split-view-collapsed]': {
          display: 'none',
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