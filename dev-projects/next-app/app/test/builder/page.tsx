import Link from 'next/link';
import { createReader } from '@keystatic/core/reader';
import localConfig from '../../../keystatic.config';

export const dynamic = 'force-static';

function normalizeSlug(slug: string) {
  return slug.replace(/^\/+|\/+$/g, '');
}

export default async function BuilderIndexPage() {
  const reader = createReader(process.cwd(), localConfig);
  const pages = (await reader.singletons.pages.read())?.items ?? [];

  return (
    <main style={{ maxWidth: 920, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ marginBottom: 8 }}>Page Builder</h1>
      <p style={{ lineHeight: 1.7, color: '#475569' }}>
        Create pages from the admin and open them here.
      </p>
      <div style={{ marginTop: 24, display: 'grid', gap: 10 }}>
        {pages.map(page => (
          <Link
            key={normalizeSlug(page.slug.slug)}
            href={`/test/builder/${normalizeSlug(page.slug.slug)}`}
            style={{
              border: '1px solid #dbeafe',
              borderRadius: 10,
              padding: '12px 14px',
              textDecoration: 'none',
              color: '#0f172a',
              lineHeight: 1.6,
            }}
          >
            {page.title}
          </Link>
        ))}
      </div>
    </main>
  );
}
