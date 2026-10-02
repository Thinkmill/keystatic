import { expect, test } from 'vitest';
import { fields } from '../form/api';
import { getSlugForNewItem } from './utils';

const schema = {
  title: fields.slug({ name: { label: 'Title' } }),
  publishDate: fields.text({ label: 'Publish Date' }),
};

test('getSlugForNewItem falls back to the slugField value when no computeSlug is set', () => {
  const collectionConfig = { slugField: 'title', schema };
  const state = {
    title: { name: 'Hello World', slug: 'hello-world' },
    publishDate: '2026-09-09',
  };
  expect(getSlugForNewItem(collectionConfig, state)).toBe('hello-world');
});

test('getSlugForNewItem uses computeSlug when set, ignoring the slugField value', () => {
  const collectionConfig = {
    slugField: 'title',
    schema,
    computeSlug: (fields: Record<string, unknown>) =>
      `${fields.publishDate}/${(fields.title as { slug: string }).slug}`,
  };
  const state = {
    title: { name: 'Hello World', slug: 'hello-world' },
    publishDate: '2026-09-09',
  };
  expect(getSlugForNewItem(collectionConfig, state)).toBe(
    '2026-09-09/hello-world'
  );
});

test('getSlugForNewItem lets computeSlug return a nested slug for a "**" collection', () => {
  const collectionConfig = {
    slugField: 'title',
    schema,
    computeSlug: () => '2026/09/deeply/nested-post',
  };
  const state = {
    title: { name: 'Ignored', slug: 'ignored' },
    publishDate: '2026-09-09',
  };
  expect(getSlugForNewItem(collectionConfig, state)).toBe(
    '2026/09/deeply/nested-post'
  );
});
