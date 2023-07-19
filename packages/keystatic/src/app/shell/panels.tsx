import {
  breakpointQueries,
  breakpoints,
  css,
  tokenSchema,
  transition,
  useMediaQuery,
} from '@keystar/ui/style';
import { useLayoutEffect } from '@react-aria/utils';
import {
  ReactElement,
  ReactNode,
  createContext,
  useContext,
  useRef,
  useState,
} from 'react';
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
  ImperativePanelHandle,
  PanelResizeHandleProps,
} from 'react-resizable-panels';

import { Config } from '../../config';

import { SidebarDialog, SidebarPanel, useSidebar } from './sidebar';

// Content context
// ------------------------------

type ContentSize = keyof typeof breakpoints;
type AboveSize = Exclude<ContentSize, 'wide'>;
type BelowSize = Exclude<ContentSize, 'mobile'>;
type QueryOptions =
  | { above: AboveSize; below: BelowSize }
  | { above: AboveSize }
  | { below: BelowSize };

const ContentPanelContext = createContext<ContentSize>('mobile');

export function useContentPanelSize() {
  return useContext(ContentPanelContext);
}
export function useContentPanelQuery(options: QueryOptions) {
  const sizes = ['mobile', 'tablet', 'desktop', 'wide'];
  const size = useContentPanelSize();

  const startIndex = 'above' in options ? sizes.indexOf(options.above) + 1 : 0;
  const endIndex =
    'below' in options ? sizes.indexOf(options.below) - 1 : sizes.length - 1;
  const range = sizes.slice(startIndex, endIndex + 1);

  return range.includes(size);
}

// Main panel layout
// -----------------------------------------------------------------------------

