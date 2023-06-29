import { ActionButton } from '@voussoir/button';
import { Icon } from '@voussoir/icon';
import { menuIcon } from '@voussoir/icon/icons/menuIcon';
import { Flex } from '@voussoir/layout';
import { PropsWithChildren, useContext, useRef, useEffect } from 'react';

import { SidebarContext } from './sidebar';

function documentSelector(selector: string): HTMLElement | null {
  return document.querySelector(selector);
}

export const AppShellHeader = ({ children }: PropsWithChildren) => {
  const { setSidebarOpen } = useContext(SidebarContext);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  let onPress = () => {
    let nav = documentSelector('.keystatic-sidebar');
    let main = documentSelector('main');

    if (nav && main) {
      nav.dataset.visible = nav.dataset.visible === 'true' ? 'false' : 'true';

      if (nav.dataset.visible === 'true') {
        setSidebarOpen(true);
        main.setAttribute('aria-hidden', 'true');
        nav.tabIndex = -1;
        nav.focus();
      } else {
        setSidebarOpen(false);
        main.removeAttribute('aria-hidden');
        nav.removeAttribute('tabindex');
      }
    }
  };

  useEffect(() => {
    let mediaQueryList = window.matchMedia('(max-width: 1020px)');
    let nav = documentSelector('.keystatic-sidebar');
    let main = documentSelector('main');
    let hamburgerButton = menuButtonRef.current;

    let removeVisible = (isNotResponsive = false) => {
      setSidebarOpen(false);

      if (nav && main) {
        if (
          hamburgerButton &&
          nav.contains(document.activeElement) &&
          !isNotResponsive
        ) {
          hamburgerButton.focus();
        }

        nav.dataset.visible = 'false';
        main.removeAttribute('aria-hidden');
        nav.removeAttribute('tabindex');
      }
    };

    /* collapse nav when underlying content is clicked */
    let onClick = (e: MouseEvent) => {
      if (e.target !== hamburgerButton) {
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
      if (event.key === 'Tab' && nav && nav.dataset.visible === 'true') {
        let tabbables = nav.querySelectorAll('button, a[href]');
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
    if (nav && main) {
      main.addEventListener('click', onClick);
      nav.addEventListener('keydown', onKeydownTab);
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
      if (nav && main) {
        main.removeEventListener('click', onClick);
        nav.removeEventListener('keydown', onKeydownTab);
      }

      if (useEventListener) {
        mediaQueryList.removeEventListener('change', mediaQueryTest);
      } else {
        mediaQueryList.removeListener(mediaQueryTest);
      }
    };
  }, [setSidebarOpen, menuButtonRef]);

  return (
    <Flex
      alignItems="center"
      backgroundColor="surface"
      borderBottom="muted"
      elementType="header"
      gap="regular"
      height={{ mobile: 'element.large', tablet: 'element.xlarge' }}
      insetTop={0}
      paddingX={{ mobile: 'regular', tablet: 'xlarge' }}
      position="sticky"
      zIndex={3}
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
  );
};
