import { Fragment, useEffect } from 'react';

import { Button } from '@voussoir/button';
import { menuIcon } from '@voussoir/icon/icons/menuIcon';
import { Icon } from '@voussoir/icon';
import { Box, Divider, Flex } from '@voussoir/layout';
import { useLinkComponent } from '@voussoir/link';
import { css, tokenSchema } from '@voussoir/style';
import { Text } from '@voussoir/typography';

import { HEADER_HEIGHT, SIDEBAR_WIDTH } from '../constants';
import { useSidebarContext } from './context';
import { NavItems } from './nav-items';
import { SidebarItem } from './types';
import { ClientOnly, ThemeSwitcher } from '../theme-switcher';

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
      <Flex
        // borderEnd={{ tablet: 'muted' }}
        backgroundColor="canvas"
        direction="column"
        height={{ mobile: sidebarIsOpen ? '100%' : undefined, tablet: '100%' }}
        position="fixed"
        width={{ mobile: '100vw', tablet: SIDEBAR_WIDTH }}
        zIndex={1}
      >
        <SidebarHeader
          menuIsOpen={sidebarIsOpen}
          onMenuPress={toggleSidebar}
          // onLayout={rect => setHeaderHeight(rect.height)}
        />

        <Box
          isHidden={{ mobile: !sidebarIsOpen, tablet: false }}
          flex
          backgroundColor="surface"
          borderTopEndRadius={{ tablet: 'medium' }}
          overflow="hidden auto"
          paddingBottom="xlarge"
          paddingTop={{ mobile: 'large', tablet: 'xlarge' }}
          paddingEnd={{ mobile: 'large', tablet: 'xlarge' }}
        >
          <NavItems items={items} />
        </Box>
      </Flex>
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
      <Flex
        alignItems="center"
        justifyContent="space-between"
        paddingStart={{ mobile: 'large', tablet: 'xlarge' }}
        paddingEnd={{ mobile: 'large', tablet: 'unset' }}
        height={{ mobile: HEADER_HEIGHT, tablet: 'unset' }}
        paddingY={{ mobile: 0, tablet: 'large' }}
      >
        <Box flex>
          <Link href="/" title="/ˈvuːswɑː/" className={linkClass}>
            <Text visuallyHidden>Home</Text>
            <VMark />
            <span aria-hidden>OUSSOIR</span>
          </Link>
        </Box>

        <ClientOnly>
          <ThemeSwitcher />
        </ClientOnly>
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
      </Flex>
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
