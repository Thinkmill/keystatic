'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cx } from '../../utils';

type HeaderLinkProps = {
  slug: string;
  title: string;
};

export function HeaderLink({ slug, title }: HeaderLinkProps) {
  const pathname = usePathname();
  const isActive = pathname.replace('/', '') === slug;
  return (
    <Link
      href={slug}
      className={cx(
        'px-3 py-0.5 rounded-md flex items-center gap-2',
        isActive
          ? 'bg-emerald-100 text-emerald-900'
          : 'bg-slate-200 text-slate-900 hover:bg-cyan-200 hover:text-cyan-900'
      )}
    >
      {title}
      {isActive && (
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-800 animate-pulse" />
      )}
    </Link>
  );
}
