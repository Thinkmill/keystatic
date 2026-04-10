import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { DismissButton, useModalOverlay } from '@react-aria/overlays';
import { useUpdateEffect } from '@react-aria/utils';
import {
  OverlayTriggerState,
  useOverlayTriggerState,
} from '@react-stately/overlays';
import { typedKeys } from 'emery';
import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useRef,
} from 'react';

import { Badge } from '@keystar/ui/badge';
import { Box, Divider, HStack, ScrollView, VStack } from '@keystar/ui/layout';
import { Icon } from '@keystar/ui/icon';
import { clockIcon } from '@keystar/ui/icon/icons/clockIcon';
import { searchIcon } from '@keystar/ui/icon/icons/searchIcon';
import { starIcon } from '@keystar/ui/icon/icons/starIcon';
import { NavGroup, NavItem, NavList } from '@keystar/ui/nav-list';
import { Blanket } from '@keystar/ui/overlays';
import { StatusLight } from '@keystar/ui/status-light';
import {
  breakpoints,
  css,
  tokenSchema,
  transition,
  useBreakpoint,
} from '@keystar/ui/style';
import { Kbd, Text } from '@keystar/ui/typography';
import { usePrevious } from '@keystar/ui/utils';

import { BranchPicker } from '../../branch-selection';
import l10nMessages from '../../l10n';
import { pluralize } from '../../pluralize';
import { useRouter } from '../../router';
import { ItemOrGroup, useNavItems } from '../../useNavItems';
import { isLocalConfig } from '../../utils';
import { useBrand } from '../common';
import { SIDE_PANEL_ID } from '../constants';
import { useCommandPalette } from '../CommandPalette';
import { useAppState, useConfig } from '../context';
import { useFavorites, useRecentItems } from '../navigation-history';

import { GitMenu, ThemeMenu, UserActions } from './components';

