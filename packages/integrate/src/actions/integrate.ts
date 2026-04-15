import fs from 'node:fs';
import path from 'node:path';
import { confirm, isCancel, log, spinner } from '@clack/prompts';
import { Context } from '..';
import {
  cancelStep,
  getInstallCommand,
  installRuntimeDependencies,
} from '../utils';

function toPosixPath(value: string) {
  return value.replaceAll('\\', '/');
}

function routeConfigImportPath(appDir: Context['appDir']) {
  return appDir === 'app'
    ? '../../../../keystatic.config'
    : '../../../../../keystatic.config';
}

function uiConfigImportPath(appDir: Context['appDir']) {
  return appDir === 'app' ? '../../keystatic.config' : '../../../keystatic.config';
}

function pageBuilderImportFromAppRoot(appDir: Context['appDir']) {
  return appDir === 'app' ? '../page-builder' : '../../page-builder';
}

function pageBuilderImportFromSlugPage(appDir: Context['appDir']) {
  return appDir === 'app' ? '../../page-builder' : '../../../page-builder';
}

function configImportFromReader(appDir: Context['appDir']) {
  return appDir === 'app' ? '../keystatic.config' : '../../keystatic.config';
}

function configImportFromPostsPage(appDir: Context['appDir']) {
  return appDir === 'app' ? '../../../keystatic.config' : '../../../../keystatic.config';
}

function pageBuilderImportFromHomePage(
  appDir: Context['appDir'],
  placement: 'root' | 'preview'
) {
  if (placement === 'root') {
    return pageBuilderImportFromAppRoot(appDir);
  }
  return appDir === 'app' ? '../../page-builder' : '../../../page-builder';
}

function pageBuilderImportFromSlugRoute(
  appDir: Context['appDir'],
  placement: 'root' | 'preview'
) {
  if (placement === 'root') {
    return pageBuilderImportFromSlugPage(appDir);
  }
  return appDir === 'app' ? '../../../page-builder' : '../../../../page-builder';
}

function configImportFromPostsRoute(
  appDir: Context['appDir'],
  placement: 'root' | 'preview'
) {
  if (placement === 'root') {
    return configImportFromPostsPage(appDir);
  }
  return appDir === 'app' ? '../../../../keystatic.config' : '../../../../../keystatic.config';
}

function getKeystaticConfigTemplate() {
  return `import { config, collection, fields, singleton } from '@itgkey/core';
import { customPageBlocks } from './itgkey-blocks';

export const markdocConfig = fields.markdoc.createMarkdocConfig({});

const basePageBlocks = {
  hero: {
    label: 'Hero',
    schema: fields.object({
      eyebrow: fields.text({ label: 'Eyebrow' }),
      heading: fields.text({ label: 'Heading' }),
      subheading: fields.text({ label: 'Subheading', multiline: true }),
      primaryCtaLabel: fields.text({ label: 'Primary CTA label' }),
      primaryCtaHref: fields.text({ label: 'Primary CTA href' }),
      secondaryCtaLabel: fields.text({ label: 'Secondary CTA label' }),
      secondaryCtaHref: fields.text({ label: 'Secondary CTA href' }),
    }),
  },
  content: {
    label: 'Content',
    schema: fields.object({
      heading: fields.text({ label: 'Heading' }),
      body: fields.text({ label: 'Body', multiline: true }),
    }),
  },
  image: {
    label: 'Image',
    schema: fields.object({
      image: fields.image({
        label: 'Image',
        directory: 'public/page-builder/images',
        publicPath: '/page-builder/images/',
      }),
      alt: fields.text({ label: 'Alt text' }),
      caption: fields.text({ label: 'Caption', multiline: true }),
    }),
  },
  featureGrid: {
    label: 'Feature Grid',
    schema: fields.object({
      title: fields.text({ label: 'Title' }),
      items: fields.array(
        fields.object({
          title: fields.text({ label: 'Item title' }),
          description: fields.text({ label: 'Description', multiline: true }),
        }),
        {
          label: 'Features',
          itemLabel: props => props.fields.title.value || 'Feature',
        }
      ),
    }),
  },
  faq: {
    label: 'FAQ',
    schema: fields.object({
      title: fields.text({ label: 'Title' }),
      items: fields.array(
        fields.object({
          question: fields.text({ label: 'Question' }),
          answer: fields.text({ label: 'Answer', multiline: true }),
        }),
        {
          label: 'FAQ items',
          itemLabel: props => props.fields.question.value || 'Question',
        }
      ),
    }),
  },
};

const pageBlocks = {
  ...basePageBlocks,
  ...customPageBlocks,
};

export default config({
  storage: { kind: 'local' },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.markdoc({ label: 'Content' }),
      },
    }),
  },
  singletons: {
    settings: singleton({
      label: 'Settings',
      path: 'settings/index',
      schema: {
        navigation: fields.array(
          fields.object({
            label: fields.text({ label: 'Label' }),
            slug: fields.text({
              label: 'Page slug',
              description: 'Use the same slug as the page route, without leading slash.',
            }),
            visible: fields.checkbox({
              label: 'Visible in navigation',
              defaultValue: true,
            }),
          }),
          {
            label: 'Navigation',
            itemLabel: props =>
              props.fields.label.value || props.fields.slug.value || 'Navigation item',
          }
        ),
      },
    }),
    pages: singleton({
      label: 'Pages',
      path: 'pages/index',
      schema: {
        items: fields.array(
          fields.object({
            title: fields.text({ label: 'Title' }),
            isHomepage: fields.checkbox({
              label: 'Use as homepage (/)',
              defaultValue: false,
            }),
            slug: fields.slug({ name: { label: 'Slug' } }),
            blocks: fields.blocks(pageBlocks, {
              label: 'Page blocks',
            }),
          }),
          {
            label: 'Pages',
            itemLabel: props =>
              props.fields.title.value ||
              props.fields.slug.value.slug ||
              'Untitled page',
          }
        ),
      },
    }),
  },
});
`;
}

