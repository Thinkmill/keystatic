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
import { VoussoirTheme, css, transition } from '@keystar/ui/style';
import { Heading, Text } from '@keystar/ui/typography';

import { Config } from '../../config';

import { isGitHubConfig, isLocalConfig } from '../utils';

import { MAIN_PANEL_ID, SIDE_PANEL_ID } from './constants';
import { ConfigContext } from './context';
import {
  GitHubAppShellProvider,
  AppShellErrorContext,
  LocalAppShellProvider,
} from './data';
import { SidebarProvider, Sidebar } from './sidebar';
import { TopBar } from './topbar';

export const AppShell = (props: {
  config: Config;
  children: ReactNode;
  currentBranch: string;
  basePath: string;
}) => {
  const inner = (
    <ConfigContext.Provider value={props.config}>
      <SidebarProvider>
        <Flex direction="column" minHeight="100vh">
          <TopBar />
          <Flex direction={{ mobile: 'column', tablet: 'row' }} flex>
            <Sidebar hrefBase={props.basePath} config={props.config} />
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
          </Flex>
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

export const AppShellBody = ({ children }: PropsWithChildren) => {
  return (
    <Box paddingY="xlarge">
      <AppShellContainer>{children}</AppShellContainer>
    </Box>
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
        UNSAFE_className={css({
          '&::before': {
            backgroundColor: '#0006',
            content: '""',
            inset: 0,
            opacity: 0,
            pointerEvents: 'none',
            visibility: 'hidden',
            position: 'fixed',
            zIndex: 5,

            // exit animation
            transition: [
              transition('opacity', {
                easing: 'easeOut',
                duration: 'regular',
                delay: 'short',
              }),
              transition('visibility', {
                delay: 'regular',
                duration: 0,
                easing: 'linear',
              }),
            ].join(', '),
          },
          [`#${SIDE_PANEL_ID}[data-visible=true] ~ &::before`]: {
            opacity: 1,
            pointerEvents: 'auto',
            visibility: 'visible',

            // enter animation
            transition: transition('opacity', { easing: 'easeIn' }),
          },
        })}
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
