'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cx } from '../../utils';

type NavItemProps = {
  label: string;
  href: string;
  level: 'top' | 'sub';
  current?: boolean;
  title?: string;
  tabIndex?: number;
};

export function NavItem({ label, href, level, title, tabIndex }: NavItemProps) {
  const pathname = usePathname();
  const isCurrentPage = href === pathname;

  const styleShared = `rounded-md px-4 py-2 block focus-visible:z-30 focus-visible:relative transition-colors ${
    level === 'top' ? 'text-md' : 'text-sm'
  }`;

  const styleIdle =
    'hover:bg-keystatic-gray-light active:bg-keystatic-gray font-medium text-stone-600';

  const styleCurrent =
    'bg-keystatic-gray text-stone-700 font-semibold before:block before:absolute before:inset-y-1 before:-inset-x-2 before:bg-keystatic-gray-dark before:w-1 before:rounded before:transition-all';

  return (
    <li className="relative" aria-current={isCurrentPage ? 'page' : false}>
      <Link href={href} legacyBehavior>
        <a
          className={cx(styleShared, isCurrentPage ? styleCurrent : styleIdle)}
          href={href}
          title={title}
          tabIndex={tabIndex}
        >
          {label}
        </a>
      </Link>
    </li>
  );
}
