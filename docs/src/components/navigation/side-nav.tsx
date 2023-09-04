'use client';

import { ReactNode } from 'react';

export function SideNav({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="fixed z-20 hidden h-screen w-60 pl-6 pt-24 lg:block">
        <nav
          aria-label="Main navigation"
          className="-ml-6 h-full overflow-y-auto border-r border-slate-4 bg-white px-6 py-10 pl-6"
        >
          {children}
        </nav>
      </div>
    </>
  );
}
