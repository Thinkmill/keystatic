'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function NavigationEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Always focus `<main />` on page navigation for accessibility
    const mainEl = document.querySelector('main');
    mainEl?.focus();
  }, [pathname, searchParams]);

  return null;
}
