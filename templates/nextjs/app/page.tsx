import { reader } from './reader';
import './styles.css';
import { getPageSlug, normalizePageSlug } from '../page-builder';

export default async function Homepage() {
  const pages = (await reader.singletons.pages.read())?.items ?? [];
  const homepage = pages.find(page => page.isHomepage) ?? pages[0];

  if (!homepage) {
    return <div>No homepage configured.</div>;
  }

  return (
    <main style={{ maxWidth: 1240, margin: '0 auto', padding: '56px 32px' }}>
      <h1 style={{ marginBottom: 24 }}>{homepage.title}</h1>
      {(homepage.blocks ?? []).map((block: any, index: number) => {
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
              </section>
            );
          case 'content':
            return (
              <section key={key} style={{ margin: '48px 0' }}>
                {block.value.heading ? <h2>{block.value.heading}</h2> : null}
                <p style={{ lineHeight: 1.8 }}>{block.value.body}</p>
              </section>
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
