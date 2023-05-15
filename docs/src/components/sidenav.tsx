'use client';

import { ReactNode, useId } from 'react';
import { cx } from '../utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function NavContainer({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="fixed hidden lg:block lg:z-20 w-60 h-screen lg:pt-24 lg:pl-6">
        <nav className="h-full py-10 pr-6 pl-4 lg:-ml-4 lg:border-r border-stone-400/20 overflow-y-auto bg-white">
          {children}
        </nav>
      </div>
    </>
  );
}

export function NavList({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const id = useId();

  return (
    <div className="lg:-ml-4 pb-6">
      <h3
        id={id}
        className="text-xs uppercase font-normal text-stone-500 mb-2 px-4"
      >
        {title}
      </h3>
      <ul aria-labelledby={id}>{children}</ul>
    </div>
  );
}

type NavItemProps = {
  label: string;
  href: string;
  level: 'top' | 'sub';
  current?: boolean;
  title?: string;
};

export function NavItem({ label, href, level, title }: NavItemProps) {
  const pathname = usePathname();
  const isCurrentPage = href === pathname;

  const styleShared = `rounded-md px-4 py-2 block ${
    level === 'top' ? 'text-md' : 'text-sm'
  }`;

  const styleIdle = 'hover:bg-keystatic-gray-light font-medium text-stone-600';

  const styleCurrent =
    'bg-keystatic-gray text-stone-700 font-semibold before:block before:absolute before:inset-y-2 before:inset-x-0 before:bg-keystatic-gray-dark before:w-1 before:rounded-r';

  return (
    <li className="relative" aria-current={isCurrentPage ? 'page' : false}>
      <Link href={href} legacyBehavior>
        <a
          className={cx(styleShared, isCurrentPage ? styleCurrent : styleIdle)}
          href={href}
          title={title}
        >
          {label}
        </a>
      </Link>
    </li>
  );
}
