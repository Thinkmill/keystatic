import { VisuallyHidden } from '@react-aria/visually-hidden';

import { useRouter } from 'next/router';
import {
  createContext,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { alertCircleIcon } from '@voussoir/icon/icons/alertCircleIcon';
import { folderOpenIcon } from '@voussoir/icon/icons/folderOpenIcon';
import { chevronDownIcon } from '@voussoir/icon/icons/chevronDownIcon';

import { Badge } from '@voussoir/badge';
import { ActionButton } from '@voussoir/button';
import { Icon } from '@voussoir/icon';
import { Image } from '@voussoir/image';
import { Box, BoxProps, Flex, Grid } from '@voussoir/layout';
import { NavList, NavGroup, NavItem } from '@voussoir/nav-list';
import { Item, Menu, MenuTrigger, Section } from '@voussoir/menu';
import { VoussoirTheme, breakpointQueries, css, tokenSchema, transition } from '@voussoir/style';
import { Heading, Text } from '@voussoir/typography';

import { Config } from '../../config';
import { pluralize } from '../utils';
import { SidebarHeader } from './sidebar-header';
import { useAppShellData } from './data';

export const SidebarContext = createContext<{
  sidebarIsOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}>({
  sidebarIsOpen: false,
  setSidebarOpen: () => {
    throw new Error('SidebarContext not set');
  },
});

const SIDEBAR_WIDTH = 320;

export const AppShell = (props: { config: Config; children: ReactNode; currentBranch: string }) => {
  const [sidebarIsOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const hrefBase = `/keystatic/branch/${props.currentBranch}`;
  const isCurrent = (href: string, { exact = false } = {}) => {
    if (exact) {
      return href === router.asPath ? 'page' : undefined;
    }
    return router.asPath.startsWith(href) ? 'page' : undefined;
  };

  const {
    baseCommit,
    changedData,
    currentBranchRef,
    defaultBranchRef,
    viewer,
    allBranches,
    repositoryId,
    error,
    providers,
  } = useAppShellData(props);

  useEffect(() => {
    setSidebarOpen(false);
  }, [router.asPath]);

  const collectionsArray = Object.entries(props.config.collections || {});
  const singletonsArray = Object.entries(props.config.singletons || {});
  const sidebarContext = { sidebarIsOpen, setSidebarOpen };

  return (
    <SidebarContext.Provider value={sidebarContext}>
      <Flex direction={{ mobile: 'column', tablet: 'row' }} width="100vw" minHeight="100vh">
        <Flex
          aria-labelledby="nav-title-id"
          elementType="nav"
          data-visible={sidebarIsOpen}
          // styles
          backgroundColor="surfaceSecondary"
          borderEnd="muted"
          direction="column"
          height="100%"
          position="fixed"
          width={SIDEBAR_WIDTH}
          zIndex={100}
          UNSAFE_className={[
            css({
              [breakpointQueries.above.mobile]: {
                '&::before': {
                  boxShadow: `inset ${tokenSchema.size.shadow.medium} ${tokenSchema.color.shadow.muted}`,
                  content: '""',
                  inset: '-10% 0',
                  position: 'absolute',
                  pointerEvents: 'none',
                  width: 'inherit',
                },
              },
              [breakpointQueries.below.tablet]: {
                boxShadow: `${tokenSchema.size.shadow.large} ${tokenSchema.color.shadow.regular}`,
                left: 'auto',
                outline: 0,
                right: '100%',
                transition: 'transform 200ms, visibility 0s 200ms',
                visibility: 'hidden',

                '&[data-visible=true]': {
                  visibility: 'unset',
                  transitionDelay: '0s',
                  transform: 'translate(100%)',
                },
              },
            }),
            'keystatic-sidebar',
          ]}
        >
          {/*
          ======================================================================
          HEADER
          ======================================================================
          */}
          <SidebarHeader
            currentBranch={props.currentBranch}
            allBranches={allBranches}
            baseCommit={baseCommit!}
            defaultBranch={defaultBranchRef?.name!}
            hasPullRequests={!!currentBranchRef?.associatedPullRequests?.nodes?.length}
            repo={props.config.repo}
            repositoryId={repositoryId!}
          />

          {/*
          ======================================================================
          NAVIGATION
          ======================================================================
          */}
          <Flex
            // backgroundColor="surface"
            direction="column"
            overflow="auto"
            paddingY="xlarge"
            paddingEnd="xlarge"
            // borderTopEndRadius="large"
            // borderBottomEndRadius="large"
            flex
          >
            <NavList flex>
              <NavItem href={hrefBase} aria-current={isCurrent(hrefBase, { exact: true })}>
                Dashboard
              </NavItem>

              {collectionsArray.length !== 0 && (
                <NavGroup title="Collections">
                  {collectionsArray.map(([key, collection]) => {
                    const href = `${hrefBase}/collection/${key}`;
                    const changes = changedData.collections.get(key);
                    const allChangesCount = changes
                      ? changes.changed.size + changes.added.size + changes.removed.size
                      : 0;
                    return (
                      <NavItem key={key} href={href} aria-current={isCurrent(href)}>
                        <Text>{collection.label}</Text>
                        {!!allChangesCount && (
                          <Badge tone="accent" marginStart="auto">
                            <Text>{allChangesCount}</Text>
                            <Text visuallyHidden>
                              {pluralize(allChangesCount, {
                                singular: 'item',
                                inclusive: false,
                              })}{' '}
                              changed
                            </Text>
                          </Badge>
                        )}
                      </NavItem>
                    );
                  })}
                </NavGroup>
              )}
              {singletonsArray.length !== 0 && (
                <NavGroup title="Singletons">
                  {singletonsArray.map(([key, collection]) => {
                    const href = `${hrefBase}/singleton/${key}`;
                    return (
                      <NavItem key={key} href={href} aria-current={isCurrent(href)}>
                        <Text>{collection.label}</Text>
                        {changedData.singletons.has(key) && (
                          <Badge tone="accent" marginStart="auto">
                            Changed
                          </Badge>
                        )}
                      </NavItem>
                    );
                  })}
                </NavGroup>
              )}
            </NavList>
          </Flex>

          {/*
          ======================================================================
          FOOTER
          ======================================================================
          */}

          <Flex
            elementType="header"
            borderTop="muted"
            paddingX="xlarge"
            height="xlarge"
            alignItems="center"
            justifyContent="space-between"
          >
            <Flex gap="regular" alignItems="center" height="regular">
              <Icon src={folderOpenIcon} />
              <Text
                color="neutralEmphasis"
                weight="semibold"
                size="medium"
                id="nav-title-id"
                truncate
              >
                {props.config.repo.name}
              </Text>
            </Flex>
            <MenuTrigger direction="top">
              <ActionButton prominence="low" aria-label="app actions">
                <Image
                  alt={`${viewer?.name ?? viewer?.login} avatar`}
                  borderRadius="full"
                  overflow="hidden"
                  aspectRatio="1"
                  height="xsmall"
                  src={viewer?.avatarUrl ?? ''}
                />
                <Icon src={chevronDownIcon} />
              </ActionButton>
              <Menu
                onAction={key => {
                  if (key === 'logout') {
                    alert('TODO: logout');
                  }
                  if (key === 'profile') {
                    window.open(`https://github.com/${viewer?.login ?? ''}`, '_blank');
                  }
                  if (key === 'repository') {
                    window.open(
                      `https://github.com/${props.config.repo.owner}/${props.config.repo.name}`,
                      '_blank'
                    );
                  }
                }}
              >
                <Item key="logout">Log out</Item>
                <Section title="Github">
                  <Item key="profile">Profile</Item>
                  <Item key="repository">Repository</Item>
                </Section>
              </Menu>
            </MenuTrigger>
          </Flex>

          <VisuallyHidden elementType="button" onClick={() => setSidebarOpen(false)}>
            close sidebar
          </VisuallyHidden>
        </Flex>

        {/*
        ========================================================================
        MAIN
        ========================================================================
        */}
        {providers(
          error ? (
            <EmptyState
              icon={alertCircleIcon}
              title="Failed to load shell"
              message={error.message}
            />
          ) : (
            props.children
          )
        )}
      </Flex>
    </SidebarContext.Provider>
  );
};

// Styled components
// -----------------------------------------------------------------------------

type EmptyStateProps =
  | { children: ReactNode }
  | { title?: ReactNode; icon?: ReactElement; message?: ReactNode; actions?: ReactNode };
export function EmptyState(props: EmptyStateProps) {
  return (
    <Flex
      alignItems="center"
      direction="column"
      gap="large"
      justifyContent="center"
      minHeight="size.scale.3000"
    >
      {'children' in props ? (
        props.children
      ) : (
        <>
          {props.icon && <Icon src={props.icon} size="large" color="neutralEmphasis" />}
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

type AppShellContextValue = { containerWidth: keyof VoussoirTheme['size']['container'] };
const AppShellContext = createContext<AppShellContextValue>({
  containerWidth: 'medium',
});
export const AppShellRoot = ({
  children,
  containerWidth = 'medium',
}: PropsWithChildren<Partial<AppShellContextValue>>) => {
  return (
    <AppShellContext.Provider value={{ containerWidth }}>
      <Grid
        elementType="main"
        flex
        minHeight="100vh"
        minWidth={0}
        paddingStart={{ tablet: SIDEBAR_WIDTH }}
        rows={['auto', '1fr', 'auto']}
        UNSAFE_className={css({
          '&::before': {
            backgroundColor: '#0006',
            content: '""',
            inset: 0,
            opacity: 0,
            pointerEvents: 'none',
            position: 'fixed',
            transition: transition('opacity'),
            zIndex: 99,
          },
          'nav[data-visible=true] ~ &::before': {
            opacity: 1,
          },
        })}
      >
        {children}
      </Grid>
    </AppShellContext.Provider>
  );
};

export const AppShellContainer = (props: BoxProps) => {
  const { containerWidth } = useContext(AppShellContext);
  return (
    <Box
      maxWidth={`size.container.${containerWidth}`}
      marginX="auto"
      paddingX={{ mobile: 'regular', tablet: 'xlarge' }}
      {...props}
    />
  );
};