function getPageBuilderTemplate() {
  return `export function normalizePageSlug(slug: string) {
  return slug.replace(/^\\/+|\\/+$/g, '');
}

export function getPageSlug(
  slug: string | { name?: string; slug: string } | null | undefined
) {
  if (!slug) {
    return '';
  }
  return typeof slug === 'string' ? slug : slug.slug;
}
`;
}

function getCustomBlocksTemplate() {
  return `import { fields } from '@itgkey/core';

// Add your own reusable blocks here.
// These blocks are merged into the page builder schema via keystatic.config.ts.
export const customPageBlocks = {
  // exampleBanner: {
  //   label: 'Example Banner',
  //   schema: fields.object({
  //     title: fields.text({ label: 'Title' }),
  //     subtitle: fields.text({ label: 'Subtitle', multiline: true }),
  //   }),
  // },
};
`;
}

function getMigrationAgentPromptTemplate(appDir: Context['appDir']) {
  const appRoot = appDir;
  return `# itgkey migration agent prompt

Use this prompt in your coding agent to migrate existing frontend pages into the itgkey block system.

## Objective

Migrate existing pages without breaking current routes.

## Required behavior

1. Keep existing routes working.
2. Reuse existing UI components where possible.
3. Convert legacy page sections into block-compatible data.
4. Add responsive rendering for migrated blocks.
5. Add any missing custom blocks to ./itgkey-blocks.ts.
6. Do NOT hardcode user-visible marketing/site copy in components.
7. For each title/text/label/CTA currently visible on the site, create or map a CMS field and read it from Keystatic data.
8. Keep hardcoded text only for safe technical fallbacks like "Page not found".
9. Treat every distinct frontend component/section as a separate block.
10. Do not merge unrelated components into one large generic block.

## Project paths

- App root: ./${appRoot}
- Responsive helper: ./${appRoot}/itgkey-responsive.tsx
- Preview routes: ./${appRoot}/itgkey-preview
- Keystatic config: ./keystatic.config.ts
- Custom blocks: ./itgkey-blocks.ts
- Agent prompt: ./.github/prompts/itgkey-migration-agent.prompt.md

## Migration plan

1. Inspect existing pages and identify reusable section/component patterns.
2. Create a field-mapping table from current UI copy -> CMS fields (title, body, labels, CTA text/links, FAQ items, etc).
3. Define additional blocks in ./itgkey-blocks.ts for those patterns, one component per block.
4. Ensure each mapped field is stored in Keystatic schemas and read at runtime.
5. Replace hardcoded content in migrated components with CMS-backed values.
6. Extend render logic in ./${appRoot}/render-page.tsx for new block types.
7. Map legacy section data through renderLegacyResponsiveSections or a custom adapter.
8. Verify routes:
  - /keystatic
  - /itgkey-preview
  - /itgkey-preview/[slug]

## Test checklist (required)

After migration changes, run these checks and only finish when they pass:

1. Start app and verify no compile errors.
2. Open and verify these pages return successfully (not 404/500):
  - /
  - /keystatic
  - /itgkey-preview
  - /itgkey-preview/[slug] (use one real slug)
3. Open at least one existing legacy page route and verify it still works.
4. In /keystatic, edit at least one migrated block field and verify the frontend reflects the updated value.

## Content rule

- Every user-facing page string must be editable from the CMS after migration.
- If an existing page has a static heading/paragraph/button text today, move it into block fields so editors can change it in Keystatic.
3. Extend render logic in ./${appRoot}/render-page.tsx for new block types.
4. Map legacy section data through renderLegacyResponsiveSections or a custom adapter.
5. Verify routes:
   - /keystatic
   - /itgkey-preview
   - /itgkey-preview/[slug]

## Done when

- Existing pages still work.
- Migrated pages render through the block system.
- New blocks are editable from /keystatic pages singleton.
`;
}

