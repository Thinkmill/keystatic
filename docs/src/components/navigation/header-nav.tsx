'use client';

import { KeystaticLogoLink } from './keystatic-logo-link';
import { SocialLinks } from './social-links';
import { MobileNav } from './mobile-nav';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cx } from '../../utils';

import { Search } from '../../components/search';

export type NavProps = {
  ignoreDocNavStyles?: boolean;
  navigationMap?: {
    groupName: string;
    items: {
      label: string;
      href: string;
      title: string | undefined;
      comingSoon?: boolean;
      isNew?: boolean;
    }[];
  }[];
};

export function HeaderNav({
  navigationMap,
  ignoreDocNavStyles = false,
}: NavProps) {
  const pathname = usePathname();

  /** Different style for HeaderNav under /docs or if explicitly passed in to ignore (like in the not-found.tsx) */
  const isDocsNav = pathname?.startsWith('/docs') && !ignoreDocNavStyles;

  const linkStylesShared =
    'shrink-0 px-4 rounded-md transition-colors h-10 flex items-center relative font-medium';

  const linkStylesIdle = 'hover:bg-slate-3 active:bg-slate-4';

  const linkStylesCurrent = 'bg-slate-4 hover:bg-slate-4';

  return (
    <header
      className={`absolute top-0 z-20 w-full ${
        isDocsNav
          ? 'z-20 bg-white lg:fixed lg:z-30 lg:border-b lg:border-sand-5'
          : ''
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <nav className="flex h-24 flex-row items-center justify-between gap-6 px-6 py-6">
          <KeystaticLogoLink />
          <div className="flex items-center gap-4">
            <Search />
            <div className="hidden items-center gap-8 lg:flex">
              <div className="flex gap-4">
                <Link
                  className={cx(
                    linkStylesShared,
                    pathname?.startsWith('/docs')
                      ? linkStylesCurrent
                      : linkStylesIdle
                  )}
                  href="/docs"
                >
                  Docs
                </Link>
                <Link
                  className={cx(
                    linkStylesShared,
                    pathname?.startsWith('/showcase')
                      ? linkStylesCurrent
                      : linkStylesIdle
                  )}
                  href="/showcase"
                >
                  Showcase
                </Link>
              </div>
              <SocialLinks />
            </div>
            <MobileNav navigationMap={navigationMap} />
          </div>
        </nav>
      </div>
    </header>
  );
}
