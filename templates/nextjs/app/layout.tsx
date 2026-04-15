import type { ReactNode } from 'react';
import { reader } from './reader';
import { getPageSlug, normalizePageSlug } from '../page-builder';
import { FrontendNav } from './FrontendNav';

export default async function RootLayout({ children }: { children: ReactNode }) {
  const pages = (await reader.singletons.pages.read())?.items ?? [];
  const settings = await reader.singletons.settings.read().catch(() => null);
  const pageMap = new Map(
    pages.map(page => [normalizePageSlug(getPageSlug(page.slug)), page.title])
  );
  const navItems =
    settings?.navigation
      ?.filter(
        item =>
          item.visible &&
          pageMap.has(normalizePageSlug(getPageSlug(item.slug as any)))
      )
      .map(item => {
        const slug = normalizePageSlug(getPageSlug(item.slug as any));
        return {
          href: slug ? `/${slug}` : '/',
          label: item.title || pageMap.get(slug) || slug,
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
