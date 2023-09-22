'use client';

import { usePathname } from 'next/navigation';
import Button from './button';
import { H1_ID } from '../constants';

export function PageNotFound() {
  const path = usePathname();

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-5xl font-medium" id={H1_ID}>
        404: Page not found <span aria-hidden="true">🕵️</span>
      </h1>

      <p className="text-lg">
        Apologies, we couldn't find any page with the path{' '}
        <span className="rounded border border-sand-6 bg-sand-3 px-2 py-1 font-mono text-base text-sand-12">
          {path}
        </span>
      </p>

      <div className="flex">
        <Button impact="light" href="/">
          Back to Home
        </Button>
      </div>
    </div>
  );
}
