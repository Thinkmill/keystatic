import {
  SplitView,
  SplitPanePrimary,
  SplitPaneSecondary,
} from '@keystar/ui/split-view';
import {
  breakpointQueries,
  breakpoints,
  useMediaQuery,
} from '@keystar/ui/style';
import { useResizeObserver } from '@react-aria/utils';
import {
  ReactElement,
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react';

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
  let [contentSize, setContentSize] = useState<ContentSize>('mobile');
  let sidebarState = useSidebar();
  let contentPaneRef = useRef<HTMLDivElement>(null);

  const contentPaneResize = useCallback(() => {
    setContentSize(size => {
      let contentPane = contentPaneRef.current;
      if (!contentPane) {
        return size;
      }
      if (contentPane.offsetWidth >= breakpoints.wide) {
        return 'wide';
      }
      if (contentPane.offsetWidth >= breakpoints.desktop) {
        return 'desktop';
      }
      if (contentPane.offsetWidth >= breakpoints.tablet) {
        return 'tablet';
      }
      return 'mobile';
    });
  }, []);
  useResizeObserver({
    ref: contentPaneRef,
    onResize: contentPaneResize,
  });

  console.log(sidebarState);

  return (
    <ContentPanelContext.Provider value={contentSize}>
      <SplitView
        autoSaveId="keystatic-app-split-view"
        isCollapsed={!sidebarState.isOpen}
        onCollapse={sidebarState.close}
        defaultSize={260}
        minSize={180}
        maxSize={400}
        flex
      >
        {isBelowTablet ? (
          <SidebarDialog hrefBase={basePath} config={config} />
        ) : (
          <SplitPanePrimary>
            <SidebarPanel hrefBase={basePath} config={config} />
          </SplitPanePrimary>
        )}
        <SplitPaneSecondary ref={contentPaneRef}>{children}</SplitPaneSecondary>
      </SplitView>
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

  return (
    <SplitView
      autoSaveId="keystatic-content-split-view"
      defaultSize={320}
      minSize={240}
      maxSize={480}
      flex
    >
      <SplitPaneSecondary>{main}</SplitPaneSecondary>
      <SplitPanePrimary>{aside}</SplitPanePrimary>
    </SplitView>
  );
};
