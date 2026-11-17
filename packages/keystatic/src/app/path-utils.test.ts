/** @vitest-environment node */
import { expect, test } from 'vitest';

import type { Config } from '../config';
import { fields } from '../form/api';
import { collectionReader } from '../reader/generic';
import type { MinimalFs } from '../reader/generic';
import {
  getCollectionItemPath,
  getCollectionItemSlugSuffix,
  getCollectionPath,
  getCollectionPathInfo,
  getSlugFieldSlug,
  parseCollectionPath,
} from './path-utils';
import { getEntriesInCollectionWithTreeKey, getSlugFromState } from './utils';
import { treeEntriesToTreeNodes, TreeEntry } from './trees';

function makeConfig(collection: Record<string, unknown>): Config {
  return {
    storage: { kind: 'local' },
    collections: collection,
  } as unknown as Config;
}

const blogSchema = {
  locale: fields.text({ label: 'Locale' }),
  title: fields.slug({ name: { label: 'Title' } }),
};

const blogCollection = {
  label: 'Blog',
  path: 'src/content/blog/{locale}/*',
  slugField: 'title',
  format: 'yaml' as const,
  schema: blogSchema,
};

test('parseCollectionPath parses a plain glob path', () => {
  expect(parseCollectionPath('posts/*')).toEqual({
    prefix: 'posts',
    slugPattern: [{ kind: 'glob', glob: '*' }],
    glob: '*',
    suffix: '',
  });
  expect(parseCollectionPath('posts/**/data')).toEqual({
    prefix: 'posts',
    slugPattern: [{ kind: 'glob', glob: '**' }],
    glob: '**',
    suffix: 'data',
  });
});

test('parseCollectionPath parses field placeholders', () => {
  expect(parseCollectionPath('src/content/blog/{locale}/*')).toEqual({
    prefix: 'src/content/blog',
    slugPattern: [
      { kind: 'field', name: 'locale' },
      { kind: 'glob', glob: '*' },
    ],
    glob: '*',
    suffix: '',
  });
  // static segments can appear between placeholders and the glob
  expect(parseCollectionPath('a/{x}/b/{y}/*/index')).toEqual({
    prefix: 'a',
    slugPattern: [
      { kind: 'field', name: 'x' },
      { kind: 'static', value: 'b' },
      { kind: 'field', name: 'y' },
      { kind: 'glob', glob: '*' },
    ],
    glob: '*',
    suffix: 'index',
  });
});

test('parseCollectionPath rejects invalid paths', () => {
  expect(() => parseCollectionPath('a/*/*')).toThrow(
    'can only contain a single * or **'
  );
  expect(() => parseCollectionPath('a/*/{x}')).toThrow(
    'cannot appear after the * or **'
  );
  expect(() => parseCollectionPath('a/{x/*')).toThrow('invalid path segment');
  expect(() => parseCollectionPath('posts')).toThrow(
    'must end with /* or /** or include /*/ or /**/'
  );
});

test('getCollectionPathInfo validates placeholders against the schema', () => {
  const config = makeConfig({
    blog: {
      ...blogCollection,
      path: 'blog/{missing}/*',
    },
  });
  expect(() => getCollectionPathInfo(config, 'blog')).toThrow(
    "does not match a field in the collection's schema"
  );
  const nonForm = makeConfig({
    blog: {
      ...blogCollection,
      path: 'blog/{group}/*',
      schema: {
        ...blogSchema,
        group: fields.object({ inner: fields.text({ label: 'Inner' }) }),
      },
    },
  });
  expect(() => getCollectionPathInfo(nonForm, 'blog')).toThrow(
    'must be a form field'
  );
});

test('getCollectionPath returns the static prefix for a placeholder path', () => {
  const config = makeConfig({ blog: blogCollection });
  expect(getCollectionPath(config, 'blog')).toBe('src/content/blog');
  expect(getCollectionItemSlugSuffix(config, 'blog')).toBe('');
  expect(getCollectionItemPath(config, 'blog', 'en/my-post')).toBe(
    'src/content/blog/en/my-post'
  );
});

