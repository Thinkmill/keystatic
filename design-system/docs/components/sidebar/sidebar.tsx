import { Fragment, useEffect } from 'react';

import { Button } from '@keystar/ui/button';
import { menuIcon } from '@keystar/ui/icon/icons/menuIcon';
import { Icon } from '@keystar/ui/icon';
import { Box, Divider } from '@keystar/ui/layout';
import { useLinkComponent } from '@keystar/ui/link';
import { breakpointQueries, css, tokenSchema } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

import { HEADER_HEIGHT, SIDEBAR_WIDTH } from '../constants';
import { useSidebarContext } from './context';
import { NavItems } from './nav-items';
import { SidebarItem } from './types';
import { ColorSchemeMenu } from '../theme-switcher';

/** Responsively render sidebar navigation items. */
export const Sidebar = ({ items }: { items: SidebarItem[] }) => {
  // const [headerHeight, setHeaderHeight] = useState(NaN);
  const { sidebarIsOpen, closeSidebar, toggleSidebar } = useSidebarContext();

  useEffect(() => {
    addEventListener('popstate', closeSidebar);
    return () => {
      removeEventListener('popstate', closeSidebar);
    };
  }, [closeSidebar]);

  return (
    <Fragment>
      <div
        data-open={sidebarIsOpen}
        className={css({
          backgroundColor: tokenSchema.color.background.canvas,
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          zIndex: 1,

          [breakpointQueries.below.tablet]: {
            width: '100vw',
            '[data-open=true]': {
              height: '100%',
            },
          },
          [breakpointQueries.above.mobile]: {
            height: '100%',
            width: SIDEBAR_WIDTH,
          },
        })}
      >
        <SidebarHeader
          menuIsOpen={sidebarIsOpen}
          onMenuPress={toggleSidebar}
          // onLayout={rect => setHeaderHeight(rect.height)}
        />

        <Box
          flex
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
      {/* <Box height={headerHeight} isHidden={{ above: 'mobile' }} /> */}
    </Fragment>
  );
};

// Header
// ----------------------------------------------------------------------------

function SidebarHeader({
  menuIsOpen,
  // onLayout,
  onMenuPress,
}: {
  menuIsOpen: boolean;
  // onLayout: (rect: DOMRect) => void;
  onMenuPress: () => void;
}) {
  const Link = useLinkComponent(null);

  const menuLabel = 'Open navigation panel';
  const linkClass = css({
    alignItems: 'baseline',
    color: tokenSchema.color.foreground.neutralEmphasis,
    display: 'flex',
    fontFamily: tokenSchema.typography.fontFamily.base,
    fontSize: tokenSchema.fontsize.text.medium.size,
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
          <Link href="/" title="/ˈvuːswɑː/" className={linkClass}>
            <Text visuallyHidden>Home</Text>
            <VMark />
            <span aria-hidden>OUSSOIR</span>
          </Link>
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

const VMark = () => {
  const size = tokenSchema.size.icon.regular;
  const cls = css({ height: size, width: size });

  return (
    <svg viewBox="0 0 48 48" fill="currentColor" className={cls}>
      <path d="M3.58 7.169C2.793 4.599 4.716 2 7.404 2h33.124c2.708 0 4.633 2.633 3.812 5.213L32.725 43.716a4 4 0 0 1-3.811 2.787H18.556a4 4 0 0 1-3.825-2.831L3.579 7.169Z" />
    </svg>
  );
};

// Hand drawn!
// <svg x="0" y="0" version="1.1" viewBox="0 0 10 10">
//   <path
//     d="M1,1 L3.5,9 h3 L9,1 Z"
//     fill="currentColor"
//     stroke="currentColor"
//     strokeLinecap="round"
//     strokeLinejoin="round"
//     strokeWidth="2"
//   />
// </svg>
