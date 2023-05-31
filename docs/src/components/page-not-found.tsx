'use client';

import { usePathname } from 'next/navigation';
import Button from './button';
import { cx } from '../utils';

export function PageNotFound({
  backTo = 'home',
}: {
  backTo?: 'home' | 'docs';
}) {
  const path = usePathname();

  return (
    <div className="flex flex-col gap-8">
      <h1
        className={cx(
          `font-extrabold`,
          backTo === 'docs'
            ? 'text-2xl sm:text-3xl'
            : 'text-3xl sm:text-4xl md:text-5xl'
        )}
      >
        404: Page not found <span aria-hidden="true">🕵️</span>
      </h1>

      <p className="text-keystatic-gray-dark">
        Apologies, we couldn't find any page with the path{' '}
        <span className="font-mono bg-keystatic-gray-light px-2 py-1 rounded border border-keystatic-gray text-black">
          {path}
        </span>
        .
      </p>

      <div className="flex">
        <Button
          impact="light"
          className=""
          href={backTo === 'docs' ? '/docs' : '/'}
        >
          Back to {backTo === 'docs' ? 'Docs' : 'Home'}
        </Button>
      </div>
    </div>
  );
}
