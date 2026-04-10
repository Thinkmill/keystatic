import '../styles.css';
import type { CSSProperties } from 'react';
import { reader } from '../reader';
import {
  getPageSlug,
  normalizePageSlug,
} from '../../page-builder';

export default async function Post(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const { slug } = params;
  const normalizedSlug = normalizePageSlug(slug);

  const pages = (await reader.singletons.pages.read())?.items ?? [];
  const homepage = pages.find(page => page.isHomepage) ?? pages[0];
  const homepageSlug = homepage
    ? normalizePageSlug(getPageSlug(homepage.slug))
    : undefined;
  if (homepageSlug && normalizedSlug === homepageSlug) {
    return <div>Page not found!</div>;
  }
  const page = pages.find(
    page => normalizePageSlug(getPageSlug(page.slug)) === normalizedSlug
  );

  if (page) {
    return (
      <main style={{ maxWidth: 1240, margin: '0 auto', padding: '56px 32px' }}>
        <h1 style={{ marginBottom: 24 }}>{page.title}</h1>
        {(page.blocks ?? []).map((block: any, index: number) => {
          const key = `${block.discriminant}-${index}`;
          switch (block.discriminant) {
            case 'hero':
              return (
                <section
                  key={key}
                  style={{
                    margin: '56px 0',
                    padding: '64px 48px',
                    borderRadius: 24,
                    color: '#0f172a',
                    background: block.value.backgroundImage
                      ? `linear-gradient(rgba(255,255,255,0.9), rgba(255,255,255,0.9)), url(${block.value.backgroundImage}) center/cover`
                      : 'linear-gradient(135deg, #dbeafe, #ecfeff)',
                  }}
                >
                  {block.value.eyebrow ? (
                    <p style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                      {block.value.eyebrow}
                    </p>
                  ) : null}
                  <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.2rem)', margin: '8px 0 12px' }}>
                    {block.value.heading}
                  </h2>
                  {block.value.subheading ? (
                    <p style={{ lineHeight: 1.85, maxWidth: 820 }}>{block.value.subheading}</p>
                  ) : null}
                  <div style={{ display: 'flex', gap: 12, marginTop: 24, flexWrap: 'wrap' }}>
                    {block.value.primaryCtaLabel ? (
                      <a href={block.value.primaryCtaHref || '#'} style={buttonPrimary}>
                        {block.value.primaryCtaLabel}
                      </a>
                    ) : null}
                    {block.value.secondaryCtaLabel ? (
                      <a href={block.value.secondaryCtaHref || '#'} style={buttonSecondary}>
                        {block.value.secondaryCtaLabel}
                      </a>
                    ) : null}
                  </div>
                </section>
              );
            case 'content':
              return (
                <section key={key} style={{ margin: '48px 0' }}>
                  {block.value.eyebrow ? (
                    <p style={{ textTransform: 'uppercase', color: '#64748b' }}>
                      {block.value.eyebrow}
                    </p>
                  ) : null}
                  {block.value.heading ? <h2>{block.value.heading}</h2> : null}
                  <p style={{ lineHeight: 1.8 }}>{block.value.body}</p>
                </section>
              );
            case 'image':
              return (
                <section key={key} style={{ margin: '48px 0' }}>
                  <img
                    src={block.value.image}
                    alt={block.value.alt || ''}
                    style={{ width: '100%', borderRadius: 16 }}
                  />
                  {block.value.caption ? <p>{block.value.caption}</p> : null}
                </section>
              );
            case 'videoHeader':
              return (
                <section key={key} style={{ margin: '56px 0' }}>
                  {block.value.video ? (
                    <video
                      controls
                      poster={block.value.poster || undefined}
                      src={block.value.video}
                      style={{ width: '100%', borderRadius: 20, background: '#020617' }}
                    />
                  ) : null}
                  {block.value.title ? <h2 style={{ marginTop: 20 }}>{block.value.title}</h2> : null}
                  {block.value.subtitle ? <p style={{ lineHeight: 1.85 }}>{block.value.subtitle}</p> : null}
                </section>
              );
            case 'imageWithText':
              return (
                <section
                  key={key}
                  style={{
                    margin: '56px 0',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 28,
                    alignItems: 'center',
                  }}
                >
                  <div style={{ order: block.value.imagePosition === 'right' ? 2 : 1 }}>
                    <img
                      src={block.value.image}
                      alt={block.value.alt || ''}
                      style={{ width: '100%', borderRadius: 16 }}
                    />
                  </div>
                  <div style={{ order: block.value.imagePosition === 'right' ? 1 : 2 }}>
                    {block.value.title ? <h2>{block.value.title}</h2> : null}
                    <p style={{ lineHeight: 1.8 }}>{block.value.content}</p>
                  </div>
                </section>
              );
            case 'file':
              return (
                <section key={key} style={{ margin: '48px 0', padding: 20, border: '1px solid #e2e8f0', borderRadius: 16 }}>
                  <a href={block.value.file}>
                    {block.value.label || 'Download file'}
                  </a>
                  {block.value.description ? <p>{block.value.description}</p> : null}
                </section>
              );
            case 'stats':
              return (
                <section key={key} style={{ margin: '56px 0' }}>
                  {block.value.title ? <h2>{block.value.title}</h2> : null}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 16 }}>
                    {(block.value.items ?? []).map((item: any, itemIndex: number) => (
                      <article key={`${key}-stat-${itemIndex}`} style={{ padding: 20, border: '1px solid #e2e8f0', borderRadius: 16 }}>
                        <div style={{ fontSize: 28, fontWeight: 700 }}>{item.value}</div>
                        <div style={{ color: '#64748b' }}>{item.label}</div>
                      </article>
                    ))}
                  </div>
                </section>
              );
            case 'testimonial':
              return (
                <section key={key} style={{ margin: '56px 0', padding: '28px 24px', border: '1px solid #e2e8f0', borderRadius: 18, background: '#f8fafc' }}>
                  <blockquote style={{ margin: 0, fontSize: 22, lineHeight: 1.7 }}>"{block.value.quote}"</blockquote>
                  <div style={{ marginTop: 18, display: 'flex', gap: 12, alignItems: 'center' }}>
                    {block.value.avatar ? (
                      <img src={block.value.avatar} alt={block.value.name || ''} style={{ width: 48, height: 48, borderRadius: 999 }} />
                    ) : null}
                    <div>
                      <div style={{ fontWeight: 600 }}>{block.value.name}</div>
                      <div style={{ color: '#64748b' }}>{block.value.role}</div>
                    </div>
                  </div>
                </section>
              );
            case 'spacer':
              return (
                <section
                  key={key}
                  style={{
                    height:
                      block.value.size === 'large'
                        ? 96
                        : block.value.size === 'small'
                          ? 32
                          : 64,
                  }}
                />
              );
            case 'featureGrid':
              return (
                <section key={key} style={{ margin: '56px 0' }}>
                  {block.value.title ? <h2>{block.value.title}</h2> : null}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 16 }}>
                    {(block.value.items ?? []).map((item: any, itemIndex: number) => (
                      <article key={`${key}-feature-${itemIndex}`} style={{ padding: 20, border: '1px solid #e2e8f0', borderRadius: 16 }}>
                        <h3 style={{ marginTop: 0 }}>{item.title}</h3>
                        <p style={{ marginBottom: 0, lineHeight: 1.7 }}>{item.description}</p>
                      </article>
                    ))}
                  </div>
                </section>
              );
            case 'faq':
              return (
                <section key={key} style={{ margin: '56px 0' }}>
                  {block.value.title ? <h2>{block.value.title}</h2> : null}
                  <div style={{ display: 'grid', gap: 12 }}>
                    {(block.value.items ?? []).map((item: any, itemIndex: number) => (
                      <article key={`${key}-faq-${itemIndex}`} style={{ padding: 18, border: '1px solid #e2e8f0', borderRadius: 14 }}>
                        <h3 style={{ marginTop: 0 }}>{item.question}</h3>
                        <p style={{ marginBottom: 0, lineHeight: 1.75 }}>{item.answer}</p>
                      </article>
                    ))}
                  </div>
                </section>
              );
            case 'logoCloud':
              return (
                <section key={key} style={{ margin: '56px 0' }}>
                  {block.value.title ? <h2>{block.value.title}</h2> : null}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 14 }}>
                    {(block.value.logos ?? []).map((item: any, itemIndex: number) => (
                      <article key={`${key}-logo-${itemIndex}`} style={{ padding: 14, border: '1px solid #e2e8f0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {item.logo ? (
                          <img src={item.logo} alt={item.name || ''} style={{ maxWidth: '100%', maxHeight: 34, objectFit: 'contain' }} />
                        ) : (
                          <span>{item.name}</span>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              );
            default:
              return null;
          }
        })}
      </main>
    );
  }

  return <div>Page not found!</div>;
}

const buttonPrimary: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 16px',
  background: '#0f172a',
  color: '#fff',
  borderRadius: 10,
  textDecoration: 'none',
  fontWeight: 600,
};

const buttonSecondary: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 16px',
  background: '#ffffff',
  color: '#0f172a',
  border: '1px solid #cbd5e1',
  borderRadius: 10,
  textDecoration: 'none',
  fontWeight: 600,
};

export async function generateStaticParams() {
  const pages = (await reader.singletons.pages.read())?.items ?? [];
  const homepage = pages.find(page => page.isHomepage) ?? pages[0];
  const homepageSlug = homepage
    ? normalizePageSlug(getPageSlug(homepage.slug))
    : undefined;
  const pageSlugs = pages.map(page => ({
    slug: normalizePageSlug(getPageSlug(page.slug)),
  }));
  return pageSlugs.filter(page => page.slug !== homepageSlug);
}
