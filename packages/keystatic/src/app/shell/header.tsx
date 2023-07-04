import { usePreventScroll } from '@react-aria/overlays';
import { PropsWithChildren, useRef, useEffect } from 'react';

import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { menuIcon } from '@keystar/ui/icon/icons/menuIcon';
import { Box, Flex } from '@keystar/ui/layout';
import { breakpointQueries } from '@keystar/ui/style';

import { MAIN_PANEL_ID, SIDE_PANEL_ID } from './constants';
import { useSidebar } from './sidebar';
import { AppShellContainer } from '.';

function documentSelector(selector: string): HTMLElement | null {
  return document.querySelector(selector);
}

export const AppShellHeader = ({ children }: PropsWithChildren) => {
  const { sidebarIsOpen, setSidebarOpen } = useSidebar();
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  usePreventScroll({ isDisabled: !sidebarIsOpen });

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

  useEffect(() => {
    let belowTablet = breakpointQueries.below.tablet
      .replace('@media', '')
      .trim(); // a bit awkward, but stays in-sync with the component library
    let mediaQueryList = window.matchMedia(belowTablet);
    let sidePanel = documentSelector(`#${SIDE_PANEL_ID}`);
    let mainPanel = documentSelector(`#${MAIN_PANEL_ID}`);
    let menuButtonElement = menuButtonRef.current;

    let removeVisible = (isNotResponsive = false) => {
      setSidebarOpen(false);

      if (sidePanel && mainPanel) {
        if (
          menuButtonElement &&
          sidePanel.contains(document.activeElement) &&
          !isNotResponsive
        ) {
          menuButtonElement.focus();
        }

        sidePanel.dataset.visible = 'false';
        mainPanel.removeAttribute('aria-hidden');
        sidePanel.removeAttribute('tabindex');
      }
    };

    /* collapse nav when underlying content is clicked */
    let onMouseDown = (e: MouseEvent) => {
      if (!menuButtonElement?.contains(e.target as Node)) {
        removeVisible();
      }
    };

    /* collapse expanded nav when esc key is pressed */
    let onKeydownEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        removeVisible();
      }
    };

    /* trap keyboard focus within expanded nav */
    let onKeydownTab = (event: KeyboardEvent) => {
      if (
        event.key === 'Tab' &&
        sidePanel &&
        sidePanel.dataset.visible === 'true'
      ) {
        let tabbables = sidePanel.querySelectorAll('button, a[href]');
        let first = tabbables[0] as HTMLElement;
        let last = tabbables[tabbables.length - 1] as HTMLElement;

        if (event.shiftKey && event.target === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && event.target === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    /* restore default behavior when responsive media query no longer matches */
    let mediaQueryTest = (event: any) => {
      if (!event.matches) {
        removeVisible(true);
      }
    };

    document.addEventListener('keydown', onKeydownEsc);
    if (sidePanel && mainPanel) {
      mainPanel.addEventListener('mousedown', onMouseDown);
      sidePanel.addEventListener('keydown', onKeydownTab);
    }

    let useEventListener =
      typeof mediaQueryList.addEventListener === 'function';
    if (useEventListener) {
      mediaQueryList.addEventListener('change', mediaQueryTest);
    } else {
      mediaQueryList.addListener(mediaQueryTest);
    }

    return () => {
      document.removeEventListener('keydown', onKeydownEsc);
      if (sidePanel && mainPanel) {
        mainPanel.removeEventListener('mousedown', onMouseDown);
        sidePanel.removeEventListener('keydown', onKeydownTab);
      }

      if (useEventListener) {
        mediaQueryList.removeEventListener('change', mediaQueryTest);
      } else {
        mediaQueryList.removeListener(mediaQueryTest);
      }
    };
  }, [setSidebarOpen, menuButtonRef]);

  return (
    <Box
      backgroundColor="surface"
      borderBottom="muted"
      elementType="header"
      height={{ mobile: 'element.large', tablet: 'element.xlarge' }}
      insetTop={0}
      position="sticky"
      zIndex={3}
    >
      <AppShellContainer>
        <Flex
          alignItems="center"
          gap={{ mobile: 'small', tablet: 'regular' }}
          height={{ mobile: 'element.large', tablet: 'element.xlarge' }}
        >
          <ActionButton
            prominence="low"
            isHidden={{ above: 'mobile' }}
            onPress={onPress}
            ref={menuButtonRef}
          >
            <Icon src={menuIcon} />
          </ActionButton>
          {children}
        </Flex>
      </AppShellContainer>
    </Box>
  );
};
