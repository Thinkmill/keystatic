import { ReactNode } from 'react';

import { alertCircleIcon } from '@keystar/ui/icon/icons/alertCircleIcon';

import { Config } from '../../config';

import { isGitHubConfig, isLocalConfig } from '../utils';

import { AppStateContext, ConfigContext } from './context';
import {
  GitHubAppShellProvider,
  AppShellErrorContext,
  LocalAppShellProvider,
} from './data';
import { SidebarProvider } from './sidebar';
import { MainPanelLayout } from './panels';
import { EmptyState } from './empty-state';

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
    <ConfigContext.Provider value={props.config}>
      <AppStateContext.Provider value={{ basePath: props.basePath }}>
        <SidebarProvider>
          <MainPanelLayout>{content}</MainPanelLayout>
        </SidebarProvider>
      </AppStateContext.Provider>
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
