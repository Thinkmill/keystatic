/** @vitest-environment node */
import { expect, test } from 'vitest';

import { collection, config } from '../config';
import type { Config } from '../config';
import { fields } from '../form/api';
import { clientSideValidateProp } from '../form/errors';
import { createReader } from '../reader';
import { collectionReader } from '../reader/generic';
import type { MinimalFs } from '../reader/generic';
import {
  getCollectionItemPath,
  getCollectionItemSlugSuffix,
  getSlugFieldsForCollection,
} from './path-utils';
import {
  getEntriesInCollectionWithTreeKey,
  getSlugFromState,
} from './utils';
import { treeEntriesToTreeNodes } from './trees';

function makeConfig(collections: Record<string, unknown>): Config {
  return {
    storage: { kind: 'local' },
    collections,
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

test('getSlugFieldsForCollection falls back to the slugField', () => {
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
      slugFields: ['count', 'title'],
      schema: {
        count: fields.integer({ label: 'Count' }),
        title: fields.slug({ name: { label: 'Title' } }),
      },
    },
  });
  expect(() => getSlugFieldsForCollection(config, 'blog')).toThrowError(
    /is not a slug field/
  );
});

test('getSlugFieldsForCollection throws when the slugField is not the last entry', () => {
  const config = makeConfig({
    blog: { ...blogCollection, slugField: 'locale' },
  });
  expect(() => getSlugFieldsForCollection(config, 'blog')).toThrowError(
    /must be the slugField/
  );
});

test('getSlugFieldsForCollection throws when combining slugFields with a ** segment', () => {
  const config = makeConfig({
    blog: { ...blogCollection, path: 'posts/*/**' },
  });
  expect(() => getSlugFieldsForCollection(config, 'blog')).toThrowError(
    /\*\* segment/
  );
});

test('getSlugFieldsForCollection throws for a static segment between glob segments', () => {
  const config = makeConfig({
    blog: { ...blogCollection, path: 'content/*/posts/*/' },
  });
  expect(() => getSlugFieldsForCollection(config, 'blog')).toThrowError(
    /static prefix followed by its \* segments/
  );
});

test('getSlugFieldsForCollection throws for a static suffix with multiple slugFields', () => {
  const config = makeConfig({
    blog: { ...blogCollection, path: 'posts/*/*/index.mdoc' },
  });
  expect(() => getSlugFieldsForCollection(config, 'blog')).toThrowError(
    /static prefix followed by its \* segments/
  );
});

test('getCollectionItemPath maps a composite slug to nested directories', () => {
  const config = makeConfig({ blog: blogCollection });
  expect(getCollectionItemPath(config, 'blog', 'en/hello-world')).toBe(
    'posts/en/hello-world'
  );
});

test('getCollectionItemSlugSuffix uses the part after the last glob', () => {
  const config = makeConfig({
    blog: {
      label: 'Blog',
      path: 'posts/*/index.mdoc',
      slugField: 'title',
      format: 'yaml',
      schema: { title: fields.slug({ name: { label: 'Title' } }) },
    },
  });
  expect(getCollectionItemSlugSuffix(config, 'blog')).toBe('/index.mdoc');
  const simple = makeConfig({
    blog: { ...blogCollection, path: 'posts/*/*' },
  });
  expect(getCollectionItemSlugSuffix(simple, 'blog')).toBe('');
});

