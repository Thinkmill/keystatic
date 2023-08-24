import { createReader } from '@keystatic/core/reader';
import keystaticConfig, { readerPath } from '../../keystatic.config';

export const reader = createReader(readerPath, keystaticConfig);

export async function getNavigationMap() {
  const navigation = await reader.singletons.navigation.read();
  const pages = await reader.collections.pages.all();

  const pagesBySlug = Object.fromEntries(pages.map(page => [page.slug, page]));

  const navigationMap = navigation?.navGroups.map(({ groupName, items }) => ({
    groupName,
    items: items.map(({ label, link }) => {
      const { discriminant, value } = link;
      const page = discriminant === 'page' && value ? pagesBySlug[value] : null;
      const url = discriminant === 'url' ? value : `/docs/${page?.slug}`;

      return {
        label: label || page?.entry.title || '',
        href: url || '',
        title: page?.entry.title,
        comingSoon: discriminant === 'coming-soon',
      };
    }),
  }));

  return navigationMap;
}
