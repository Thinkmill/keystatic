'use client';

import Button from '../button';
import { KeystaticLogo } from './keystatic-logo';
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
  const isDocsNav = pathname?.includes('/docs');

  return (
    <header className="bg-white w-full">
      <div className="mx-auto max-w-7xl">
        <nav className="lg:h-24 py-6 px-6 flex flex-row items-center justify-between gap-6">
          <KeystaticLogo />

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
