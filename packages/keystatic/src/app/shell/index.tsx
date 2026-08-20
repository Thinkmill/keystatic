import { ReactNode, useContext } from 'react';

import { alertCircleIcon } from '@keystar/ui/icon/icons/alertCircleIcon';

import { Config } from '../../config';

import { isGitHubConfig, isLocalConfig } from '../utils';

import { AppStateContext, ConfigContext } from './context';
import { ContentLocaleProvider } from './content-locale';
import {
  GitHubAppShellProvider,
  AppShellErrorContext,
  LocalAppShellProvider,
  useBranches,
  useCurrentBranch,
  GitHubAppShellDataContext,
} from './data';
import { SidebarProvider } from './sidebar';
import { MainPanelLayout } from './panels';
import { EmptyState } from './empty-state';

function BranchNotFound(props: { children: ReactNode }) {
  const branches = useBranches();
  const currentBranch = useCurrentBranch();
  const appShellDataContext = useContext(GitHubAppShellDataContext);
  if (
    appShellDataContext?.data?.repository?.refs?.pageInfo.hasNextPage ===
      false &&
    !branches.has(currentBranch)
  ) {
    return (
      <EmptyState
        icon={alertCircleIcon}
        title="Branch not found"
        message={`The branch ${currentBranch} does not exist in this repository.`}
      />
    );
  }
  return props.children;
}

export const AppShell = (props: {
  config: Config;
  children: ReactNode;
  currentBranch: string;
  basePath: string;
}) => {
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
    <AppStateContext.Provider value={{ basePath: props.basePath }}>
      <SidebarProvider>
        <MainPanelLayout>
          <BranchNotFound>{content}</BranchNotFound>
        </MainPanelLayout>
      </SidebarProvider>
    </AppStateContext.Provider>
  );

  let withData: ReactNode;
  if (isGitHubConfig(props.config) || props.config.storage.kind === 'cloud') {
    withData = (
      <GitHubAppShellProvider
        currentBranch={props.currentBranch}
        config={props.config}
      >
        {inner}
      </GitHubAppShellProvider>
    );
  } else if (isLocalConfig(props.config)) {
    withData = (
      <LocalAppShellProvider config={props.config}>
        {inner}
      </LocalAppShellProvider>
    );
  } else {
    return null;
  }

  return (
    <ConfigContext.Provider value={props.config}>
      <ContentLocaleProvider>{withData}</ContentLocaleProvider>
    </ConfigContext.Provider>
  );
};
