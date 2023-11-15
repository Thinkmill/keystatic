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
import { Divider, Flex } from '@keystar/ui/layout';
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
import { Text } from '@keystar/ui/typography';
import { usePrevious } from '@keystar/ui/utils';

import { Config } from '../../config';

import l10nMessages from '../l10n/index.json';
import { useRouter } from '../router';
import { ItemOrGroup, useNavItems } from '../useNavItems';
import { pluralize } from '../utils';

import { useBrand } from './common';
import { SIDE_PANEL_ID } from './constants';

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
  let { brandMark, brandName } = useBrand();

  return (
    <Flex
      alignItems="center"
      borderBottom="muted"
      gap="regular"
      height="element.large"
      paddingX="xlarge"
      UNSAFE_className={css({
        // let consumers use "currentColor" in SVG for their brand mark
        color: tokenSchema.color.foreground.neutralEmphasis,

        // ensure that the brand mark doesn't get squashed
        '& :first-child': {
          flexShrink: 0,
        },
      })}
    >
      {brandMark}

      <Text color="inherit" weight="medium" truncate>
        {brandName}
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
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const navItems = useNavItems();
  const isCurrent = useIsCurrent();

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

        {navItems.map(item => renderItemOrGroup(item, isCurrent))}
      </NavList>
    </div>
  );
}

// Utils
// ----------------------------------------------------------------------------

function useIsCurrent() {
  const router = useRouter();
  return useCallback(
    (href: string, { exact = false } = {}) => {
      if (exact) {
        return href === router.href ? 'page' : undefined;
      }
      return href === router.href || router.href.startsWith(`${href}/`)
        ? 'page'
        : undefined;
    },
    [router.href]
  );
}

// Renderers
// ----------------------------------------------------------------------------
let dividerCount = 0;
function renderItemOrGroup(
  itemOrGroup: ItemOrGroup,
  isCurrent: ReturnType<typeof useIsCurrent>
) {
  if ('isDivider' in itemOrGroup) {
    return <Divider key={dividerCount++} />;
  }

  if ('children' in itemOrGroup) {
    return (
      <NavGroup key={itemOrGroup.title} title={itemOrGroup.title}>
        {itemOrGroup.children.map(child => renderItemOrGroup(child, isCurrent))}
      </NavGroup>
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
    <NavItem
      key={itemOrGroup.key}
      href={itemOrGroup.href}
      aria-current={isCurrent(itemOrGroup.href)}
    >
      <Text truncate title={itemOrGroup.label}>
        {itemOrGroup.label}
      </Text>
      {changeElement}
    </NavItem>
  );
}
