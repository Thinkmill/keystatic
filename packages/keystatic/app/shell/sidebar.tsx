import { VisuallyHidden } from '@react-aria/visually-hidden';
import { Item, Section } from '@react-stately/collections';
import { Badge } from '@voussoir/badge';
import { ActionButton } from '@voussoir/button';
import { Icon } from '@voussoir/icon';
import { chevronDownIcon } from '@voussoir/icon/icons/chevronDownIcon';
import { folderOpenIcon } from '@voussoir/icon/icons/folderOpenIcon';
import { Flex } from '@voussoir/layout';
import { MenuTrigger, Menu } from '@voussoir/menu';
import { NavList, NavItem, NavGroup } from '@voussoir/nav-list';
import { css, breakpointQueries, tokenSchema } from '@voussoir/style';
import { Text } from '@voussoir/typography';
import router, { useRouter } from 'next/router';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Config, GitHubConfig } from '../../config';
import { isGitHubConfig, pluralize } from '../utils';
import { SidebarHeader } from './sidebar-header';
import { Image } from '@voussoir/image';
import { useQuery } from 'urql';
import { gql } from '@ts-gql/tag/no-transform';
import { useChanged } from './data';

export const SidebarContext = createContext<{
  sidebarIsOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}>({
  sidebarIsOpen: false,
  setSidebarOpen: () => {
    throw new Error('SidebarContext not set');
  },
});

export function SidebarProvider(props: { children: ReactNode }) {
  const [sidebarIsOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setSidebarOpen(false);
  }, [router.asPath]);

  const sidebarContext = { sidebarIsOpen, setSidebarOpen };

  return (
    <SidebarContext.Provider value={sidebarContext}>
      {props.children}
    </SidebarContext.Provider>
  );
}

export const SIDEBAR_WIDTH = 320;

export function Sidebar(props: { config: Config; hrefBase: string }) {
  const { sidebarIsOpen, setSidebarOpen } = useContext(SidebarContext);
  const isCurrent = (href: string, { exact = false } = {}) => {
    if (exact) {
      return href === router.asPath ? 'page' : undefined;
    }
    return router.asPath.startsWith(href) ? 'page' : undefined;
  };

  const collectionsArray = Object.entries(props.config.collections || {});
  const singletonsArray = Object.entries(props.config.singletons || {});

  const changedData = useChanged();

  return (
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
      {isGitHubConfig(props.config) && (
        <SidebarHeader repo={props.config.storage.repo} />
      )}

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
          <NavItem
            href={props.hrefBase}
            aria-current={isCurrent(props.hrefBase, { exact: true })}
          >
            Dashboard
          </NavItem>

          {collectionsArray.length !== 0 && (
            <NavGroup title="Collections">
              {collectionsArray.map(([key, collection]) => {
                const href = `${props.hrefBase}/collection/${key}`;
                const changes = changedData.collections.get(key);
                const allChangesCount = changes
                  ? changes.changed.size +
                    changes.added.size +
                    changes.removed.size
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
                const href = `${props.hrefBase}/singleton/${key}`;
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

      {isGitHubConfig(props.config) && <SidebarFooter config={props.config} />}

      <VisuallyHidden
        elementType="button"
        onClick={() => setSidebarOpen(false)}
      >
        close sidebar
      </VisuallyHidden>
    </Flex>
  );
}

function SidebarFooter(props: { config: GitHubConfig }) {
  const [{ data: { viewer = undefined } = {} }] = useQuery({
    query: gql`
      query Viewer {
        viewer {
          id
          name
          login
          avatarUrl
        }
      }
    ` as import('../../__generated__/ts-gql/Viewer').type,
  });
  return (
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
          {props.config.storage.repo.name}
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
              window.open(
                `https://github.com/${viewer?.login ?? ''}`,
                '_blank'
              );
            }
            if (key === 'repository') {
              window.open(
                `https://github.com/${props.config.storage.repo.owner}/${props.config.storage.repo.name}`,
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
  );
}
