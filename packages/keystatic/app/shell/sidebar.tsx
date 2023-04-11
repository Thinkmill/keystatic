import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { Item, Section } from '@react-stately/collections';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Badge } from '@voussoir/badge';
import { ActionButton } from '@voussoir/button';
import { Icon } from '@voussoir/icon';
import { chevronDownIcon } from '@voussoir/icon/icons/chevronDownIcon';
import { Image } from '@voussoir/image';
import { Flex } from '@voussoir/layout';
import { MenuTrigger, Menu } from '@voussoir/menu';
import { NavList, NavItem, NavGroup } from '@voussoir/nav-list';
import { css, breakpointQueries, tokenSchema } from '@voussoir/style';
import { Text } from '@voussoir/typography';

import { CloudConfig, Config, GitHubConfig } from '../../config';

import l10nMessages from '../l10n/index.json';
import { useRouter } from '../router';
import { getRepoUrl, isCloudConfig, isGitHubConfig, pluralize } from '../utils';

import { GitHubAppShellDataContext, useBranchInfo, useChanged } from './data';
import { SidebarHeader } from './sidebar-header';
import { ViewerContext } from './sidebar-data';

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
  }, [router.href]);

  const sidebarContext = { sidebarIsOpen, setSidebarOpen };

  return (
    <SidebarContext.Provider value={sidebarContext}>
      {props.children}
    </SidebarContext.Provider>
  );
}

export const SIDEBAR_WIDTH = 320;

export function Sidebar(props: { config: Config; hrefBase: string }) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const { sidebarIsOpen, setSidebarOpen } = useContext(SidebarContext);
  const router = useRouter();
  const isCurrent = (href: string, { exact = false } = {}) => {
    if (exact) {
      return href === router.href ? 'page' : undefined;
    }
    return router.href.startsWith(href) ? 'page' : undefined;
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
      {(isGitHubConfig(props.config) || isCloudConfig(props.config)) && (
        <SidebarHeader />
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
            {stringFormatter.format('dashboard')}
          </NavItem>

          {collectionsArray.length !== 0 && (
            <NavGroup title={stringFormatter.format('collections')}>
              {collectionsArray.map(([key, collection]) => {
                const href = `${props.hrefBase}/collection/${encodeURIComponent(
                  key
                )}`;
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
            <NavGroup title={stringFormatter.format('singletons')}>
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

      {(isGitHubConfig(props.config) || isCloudConfig(props.config)) && (
        <SidebarFooter config={props.config} />
      )}

      <VisuallyHidden
        elementType="button"
        onClick={() => setSidebarOpen(false)}
      >
        close sidebar
      </VisuallyHidden>
    </Flex>
  );
}

function SidebarFooter(props: { config: GitHubConfig | CloudConfig }) {
  const viewer = useContext(ViewerContext);
  const appShellData = useContext(GitHubAppShellDataContext);
  const fork =
    appShellData?.data?.repository &&
    'forks' in appShellData.data.repository &&
    appShellData.data.repository.forks.nodes?.[0];
  const branchInfo = useBranchInfo();
  return (
    <Flex
      elementType="header"
      borderTop="muted"
      paddingX="xlarge"
      height="xlarge"
      alignItems="center"
      justifyContent="space-between"
    >
      <Text
        color="neutralEmphasis"
        weight="semibold"
        size="medium"
        id="nav-title-id"
        truncate
      >
        {props.config.storage.kind === 'github'
          ? props.config.storage.repo.name
          : props.config.storage.project}
      </Text>
      <MenuTrigger direction="top">
        <ActionButton prominence="low" aria-label="app actions">
          {props.config.storage.kind === 'github' && (
            <Image
              alt={`${viewer?.name ?? viewer?.login} avatar`}
              borderRadius="full"
              overflow="hidden"
              aspectRatio="1"
              height="xsmall"
              src={viewer?.avatarUrl ?? ''}
            />
          )}
          <Icon src={chevronDownIcon} />
        </ActionButton>
        <Menu
          onAction={key => {
            if (key === 'logout') {
              if (props.config.storage.kind === 'github') {
                window.location.href = '/api/keystatic/github/logout';
              }
              if (props.config.storage.kind === 'cloud') {
                localStorage.removeItem('keystatic-cloud-access-token');
                window.location.reload();
              }
            }
            if (key === 'profile') {
              window.open(
                `https://github.com/${viewer?.login ?? ''}`,
                '_blank',
                'noopener,noreferrer'
              );
            }
            if (key === 'repository') {
              window.open(
                getRepoUrl(branchInfo),
                '_blank',
                'noopener,noreferrer'
              );
            }
            if (key === 'fork' && fork) {
              window.open(
                `https://github.com/${fork.owner.login}/${fork.name}`,
                '_blank',
                'noopener,noreferrer'
              );
            }
          }}
        >
          <Item key="logout">Log out</Item>
          <Section title="Github">
            {[
              ...(props.config.storage.kind === 'github'
                ? [<Item key="profile">Profile</Item>]
                : []),
              <Item key="repository">Repository</Item>,
              ...(fork ? [<Item key="fork">Fork</Item>] : []),
            ]}
          </Section>
        </Menu>
      </MenuTrigger>
    </Flex>
  );
}
