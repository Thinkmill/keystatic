import { useLocalizedStringFormatter } from '@react-aria/i18n';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import { Badge } from '@voussoir/badge';
import { Box, Flex } from '@voussoir/layout';
import { NavList, NavItem, NavGroup } from '@voussoir/nav-list';
import { css, breakpointQueries, tokenSchema } from '@voussoir/style';
import { Text } from '@voussoir/typography';

import { Config } from '../../config';

import l10nMessages from '../l10n/index.json';
import { useRouter } from '../router';
import { isCloudConfig, isGitHubConfig, pluralize } from '../utils';

import { useChanged } from './data';
import { SIDE_PANEL_ID } from './constants';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import { ZapLogo } from './common';
import { useConfig } from './context';

const SidebarContext = createContext<{
  sidebarIsOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}>({
  sidebarIsOpen: false,
  setSidebarOpen: () => {
    throw new Error('SidebarContext not set');
  },
});
export function useSidebar() {
  return useContext(SidebarContext);
}

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

export function Sidebar(props: { config: Config; hrefBase: string }) {
  const { sidebarIsOpen, setSidebarOpen } = useContext(SidebarContext);

  return (
    <Flex
      data-visible={sidebarIsOpen}
      id={SIDE_PANEL_ID}
      // styles
      backgroundColor="surface"
      borderEnd="muted"
      direction="column"
      insetTop={0}
      maxHeight="100vh"
      position="sticky"
      width="scale.3600"
      zIndex={100}
      UNSAFE_className={[
        css({
          // ensure that there's always enough of gutter for the user to press
          // and exit the sidebar
          maxWidth: `calc(100% - ${tokenSchema.size.element.medium})`,

          [breakpointQueries.below.tablet]: {
            border: 0,
            boxShadow: `${tokenSchema.size.shadow.large} ${tokenSchema.color.shadow.regular}`,
            height: '100vh',
            left: 'auto',
            outline: 0,
            position: 'fixed',
            right: '100%',
            transition: 'transform 200ms, visibility 0s 200ms',
            visibility: 'hidden',

            '&[data-visible=true]': {
              transform: 'translate(100%)',
              transitionDelay: '0s',
              visibility: 'unset',
            },
          },
        }),
      ]}
    >
      {sidebarIsOpen && <SidebarHeader />}

      <SidebarNav {...props} />

      {/* let screen reader users exit the sidebar on mobile devices */}
      {sidebarIsOpen && (
        <VisuallyHidden
          elementType="button"
          onClick={() => setSidebarOpen(false)}
        >
          close sidebar
        </VisuallyHidden>
      )}
    </Flex>
  );
}

function SidebarHeader() {
  let config = useConfig();
  let text = 'Keystatic';

  if (isCloudConfig(config)) {
    text = config.storage.project;
  }
  if (isGitHubConfig(config)) {
    text = config.storage.repo.name;
  }

  return (
    <Flex
      alignItems="center"
      borderBottom="muted"
      gap="regular"
      height="element.large"
      paddingX="xlarge"
    >
      <ZapLogo />
      <Text color="neutralEmphasis" weight="semibold">
        {text}
      </Text>
    </Flex>
  );
}

export function SidebarNav(props: { config: Config; hrefBase: string }) {
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const router = useRouter();
  const isCurrent = (href: string, { exact = false } = {}) => {
    if (exact) {
      return href === router.href ? 'page' : undefined;
    }
    return href === router.href || router.href.startsWith(`${href}/`)
      ? 'page'
      : undefined;
  };

  const collectionsArray = Object.entries(props.config.collections || {});
  const singletonsArray = Object.entries(props.config.singletons || {});

  const changedData = useChanged();

  return (
    <Box flex overflow="auto" paddingEnd="large" paddingY="large">
      <NavList>
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
    </Box>
  );
}
