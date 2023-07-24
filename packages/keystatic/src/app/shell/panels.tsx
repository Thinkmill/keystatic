import {
  SplitView,
  SplitPanePrimary,
  SplitPaneSecondary,
} from '@keystar/ui/split-view';
import { breakpointQueries, useMediaQuery } from '@keystar/ui/style';
import { ReactNode } from 'react';

import { Config } from '../../config';

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

  // no split view on small devices
  if (isBelowDesktop) {
    return (
      <>
        <SidebarDialog hrefBase={basePath} config={config} />
        {children}
      </>
    );
  }

  return (
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
      <SplitPaneSecondary>{children}</SplitPaneSecondary>
    </SplitView>
  );
};
