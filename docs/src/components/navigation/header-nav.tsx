'use client';

import { KeystaticLogoLink } from './keystatic-logo-link';
import { SocialLinks } from './social-links';
import { MobileNav } from './mobile-nav';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cx } from '../../utils';

export type NavProps = {
  ignoreDocNavStyles?: boolean;
  navigationMap?: {
    groupName: string;
    items: {
      label: string;
      href: string;
      title: string | undefined;
      comingSoon?: boolean;
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
    'shrink-0 px-4 rounded-md transition-colors h-10 flex items-center relative';

  const linkStylesIdle = 'hover:bg-slate-3 active:bg-slate-4 font-medium';

  const linkStylesCurrent = 'bg-slate-4 hover:bg-slate-4 font-bold';

  return (
    <header
      className={`absolute top-0 z-20 w-full ${
        isDocsNav
          ? 'z-20 bg-white lg:fixed lg:z-30 lg:border-b lg:border-sand-5'
          : ''
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <nav className="flex flex-row items-center justify-between gap-6 px-6 py-6 lg:h-24">
          <KeystaticLogoLink />

          <div className="hidden items-center gap-2 lg:flex">
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
            {/* CHECK: Remove Blog link completely? */}
            {/* <Link
              className={cx(
                linkStylesShared,
                pathname?.startsWith('/blog')
                  ? linkStylesCurrent
                  : linkStylesIdle
              )}
              href="/blog"
            >
              Blog
            </Link> */}
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
            <SocialLinks />
          </div>

          <MobileNav navigationMap={navigationMap} />
        </nav>
      </div>
    </header>
  );
}
