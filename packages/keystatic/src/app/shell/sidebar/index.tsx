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
import { Divider, ScrollView, HStack, VStack, Box } from '@keystar/ui/layout';
import { NavList, NavItem, NavGroup } from '@keystar/ui/nav-list';
import { Blanket } from '@keystar/ui/overlays';
import { StatusLight } from '@keystar/ui/status-light';
import {
  breakpoints,
  css,
  tokenSchema,
  transition,
  useBreakpoint,
} from '@keystar/ui/style';
import { Text, Kbd } from '@keystar/ui/typography';
import { usePrevious } from '@keystar/ui/utils';
import { Icon } from '@keystar/ui/icon';
import { searchIcon } from '@keystar/ui/icon/icons/searchIcon';
import { starIcon } from '@keystar/ui/icon/icons/starIcon';
import { clockIcon } from '@keystar/ui/icon/icons/clockIcon';

import l10nMessages from '../../l10n';
import { useRouter } from '../../router';
import { ItemOrGroup, useNavItems } from '../../useNavItems';
import { isLocalConfig } from '../../utils';
import { pluralize } from '../../pluralize';

import { useBrand } from '../common';
import { SIDE_PANEL_ID } from '../constants';
import { GitMenu, ThemeMenu, UserActions } from './components';
import { BranchPicker } from '../../branch-selection';
import { useAppState, useConfig } from '../context';
import { useCommandPalette } from '../CommandPalette';
import { useFavorites, useRecentItems } from '../navigation-history';

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

export function SidebarPanel() {
  return (
    <VStack backgroundColor="surface" height="100%">
      <SidebarHeader />
      <SidebarSearch />
      <SidebarGitActions />
      <SidebarNav />
      <SidebarFooter />
    </VStack>
  );
}

function SidebarSearch() {
  const { open } = useCommandPalette();

  return (
    <Box paddingX="medium" paddingY="small">
      <Box
        role="button"
        tabIndex={0}
        onClick={open}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            open();
          }
        }}
        borderRadius="medium"
        paddingX="regular"
        paddingY="small"
        UNSAFE_className={css({
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: tokenSchema.size.space.regular,
          border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.muted}`,
          backgroundColor: tokenSchema.color.background.canvas,
          transition: transition(['border-color', 'background-color', 'box-shadow']),
          boxShadow: `0 1px 2px ${tokenSchema.color.shadow.muted}`,
          '&:hover': {
            borderColor: tokenSchema.color.scale.indigo6,
            backgroundColor: tokenSchema.color.alias.backgroundHovered,
            boxShadow: `0 2px 8px ${tokenSchema.color.shadow.regular}`,
          },
          '&:focus': {
            outline: 'none',
            borderColor: tokenSchema.color.scale.indigo7,
            boxShadow: `0 0 0 2px ${tokenSchema.color.scale.indigo4}`,
          },
        })}
      >
        <Box
          UNSAFE_className={css({
            padding: '4px',
            borderRadius: '50%',
            backgroundColor: tokenSchema.color.scale.indigo3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          <Icon src={searchIcon} size="small" color="accent" />
        </Box>
        <Text color="neutralSecondary" flex size="small">
          Search anything...
        </Text>
        <HStack gap="xsmall">
          <Kbd>⌘K</Kbd>
        </HStack>
      </Box>
    </Box>
  );
}

function SidebarHeader() {
  let isLocalNoCloud = useIsLocalNoCloud();
  let { brandMark, brandName } = useBrand();

  return (
    <Box
      UNSAFE_className={css({
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${tokenSchema.color.background.surface} 0%, ${tokenSchema.color.background.canvas} 100%)`,
        borderBottom: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.muted}`,
        '::before': {
          content: '""',
          position: 'absolute',
          top: '-50%',
          left: '-30%',
          width: '100%',
          height: '150%',
          backgroundImage: `radial-gradient(circle at center, ${tokenSchema.color.scale.indigo4}, transparent 70%)`,
          opacity: 0.2,
          pointerEvents: 'none',
          animation: 'drift 15s ease-in-out infinite',
        },
        '::after': {
          content: '""',
          position: 'absolute',
          bottom: '-50%',
          right: '-30%',
          width: '100%',
          height: '150%',
          backgroundImage: `radial-gradient(circle at center, ${tokenSchema.color.scale.cyan5}, transparent 70%)`,
          opacity: 0.15,
          pointerEvents: 'none',
          animation: 'drift 18s ease-in-out infinite reverse',
        },
        '@keyframes drift': {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '50%': { transform: 'translate(8px, 8px)' },
        },
      })}
    >
      <HStack
        alignItems="center"
        gap="regular"
        paddingY="regular"
        paddingX="medium"
        minHeight={{ mobile: 'element.large', tablet: 'element.xlarge' }}
        position="relative"
      >
        <HStack
          flex
          alignItems="center"
          gap="regular"
          UNSAFE_className={css({
            // let consumers use "currentColor" in SVG for their brand mark
            color: tokenSchema.color.foreground.neutralEmphasis,

            // ensure that the brand mark doesn't get squashed
            '& :first-child': {
              flexShrink: 0,
            },
          })}
        >
          <Box
            UNSAFE_className={css({
              padding: '6px',
              borderRadius: tokenSchema.size.radius.regular,
              background: `linear-gradient(135deg, ${tokenSchema.color.scale.indigo3}, ${tokenSchema.color.scale.cyan3})`,
              boxShadow: `0 4px 16px ${tokenSchema.color.shadow.muted}, inset 0 1px 1px ${tokenSchema.color.scale.indigo2}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: `0 6px 24px ${tokenSchema.color.shadow.regular}, inset 0 1px 1px ${tokenSchema.color.scale.indigo2}`,
                transform: 'translateY(-2px)',
              },
            })}
          >
            {brandMark}
          </Box>

          <VStack gap="xsmall">
            <Text 
              color="neutralEmphasis" 
              weight="bold" 
              truncate
              UNSAFE_style={{ 
                letterSpacing: '-0.01em',
                lineHeight: 1.3,
                fontSize: '15px',
              }}
            >
              {brandName}
            </Text>
            <Text 
              size="small" 
              color="neutralTertiary"
              UNSAFE_style={{ 
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                lineHeight: 1.4,
                fontWeight: '600',
              }}
            >
              CMS
            </Text>
          </VStack>
        </HStack>
        {isLocalNoCloud && <ThemeMenu />}
      </HStack>
    </Box>
  );
}

