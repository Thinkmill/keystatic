import { ReactNode } from 'react';
import Link from 'next/link';

export default function BuilderLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div
        style={{
          fontFamily:
            '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
          color: '#0f172a',
        }}
      >
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 20,
            borderBottom: '1px solid #e2e8f0',
            background: 'rgba(255,255,255,0.9)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            style={{
              maxWidth: 980,
              margin: '0 auto',
              padding: '12px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <Link
              href="/test/builder"
              style={{ textDecoration: 'none', color: '#0f172a', fontWeight: 700 }}
            >
              Page Builder Preview
            </Link>
            <Link
              href="/keystatic"
              style={{
                textDecoration: 'none',
                color: 'white',
                background: '#2563eb',
                borderRadius: 8,
                padding: '8px 12px',
                lineHeight: 1.2,
              }}
            >
              Open Admin
            </Link>
          </div>
        </header>
        {children}
      </div>
    </>
  );
}
