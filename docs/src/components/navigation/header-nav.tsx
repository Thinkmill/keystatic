'use client';

import Button from '../button';
import { KeystaticLogoLink } from './keystatic-logo-link';
import { SocialLinks } from './social-links';
import { MobileNav } from './mobile-nav';
import { usePathname } from 'next/navigation';

export type NavProps = {
  navigationMap?: {
    groupName: string;
    items: {
      label: string;
      href: string;
      title: string | undefined;
    }[];
  }[];
};

export function HeaderNav({ navigationMap }: NavProps) {
  const pathname = usePathname();
  const isDocsNav = pathname?.startsWith('/docs');

  return (
    <header
      className={`bg-white w-full ${
        isDocsNav ? 'border-b border-keystatic-gray lg:fixed z-20 lg:z-30' : ''
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <nav className="lg:h-24 py-6 px-6 flex flex-row items-center justify-between gap-6">
          <KeystaticLogoLink />

          <div className="hidden lg:flex flex-row items-center gap-6 justify-between">
            <SocialLinks />
            <Button href="/docs/introduction">Docs</Button>
          </div>

          <MobileNav navigationMap={navigationMap} />
        </nav>
      </div>
    </header>
  );
}