// when local mode w/o cloud there's no user actions, so we hide the footer and
// move the theme menu to the header
function SidebarFooter() {
  let isLocalNoCloud = useIsLocalNoCloud();
  if (isLocalNoCloud) {
    return null;
  }
  return (
    <Box
      UNSAFE_className={css({
        borderTop: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.muted}`,
        background: `linear-gradient(0deg, ${tokenSchema.color.background.canvas} 0%, ${tokenSchema.color.background.surface} 100%)`,
      })}
    >
      <HStack
        alignItems="center"
        paddingY="regular"
        paddingX="medium"
        gap="regular"
      >
        <UserActions />
        <ThemeMenu />
      </HStack>
    </Box>
  );
}

// no git actions in local mode
function SidebarGitActions() {
  let config = useConfig();
  if (isLocalConfig(config)) {
    return null;
  }
  return (
    <Box
      UNSAFE_className={css({
        borderTop: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.muted}`,
        borderBottom: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.muted}`,
      })}
    >
      <HStack gap="regular" paddingY="regular" paddingX="medium">
        <BranchPicker />
        <GitMenu />
      </HStack>
    </Box>
  );
}

export function SidebarDialog() {
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
        <SidebarSearch />
        <SidebarGitActions />
        <SidebarNav />
        <SidebarFooter />
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
    <ScrollView flex paddingY="large" paddingEnd="medium">
      <VStack gap="small">
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

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <Box paddingTop="regular">
            <NavList>
              <NavGroup
                title={
                  <HStack gap="small" alignItems="center" paddingBottom="xsmall">
                    <Box
                      UNSAFE_className={css({
                        padding: '3px',
                        borderRadius: '4px',
                        backgroundColor: tokenSchema.color.scale.amber3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      })}
                    >
                      <Icon src={starIcon} size="small" color="pending" />
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
                      Favorites
                    </Text>
                  </HStack>
                }
              >
                {favorites.map(fav => (
                  <NavItem
                    key={fav.key}
                    href={fav.href}
                    aria-current={isCurrent(fav.href)}
                  >
                    <Text truncate UNSAFE_style={{ lineHeight: 1.5 }}>{fav.label}</Text>
                  </NavItem>
                ))}
              </NavGroup>
            </NavList>
          </Box>
        )}

        {/* Recent Items Section */}
        {recentItems.length > 0 && (
          <Box paddingTop="regular">
            <NavList>
              <NavGroup
                title={
                  <HStack gap="small" alignItems="center" paddingBottom="xsmall">
                    <Box
                      UNSAFE_className={css({
                        padding: '3px',
                        borderRadius: '4px',
                        backgroundColor: tokenSchema.color.scale.slate3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      })}
                    >
                      <Icon src={clockIcon} size="small" color="neutralSecondary" />
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
                      Recent
                    </Text>
                  </HStack>
                }
              >
                {recentItems.slice(0, 5).map(item => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    aria-current={isCurrent(item.href)}
                  >
                    <Text truncate size="small" UNSAFE_style={{ lineHeight: 1.5 }}>{item.label}</Text>
                  </NavItem>
                ))}
              </NavGroup>
            </NavList>
          </Box>
        )}

        {/* Regular Navigation with proper spacing */}
        <Box paddingTop="medium">
          <NavList>
            {navItems.map((item, i) => (
              <NavItemOrGroup key={i} itemOrGroup={item} />
            ))}
          </NavList>
        </Box>
      </VStack>
    </ScrollView>
  );
}

// Utils
// ----------------------------------------------------------------------------

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

// Renderers
// ----------------------------------------------------------------------------
function NavItemOrGroup({ itemOrGroup }: { itemOrGroup: ItemOrGroup }) {
  const isCurrent = useIsCurrent();
  if (itemOrGroup.isDivider) {
    return <Divider />;
  }

  if (itemOrGroup.children) {
    return (
      <Box paddingTop="medium">
        <NavGroup 
          title={
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
              {itemOrGroup.title}
            </Text>
          }
        >
          {itemOrGroup.children.map((child, i) => (
            <NavItemOrGroup itemOrGroup={child} key={i} />
          ))}
        </NavGroup>
      </Box>
    );
  }

  let changeElement = (() => {
    if (!itemOrGroup.changed) {
      return null;
    }

    return typeof itemOrGroup.changed === 'number' ? (
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
  })();

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
