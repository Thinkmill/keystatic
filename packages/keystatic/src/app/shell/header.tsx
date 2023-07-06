import { useLocale } from '@react-aria/i18n';
import { PropsWithChildren, useRef } from 'react';

import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { panelLeftOpenIcon } from '@keystar/ui/icon/icons/panelLeftOpenIcon';
import { panelLeftCloseIcon } from '@keystar/ui/icon/icons/panelLeftCloseIcon';
import { panelRightOpenIcon } from '@keystar/ui/icon/icons/panelRightOpenIcon';
import { panelRightCloseIcon } from '@keystar/ui/icon/icons/panelRightCloseIcon';
import { Box, Flex } from '@keystar/ui/layout';

import { MAIN_PANEL_ID, SIDE_PANEL_ID } from './constants';
import { useSidebar } from './sidebar';
import { AppShellContainer } from '.';

function documentSelector(selector: string): HTMLElement | null {
  return document.querySelector(selector);
}

export const AppShellHeader = ({ children }: PropsWithChildren) => {
  const { sidebarIsOpen, setSidebarOpen } = useSidebar();
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { direction } = useLocale();

  let onPress = () => {
    let sidePanel = documentSelector(`#${SIDE_PANEL_ID}`);
    let mainPanel = documentSelector(`#${MAIN_PANEL_ID}`);

    if (sidePanel && mainPanel) {
      sidePanel.dataset.visible =
        sidePanel.dataset.visible === 'true' ? 'false' : 'true';

      if (sidePanel.dataset.visible === 'true') {
        setSidebarOpen(true);
        mainPanel.setAttribute('aria-hidden', 'true');
        sidePanel.tabIndex = -1;
        sidePanel.focus();
      } else {
        setSidebarOpen(false);
        mainPanel.removeAttribute('aria-hidden');
        sidePanel.removeAttribute('tabindex');
      }
    }
  };

  let icon = sidebarIsOpen ? panelLeftCloseIcon : panelLeftOpenIcon;
  if (direction === 'rtl') {
    icon = sidebarIsOpen ? panelRightCloseIcon : panelRightOpenIcon;
  }

  return (
    <Box
      backgroundColor="surface"
      borderBottom="muted"
      elementType="header"
      height={{ mobile: 'element.large', tablet: 'element.xlarge' }}
      // insetTop={0}
      // position="sticky"
      // zIndex={3}
    >
      <AppShellContainer>
        <Flex
          alignItems="center"
          gap={{ mobile: 'small', tablet: 'regular' }}
          height={{ mobile: 'element.large', tablet: 'element.xlarge' }}
        >
          <ActionButton
            prominence="low"
            isHidden={sidebarIsOpen ? { above: 'mobile' } : undefined}
            onPress={onPress}
            ref={menuButtonRef}
          >
            <Icon src={icon} />
          </ActionButton>
          {children}
        </Flex>
      </AppShellContainer>
    </Box>
  );
};