function getApiRouteTemplate(appDir: Context['appDir']) {
  return `import { makeRouteHandler } from '@itgkey/next/route-handler';
import keystaticConfig from '${routeConfigImportPath(appDir)}';

export const { POST, GET } = makeRouteHandler({
  config: keystaticConfig,
});
`;
}

function getReaderTemplate(appDir: Context['appDir']) {
  return `import { createReader } from '@itgkey/core/reader';
import keystaticConfig from '${configImportFromReader(appDir)}';

export const reader = createReader(process.cwd(), keystaticConfig);
`;
}

function getFrontendNavTemplate() {
  return `'use client';

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
        <Link href='/' style={{ fontWeight: 700, marginRight: 6 }}>
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
`;
}

function getStylesTemplate() {
  return `html {
  max-width: 100vw;
  padding: 0;
  margin: 0;
  font-size: 1rem;
  font-family: sans-serif;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 1rem 0 1rem;
}

p,
ul,
ol {
  margin-bottom: 1rem;
  color: #1d1d1d;
}

img {
  height: auto;
  max-width: 100%;
}
`;
}

function getRenderPageTemplate() {
  return `import type { CSSProperties, ReactNode } from 'react';

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

export function renderPageBlocks(blocks: any[]): ReactNode[] {
  return (blocks || []).map((block: any, index: number) => {
    const key = block.discriminant + '-' + index;
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
              background: 'linear-gradient(135deg, #dbeafe, #ecfeff)',
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
      case 'featureGrid':
        return (
          <section key={key} style={{ margin: '56px 0' }}>
            {block.value.title ? <h2>{block.value.title}</h2> : null}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 16 }}>
              {(block.value.items ?? []).map((item: any, itemIndex: number) => (
                <article key={key + '-feature-' + itemIndex} style={{ padding: 20, border: '1px solid #e2e8f0', borderRadius: 16 }}>
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
                <article key={key + '-faq-' + itemIndex} style={{ padding: 18, border: '1px solid #e2e8f0', borderRadius: 14 }}>
                  <h3 style={{ marginTop: 0 }}>{item.question}</h3>
                  <p style={{ marginBottom: 0, lineHeight: 1.75 }}>{item.answer}</p>
                </article>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  });
}
`;
}

function getRootLayoutTemplate(appDir: Context['appDir']) {
  return `import type { ReactNode } from 'react';
import { reader } from './reader';
import { FrontendNav } from './FrontendNav';
import { getPageSlug, normalizePageSlug } from '${pageBuilderImportFromAppRoot(appDir)}';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const pages = (await reader.singletons.pages.read())?.items ?? [];
  const settings = await reader.singletons.settings.read().catch(() => null);
  const pageMap = new Map(
    pages.map(page => [normalizePageSlug(getPageSlug(page.slug)), page.title])
  );

  const navItems =
    settings?.navigation
      ?.filter(item => item.visible && pageMap.has(normalizePageSlug(item.slug)))
      .map(item => {
        const slug = normalizePageSlug(item.slug);
        return {
          href: '/' + slug,
          label: item.label || pageMap.get(slug) || slug,
        };
      }) ?? [];

  return (
    <html lang='en'>
      <body>
        <FrontendNav items={navItems} />
        {children}
      </body>
    </html>
  );
}
`;
}