const SidebarContext = createContext<OverlayTriggerState | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
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

  const breakpointIndex = breakpointNames.indexOf(matchedBreakpoints[0]);
  const previousIndex = usePrevious(breakpointIndex) || 0;

  useUpdateEffect(() => {
    const larger = previousIndex < breakpointIndex;
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

export function SidebarPanel() {
  return (
    <VStack
      height="100%"
      UNSAFE_className={css({
        background: `linear-gradient(180deg, ${tokenSchema.color.background.surface} 0%, ${tokenSchema.color.background.canvas} 100%)`,
      })}
    >
      <SidebarHeader />
      <SidebarSearch />
      <SidebarGitActions />
      <SidebarNav />
      <SidebarFooter />
    </VStack>
  );
}

function SidebarHeader() {
  const isLocalNoCloud = useIsLocalNoCloud();
  const { brandMark } = useBrand();

  return (
    <Box
      paddingX="medium"
      paddingY="regular"
      UNSAFE_className={css({
        borderBottom: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.muted}`,
        background: `linear-gradient(135deg, ${tokenSchema.color.scale.indigo3} 0%, ${tokenSchema.color.background.surface} 55%, ${tokenSchema.color.scale.green3} 100%)`,
      })}
    >
      <div
        className={css({
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: tokenSchema.size.space.regular,
          minHeight: tokenSchema.size.element.xlarge,
        })}
      >
        <Box />
        <Box
          UNSAFE_className={css({
            color: tokenSchema.color.foreground.neutralEmphasis,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 0,
            '& :first-child': {
              flexShrink: 0,
            },
          })}
        >
          <Box
            UNSAFE_className={css({
              width: '112px',
              height: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 160ms ease',
              '&:hover': {
                transform: 'translateY(-1px)',
              },
            })}
          >
            {brandMark}
          </Box>
        </Box>
        <Box
          justifySelf="end"
          minWidth={0}
          UNSAFE_className={css({
            display: 'flex',
            justifyContent: 'flex-end',
          })}
        >
          {isLocalNoCloud ? <ThemeMenu /> : null}
        </Box>
      </div>
    </Box>
  );
}

function SidebarSearch() {
  const { open } = useCommandPalette();

  return (
    <Box paddingX="medium" paddingY="medium">
      <Box
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            open();
          }
        }}
        borderRadius="large"
        paddingX="regular"
        paddingY="regular"
        UNSAFE_className={css({
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: tokenSchema.size.space.regular,
          width: '100%',
          minWidth: 0,
          maxWidth: '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
          border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
          backgroundColor: tokenSchema.color.background.surface,
          boxShadow: `0 10px 18px ${tokenSchema.color.shadow.muted}`,
          transition: transition([
            'border-color',
            'box-shadow',
            'transform',
            'background-color',
          ]),
          '&:hover': {
            transform: 'translateY(-1px)',
            borderColor: tokenSchema.color.border.accent,
            boxShadow: `0 14px 26px ${tokenSchema.color.shadow.regular}`,
          },
          '&:focus-visible': {
            outline: `${tokenSchema.size.alias.focusRing} solid ${tokenSchema.color.alias.focusRing}`,
            outlineOffset: tokenSchema.size.alias.focusRingGap,
          },
        })}
      >
        <Box
          borderRadius="full"
          padding="xsmall"
          UNSAFE_className={css({
            backgroundColor: tokenSchema.color.scale.indigo3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          <Icon src={searchIcon} size="small" color="accent" />
        </Box>
        <Text color="neutralSecondary" flex minWidth={0} size="small" truncate>
          Search admin UI...
        </Text>
        <HStack
          gap="xsmall"
          isHidden={{ below: 'tablet' }}
          UNSAFE_className={css({ flexShrink: 0 })}
        >
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </HStack>
      </Box>
    </Box>
  );
}

function SidebarGitActions() {
  const config = useConfig();
  if (isLocalConfig(config)) {
    return null;
  }

  return (
    <Box paddingX="medium" paddingBottom="medium">
      <Box
        borderRadius="large"
        padding="medium"
        UNSAFE_className={css({
          border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
          backgroundColor: tokenSchema.color.background.surface,
          boxShadow: `0 10px 18px ${tokenSchema.color.shadow.muted}`,
        })}
      >
        <HStack gap="regular">
          <BranchPicker />
          <GitMenu />
        </HStack>
      </Box>
    </Box>
  );
}

function SidebarFooter() {
  const isLocalNoCloud = useIsLocalNoCloud();
  if (isLocalNoCloud) {
    return null;
  }

  return (
    <Box padding="medium" paddingTop="small">
      <Box
        borderRadius="large"
        padding="medium"
        UNSAFE_className={css({
          border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
          backgroundColor: tokenSchema.color.background.surface,
          boxShadow: `0 10px 18px ${tokenSchema.color.shadow.muted}`,
        })}
      >
        <HStack alignItems="center" gap="regular">
          <UserActions />
          <ThemeMenu />
        </HStack>
      </Box>
    </Box>
  );
}

export function SidebarDialog() {
  const state = useSidebar();
  const router = useRouter();

  useUpdateEffect(() => {
    state.close();
  }, [router.href]);

  const dialogRef = useRef<HTMLDivElement>(null);
  const { modalProps, underlayProps } = useModalOverlay(
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
        className={css({
          display: 'flex',
          flexDirection: 'column',
          inset: 0,
          insetInlineEnd: 'auto',
          maxWidth: `calc(100% - ${tokenSchema.size.element.medium})`,
          minWidth: tokenSchema.size.scale[3000],
          outline: 0,
          pointerEvents: 'none',
          position: 'fixed',
          transform: 'translateX(-100%)',
          visibility: 'hidden',
          zIndex: 10,
          boxShadow: `${tokenSchema.size.shadow.large} ${tokenSchema.color.shadow.regular}`,
          transition: [
            transition('transform', {
              easing: 'easeIn',
              duration: 'short',
            }),
            transition('visibility', {
              delay: 'regular',
              duration: 0,
              easing: 'linear',
            }),
          ].join(', '),
          '&[data-visible=true]': {
            transform: 'translateX(0)',
            transition: transition('transform', { easing: 'easeOut' }),
            pointerEvents: 'auto',
            visibility: 'visible',
          },
        })}
      >
        <SidebarPanel />
        <DismissButton onDismiss={state.close} />
      </div>
    </>
  );
}

export function SidebarNav() {
  const { basePath } = useAppState();
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const navItems = useNavItems();
  const isCurrent = useIsCurrent();
  const { favorites } = useFavorites();
  const { recentItems } = useRecentItems();

  return (
    <ScrollView flex paddingX="medium" paddingBottom="medium">
      <VStack gap="medium">
        <SidebarSectionCard>
          <NavList>
            <NavItem
              href={basePath}
              aria-current={isCurrent(basePath, { exact: true })}
            >
              <Text UNSAFE_style={{ lineHeight: 1.5 }}>
                {stringFormatter.format('dashboard')}
              </Text>
            </NavItem>
          </NavList>
        </SidebarSectionCard>

        {favorites.length > 0 && (
          <SidebarSectionCard>
            <VStack gap="small">
              <SidebarSectionTitle
                icon={starIcon}
                label="Favorites"
                tone="amber"
              />
              <NavList>
                {favorites.map(item => (
                  <NavItem
                    key={item.key}
                    href={item.href}
                    aria-current={isCurrent(item.href)}
                  >
                    <Text truncate UNSAFE_style={{ lineHeight: 1.5 }}>
                      {item.label}
                    </Text>
                  </NavItem>
                ))}
              </NavList>
            </VStack>
          </SidebarSectionCard>
        )}

        {recentItems.length > 0 && (
          <SidebarSectionCard>
            <VStack gap="small">
              <SidebarSectionTitle
                icon={clockIcon}
                label="Recent"
                tone="slate"
              />
              <NavList>
                {recentItems.slice(0, 5).map(item => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    aria-current={isCurrent(item.href)}
                  >
                    <Text truncate UNSAFE_style={{ lineHeight: 1.5 }}>
                      {item.label}
                    </Text>
                  </NavItem>
                ))}
              </NavList>
            </VStack>
          </SidebarSectionCard>
        )}

        <SidebarSectionCard>
          <NavList>
            {navItems.map((item, index) => (
              <NavItemOrGroup itemOrGroup={item} key={index} />
            ))}
          </NavList>
        </SidebarSectionCard>
      </VStack>
    </ScrollView>
  );
}

function SidebarSectionCard(props: { children: ReactNode }) {
  return (
    <Box
      borderRadius="large"
      padding="small"
      UNSAFE_className={css({
        border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.neutral}`,
        backgroundColor: tokenSchema.color.background.surface,
        boxShadow: `0 10px 18px ${tokenSchema.color.shadow.muted}`,
      })}
    >
      {props.children}
    </Box>
  );
}

function SidebarSectionTitle(props: {
  icon: typeof starIcon;
  label: string;
  tone: 'amber' | 'slate';
}) {
  const backgroundColor =
    props.tone === 'amber'
      ? tokenSchema.color.scale.amber3
      : tokenSchema.color.scale.slate3;
  const iconClassName = css({
    color:
      props.tone === 'amber'
        ? tokenSchema.color.scale.amber9
        : tokenSchema.color.scale.slate8,
  });

  return (
    <HStack gap="small" alignItems="center" paddingBottom="xsmall">
      <Box
        UNSAFE_className={css({
          padding: '3px',
          borderRadius: '4px',
          backgroundColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        })}
      >
        <Icon src={props.icon} size="small" UNSAFE_className={iconClassName} />
      </Box>
      <Text
        size="small"
        weight="semibold"
        color="neutralSecondary"
        UNSAFE_style={{
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          fontSize: '11px',
          lineHeight: 1.4,
        }}
      >
        {props.label}
      </Text>
    </HStack>
  );
}

function useIsLocalNoCloud() {
  const config = useConfig();
  return isLocalConfig(config) && !config.cloud;
}

function useIsCurrent() {
  const router = useRouter();
  return useCallback(
    (href: string, { exact = false } = {}) => {
      if (exact) {
        return href === router.pathname ? 'page' : undefined;
      }
      return href === router.pathname || router.pathname.startsWith(`${href}/`)
        ? 'page'
        : undefined;
    },
    [router.pathname]
  );
}

function NavItemOrGroup({ itemOrGroup }: { itemOrGroup: ItemOrGroup }) {
  const isCurrent = useIsCurrent();

  if (itemOrGroup.isDivider) {
    return <Divider />;
  }

  if (itemOrGroup.children) {
    return (
      <Box paddingTop="medium">
        <NavGroup title={itemOrGroup.title}>
          {itemOrGroup.children.map((child, index) => (
            <NavItemOrGroup itemOrGroup={child} key={index} />
          ))}
        </NavGroup>
      </Box>
    );
  }

  const changeElement =
    !itemOrGroup.changed ? null : typeof itemOrGroup.changed === 'number' ? (
      <Badge tone="accent" marginStart="auto">
        <Text>{itemOrGroup.changed}</Text>
        <Text visuallyHidden>
          {pluralize(itemOrGroup.changed, {
            singular: 'change',
            plural: 'changes',
            inclusive: false,
          })}
        </Text>
      </Badge>
    ) : (
      <StatusLight
        tone="accent"
        marginStart="auto"
        aria-label="Changed"
        role="status"
      />
    );

  return (
    <NavItem href={itemOrGroup.href} aria-current={isCurrent(itemOrGroup.href)}>
      <Text
        truncate
        title={itemOrGroup.label}
        UNSAFE_style={{ lineHeight: 1.5 }}
      >
        {itemOrGroup.label}
      </Text>
      {changeElement}
    </NavItem>
  );
}
