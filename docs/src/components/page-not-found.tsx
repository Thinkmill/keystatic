'use client';

import { usePathname } from 'next/navigation';
import Button from './button';
import { H1_ID } from '../constants';

export function PageNotFound() {
  const path = usePathname();

  return (
    <div className="flex flex-col gap-8">
      <h1
        className="text-3xl font-extrabold sm:text-4xl md:text-5xl"
        id={H1_ID}
      >
        404: Page not found <span aria-hidden="true">🕵️</span>
      </h1>

      <p className="text-lg text-slate-11">
        Apologies, we couldn't find any page with the path{' '}
        <span className="rounded border border-slate-5 bg-slate-3 px-2 py-1 font-mono text-black">
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
