'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function FrontendNav(props: { items: { href: string; label: string }[] }) {
  const pathname = usePathname();
  if (pathname.startsWith('/keystatic')) {
    return null;
  }

  return (
    <header style={{ borderBottom: '1px solid #e2e8f0', padding: '14px 20px' }}>
      <nav
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: 12,
          maxWidth: 980,
          margin: '0 auto',
        }}
      >
        <Link href="/" style={{ fontWeight: 700, marginRight: 6 }}>
          Home
        </Link>
        {props.items.map(item => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
