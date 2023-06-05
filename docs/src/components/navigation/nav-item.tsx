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
  comingSoon?: boolean;
};

export function NavItem({
  label,
  href,
  level,
  title,
  tabIndex,
  comingSoon,
}: NavItemProps) {
  const pathname = usePathname();
  const isCurrentPage = href === pathname;

  const styleShared = `rounded-md px-4 py-2 block focus-visible:z-30 focus-visible:relative transition-colors ${
    level === 'top' ? 'text-md' : 'text-sm'
  }`;

  const styleIdle =
    'font-medium text-neutral-600 hover:bg-keystatic-gray-light active:bg-keystatic-gray';

  const styleCurrent =
    'bg-keystatic-gray text-keystatic-gray-dark font-semibold before:block before:absolute before:inset-y-1 before:-inset-x-2 before:bg-keystatic-gray-dark before:w-1 before:rounded before:transition-all';

  return (
    <li className="relative" aria-current={isCurrentPage ? 'page' : false}>
      {comingSoon ? (
        <div
          className={cx(
            styleShared,
            'inline-flex gap-1 items-baseline text-neutral-500'
          )}
        >
          {label}
          {comingSoon && (
            <div className="px-1 py-0.5 rounded bg-amber-100 text-amber-800/80 font-medium text-[0.625rem] leading-none uppercase self-start">
              Soon
            </div>
          )}
        </div>
      ) : (
        <Link href={href} legacyBehavior>
          <a
            className={cx(
              styleShared,
              isCurrentPage ? styleCurrent : styleIdle
            )}
            href={href}
            title={title}
            tabIndex={tabIndex}
          >
            {label}
          </a>
        </Link>
      )}
    </li>
  );
}
