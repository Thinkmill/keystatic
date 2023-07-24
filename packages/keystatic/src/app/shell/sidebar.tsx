import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { DismissButton, useModalOverlay } from '@react-aria/overlays';
import { useUpdateEffect } from '@react-aria/utils';
import {
  OverlayTriggerState,
  useOverlayTriggerState,
} from '@react-stately/overlays';
import { createContext, ReactNode, useContext, useRef } from 'react';

import { Badge } from '@keystar/ui/badge';
import { Box, Flex } from '@keystar/ui/layout';
import { Blanket } from '@keystar/ui/overlays';
import { NavList, NavItem, NavGroup } from '@keystar/ui/nav-list';
import {
  breakpoints,
  css,
  tokenSchema,
  transition,
  useBreakpoint,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { usePrevious } from '@keystar/ui/utils';

import { Config } from '../../config';

import l10nMessages from '../l10n/index.json';
import { useRouter } from '../router';
import { isCloudConfig, isGitHubConfig, pluralize } from '../utils';

import { useChanged } from './data';
import { SIDE_PANEL_ID } from './constants';
import { ZapLogo } from './common';
import { useConfig } from './context';
import { serializeRepoConfig } from '../repo-config';
import { typedKeys } from 'emery';

const SidebarContext = createContext<OverlayTriggerState | null>(null);
export function useSidebar() {
  let context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be within a SidebarProvider');
  }
  return context;
}

const breakpointNames = typedKeys(breakpoints);
export function SidebarProvider(props: { children: ReactNode }) {
  const matchedBreakpoints = useBreakpoint();
  const state = useOverlayTriggerState({
    defaultOpen: matchedBreakpoints.includes('desktop'),
  });

  let breakpointIndex = breakpointNames.indexOf(matchedBreakpoints[0]);
  let previousIndex = usePrevious(breakpointIndex) || 0;

  useUpdateEffect(() => {
    let larger = previousIndex < breakpointIndex;
    if (larger && breakpointIndex >= 2) {
      state.open();
    } else if (breakpointIndex < 2) {
      state.close();
    }
  }, [matchedBreakpoints]);

  return (
    <SidebarContext.Provider value={state}>
      {props.children}
    </SidebarContext.Provider>
  );
}

export function SidebarPanel(props: { hrefBase: string; config: Config }) {
  return (
    <Flex backgroundColor="surface" direction="column" height="100%">
      <SidebarNav {...props} />
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
    text = serializeRepoConfig(config.storage.repo);
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

export function SidebarDialog(props: { hrefBase: string; config: Config }) {
  const state = useSidebar();
  const router = useRouter();

  // close the sidebar when the route changes
  useUpdateEffect(() => {
    state.close();
  }, [router.href]);

  let dialogRef = useRef<HTMLDivElement>(null);
  let { modalProps, underlayProps } = useModalOverlay(
    { isDismissable: true },
    state,
    dialogRef
  );

  return (
    <>
      <Blanket {...underlayProps} isOpen={state.isOpen} zIndex={10} />
      <div
        data-visible={state.isOpen}
        id={SIDE_PANEL_ID}
        ref={dialogRef}
        {...modalProps}
        // styles
        className={css({
          backgroundColor: tokenSchema.color.background.surface,
          boxShadow: `${tokenSchema.size.shadow.large} ${tokenSchema.color.shadow.regular}`,
          display: 'flex',
          flexDirection: 'column',
          inset: 0,
          insetInlineEnd: 'auto',
          // ensure that there's always enough of gutter for the user to press
          // and exit the sidebar
          maxWidth: `calc(100% - ${tokenSchema.size.element.medium})`,
          minWidth: tokenSchema.size.scale[3000],
          outline: 0,
          pointerEvents: 'none',
          position: 'fixed',
          transform: 'translateX(-100%)',
          visibility: 'hidden',
          zIndex: 10,

          // exit animation
          transition: [
            transition('transform', {
              easing: 'easeIn',
              duration: 'short',
              // delay: 'short',
            }),
            transition('visibility', {
              delay: 'regular',
              duration: 0,
              easing: 'linear',
            }),
          ].join(', '),

          '&[data-visible=true]': {
            transform: 'translateX(0)',
            // enter animation
            transition: transition('transform', { easing: 'easeOut' }),
            pointerEvents: 'auto',
            visibility: 'visible',
          },
        })}
      >
        <SidebarHeader />
        <SidebarNav {...props} />
        <DismissButton onDismiss={state.close} />
      </div>
    </>
  );
}

export function SidebarNav(props: { hrefBase: string; config: Config }) {
  let config = useConfig();
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

  const collectionsArray = Object.entries(config.collections || {});
  const singletonsArray = Object.entries(config.singletons || {});

  const changedData = useChanged();

  return (
    <div
      className={css({
        flex: 1,
        overflowY: 'auto',
        paddingBlock: tokenSchema.size.space.large,
        paddingInlineEnd: tokenSchema.size.space.large,
        WebkitOverflowScrolling: 'touch',
      })}
    >
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
                  <Text truncate title={collection.label}>
                    {collection.label}
                  </Text>
                  {!!allChangesCount && (
                    <Badge tone="accent" marginStart="auto">
                      <Text>{allChangesCount}</Text>
                      <Text visuallyHidden>
                        {pluralize(allChangesCount, {
                          singular: 'change',
                          plural: 'changes',
                          inclusive: false,
                        })}
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
                  <Text truncate title={collection.label}>
                    {collection.label}
                  </Text>
                  {changedData.singletons.has(key) && (
                    <Box
                      backgroundColor="accentEmphasis"
                      height="scale.75"
                      width="scale.75"
                      borderRadius="full"
                      marginStart="auto"
                    >
                      <Text visuallyHidden>Changed</Text>
                    </Box>
                  )}
                </NavItem>
              );
            })}
          </NavGroup>
        )}
      </NavList>
    </div>
  );
}
