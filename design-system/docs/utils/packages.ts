import path from 'path';
import { categories, Category } from './categories';
import { SidebarItem } from '../components/sidebar';
import { SidebarLink } from '../components/sidebar/types';
import { createReader, Reader } from '@keystatic/core/reader';
import keystaticConfig from '../keystatic.config';

export const projectDir = path.resolve(process.cwd(), '..');

export const reader: Reader<(typeof keystaticConfig)['collections'], {}> =
  createReader(path.resolve(process.cwd(), '../..'), keystaticConfig);

export async function getNavigation(): Promise<SidebarItem[]> {
  const packageDocs = await reader.collections.packageDocs.all();
  const categoryToLinks = new Map<Category, SidebarLink[]>(
    categories.map(x => [x, []])
  );
  for (const { entry: info, slug } of packageDocs) {
    const items = categoryToLinks.get(info.category)!;
    items.push({
      name: info.title,
      href: '/package/' + slug.replace(/\/docs/, '').replace(/\/index$/, ''),
    });
  }

  const items: SidebarItem[] = [];
  for (const [name, children] of categoryToLinks) {
    items.push({
      name,
      children: children.sort((a, b) => a.href.localeCompare(b.href)),
    });
  }

  return items;
}
