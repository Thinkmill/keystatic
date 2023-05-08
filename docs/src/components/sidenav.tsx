'use client';

import { ReactNode, useId, useState } from 'react';
import { cx } from '../utils';

export function NavContainer({ children }: { children: ReactNode }) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setNavOpen(true)}
        className="bg-keystatic-gray-light hover:bg-keystatic-gray sticky top-0 left-0 w-full px-6 py-2 border-b flex items-center border-stone-400/20 z-20 lg:hidden"
      >
        <div className="flex items-center gap-2 text-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
          <span className="flex items-center gap-1">
            <span className="">Getting started</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-3 h-3"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
            <span className="font-semibold">Introduction</span>
          </span>
        </div>
      </button>

      <div
        onClick={prev => setNavOpen(!prev)}
        className={`fixed top-0 left-0 bottom-0 right-0 bg-stone-800/[.6] z-30 transition-opacity lg:hidden ${
          navOpen
            ? 'visible opacity-100'
            : 'invisible opacity-0 lg:visible lg:opacity-100'
        }`}
      />

      <div
        className={`fixed top-0 z-30 lg:z-20 w-56 h-screen lg:top-24 lg:pl-6 transition-[left] ${
          !navOpen ? '-left-full lg:left-auto' : 'left-0'
        }`}
      >
        <nav className="h-full pt-2 pb-10 pr-6 pl-4 lg:-ml-4 lg:border-r border-stone-400/20 overflow-y-auto bg-white">
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
    <div className="lg:-ml-4 pt-8">
      <h3 id={id} className="text-sm font-semibold mb-2 px-4">
        {title}
      </h3>
      <ul aria-labelledby={id}>{children}</ul>
    </div>
  );
}

const navItemStyleShared = 'rounded-md px-4 py-2 block text-sm';

const navItemStyleIdle =
  'hover:bg-keystatic-gray-light font-normal text-stone-600';

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