test('getSlugFromState composes a slug from placeholder field values', () => {
  const collectionConfig = {
    slugField: 'title',
    path: 'src/content/blog/{locale}/*',
    schema: blogSchema,
  };
  const state = {
    locale: 'en',
    title: { name: 'My Post', slug: 'my-post' },
  };
  expect(getSlugFromState(collectionConfig, state)).toBe('en/my-post');
});

test('getSlugFromState fills static segments and supports non-text fields', () => {
  const collectionConfig = {
    slugField: 'title',
    path: 'posts/{kind}/blog/{year}/*',
    schema: {
      kind: fields.select({
        label: 'Kind',
        options: [
          { label: 'News', value: 'news' },
          { label: 'Guide', value: 'guide' },
        ],
        defaultValue: 'news',
      }),
      year: fields.integer({ label: 'Year' }),
      title: fields.slug({ name: { label: 'Title' } }),
    },
  };
  const state = {
    kind: 'guide',
    year: 2026,
    title: { name: 'My Post', slug: 'my-post' },
  };
  expect(getSlugFromState(collectionConfig, state)).toBe(
    'guide/blog/2026/my-post'
  );
});

test('getSlugFromState is unchanged for paths without placeholders', () => {
  const collectionConfig = {
    slugField: 'title',
    path: 'posts/*',
    schema: blogSchema,
  };
  const state = { locale: 'en', title: { name: 'X', slug: 'my-post' } };
  expect(getSlugFromState(collectionConfig, state)).toBe('my-post');
});

test('getSlugFieldSlug returns the glob portion of a slug', () => {
  const placeholder = parseCollectionPath('blog/{locale}/*');
  expect(getSlugFieldSlug(placeholder, 'en/my-post')).toBe('my-post');
  const staticMiddle = parseCollectionPath('a/{x}/b/*');
  expect(getSlugFieldSlug(staticMiddle, 'en/b/my-post')).toBe('my-post');
  const globstar = parseCollectionPath('posts/{locale}/**');
  expect(getSlugFieldSlug(globstar, 'en/a/b/post')).toBe('a/b/post');
  const plain = parseCollectionPath('posts/*');
  expect(getSlugFieldSlug(plain, 'my-post')).toBe('my-post');
});

function entry(path: string): TreeEntry {
  return { mode: '100644', type: 'blob', sha: `sha-${path}`, path };
}

function dirEntry(path: string): TreeEntry {
  return { mode: '040000', type: 'tree', sha: `sha-${path}`, path };
}

function pathsToTreeEntries(paths: string[]): TreeEntry[] {
  const dirs = new Set<string>();
  const entries: TreeEntry[] = [];
  for (const path of paths) {
    const segments = path.split('/');
    for (let i = 1; i < segments.length; i++) {
      dirs.add(segments.slice(0, i).join('/'));
    }
    entries.push(entry(path));
  }
  return [...dirs].map(dirEntry).concat(entries);
}

test('getEntriesInCollectionWithTreeKey lists entries under placeholders', () => {
  const config = makeConfig({
    blog: {
      ...blogCollection,
      path: 'src/content/blog/{locale}/*/',
    },
  });
  const tree = treeEntriesToTreeNodes(
    pathsToTreeEntries([
      'src/content/blog/en/my-post/index.yaml',
      'src/content/blog/en/other-post/index.yaml',
      'src/content/blog/fr/my-post/index.yaml',
      // wrong depth — should not be listed
      'src/content/blog/index.yaml',
      'src/content/blog/en/my-post/extra/deep/index.yaml',
    ])
  );
  const slugs = getEntriesInCollectionWithTreeKey(config, 'blog', tree).map(
    x => x.slug
  );
  expect(slugs.sort()).toEqual(['en/my-post', 'en/other-post', 'fr/my-post']);
});

