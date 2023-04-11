import { PropsWithChildren } from 'react';

import { bookIcon } from '@voussoir/icon/icons/bookIcon';
import { codeIcon } from '@voussoir/icon/icons/codeIcon';
import { Icon } from '@voussoir/icon';
import { AspectRatio, Box, Flex } from '@voussoir/layout';
import { NavList, NavGroup, NavItem } from '@voussoir/nav-list';
import { tokenSchema } from '@voussoir/style';
import { Text } from '@voussoir/typography';

function isCurrent(storyId: string) {
  const searchParams = new URLSearchParams(window.location.search);
  const idParam = searchParams.get('id');

  if (idParam && idParam.includes(storyId)) {
    return 'page';
  }
}

export const AppShell = ({ children }: PropsWithChildren) => {
  return (
    <Flex width="100vw" minHeight="100vh">
      <Flex
        isHidden={{ below: 'tablet' }}
        direction="column"
        height="100vh"
        position="sticky"
        insetTop="0"
        UNSAFE_style={{ width: 280 }}
      >
        <Box paddingStart="xlarge" paddingY="medium">
          <Logo />
        </Box>

        <Flex
          direction="column"
          overflow="auto"
          backgroundColor="surface"
          paddingY="xlarge"
          paddingEnd="xlarge"
          borderTopEndRadius="medium"
          flex
        >
          <NavList flex>
            <NavItem
              href="linkToStory:app-dashboard"
              aria-current={isCurrent('dashboard')}
            >
              Dashboard
            </NavItem>

            <NavGroup title="Lists">
              <NavItem href="linkToStory:app-list">Users</NavItem>
              <NavItem
                href="linkToStory:app-list"
                aria-current={isCurrent('list') || isCurrent('item')}
              >
                Puppies
              </NavItem>
              <NavItem href="linkToStory:app-list">Reviews</NavItem>
            </NavGroup>
            <NavGroup title="Singletons">
              <NavItem href="#">Settings</NavItem>
            </NavGroup>

            <Box flex elementType="li" role="presentation" />

            <NavGroup title="Developer tools">
              <NavItem href="#">
                <Icon src={codeIcon} />
                <Text>API Explorer</Text>
              </NavItem>
              <NavItem href="https://keystonejs.com/docs">
                <Icon src={bookIcon} />
                <Text>Documentation</Text>
              </NavItem>
            </NavGroup>
          </NavList>
        </Flex>
      </Flex>

      {/* <Divider orientation="vertical" isHidden={{ below: 'tablet' }} /> */}

      {children}
    </Flex>
  );
};

// Styled components
// -----------------------------------------------------------------------------

const Logo = () => (
  <Flex gap="regular" alignItems="center">
    <LogoMark />
    <Text color="neutralEmphasis" weight="semibold">
      Keystone
    </Text>
  </Flex>
);
const LogoMark = () => (
  <AspectRatio value="1" height="element.medium">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 35 34"
      aria-label="Keystone"
      role="img"
      fill="none"
    >
      <path
        fill={tokenSchema.color.background.accentEmphasis}
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.82812 0.125C3.3332 0.125 0.5 2.9582 0.5 6.45312V27.5469C0.5 31.0418 3.3332 33.875 6.82812 33.875H27.9219C31.4168 33.875 34.25 31.0418 34.25 27.5469V6.45312C34.25 2.9582 31.4168 0.125 27.9219 0.125H6.82812ZM14.5199 20.9221V25.9648H9.98395V8.12991H14.5199V15.7929H14.7548L20.6874 8.12991H25.5571L19.3896 16.003L25.9155 25.9648H20.5885L16.0896 18.9322L14.5199 20.9221Z"
      />
    </svg>
  </AspectRatio>
);