function getHomePageTemplate(
  appDir: Context['appDir'],
  placement: 'root' | 'preview'
) {
  return `import './styles.css';
import { reader } from './reader';
import { renderPageBlocks } from './render-page';
import { getPageSlug, normalizePageSlug } from '${pageBuilderImportFromHomePage(appDir, placement)}';

export default async function Homepage() {
  const pages = (await reader.singletons.pages.read())?.items ?? [];
  const homepage = pages.find(page => page.isHomepage) ?? pages[0];

  if (!homepage) {
    return <div>No homepage configured.</div>;
  }

  const normalizedSlug = normalizePageSlug(getPageSlug(homepage.slug));

  return (
    <main style={{ maxWidth: 1240, margin: '0 auto', padding: '56px 32px' }}>
      <h1 style={{ marginBottom: 24 }}>{homepage.title}</h1>
      {renderPageBlocks(homepage.blocks ?? [])}
      <p style={{ color: '#64748b', marginTop: 40 }}>
        Homepage slug: {normalizedSlug || '/'}
      </p>
    </main>
  );
}
`;
}

function getSlugPageTemplate(
  appDir: Context['appDir'],
  placement: 'root' | 'preview'
) {
  return `import '../styles.css';
import { reader } from '../reader';
import { renderPageBlocks } from '../render-page';
import { getPageSlug, normalizePageSlug } from '${pageBuilderImportFromSlugRoute(appDir, placement)}';

export default async function PageBySlug(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const normalizedSlug = normalizePageSlug(params.slug);

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

  if (!page) {
    return <div>Page not found!</div>;
  }

  return (
    <main style={{ maxWidth: 1240, margin: '0 auto', padding: '56px 32px' }}>
      <h1 style={{ marginBottom: 24 }}>{page.title}</h1>
      {renderPageBlocks(page.blocks ?? [])}
    </main>
  );
}

export async function generateStaticParams() {
  const pages = (await reader.singletons.pages.read())?.items ?? [];
  const homepage = pages.find(page => page.isHomepage) ?? pages[0];
  const homepageSlug = homepage
    ? normalizePageSlug(getPageSlug(homepage.slug))
    : undefined;

  const slugs = pages
    .map(page => normalizePageSlug(getPageSlug(page.slug)))
    .filter(Boolean)
    .filter(slug => slug !== homepageSlug);

  return slugs.map(slug => ({ slug }));
}
`;
}

function getPostsPageTemplate(
  appDir: Context['appDir'],
  placement: 'root' | 'preview'
) {
  return `import '../../styles.css';
import React from 'react';
import Markdoc from '@markdoc/markdoc';
import { reader } from '../../reader';
import { markdocConfig } from '${configImportFromPostsRoute(appDir, placement)}';

export default async function PostPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const post = await reader.collections.posts.read(slug);

  if (!post) {
    return <div>Post not found!</div>;
  }

  const { node } = await post.content();
  const errors = Markdoc.validate(node, markdocConfig);
  if (errors.length) {
    console.error(errors);
    throw new Error('Invalid content');
  }

  const renderable = Markdoc.transform(node, markdocConfig);

  return (
    <main style={{ maxWidth: 920, margin: '0 auto', padding: '40px 20px' }}>
      <h1>{post.title}</h1>
      {Markdoc.renderers.react(renderable, React)}
    </main>
  );
}

export async function generateStaticParams() {
  const slugs = await reader.collections.posts.list();
  return slugs.map(slug => ({ slug }));
}
`;
}

