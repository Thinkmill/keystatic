'use client';

import { ReactNode } from 'react';

export function SideNav({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="fixed hidden lg:block z-20 w-60 h-screen pt-24 pl-6">
        <nav className="h-full py-10 px-6 pl-6 -ml-6 border-r border-keystatic-gray overflow-y-auto bg-white">
          {children}
        </nav>
      </div>
    </>
  );
}
