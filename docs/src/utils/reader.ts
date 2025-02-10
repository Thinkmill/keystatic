import { createReader, Reader } from '@keystatic/core/reader';
import keystaticConfig from '../../keystatic.config';
import { cache } from 'react';

export const reader = cache(
  (): Reader<
    (typeof keystaticConfig)['collections'],
    (typeof keystaticConfig)['singletons']
  > => createReader(process.cwd(), keystaticConfig)
);

export async function getNavigationMap() {
  const navigation = await reader().singletons.navigation.read();
  const pages = await reader().collections.pages.all();

  const pagesBySlug = Object.fromEntries(pages.map(page => [page.slug, page]));

  const navigationMap = navigation?.navGroups.map(({ groupName, items }) => ({
    groupName,
    items: items.map(({ label, link, status }) => {
      const { discriminant, value } = link;
      const page = discriminant === 'page' && value ? pagesBySlug[value] : null;
      const url = discriminant === 'url' ? value : `/docs/${page?.slug}`;

      return {
        label: label || page?.entry.title || '',
        href: url || '',
        title: page?.entry.title,
        comingSoon: discriminant === 'coming-soon',
        status,
      };
    }),
  }));

  return navigationMap;
}