function getResponsiveAdapterTemplate() {
  return `import { renderPageBlocks } from './render-page';

export type LegacySection =
  | {
      type: 'hero';
      eyebrow?: string;
      heading: string;
      subheading?: string;
      primaryCtaLabel?: string;
      primaryCtaHref?: string;
      secondaryCtaLabel?: string;
      secondaryCtaHref?: string;
    }
  | {
      type: 'content';
      heading: string;
      body: string;
    }
  | {
      type: 'featureGrid';
      title: string;
      items: { title: string; description: string }[];
    }
  | {
      type: 'faq';
      title: string;
      items: { question: string; answer: string }[];
    }
  | {
      type: 'image';
      image: string;
      alt?: string;
      caption?: string;
    };

export function legacySectionsToBlocks(sections: LegacySection[]) {
  return sections.map(section => {
    if (section.type === 'hero') {
      return {
        discriminant: 'hero',
        value: {
          eyebrow: section.eyebrow || '',
          heading: section.heading,
          subheading: section.subheading || '',
          primaryCtaLabel: section.primaryCtaLabel || '',
          primaryCtaHref: section.primaryCtaHref || '',
          secondaryCtaLabel: section.secondaryCtaLabel || '',
          secondaryCtaHref: section.secondaryCtaHref || '',
        },
      };
    }

    if (section.type === 'content') {
      return {
        discriminant: 'content',
        value: {
          heading: section.heading,
          body: section.body,
        },
      };
    }

    if (section.type === 'featureGrid') {
      return {
        discriminant: 'featureGrid',
        value: {
          title: section.title,
          items: section.items,
        },
      };
    }

    if (section.type === 'faq') {
      return {
        discriminant: 'faq',
        value: {
          title: section.title,
          items: section.items,
        },
      };
    }

    return {
      discriminant: 'image',
      value: {
        image: section.image,
        alt: section.alt || '',
        caption: section.caption || '',
      },
    };
  });
}

export function renderLegacyResponsiveSections(sections: LegacySection[]) {
  return renderPageBlocks(legacySectionsToBlocks(sections));
}
`;
}

function getPagesSeedTemplate() {
  return `items:
  - title: Home
    isHomepage: true
    slug:
      name: Home
      slug: home
    blocks:
      - discriminant: hero
        value:
          eyebrow: itgkey page builder
          heading: Build pages with reusable blocks
          subheading: Edit this page in /keystatic under the Pages singleton.
          primaryCtaLabel: Open Admin UI
          primaryCtaHref: /keystatic
      - discriminant: content
        value:
          heading: Add pages
          body: Create and reorder blocks, then add more pages in the same singleton.
      - discriminant: featureGrid
        value:
          title: Starter features
          items:
            - title: Block-based pages
              description: Compose visual sections from schema-defined blocks.
            - title: File-backed content
              description: Content is stored as files in your repository.
            - title: Dynamic routes
              description: New pages are served automatically by slug.
`;
}

function getSettingsSeedTemplate() {
  return `navigation:
  - label: Home
    slug: home
    visible: true
`;
}

function getFirstPostSeedTemplate() {
  return `---
title: First post
---
Welcome to your itgkey starter.

Open /keystatic to edit this post or create new content.
`;
}

function getKeystaticPageTemplate(appDir: Context['appDir']) {
  return `'use client';

import { makePage } from '@itgkey/next/ui/app';
import config from '${uiConfigImportPath(appDir)}';

export default makePage(config);
`;
}

function getLayoutTemplate() {
  return `import KeystaticApp from './keystatic';

export default function RootLayout() {
  return <KeystaticApp />;
}
`;
}

function getCatchAllTemplate() {
  return `export default function Page() {
  return null;
}
`;
}

async function writeWithPrompt(
  ctx: Context,
  filePath: string,
  content: string
): Promise<void> {
  const relPath = toPosixPath(path.relative(ctx.projectDir, filePath));
  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    const overwrite = await confirm({
      message: `${relPath} already exists. Overwrite it?`,
      initialValue: false,
    });

    if (isCancel(overwrite)) cancelStep();
    if (!overwrite) {
      ctx.skippedFiles.push(relPath);
      return;
    }
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');

  if (fileExists) {
    ctx.overwrittenFiles.push(relPath);
  } else {
    ctx.createdFiles.push(relPath);
  }
}

