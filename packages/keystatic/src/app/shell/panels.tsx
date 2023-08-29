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

  return (
    <ContentPanelProvider value={context}>
      <SplitView
        autoSaveId="keystatic-app-split-view"
        isCollapsed={isBelowDesktop || !sidebarState.isOpen}
        onCollapseChange={sidebarState.toggle}
        defaultSize={260}
        minSize={180}
        maxSize={400}
        flex
      >
        {isBelowDesktop ? (
          <SidebarDialog hrefBase={basePath} config={config} />
        ) : (
          <SplitPanePrimary>
            <SidebarPanel hrefBase={basePath} config={config} />
          </SplitPanePrimary>
        )}
        <SplitPaneSecondary ref={ref}>{children}</SplitPaneSecondary>
      </SplitView>
    </ContentPanelProvider>
  );
};