test('getEntriesInCollectionWithTreeKey matches static segments in the slug region', () => {
  const config = makeConfig({
    blog: { ...blogCollection, path: 'blog/{locale}/posts/*' },
  });
  const tree = treeEntriesToTreeNodes(
    pathsToTreeEntries([
      'blog/en/posts/my-post.yaml',
      'blog/en/wrong/ignored.yaml',
      'blog/fr/posts/other-post.yaml',
    ])
  );
  const slugs = getEntriesInCollectionWithTreeKey(config, 'blog', tree).map(
    x => x.slug
  );
  expect(slugs.sort()).toEqual(['en/posts/my-post', 'fr/posts/other-post']);
});

test('getEntriesInCollectionWithTreeKey is unchanged for plain glob paths', () => {
  const config = makeConfig({
    blog: { ...blogCollection, path: 'blog/*' },
  });
  const tree = treeEntriesToTreeNodes(
    pathsToTreeEntries(['blog/my-post.yaml', 'blog/nested/deeper.yaml'])
  );
  const slugs = getEntriesInCollectionWithTreeKey(config, 'blog', tree).map(
    x => x.slug
  );
  expect(slugs).toEqual(['my-post']);
});

function memFs(files: Record<string, string>): MinimalFs {
  const dirs = new Map<
    string,
    { name: string; kind: 'file' | 'directory' }[]
  >();
  for (const path of Object.keys(files)) {
    const segments = path.split('/');
    for (let i = 0; i < segments.length; i++) {
      const dir = segments.slice(0, i).join('/');
      const name = segments[i];
      const kind = i === segments.length - 1 ? 'file' : 'directory';
      const list = dirs.get(dir) ?? [];
      if (!list.some(x => x.name === name)) {
        list.push({ name, kind });
        dirs.set(dir, list);
      }
    }
  }
  return {
    async readdir(path: string) {
      return dirs.get(path.replace(/\/$/, '')) ?? [];
    },
    async readFile(path: string) {
      const contents = files[path];
      return contents === undefined ? null : new TextEncoder().encode(contents);
    },
    async fileExists(path: string) {
      return path in files;
    },
  };
}

test('reader lists and reads entries from placeholder paths', async () => {
  const config = makeConfig({ blog: blogCollection });
  const fs = memFs({
    'src/content/blog/en/my-post.yaml': 'title: My Post\nlocale: en\n',
    'src/content/blog/fr/my-post.yaml': 'title: Mon Post\nlocale: fr\n',
    'src/content/blog/top-level.yaml': 'title: Nope\nlocale: en\n',
    'src/content/blog/en/nested/too-deep.yaml': 'title: Nope\nlocale: en\n',
  });
  const reader = collectionReader('blog', config, fs);
  expect((await reader.list()).sort()).toEqual(['en/my-post', 'fr/my-post']);
  expect(await reader.read('en/my-post')).toEqual({
    locale: 'en',
    title: 'My Post',
  });
  // wrong depth and static mismatches are rejected
  expect(await reader.read('my-post')).toBeNull();
  expect(await reader.read('en/nested/too-deep')).toBeNull();
});

test('reader read for a placeholder path is consistent across locales', async () => {
  const config = makeConfig({
    blog: {
      ...blogCollection,
      path: 'blog/{locale}/*',
      format: 'yaml' as const,
    },
  });
  const fs = memFs({
    'blog/en/my-post.yaml': 'title: My Post\nlocale: en\n',
    'blog/fr/my-post.yaml': 'title: Mon Post\nlocale: fr\n',
  });
  const reader = collectionReader('blog', config, fs);
  // the same slug field value can exist under different path segments
  expect(await reader.read('en/my-post')).toEqual({
    locale: 'en',
    title: 'My Post',
  });
  expect(await reader.read('fr/my-post')).toEqual({
    locale: 'fr',
    title: 'Mon Post',
  });
});
