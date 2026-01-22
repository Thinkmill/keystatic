import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { Button } from '@keystar/ui/button';
import { menuIcon } from '@keystar/ui/icon/icons/menuIcon';
import { Icon } from '@keystar/ui/icon';
import { Box, Divider } from '@keystar/ui/layout';
import { breakpointQueries, css, tokenSchema } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

import { HEADER_HEIGHT, SIDEBAR_WIDTH } from '../constants';
import { useSidebarContext } from './context';
import { NavItems } from './nav-items';
import { SidebarItem } from './types';
import { ColorSchemeMenu } from '../theme-switcher';

/** Responsively render sidebar navigation items. */
export const Sidebar = ({ items }: { items: SidebarItem[] }) => {
  const { sidebarIsOpen, closeSidebar, toggleSidebar } = useSidebarContext();
  const pathname = usePathname();

  useEffect(() => {
    // Close the sidebar when the pathname changes
    closeSidebar();
  }, [closeSidebar, pathname]);

  return (
    <div
      data-open={sidebarIsOpen}
      className={css({
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        width: '100%',
        zIndex: 1,
        '&[data-open=true]': {
          height: '100%',
        },
        [breakpointQueries.above.mobile]: {
          height: '100%',
          width: SIDEBAR_WIDTH,
        },
      })}
    >
      <SidebarHeader menuIsOpen={sidebarIsOpen} onMenuPress={toggleSidebar} />

      <Box
        flex
        minHeight={0}
        backgroundColor="surface"
        borderTopEndRadius={{ tablet: 'medium' }}
        overflow="hidden auto"
        paddingBottom="xlarge"
        paddingTop={{ mobile: 'large', tablet: 'xlarge' }}
        paddingEnd={{ mobile: 'large', tablet: 'xlarge' }}
        data-open={sidebarIsOpen}
        UNSAFE_className={css({
          [breakpointQueries.below.tablet]: {
            '&[data-open=false]': {
              display: 'none',
            },
          },
        })}
      >
        <NavItems items={items} />
      </Box>
    </div>
  );
};

// Header
// ----------------------------------------------------------------------------

function SidebarHeader({
  menuIsOpen,
  onMenuPress,
}: {
  menuIsOpen: boolean;
  onMenuPress: () => void;
}) {
  const menuLabel = 'Open navigation panel';
  const linkClass = css({
    alignItems: 'baseline',
    color: tokenSchema.color.foreground.neutralEmphasis,
    display: 'flex',
    fontFamily: tokenSchema.typography.fontFamily.base,
    fontSize: tokenSchema.typography.text.medium.size,
    fontWeight: tokenSchema.typography.fontWeight.bold,
    textDecoration: 'none',
  });

  return (
    <Box backgroundColor="canvas">
      <div
        className={css({
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between',
          paddingInlineStart: tokenSchema.size.space.large,

          [breakpointQueries.above.mobile]: {
            paddingInlineStart: tokenSchema.size.space.xlarge,
            paddingBlock: tokenSchema.size.space.large,
          },
          [breakpointQueries.below.tablet]: {
            height: HEADER_HEIGHT,
            paddingInlineEnd: tokenSchema.size.space.large,
          },
        })}
      >
        <Box flex>
          <a href="/" className={linkClass}>
            <Text visuallyHidden>Home</Text>
            <span aria-hidden>KeystarUI</span>
          </a>
        </Box>

        <ColorSchemeMenu />
        <Box
          title={menuLabel}
          role="presentation"
          isHidden={{ above: 'mobile' }}
        >
          <Button
            onPress={onMenuPress}
            prominence="low"
            aria-label={menuLabel}
            aria-pressed={menuIsOpen}
          >
            <Icon src={menuIcon} />
          </Button>
        </Box>
      </div>
      <Divider marginX="large" isHidden={{ above: 'mobile' }} />
    </Box>
  );
}
