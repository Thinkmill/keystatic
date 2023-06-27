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
    event: UIEvent<HTMLUListElement> & { target: HTMLUListElement }
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
        className="px-3 pt-2 pb-2 lg:hidden"
        aria-label="Open menu"
      >
        <div className="flex items-center gap-2" aria-hidden="true">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
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
        className={`fixed top-0 left-0 bottom-0 right-0 bg-neutral-800/[.6] z-30 transition-opacity duration-300 lg:hidden ${
          navOpen
            ? 'visible opacity-100'
            : 'invisible opacity-0 lg:visible lg:opacity-100'
        }`}
      />

      {/** Slideout menu */}
      <ul
        aria-expanded={navOpen}
        onScroll={onScrollHandler}
        className={`overflow-y-auto list-none fixed lg:hidden top-0 bg-white h-[100dvh] w-64 z-30 drop-shadow-2xl flex flex-col transition-[right] duration-300 ${
          navOpen ? '-right-0' : '-right-full'
        }`}
      >
        <FocusLock disabled={!navOpen} returnFocus>
          {/* Sticky close */}
          <div
            className={`sticky top-0 left-0 right-0 p-2 bg-white z-30 justify-end flex transition-shadow ${
              scrollTop <= 0 ? 'shadow-none' : 'shadow-lg'
            }`}
          >
            <button
              type="button"
              className="flex items-center justify-center rounded-lg h-10 w-10 hover:bg-keystatic-gray-light active:bg-keystatic-gray transition-colors"
              onClick={closeNav}
              tabIndex={navOpen ? 0 : -1}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          {/** Nav list items */}
          <div className="px-2 pb-10">
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
              currentPage={pathname?.startsWith('/docs')}
            />

            <NavItem
              level="top"
              label="Blog"
              href="/blog"
              tabIndex={navOpen ? 0 : -1}
              currentPage={pathname?.startsWith('/blog')}
            />

            <div className="pt-6">
              {navigationMap?.map(({ groupName, items }) => (
                <NavGroup key={groupName} title={groupName}>
                  {items.map(({ label, href, title, comingSoon }) => (
                    <NavItem
                      key={href}
                      label={label}
                      href={href}
                      title={title}
                      level="sub"
                      tabIndex={navOpen ? 0 : -1}
                      comingSoon={comingSoon}
                    />
                  ))}
                </NavGroup>
              ))}
            </div>

            <hr className="h-px my-3 mx-4 border-keystatic-gray" />

            <div className="flex flex-row items-center gap-4 justify-center px-4 pt-4">
              <SocialLinks tabIndex={navOpen ? 0 : -1} />
            </div>
          </div>
        </FocusLock>
      </ul>
    </>
  );
}
