import { notFound } from 'next/navigation';
import { createReader } from '@keystatic/core/reader';
import { DocumentRenderer } from '@keystatic/core/renderer';
import localConfig from '../../../../keystatic.config';

export const dynamic = 'force-static';

function normalizeSlug(slug: string) {
  return slug.replace(/^\/+|\/+$/g, '');
}

export async function generateStaticParams() {
  const reader = createReader(process.cwd(), localConfig);
  const pages = (await reader.singletons.pages.read())?.items ?? [];
  return pages.map(page => ({
    slug: normalizeSlug(page.slug.slug).split('/'),
  }));
}

export default async function BuilderPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const reader = createReader(process.cwd(), localConfig);
  const resolvedParams = await params;
  const slug = normalizeSlug(resolvedParams.slug?.join('/') ?? '');
  const pages = (await reader.singletons.pages.read())?.items ?? [];
  const page = pages.find(page => normalizeSlug(page.slug.slug) === slug);
  if (!page) notFound();

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ marginBottom: 8 }}>{page.title}</h1>
      {page.excerpt ? (
        <p style={{ color: '#475569', lineHeight: 1.8, marginBottom: 18 }}>
          {page.excerpt}
        </p>
      ) : null}
      <div style={{ lineHeight: 1.75 }}>
        <DocumentRenderer
          document={await page.content()}
          componentBlocks={{
            section: props => (
              <section
                style={{
                  border: '1px solid #e2e8f0',
                  borderRadius: 12,
                  padding: 16,
                  margin: '18px 0',
                }}
              >
                {props.title ? <h2>{props.title}</h2> : null}
                <div>{props.content}</div>
              </section>
            ),
            twoColumns: props => (
              <section
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 16,
                  margin: '18px 0',
                }}
              >
                <div>{props.left}</div>
                <div>{props.right}</div>
              </section>
            ),
            callToAction: props => (
              <section
                style={{
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: 12,
                  padding: 18,
                  margin: '18px 0',
                }}
              >
                <p style={{ margin: 0 }}>{props.text}</p>
                <a
                  href={props.buttonHref || '#'}
                  style={{
                    display: 'inline-block',
                    marginTop: 12,
                    borderRadius: 8,
                    background: '#2563eb',
                    color: 'white',
                    textDecoration: 'none',
                    padding: '8px 12px',
                  }}
                >
                  {props.buttonLabel || 'Learn more'}
                </a>
              </section>
            ),
            imageBlock: props => (
              <figure style={{ margin: '20px 0' }}>
                <img
                  src={props.image}
                  alt={props.alt || ''}
                  style={{ width: '100%', borderRadius: 16 }}
                />
                {props.caption ? (
                  <figcaption style={{ color: '#475569', marginTop: 10 }}>
                    {props.caption}
                  </figcaption>
                ) : null}
              </figure>
            ),
            videoBlock: props => (
              <figure style={{ margin: '20px 0' }}>
                <video
                  controls
                  poster={props.poster || undefined}
                  src={props.video}
                  style={{ width: '100%', borderRadius: 16, background: '#020617' }}
                />
                {props.caption ? (
                  <figcaption style={{ color: '#475569', marginTop: 10 }}>
                    {props.caption}
                  </figcaption>
                ) : null}
              </figure>
            ),
            fileBlock: props => (
              <section
                style={{
                  margin: '20px 0',
                  padding: 16,
                  border: '1px solid #dbeafe',
                  borderRadius: 12,
                  background: '#f8fbff',
                }}
              >
                <a
                  href={props.file}
                  style={{ color: '#1d4ed8', fontWeight: 700, textDecoration: 'none' }}
                >
                  {props.label || 'Download file'}
                </a>
                {props.description ? (
                  <p style={{ marginBottom: 0 }}>{props.description}</p>
                ) : null}
              </section>
            ),
          }}
        />
      </div>
    </main>
  );
}
