import { Box } from '@keystar/ui/layout';
import {
  SplitView,
  SplitPanePrimary,
  SplitPaneSecondary,
} from '@keystar/ui/split-view';
import { breakpointQueries, useMediaQuery } from '@keystar/ui/style';
import { ReactNode, useRef } from 'react';

import { Config } from '../../config';

import { ContentPanelProvider, useContentPanelState } from './context';
import { SidebarDialog, SidebarPanel, useSidebar } from './sidebar';

// Main panel layout
// -----------------------------------------------------------------------------

export const MainPanelLayout = (props: {
  children: ReactNode;
  basePath: string;
  config: Config;
}) => {
  let { basePath, children, config } = props;

  let isBelowDesktop = useMediaQuery(breakpointQueries.below.desktop);
  let sidebarState = useSidebar();
  let ref = useRef<HTMLDivElement>(null);
  let context = useContentPanelState(ref);

  // no split view on small devices
  if (isBelowDesktop) {
    return (
      <ContentPanelProvider value={context}>
        <SidebarDialog hrefBase={basePath} config={config} />
        <Box flex ref={ref}>
          {children}
        </Box>
      </ContentPanelProvider>
    );
  }

  return (
    <ContentPanelProvider value={context}>
      <SplitView
        autoSaveId="keystatic-app-split-view"
        isCollapsed={!sidebarState.isOpen}
        onCollapseChange={sidebarState.toggle}
        defaultSize={260}
        minSize={180}
        maxSize={400}
        flex
      >
        <SplitPanePrimary>
          <SidebarPanel hrefBase={basePath} config={config} />
        </SplitPanePrimary>
        <SplitPaneSecondary ref={ref}>{children}</SplitPaneSecondary>
      </SplitView>
    </ContentPanelProvider>
  );
};
