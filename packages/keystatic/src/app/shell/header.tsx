import { useLocale } from '@react-aria/i18n';
import { PropsWithChildren, useRef } from 'react';

import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { panelLeftOpenIcon } from '@keystar/ui/icon/icons/panelLeftOpenIcon';
import { panelLeftCloseIcon } from '@keystar/ui/icon/icons/panelLeftCloseIcon';
import { panelRightOpenIcon } from '@keystar/ui/icon/icons/panelRightOpenIcon';
import { panelRightCloseIcon } from '@keystar/ui/icon/icons/panelRightCloseIcon';
import { Box, Flex } from '@keystar/ui/layout';
import { breakpointQueries, css, tokenSchema } from '@keystar/ui/style';

import { useSidebar } from './sidebar';
import { AppShellContainer } from '.';

export const AppShellHeader = ({ children }: PropsWithChildren) => {
  const sidebarState = useSidebar();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { direction } = useLocale();

  let icon = sidebarState.isOpen ? panelLeftCloseIcon : panelLeftOpenIcon;
  if (direction === 'rtl') {
    icon = sidebarState.isOpen ? panelRightCloseIcon : panelRightOpenIcon;
  }

  return (
    <Box
      backgroundColor="surface"
      borderBottom="muted"
      elementType="header"
      height={{ mobile: 'element.large', tablet: 'scale.700' }}
      flexShrink={0}
    >
      <AppShellContainer>
        <Flex
          alignItems="center"
          gap={{ mobile: 'small', tablet: 'regular' }}
          height={{ mobile: 'element.large', tablet: 'scale.700' }}
        >
          <ActionButton
            prominence="low"
            isHidden={sidebarState.isOpen ? { above: 'mobile' } : undefined}
            onPress={sidebarState.toggle}
            ref={menuButtonRef}
            UNSAFE_className={css({
              marginInlineStart: `calc(${tokenSchema.size.space.regular} * -1)`,
              [breakpointQueries.below.tablet]: {
                borderStartStartRadius: 0,
                borderEndStartRadius: 0,
              },
            })}
          >
            <Icon src={icon} />
          </ActionButton>
          {children}
        </Flex>
      </AppShellContainer>
    </Box>
  );
};