test('getSlugFromState joins all slug field segments', () => {
  expect(
    getSlugFromState(blogCollection as any, {
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

test('getEntriesInCollectionWithTreeKey lists entries at the exact segment depth', () => {
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

test('getEntriesInCollectionWithTreeKey is unchanged for single slug collections', () => {
  const config = makeConfig({
    blog: {
      label: 'Blog',
      path: 'posts/*/',
      slugField: 'title',
      format: 'yaml',
      schema: { title: fields.slug({ name: { label: 'Title' } }) },
    },
  });
  const tree = treeEntriesToTreeNodes(
    [
      { path: 'posts', mode: '040000', type: 'tree', sha: 't0' },
      { path: 'posts/hello-world', mode: '040000', type: 'tree', sha: 't1' },
      {
        path: 'posts/hello-world/index.yaml',
        mode: '100644',
        type: 'blob',
        sha: 'a1',
      },
    ].map(x => ({ ...x, url: '' }))
  );
  const entries = getEntriesInCollectionWithTreeKey(config, 'blog', tree).map(
    x => x.slug
  );
  expect(entries).toEqual(['hello-world']);
});

function makeLocalFs(files: Record<string, string>): MinimalFs {
  const encoder = new TextEncoder();
  const readdir = (path: string) => {
    const prefix = path.endsWith('/') ? path : path + '/';
    const names = new Set<string>();
    for (const file of Object.keys(files)) {
      if (!file.startsWith(prefix)) continue;
      const rest = file.slice(prefix.length);
      const slash = rest.indexOf('/');
      names.add(slash === -1 ? rest : rest.slice(0, slash));
    }
    return [...names].map(name => ({
      name,
      kind: (
        Object.keys(files).some(f => f.startsWith(`${prefix}${name}/`))
          ? 'directory'
          : 'file'
      ) as 'directory' | 'file',
    }));
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
  // a slug with the wrong segment count does not match the collection
  expect(await reader.read('hello-world')).toBe(null);
  expect(await reader.read('en/deep/hello-world')).toBe(null);
});

test('reader list does not traverse below the entry depth', async () => {
  const config = makeConfig({ blog: blogCollection });
  const base = makeLocalFs({
    'posts/en/hello-world/index.yaml': 'title: ignored\n',
    'posts/en/hello-world/assets/image.png': 'binary',
  });
  const readdirPaths: string[] = [];
  const fsReader: MinimalFs = {
    ...base,
    readdir: async path => {
      readdirPaths.push(path);
      return base.readdir(path);
    },
  };
  const reader = collectionReader('blog', config, fsReader);
  expect(await reader.list()).toEqual(['en/hello-world']);
  expect(readdirPaths).not.toContain('posts/en/hello-world/');
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

test('validation scopes uniqueness to the composite slug', () => {
  const schema = fields.object(blogCollection.schema);
  const slugFieldInfo = {
    field: 'title',
    fields: ['locale', 'title'],
    slugs: new Set(['en/hello-world']),
    glob: '*' as const,
  };
  // the same slug in the same locale is a duplicate
  expect(
    clientSideValidateProp(
      schema,
      { locale: 'en', title: { name: 'Hello World', slug: 'hello-world' } },
      slugFieldInfo
    )
  ).toBe(false);
  // the same slug in another locale is fine
  expect(
    clientSideValidateProp(
      schema,
      { locale: 'fr', title: { name: 'Hello World', slug: 'hello-world' } },
      slugFieldInfo
    )
  ).toBe(true);
});

test('slug field segments must not contain slashes', () => {
  const schema = fields.object(blogCollection.schema);
  const slugFieldInfo = {
    field: 'title',
    fields: ['locale', 'title'],
    slugs: new Set<string>(),
    glob: '*' as const,
  };
  expect(
    clientSideValidateProp(
      schema,
      { locale: 'en/us', title: { name: 'Hello World', slug: 'hello-world' } },
      slugFieldInfo
    )
  ).toBe(false);
});

test('slugFields are checked against the path at the type level', () => {
  const typeAssertions = () => {
    collection({
      label: 'Blog',
      path: 'posts/*/*/',
      slugField: 'title',
      slugFields: ['locale', 'title'],
      schema: blogCollection.schema,
    });
    collection({
      label: 'Blog',
      path: 'posts/*/',
      slugField: 'title',
      // @ts-expect-error - one slug field per * segment in path
      slugFields: ['locale', 'title'],
      schema: blogCollection.schema,
    });
    collection({
      label: 'Blog',
      path: 'posts/*/*/',
      slugField: 'locale',
      // @ts-expect-error - the last entry of slugFields must be the slugField
      slugFields: ['locale', 'title'],
      schema: blogCollection.schema,
    });
    collection({
      label: 'Blog',
      path: 'posts/*/*/',
      slugField: 'title',
      slugFields: [
        // @ts-expect-error - slugFields entries must be slug fields
        'count',
        'title',
      ],
      schema: {
        ...blogCollection.schema,
        count: fields.integer({ label: 'Count' }),
      },
    });
    collection({
      label: 'Blog',
      path: 'posts/*/**',
      slugField: 'title',
      // @ts-expect-error - multiple slugFields cannot be used with a ** segment
      slugFields: ['locale', 'title'],
      schema: blogCollection.schema,
    });
  };
  void typeAssertions;
});

test('reader entry types follow the slugFields', () => {
  const typeAssertions = async () => {
    const reader = createReader(
      '',
      config({
        storage: { kind: 'local' },
        collections: {
          blog: collection({
            label: 'Blog',
            path: 'posts/*/*/',
            slugField: 'title',
            slugFields: ['locale', 'title'],
            schema: blogCollection.schema,
          }),
        },
      })
    );
    const entry = await reader.collections.blog.readOrThrow('en/hello-world');
    // fields.text as a secondary slug field reads as null
    const locale: null = entry.locale;
    // fields.slug as the slugField reads as the stored name
    const title: string = entry.title;
    // @ts-expect-error - a secondary slug field does not read as a string
    const localeAsString: string = entry.locale;
    // @ts-expect-error - the slugField does not read as { name, slug }
    const titleAsObject: { name: string; slug: string } = entry.title;
    void locale;
    void title;
    void localeAsString;
    void titleAsObject;
  };
  void typeAssertions;
});
