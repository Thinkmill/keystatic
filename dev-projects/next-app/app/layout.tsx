import { createReader } from '@keystatic/core/reader';
import { ReactNode } from 'react';
import localConfig from '../keystatic.config';
import { FrontendNav } from './FrontendNav';

function normalizeSlug(slug: string) {
  return slug.replace(/^\/+|\/+$/g, '');
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const reader = createReader(process.cwd(), localConfig);
  const pages = (await reader.singletons.pages.read())?.items ?? [];
  const settings = await reader.singletons.settings.read().catch(() => null);
  const pageMap = new Map(
    pages.map(page => [normalizeSlug(page.slug.slug), page.title])
  );
  const navItems =
    settings?.navigation
      ?.filter(item => item.visible && pageMap.has(normalizeSlug(item.slug)))
      .map(item => {
        const slug = normalizeSlug(item.slug);
        return {
          href: `/${slug}`,
          label: item.label || pageMap.get(slug) || slug,
        };
      }) ?? [];

  return (
    <html lang="en">
      <body>
        <FrontendNav items={navItems} />
        {children}
      </body>
    </html>
  );
}
