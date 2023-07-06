import { clamp, useLayoutEffect } from '@react-aria/utils';
import {
  createContext,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useContext,
  useRef,
  useState,
} from 'react';
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
  ImperativePanelHandle,
} from 'react-resizable-panels';

import { alertCircleIcon } from '@keystar/ui/icon/icons/alertCircleIcon';
import { Icon } from '@keystar/ui/icon';
import { Box, BoxProps, Flex } from '@keystar/ui/layout';
import {
  VoussoirTheme,
  breakpointQueries,
  css,
  tokenSchema,
  transition,
  useMediaQuery,
} from '@keystar/ui/style';
import { Heading, Text } from '@keystar/ui/typography';

import { Config } from '../../config';

import { isGitHubConfig, isLocalConfig } from '../utils';

import { MAIN_PANEL_ID } from './constants';
import { ConfigContext } from './context';
import {
  GitHubAppShellProvider,
  AppShellErrorContext,
  LocalAppShellProvider,
} from './data';
import { SidebarProvider, Sidebar, useSidebar } from './sidebar';
import { TopBar } from './topbar';

export const AppShell = (props: {
  config: Config;
  children: ReactNode;
  currentBranch: string;
  basePath: string;
}) => {
  const isBelowTablet = useMediaQuery(breakpointQueries.below.tablet);

  const content = (
    <AppShellErrorContext.Consumer>
      {error =>
        error &&
        !error?.graphQLErrors.some(
          err => (err?.originalError as any)?.type === 'NOT_FOUND'
        ) ? (
          <EmptyState
            icon={alertCircleIcon}
            title="Failed to load shell"
            message={error.message}
          />
        ) : (
          props.children
        )
      }
    </AppShellErrorContext.Consumer>
  );

  const inner = (
    <ConfigContext.Provider value={props.config}>
      <SidebarProvider>
        <Flex direction="column" height="100vh">
          <TopBar />
          {isBelowTablet ? (
            <>
              <Sidebar hrefBase={props.basePath} config={props.config} />
              {content}
            </>
          ) : (
            <PanelLayout
              sidebar={
                <Sidebar hrefBase={props.basePath} config={props.config} />
              }
              content={content}
            />
          )}
        </Flex>
      </SidebarProvider>
    </ConfigContext.Provider>
  );
  if (isGitHubConfig(props.config) || props.config.storage.kind === 'cloud') {
    return (
      <GitHubAppShellProvider
        currentBranch={props.currentBranch}
        config={props.config}
      >
        {inner}
      </GitHubAppShellProvider>
    );
  }
  if (isLocalConfig(props.config)) {
    return (
      <LocalAppShellProvider config={props.config}>
        {inner}
      </LocalAppShellProvider>
    );
  }
  return null;
};

// Panels
// -----------------------------------------------------------------------------

const SIDEBAR_MIN_PERCENT = 10;
const SIDEBAR_DEFAULT_PERCENT = 18;
const SIDEBAR_MAX_PERCENT = 50;
const SIDEBAR_MIN_PX = 180;
const SIDEBAR_DEFAULT_PX = 260;
const SIDEBAR_MAX_PX = 600;

const calcDefault = (t: number) => (SIDEBAR_DEFAULT_PX / t) * 100;
const calcMin = (t: number) => (SIDEBAR_MIN_PX / t) * 100;
const calcMax = (t: number) =>
  Math.min((SIDEBAR_MAX_PX / t) * 100, SIDEBAR_MAX_PERCENT);

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

