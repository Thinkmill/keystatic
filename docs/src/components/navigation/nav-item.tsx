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
  currentPage?: boolean;
};

export function NavItem({
  label,
  href,
  level,
  title,
  tabIndex,
  comingSoon,
  currentPage,
}: NavItemProps) {
  const pathname = usePathname();
  const isCurrentPage = currentPage || href === pathname;

  const styleShared = `rounded-md px-4 py-2 block focus-visible:z-30 focus-visible:relative transition-colors ${
    level === 'top' ? 'text-md' : 'text-sm'
  }`;

  const styleIdle =
    'font-medium text-neutral-600 hover:bg-slate-3 active:bg-slate-5';

  const styleCurrent = `bg-slate-4 text-slate-11 font-semibold ${
    level !== 'top'
      ? 'before:block before:absolute before:inset-y-1 before:-inset-x-2 before:bg-slate-11 before:w-1 before:rounded before:transition-all'
      : ''
  }`;

  return (
    <li className="relative" aria-current={isCurrentPage ? 'page' : false}>
      {comingSoon ? (
        <div
          className={cx(
            styleShared,
            'inline-flex items-baseline gap-1 text-neutral-500'
          )}
        >
          {label}
          <div className="self-start rounded bg-amber-100 px-1 py-0.5 text-[0.625rem] font-medium uppercase leading-none text-amber-800">
            Soon
          </div>
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
