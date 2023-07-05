'use client';

import { usePathname } from 'next/navigation';
import Button from './button';

export function PageNotFound() {
  const path = usePathname();

  return (
    <div className="flex flex-col gap-8">
      <h1
        className="font-extrabold text-3xl sm:text-4xl md:text-5xl"
        id="heading-1-overview"
      >
        404: Page not found <span aria-hidden="true">🕵️</span>
      </h1>

      <p className="text-lg text-keystatic-gray-dark">
        Apologies, we couldn't find any page with the path{' '}
        <span className="font-mono bg-keystatic-gray-light px-2 py-1 rounded border border-keystatic-gray text-black">
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
