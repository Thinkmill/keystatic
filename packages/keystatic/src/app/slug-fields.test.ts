/** @vitest-environment node */
import { expect, test } from 'vitest';

import type { Config } from '../config';
import { fields } from '../form/api';
import { collectionReader } from '../reader/generic';
import type { MinimalFs } from '../reader/generic';
import {
  getCollectionItemPath,
  getSlugFieldsForCollection,
} from './path-utils';
import { getSlugFromState } from './utils';
import { getEntriesInCollectionWithTreeKey } from './utils';
import { treeEntriesToTreeNodes } from './trees';

function makeConfig(collection: Record<string, unknown>): Config {
  return {
    storage: { kind: 'local' },
    collections: collection,
  } as unknown as Config;
}

const blogCollection = {
  label: 'Blog',
  path: 'posts/*/*/',
  slugField: 'title',
  slugFields: ['locale', 'title'],
  format: 'yaml',
  schema: {
    locale: fields.text({ label: 'Locale' }),
    title: fields.slug({ name: { label: 'Title' } }),
  },
};

test('getSlugFieldsForCollection returns the configured slug fields', () => {
  const config = makeConfig({ blog: blogCollection });
  expect(getSlugFieldsForCollection(config, 'blog')).toEqual([
    'locale',
    'title',
  ]);
});

test('getSlugFieldsForCollection falls back to slugField', () => {
  const config = makeConfig({
    blog: {
      label: 'Blog',
      path: 'posts/*/',
      slugField: 'title',
      format: 'yaml',
      schema: { title: fields.slug({ name: { label: 'Title' } }) },
    },
  });
  expect(getSlugFieldsForCollection(config, 'blog')).toEqual(['title']);
});

test('getSlugFieldsForCollection throws when the star count does not match', () => {
  const config = makeConfig({
    blog: { ...blogCollection, path: 'posts/*/' },
  });
  expect(() => getSlugFieldsForCollection(config, 'blog')).toThrowError(
    /exactly 2 \* segments/
  );
});

test('getSlugFieldsForCollection throws when a slug field is not a slug field', () => {
  const config = makeConfig({
    blog: {
      ...blogCollection,
      slugFields: ['title', 'count'],
      slugField: 'count',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        count: fields.integer({ label: 'Count' }),
      },
    },
  });
  expect(() => getSlugFieldsForCollection(config, 'blog')).toThrowError(
    /is not a slug field/
  );
});

test('getSlugFieldsForCollection throws when slugField is not the last entry', () => {
  const config = makeConfig({
    blog: { ...blogCollection, slugField: 'locale' },
  });
  expect(() => getSlugFieldsForCollection(config, 'blog')).toThrowError(
    /must be the slugField/
  );
});

test('getCollectionItemPath maps a composite slug to nested directories', () => {
  const config = makeConfig({ blog: blogCollection });
  expect(getCollectionItemPath(config, 'blog', 'en/hello-world')).toBe(
    'posts/en/hello-world'
  );
});

test('getSlugFromState joins all slug field segments', () => {
  const config = makeConfig({ blog: blogCollection });
  expect(
    getSlugFromState(config.collections!.blog as any, {
      locale: 'en',
      title: { name: 'Hello World', slug: 'hello-world' },
    })
  ).toBe('en/hello-world');
});

const treeEntries = [
  { path: 'posts', mode: '040000', type: 'tree', sha: 't0' },
  { path: 'posts/en', mode: '040000', type: 'tree', sha: 't1' },
  { path: 'posts/en/hello-world', mode: '040000', type: 'tree', sha: 't2' },
  {
    path: 'posts/en/hello-world/index.yaml',
    mode: '100644',
    type: 'blob',
    sha: 'a1',
  },
  { path: 'posts/en/deep', mode: '040000', type: 'tree', sha: 't5' },
  { path: 'posts/en/deep/nested', mode: '040000', type: 'tree', sha: 't6' },
  {
    path: 'posts/en/deep/nested/index.yaml',
    mode: '100644',
    type: 'blob',
    sha: 'a3',
  },
  { path: 'posts/fr', mode: '040000', type: 'tree', sha: 't3' },
  { path: 'posts/fr/hello-world', mode: '040000', type: 'tree', sha: 't4' },
  {
    path: 'posts/fr/hello-world/index.yaml',
    mode: '100644',
    type: 'blob',
    sha: 'a2',
  },
];

test('getEntriesInCollectionWithTreeKey lists entries for multi-slug collections', () => {
  const config = makeConfig({ blog: blogCollection });
  const tree = treeEntriesToTreeNodes(
    treeEntries.map(x => ({ ...x, url: '' }))
  );
  const entries = getEntriesInCollectionWithTreeKey(config, 'blog', tree).map(
    x => x.slug
  );
  // entries of a `posts/*/*/` collection are exactly two segments deep;
  // `posts/en/deep/nested/index.yaml` is three segments and must be ignored
  expect(entries.sort()).toEqual(['en/hello-world', 'fr/hello-world']);
});

function makeLocalFs(files: Record<string, string>): MinimalFs {
  const encoder = new TextEncoder();
  const toDirEntry = (name: string) =>
    name.endsWith('/')
      ? { name: name.slice(0, -1), kind: 'directory' as const }
      : { name, kind: 'file' as const };
  const readdir = (path: string) => {
    const prefix = path.endsWith('/') ? path : path + '/';
    const names = new Set<string>();
    for (const file of Object.keys(files)) {
      if (!file.startsWith(prefix)) continue;
      const rest = file.slice(prefix.length);
      const slash = rest.indexOf('/');
      names.add(
        toDirEntry(slash === -1 ? rest : rest.slice(0, slash + 1)).name +
          (slash === -1 ? '' : '/')
      );
    }
    return [...names].map(toDirEntry);
  };
  return {
    readFile: async path =>
      files[path] === undefined ? null : encoder.encode(files[path]),
    readdir: async path => readdir(path),
    fileExists: async path => files[path] !== undefined,
  };
}

test('reader lists and reads multi-slug entries', async () => {
  const config = makeConfig({ blog: blogCollection });
  const fsReader = makeLocalFs({
    'posts/en/hello-world/index.yaml': 'title: ignored\n',
    'posts/fr/hello-world/index.yaml': 'title: ignored\n',
  });
  const reader = collectionReader('blog', config, fsReader);
  expect(await reader.list()).toEqual(['en/hello-world', 'fr/hello-world']);
  const entry = await reader.readOrThrow('en/hello-world');
  // text-as-slug fields read as null, fields.slug reads as the stored name
  expect(entry.locale).toBe(null);
  expect(entry.title).toBe('ignored');
  expect(await reader.read('zh/hello-world')).toBe(null);
});

test('reader still works for single slug collections', async () => {
  const config = makeConfig({
    blog: {
      label: 'Blog',
      path: 'posts/*/',
      slugField: 'title',
      format: 'yaml',
      schema: { title: fields.slug({ name: { label: 'Title' } }) },
    },
  });
  const fsReader = makeLocalFs({
    'posts/hello-world/index.yaml': 'title: ignored\n',
  });
  const reader = collectionReader('blog', config, fsReader);
  expect(await reader.list()).toEqual(['hello-world']);
  const entry = await reader.readOrThrow('hello-world');
  expect(entry.title).toBe('ignored');
});
