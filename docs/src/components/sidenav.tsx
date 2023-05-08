'use client';

import { ReactNode, useId } from 'react';
import { cx } from '../utils';

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

const navItemStyleShared = 'rounded-md px-4 py-2 block text-sm';

const navItemStyleIdle =
  'hover:bg-keystatic-gray-light font-medium text-stone-600';

const navItemStyleCurrent =
  'bg-keystatic-gray text-stone-700 font-semibold before:block before:absolute before:inset-y-2 before:inset-x-0 before:bg-keystatic-gray-dark before:w-1 before:rounded-r';

export function NavItem({
  label,
  href,
  current,
}: {
  label: string;
  href: string;
  current?: boolean;
}) {
  // TODO next/link
  return (
    <li className="relative" aria-current={current ? 'page' : false}>
      <a
        className={cx(
          navItemStyleShared,
          current ? navItemStyleCurrent : navItemStyleIdle
        )}
        href={href}
      >
        {label}
      </a>
    </li>
  );
}

const topNavItemStyleShared = 'rounded-md px-4 py-2 block text-md';

const topNavItemStyleIdle =
  'hover:bg-keystatic-gray-light font-medium text-stone-600';

const topNavItemStyleCurrent = 'bg-keystatic-gray text-stone-700 font-semibold';

export function TopNavItem({
  label,
  href,
  current,
}: {
  label: string;
  href: string;
  current?: boolean;
}) {
  // TODO next/link
  return (
    <li className="relative" aria-current={current ? 'page' : false}>
      <a
        className={cx(
          topNavItemStyleShared,
          current ? topNavItemStyleCurrent : topNavItemStyleIdle
        )}
        href={href}
      >
        {label}
      </a>
    </li>
  );
}
