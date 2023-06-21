'use client';

// import Button from '../button';
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
    'shrink-0 px-3 rounded-lg transition-colors h-10 flex items-center font-semibold relative';

  const linkStylesIdle =
    'hover:bg-keystatic-gray-light active:bg-keystatic-gray';

  const linkStylesCurrent = 'bg-keystatic-gray hover:bg-keystatic-gray';

  return (
    <header
      className={`bg-white w-full ${
        isDocsNav ? 'border-b border-keystatic-gray lg:fixed z-20 lg:z-30' : ''
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <nav className="lg:h-24 py-6 px-6 flex flex-row items-center justify-between gap-6">
          <KeystaticLogoLink />

          <div className="hidden lg:flex items-center gap-2">
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
                pathname?.startsWith('/blog')
                  ? linkStylesCurrent
                  : linkStylesIdle
              )}
              href="/blog"
            >
              Blog
            </Link>
            <SocialLinks />
          </div>

          <MobileNav navigationMap={navigationMap} />
        </nav>
      </div>
    </header>
  );
}
