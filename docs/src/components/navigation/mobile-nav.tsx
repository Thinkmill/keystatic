import { usePathname } from 'next/navigation';
import { NavProps } from './header-nav';
import { UIEvent, useCallback, useEffect, useState } from 'react';
import Button from '../button';
import { XMarkIcon } from '@heroicons/react/24/outline';
import FocusLock from 'react-focus-lock';
import { SocialLinks } from './social-links';
import { NavGroup } from './nav-group';
import { NavItem } from './nav-item';
import useLockedBody from '../../hooks/useLockedBody';

export function MobileNav({ navigationMap }: NavProps) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);
  const [, setLocked] = useLockedBody(false, 'root');
  const [scrollTop, setScrollTop] = useState(0);

  const closeNav = useCallback(() => {
    setNavOpen(false);
    setLocked(false);
  }, [setLocked]);

  const openNav = useCallback(() => {
    setNavOpen(true);
    setLocked(true);
  }, [setLocked]);

  // Close the mobile menu when pathname (route) changes
  // https://nextjs.org/docs/app/api-reference/functions/use-pathname#do-something-in-response-to-a-route-change
  useEffect(() => {
    closeNav();
  }, [closeNav, pathname]);

  // Close the mobile menu when ESC key is pressed
  useEffect(() => {
    const onKeydownEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeNav();
      }
    };

    document.addEventListener('keydown', onKeydownEsc);

    return () => {
      document.removeEventListener('keydown', onKeydownEsc);
    };
  }, [closeNav]);

  const onScrollHandler = (
    event: UIEvent<HTMLDivElement> & { target: HTMLUListElement }
  ) => {
    const { target } = event;
    setScrollTop(target.scrollTop);
  };

  return (
    <>
      {/** Hamburger menu button */}
      <Button
        onClick={openNav}
        impact="light"
        className="px-3 pb-2 pt-2 lg:hidden"
        aria-label="Open menu"
        aria-expanded={navOpen}
        aria-haspopup="true"
        aria-controls="slideout-menu"
      >
        <div className="flex items-center gap-2" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          Menu
        </div>
      </Button>

      {/** Blanket */}
      <div
        onClick={closeNav}
        className={`fixed bottom-0 left-0 right-0 top-0 z-30 bg-slate-11/[.6] transition-opacity duration-300 lg:hidden ${
          navOpen
            ? 'visible opacity-100'
            : 'invisible opacity-0 lg:visible lg:opacity-100'
        }`}
      />

      {/** Slideout menu */}
      <div
        onScroll={onScrollHandler}
        className={`fixed top-0 z-30 flex h-[100dvh] w-64 list-none flex-col overflow-y-auto bg-white drop-shadow-2xl transition-[right] duration-300 lg:hidden ${
          navOpen ? 'visible -right-0' : '-right-full hidden'
        }`}
      >
        <FocusLock disabled={!navOpen} returnFocus>
          {/* Sticky close */}
          <div
            className={`sticky left-0 right-0 top-0 z-30 flex justify-end bg-white p-2 transition-shadow ${
              scrollTop <= 0 ? 'shadow-none' : 'shadow-lg'
            }`}
          >
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors hover:bg-slate-3 active:bg-slate-5"
              onClick={closeNav}
              tabIndex={navOpen ? 0 : -1}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/** Nav list items */}
          <div className="px-2" id="slideout-menu">
            <NavGroup title="Main pages" visuallyHideTitle>
              <NavItem
                level="top"
                label="Home"
                href="/"
                tabIndex={navOpen ? 0 : -1}
              />

              <NavItem
                level="top"
                label="Docs"
                href="/docs"
                tabIndex={navOpen ? 0 : -1}
                currentPage={pathname === '/docs'}
              />

              <NavItem
                level="top"
                label="Blog"
                href="/blog"
                tabIndex={navOpen ? 0 : -1}
                currentPage={pathname === '/blog'}
              />

              <NavItem
                level="top"
                label="Showcase"
                href="/showcase"
                tabIndex={navOpen ? 0 : -1}
              />

              <NavItem
                level="top"
                label="Resources"
                href="/resources"
                tabIndex={navOpen ? 0 : -1}
              />
            </NavGroup>

            {navigationMap?.map(({ groupName, items }) => (
              <NavGroup key={groupName} title={groupName}>
                {items.map(({ label, href, title, comingSoon, status }) => (
                  <NavItem
                    key={href}
                    label={label}
                    href={href}
                    title={title}
                    level="sub"
                    tabIndex={navOpen ? 0 : -1}
                    comingSoon={comingSoon}
                    status={status}
                  />
                ))}
              </NavGroup>
            ))}

            <hr className="mx-4 my-3 h-px border-slate-5" />

            <div className="flex flex-row items-center justify-center gap-4 px-4 pb-10 pt-4">
              <SocialLinks tabIndex={navOpen ? 0 : -1} />
            </div>
          </div>
        </FocusLock>
      </div>
    </>
  );
}