export const MainPanelLayout = (props: {
  children: ReactNode;
  basePath: string;
  config: Config;
}) => {
  let { basePath, children, config } = props;

  let isBelowTablet = useMediaQuery(breakpointQueries.below.tablet);
  let [isDragging, setIsDragging] = useState(false);
  let [size, setSize] = useState(() => getInitialSizes());
  let [contentSize, setContentSize] = useState<ContentSize>('mobile');
  let sidebarState = useSidebar();
  let sidebarPanelRef = useRef<ImperativePanelHandle>(null);

  const contentPanelId = 'content';
  const panelGroupId = 'main';

  // Sync sidebar context with panel state.
  useLayoutEffect(() => {
    let panel = sidebarPanelRef.current;
    if (panel) {
      if (!sidebarState.isOpen) {
        panel.collapse();
      } else {
        panel.expand();
      }
    }
  }, [sidebarState.isOpen]);

  // Handle cases where the sidebar has an invalid size. This can happen when
  // the panel has been resized in a larger window, then the window is resized
  // to be smaller, or vice versa.
  useLayoutEffect(() => {
    let panel = sidebarPanelRef.current;
    if (panel && !panel.getCollapsed()) {
      let currentSize = panel.getSize();
      if (currentSize < size.minSize || currentSize > size.maxSize) {
        panel.resize(clamp(currentSize, size.minSize, size.maxSize));
      }
    }
  }, [size.maxSize, size.minSize]);

  useLayoutEffect(() => {
    const panelGroup: HTMLElement | null = document.querySelector(
      `[data-panel-group-id="${panelGroupId}"]`
    );
    const contentPanel: HTMLElement | null = document.querySelector(
      `[data-panel-id="${contentPanelId}"]`
    );
    const resizeHandles: NodeListOf<HTMLElement> = document.querySelectorAll(
      '[data-panel-resize-handle-id]'
    );

    if (!panelGroup || !contentPanel) {
      return;
    }

    const observer = new ResizeObserver(() => {
      // GROUP: pixel fixes
      let groupWidth = panelGroup.offsetWidth;

      resizeHandles.forEach(resizeHandle => {
        // subtract the width of the resize handles
        groupWidth -= resizeHandle.offsetWidth;
      });

      let minSize = calcMin(groupWidth);
      let maxSize = calcMax(groupWidth);
      let defaultSize = calcDefault(groupWidth);

      setSize({ minSize, maxSize, defaultSize });

      // CONTENT PANEL: for context
      let contentWidth = contentPanel.offsetWidth;

      setContentSize(() => {
        if (contentWidth >= breakpoints.wide) {
          return 'wide';
        }
        if (contentWidth >= breakpoints.desktop) {
          return 'desktop';
        }
        if (contentWidth >= breakpoints.tablet) {
          return 'tablet';
        }
        return 'mobile';
      });
    });
    observer.observe(panelGroup);
    observer.observe(contentPanel);
    resizeHandles.forEach(resizeHandle => {
      observer.observe(resizeHandle);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <ContentPanelContext.Provider value={contentSize}>
      <PanelGroup
        disablePointerEventsDuringResize
        id={panelGroupId}
        autoSaveId={panelGroupId}
        direction="horizontal"
        className={css({ flex: 1 })}
      >
        {isBelowTablet ? (
          <SidebarDialog hrefBase={basePath} config={config} />
        ) : (
          <>
            <Panel
              order={1}
              collapsible
              defaultSize={size.defaultSize}
              maxSize={size.maxSize}
              minSize={size.minSize}
              onCollapse={isCollapsed => sidebarState.setOpen(!isCollapsed)}
              ref={sidebarPanelRef}
              className={css({
                containerName: 'app-side-panel',
                containerType: 'inline-size',
              })}
            >
              <SidebarPanel hrefBase={basePath} config={config} />
            </Panel>
            <ResizeHandle
              onDragging={setIsDragging}
              disabled={!isDragging && !sidebarState.isOpen}
            />
          </>
        )}
        <Panel
          order={2}
          id={contentPanelId}
          className={css({
            containerName: 'app-main-panel',
            containerType: 'inline-size',
          })}
        >
          {children}
        </Panel>
      </PanelGroup>
    </ContentPanelContext.Provider>
  );
};

// Content panel layout
// -----------------------------------------------------------------------------

export const ContentPanelLayout = ({
  children,
}: {
  children: [ReactElement, ReactElement];
}) => {
  const [main, aside] = children;
  const panelGroupId = 'content';

  return (
    <PanelGroup
      disablePointerEventsDuringResize
      id={panelGroupId}
      autoSaveId={panelGroupId}
      direction="horizontal"
      className={css({ flex: 1 })}
    >
      <Panel minSize={25} maxSize={75} defaultSize={67}>
        {main}
      </Panel>
      <ResizeHandle />
      <Panel minSize={25} maxSize={75} defaultSize={33}>
        {aside}
      </Panel>
    </PanelGroup>
  );
};

// Utils
// -----------------------------------------------------------------------------

const SIDEBAR_MIN_PERCENT = 14;
const SIDEBAR_DEFAULT_PERCENT = 20;
const SIDEBAR_MAX_PERCENT = 48;
const SIDEBAR_MIN_PX = 180;
const SIDEBAR_DEFAULT_PX = 260;
const SIDEBAR_MAX_PX = 600;

const calcDefault = (t: number) =>
  toFixedNumber((SIDEBAR_DEFAULT_PX / t) * 100, 0);
const calcMin = (t: number) => toFixedNumber((SIDEBAR_MIN_PX / t) * 100, 0);
const calcMax = (t: number) =>
  toFixedNumber(Math.min((SIDEBAR_MAX_PX / t) * 100, SIDEBAR_MAX_PERCENT), 0);

function getInitialSizes() {
  if (typeof window === 'undefined') {
    return {
      minSize: SIDEBAR_MIN_PERCENT,
      maxSize: SIDEBAR_MAX_PERCENT,
      defaultSize: SIDEBAR_DEFAULT_PERCENT,
    };
  }

  // Fallback to `window.innerWidth`, which doesn't include scrollbars but it's
  // okay for this approximation.
  let viewportWidth = window.visualViewport?.width || window.innerWidth;

  let minSize = calcMin(viewportWidth);
  let maxSize = calcMax(viewportWidth);
  let defaultSize = calcDefault(viewportWidth);
  return { minSize, maxSize, defaultSize };
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

// Styled components
// -----------------------------------------------------------------------------

function ResizeHandle(props: Omit<PanelResizeHandleProps, 'className'>) {
  return (
    <PanelResizeHandle
      {...props}
      className={css({
        backgroundColor: tokenSchema.color.border.muted,
        boxSizing: 'border-box',
        outline: 0,
        position: 'relative',
        transition: transition('background-color'),
        width: tokenSchema.size.border.regular,
        zIndex: 1,

        // hide when disabled
        '&[data-panel-resize-handle-enabled=false]': {
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
        '&[data-resize-handle-active]::after': {
          backgroundColor: tokenSchema.color.background.accentEmphasis,
          insetInline: `calc(${tokenSchema.size.border.regular} * -1)`,
          opacity: 1,
        },
      })}
    />
  );
}