const PanelLayout = ({
  sidebar,
  content,
}: {
  sidebar: ReactNode;
  content: ReactNode;
}) => {
  let [isDragging, setIsDragging] = useState(false);
  let [size, setSize] = useState(() => getInitialSizes());
  let { sidebarIsOpen, setSidebarOpen } = useSidebar();
  let sidebarPanelRef = useRef<ImperativePanelHandle>(null);

  // Sync sidebar context with panel state.
  useLayoutEffect(() => {
    let panel = sidebarPanelRef.current;
    if (panel) {
      if (sidebarIsOpen) {
        panel.resize(size.defaultSize);
      } else {
        panel.collapse();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarIsOpen]);

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
      '[data-panel-group-id="main"]'
    );
    const resizeHandles: NodeListOf<HTMLElement> = document.querySelectorAll(
      '[data-panel-resize-handle-id]'
    );

    if (!panelGroup) {
      return;
    }

    const observer = new ResizeObserver(() => {
      let width = panelGroup.offsetWidth;

      // subtract the width of the resize handles
      resizeHandles.forEach(resizeHandle => {
        width -= resizeHandle.offsetWidth;
      });

      let minSize = calcMin(width);
      let maxSize = calcMax(width);
      let defaultSize = calcDefault(width);
      setSize({ minSize, maxSize, defaultSize });
    });
    observer.observe(panelGroup);
    resizeHandles.forEach(resizeHandle => {
      observer.observe(resizeHandle);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  console.log('panels');

  return (
    <PanelGroup
      disablePointerEventsDuringResize
      id="main"
      autoSaveId="main"
      direction="horizontal"
      className={css({ flex: 1 })}
    >
      <Panel
        collapsible
        defaultSize={size.defaultSize}
        maxSize={size.maxSize}
        minSize={size.minSize}
        onCollapse={isCollapsed => setSidebarOpen(!isCollapsed)}
        ref={sidebarPanelRef}
        className={css({
          // containerName: 'sidepanel',
          // containerType: 'inline-size',
        })}
      >
        {sidebar}
      </Panel>
      <PanelResizeHandle
        onDragging={setIsDragging}
        disabled={!isDragging && !sidebarIsOpen}
        className={css({
          borderInlineEnd: `1px solid ${tokenSchema.color.border.muted}`,
          boxSizing: 'border-box',
          outline: 0,
          position: 'relative',
          zIndex: 1,

          // hide when disabled
          '&[data-panel-resize-handle-enabled=false]': {
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
            backgroundColor: tokenSchema.color.border.emphasis,
            content: '""',
            insetBlock: 0,
            insetInline: `calc(${tokenSchema.size.space.xsmall} / -2)`,
            opacity: 0,
            position: 'absolute',
            transition: transition('opacity'),
          },
          '&:hover::after': {
            opacity: 1,
            transition: transition('opacity', { delay: 300 }), // delay to avoid flicker. user may just be mousing around the screen; wait for intent
          },
          '&[data-resize-handle-active]::after': {
            backgroundColor: tokenSchema.color.background.accentEmphasis,
            opacity: 1,
          },
        })}
      />
      <Panel
        className={css({
          // containerName: 'mainpanel',
          // containerType: 'inline-size',
        })}
      >
        {content}
      </Panel>
    </PanelGroup>
  );
};

// Styled components
// -----------------------------------------------------------------------------

type EmptyStateProps =
  | { children: ReactNode }
  | {
      title?: ReactNode;
      icon?: ReactElement;
      message?: ReactNode;
      actions?: ReactNode;
    };
export function EmptyState(props: EmptyStateProps) {
  return (
    <Flex
      alignItems="center"
      direction="column"
      gap="large"
      justifyContent="center"
      minHeight="scale.3000"
    >
      {'children' in props ? (
        props.children
      ) : (
        <>
          {props.icon && (
            <Icon src={props.icon} size="large" color="neutralEmphasis" />
          )}
          {props.title && <Heading size="medium">{props.title}</Heading>}
          {props.message && <Text align="center">{props.message}</Text>}
          {props.actions}
        </>
      )}
    </Flex>
  );
}

// Composite components
// -----------------------------------------------------------------------------

export const AppShellBody = ({
  children,
  isScrollable,
}: PropsWithChildren<{ isScrollable?: boolean }>) => {
  return (
    <div
      data-scrollable={isScrollable || undefined}
      className={css({
        '&[data-scrollable]': {
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        },
      })}
    >
      <AppShellContainer
        // padding on the container so descendants can use sticky positioning
        // with simple relative offsets
        paddingY="xlarge"
      >
        {children}
      </AppShellContainer>
    </div>
  );
};

type AppShellContextValue = {
  containerWidth: keyof VoussoirTheme['size']['container'];
};
const AppShellContext = createContext<AppShellContextValue>({
  containerWidth: 'medium',
});
export const AppShellRoot = ({
  children,
  containerWidth = 'medium',
}: PropsWithChildren<Partial<AppShellContextValue>>) => {
  return (
    <AppShellContext.Provider value={{ containerWidth }}>
      <Flex
        elementType="main"
        direction="column"
        id={MAIN_PANEL_ID}
        flex
        minWidth={0}
        // height={{ tablet: '100%' }}
        height="100%"
        // UNSAFE_className={css({
        //   '&::before': {
        //     backgroundColor: '#0006',
        //     content: '""',
        //     inset: 0,
        //     opacity: 0,
        //     pointerEvents: 'none',
        //     visibility: 'hidden',
        //     position: 'fixed',
        //     zIndex: 5,

        //     // exit animation
        //     transition: [
        //       transition('opacity', {
        //         easing: 'easeOut',
        //         duration: 'regular',
        //         delay: 'short',
        //       }),
        //       transition('visibility', {
        //         delay: 'regular',
        //         duration: 0,
        //         easing: 'linear',
        //       }),
        //     ].join(', '),
        //   },
        //   [`#${SIDE_PANEL_ID}[data-visible=true] ~ &::before`]: {
        //     opacity: 1,
        //     pointerEvents: 'auto',
        //     visibility: 'visible',

        //     // enter animation
        //     transition: transition('opacity', { easing: 'easeIn' }),
        //   },
        // })}
      >
        {children}
      </Flex>
    </AppShellContext.Provider>
  );
};

export const AppShellContainer = (props: BoxProps) => {
  const { containerWidth } = useContext(AppShellContext);
  return (
    <Box
      maxWidth={`container.${containerWidth}`}
      marginX="auto"
      paddingX={{ mobile: 'regular', tablet: 'xlarge' }}
      {...props}
    />
  );
};