export const integrate = async (ctx: Context) => {
  const spin = spinner();
  const appRoot = path.join(ctx.projectDir, ...ctx.appDir.split('/'));
  const previewRoot = path.join(appRoot, 'itgkey-preview');

  spin.start('Adding itgkey files...');

  await writeWithPrompt(
    ctx,
    path.join(ctx.projectDir, 'keystatic.config.ts'),
    getKeystaticConfigTemplate()
  );
  await writeWithPrompt(
    ctx,
    path.join(ctx.projectDir, 'page-builder.ts'),
    getPageBuilderTemplate()
  );
  await writeWithPrompt(
    ctx,
    path.join(ctx.projectDir, 'itgkey-blocks.ts'),
    getCustomBlocksTemplate()
  );
  await writeWithPrompt(
    ctx,
    path.join(
      ctx.projectDir,
      '.github',
      'prompts',
      'itgkey-migration-agent.prompt.md'
    ),
    getMigrationAgentPromptTemplate(ctx.appDir)
  );
  await writeWithPrompt(
    ctx,
    path.join(appRoot, 'api', 'keystatic', '[...params]', 'route.ts'),
    getApiRouteTemplate(ctx.appDir)
  );
  await writeWithPrompt(
    ctx,
    path.join(appRoot, 'keystatic', 'keystatic.tsx'),
    getKeystaticPageTemplate(ctx.appDir)
  );
  await writeWithPrompt(
    ctx,
    path.join(appRoot, 'keystatic', 'layout.tsx'),
    getLayoutTemplate()
  );
  await writeWithPrompt(
    ctx,
    path.join(appRoot, 'keystatic', '[[...params]]', 'page.tsx'),
    getCatchAllTemplate()
  );
  await writeWithPrompt(
    ctx,
    path.join(appRoot, 'reader.ts'),
    getReaderTemplate(ctx.appDir)
  );
  await writeWithPrompt(
    ctx,
    path.join(appRoot, 'FrontendNav.tsx'),
    getFrontendNavTemplate()
  );
  await writeWithPrompt(
    ctx,
    path.join(appRoot, 'render-page.tsx'),
    getRenderPageTemplate()
  );

  if (ctx.routeMode === 'replace') {
    await writeWithPrompt(
      ctx,
      path.join(appRoot, 'layout.tsx'),
      getRootLayoutTemplate(ctx.appDir)
    );
    await writeWithPrompt(
      ctx,
      path.join(appRoot, 'page.tsx'),
      getHomePageTemplate(ctx.appDir, 'root')
    );
    await writeWithPrompt(
      ctx,
      path.join(appRoot, '[slug]', 'page.tsx'),
      getSlugPageTemplate(ctx.appDir, 'root')
    );
    await writeWithPrompt(
      ctx,
      path.join(appRoot, 'posts', '[slug]', 'page.tsx'),
      getPostsPageTemplate(ctx.appDir, 'root')
    );
  } else {
    await writeWithPrompt(
      ctx,
      path.join(appRoot, 'itgkey-responsive.tsx'),
      getResponsiveAdapterTemplate()
    );
    await writeWithPrompt(
      ctx,
      path.join(previewRoot, 'page.tsx'),
      getHomePageTemplate(ctx.appDir, 'preview')
    );
    await writeWithPrompt(
      ctx,
      path.join(previewRoot, '[slug]', 'page.tsx'),
      getSlugPageTemplate(ctx.appDir, 'preview')
    );
    await writeWithPrompt(
      ctx,
      path.join(previewRoot, 'posts', '[slug]', 'page.tsx'),
      getPostsPageTemplate(ctx.appDir, 'preview')
    );
  }

  await writeWithPrompt(
    ctx,
    path.join(appRoot, 'styles.css'),
    getStylesTemplate()
  );
  await writeWithPrompt(
    ctx,
    path.join(ctx.projectDir, 'pages', 'index.yaml'),
    getPagesSeedTemplate()
  );
  await writeWithPrompt(
    ctx,
    path.join(ctx.projectDir, 'settings', 'index.yaml'),
    getSettingsSeedTemplate()
  );
  await writeWithPrompt(
    ctx,
    path.join(ctx.projectDir, 'posts', 'first-post.mdoc'),
    getFirstPostSeedTemplate()
  );

  if (ctx.installDependencies) {
    spin.stop('Files added.');
    spin.start('Installing dependencies...');
    const ok = installRuntimeDependencies(ctx.packageManager, ctx.projectDir);
    ctx.installStatus = ok ? 'installed' : 'failed';
    if (!ok) {
      log.warn('Automatic dependency install failed. You can run it manually.');
    }
  } else {
    ctx.installStatus = 'skipped';
  }

  spin.stop('Integration complete.');

  if (ctx.installStatus !== 'installed') {
    const cmd = getInstallCommand(ctx.packageManager).pretty;
    log.info(`Run manually: ${cmd}`);
  }
}
