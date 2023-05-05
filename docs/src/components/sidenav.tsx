import { ReactNode, useId } from 'react';
import { cx } from '../utils';

export function NavContainer({ children }: { children: ReactNode }) {
  return (
    <div className="hidden lg:block fixed w-60 h-screen pt-24">
      <nav className="h-full pt-2 pb-10 pr-6 pl-4 -ml-4 border-r border-stone-400/20 overflow-y-auto">
        {children}
      </nav>
    </div>
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
    <div className="-ml-4 pt-8">
      <h3 id={id} className="text-sm font-semibold mb-2 px-4">
        {title}
      </h3>
      <ul aria-labelledby={id}>{children}</ul>
    </div>
  );
}

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
          'rounded-md hover:bg-keystatic-gray-light px-4 py-2 block text-sm font-normal text-stone-600',
          current
            ? 'bg-keystatic-gray hover:bg-keystatic-gray text-stone-700 font-semibold before:block before:absolute before:inset-y-2 before:inset-x-0 before:bg-keystatic-gray-dark before:w-1 before:rounded-r'
            : ''
        )}
        href={href}
      >
        {label}
      </a>
    </li>
  );
}
