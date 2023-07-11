import {
  createContext,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useContext,
} from 'react';

import { alertCircleIcon } from '@keystar/ui/icon/icons/alertCircleIcon';
import { Icon } from '@keystar/ui/icon';
import { Box, BoxProps, Flex } from '@keystar/ui/layout';
import { VoussoirTheme } from '@keystar/ui/style';
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
import { SidebarProvider } from './sidebar';
import { TopBar } from './topbar';
import { MainPanelLayout } from './panels';
import { ScrollView } from './primitives';

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
      <SidebarProvider>
        <Flex direction="column" height="100vh">
          <TopBar />
          <MainPanelLayout basePath={props.basePath} config={props.config}>
            {content}
          </MainPanelLayout>
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
      paddingX={{ mobile: 'medium', tablet: 'xlarge', desktop: 'xxlarge' }}
    >
      {'children' in props ? (
        props.children
      ) : (
        <>
          {props.icon && (
            <Icon src={props.icon} size="large" color="neutralEmphasis" />
          )}
          {props.title && (
            <Heading align="center" size="medium">
              {props.title}
            </Heading>
          )}
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
    <ScrollView isDisabled={!isScrollable}>
      <AppShellContainer
        // padding on the container so descendants can use sticky positioning
        // with simple relative offsets
        paddingY="xlarge"
      >
        {children}
      </AppShellContainer>
    </ScrollView>
  );
};

type AppShellContextValue = {
  containerWidth: keyof VoussoirTheme['size']['container'] | 'none';
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
        height="100%"
        // fix flexbox issues
        minHeight={0}
        minWidth={0}
      >
        {children}
      </Flex>
    </AppShellContext.Provider>
  );
};

export const AppShellContainer = (props: BoxProps) => {
  const { containerWidth } = useContext(AppShellContext);
  const maxWidth =
    containerWidth === 'none'
      ? undefined
      : (`container.${containerWidth}` as const);

  return (
    <Box
      minHeight={0}
      minWidth={0}
      maxWidth={maxWidth}
      // marginX="auto"
      paddingX={{ mobile: 'medium', tablet: 'xlarge', desktop: 'xxlarge' }}
      {...props}
    />
  );
};
