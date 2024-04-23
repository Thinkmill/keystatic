'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ComingSoonBadge,
  NewBadge,
  type BadgeStatus,
  DeprecatedBadge,
} from './badges';
import { cx } from '../../utils';

type NavItemProps = {
  label: string;
  href: string;
  level: 'top' | 'sub';
  current?: boolean;
  title?: string;
  tabIndex?: number;
  comingSoon?: boolean;
  status?: BadgeStatus | 'deprecated';
  currentPage?: boolean;
};

export function NavItem({
  label,
  href,
  level,
  title,
  tabIndex,
  comingSoon,
  status,
  currentPage,
}: NavItemProps) {
  const pathname = usePathname();
  const isCurrentPage = currentPage || href === pathname;

  const styleShared = `rounded-md px-4 py-2 block focus-visible:z-30 focus-visible:relative transition-colors ${
    level === 'top' ? 'text-md' : 'text-sm'
  }`;

  const styleIdle =
    'font-medium text-slate-10 hover:bg-slate-3 active:bg-slate-5';

  const styleCurrent = `bg-slate-4 text-slate-11 font-semibold ${
    level !== 'top'
      ? 'before:block before:absolute before:inset-y-1 before:-inset-x-2 before:bg-slate-11 before:w-1 before:rounded before:transition-all'
      : ''
  }`;

  const hasStatusBadge = status !== 'default';

  return (
    <li className="relative" aria-current={isCurrentPage ? 'page' : false}>
      {comingSoon ? (
        <div
          className={cx(
            styleShared,
            'inline-flex items-center gap-1 text-slate-9'
          )}
        >
          <span>{label}</span>
          <ComingSoonBadge />
        </div>
      ) : (
        <Link href={href} legacyBehavior>
          <a
            className={cx(
              styleShared,
              isCurrentPage ? styleCurrent : styleIdle,
              hasStatusBadge ? 'flex items-center gap-1' : ''
            )}
            href={href}
            title={title}
            tabIndex={tabIndex}
          >
            {label}
            {status === 'new' && <NewBadge />}
            {status === 'experimental' && <ComingSoonBadge />}
            {status === 'deprecated' && <DeprecatedBadge />}
          </a>
        </Link>
      )}
    </li>
  );
}
