/** @vitest-environment node */
import { describe, expect, test } from 'vitest';
import { collection, fields, type Config } from '..';
import { collectionReader, MinimalFs, DirEntry } from './generic';

function memoryFs(files: Record<string, string>): MinimalFs {
  const enc = new TextEncoder();
  const dirs = new Set<string>(['']);
  for (const file of Object.keys(files)) {
    const parts = file.split('/');
    for (let i = 1; i < parts.length; i++) {
      dirs.add(parts.slice(0, i).join('/'));
    }
  }
  return {
    async readFile(path) {
      return path in files ? enc.encode(files[path]) : null;
    },
    async fileExists(path) {
      return path in files;
    },
    async readdir(path) {
      const prefix = path.replace(/\/$/, '') + '/';
      const out = new Map<string, DirEntry>();
      for (const file of Object.keys(files)) {
        if (!file.startsWith(prefix)) continue;
        const [name, ...rest] = file.slice(prefix.length).split('/');
        out.set(name, { name, kind: rest.length ? 'directory' : 'file' });
      }
      return [...out.values()];
    },
  };
}

const files = {
  'blog/en/hello.yaml': 'title: Hello\n',
  'blog/fr/bonjour.yaml': 'title: Bonjour\n',
  'blog/stray.yaml': 'title: Stray\n',
  'blog/en/deep/too-deep.yaml': 'title: Deep\n',
};

function makeReader(path: string, fs = memoryFs(files)) {
  const c: Config = {
    storage: { kind: 'local' },
    collections: {
      posts: collection({
        label: 'Posts',
        slugField: 'title',
        path: path as any,
        schema: { title: fields.slug({ name: { label: 'Title' } }) },
      }),
    },
  };
  return collectionReader('posts', c, fs);
}

describe('collection reader with multiple wildcards', () => {
  test('list only returns entries with the right depth', async () => {
    expect((await makeReader('blog/*/*').list()).sort()).toEqual([
      'en/hello',
      'fr/bonjour',
    ]);
  });

  test('read resolves a multi-segment slug', async () => {
    const entry = await makeReader('blog/*/*').read('en/hello');
    expect(entry).toEqual({ title: 'Hello' });
  });

  test('read returns null for slugs of the wrong depth', async () => {
    const reader = makeReader('blog/*/*');
    expect(await reader.read('stray')).toBeNull();
    expect(await reader.read('en/deep/too-deep')).toBeNull();
    expect(await reader.read('en/')).toBeNull();
    expect(await reader.read('../blog/en/hello')).toBeNull();
  });

  test('all returns slugs and entries', async () => {
    const all = await makeReader('blog/*/*').all();
    expect(all.map(x => x.slug).sort()).toEqual(['en/hello', 'fr/bonjour']);
  });

  test('single wildcard behaviour is unchanged', async () => {
    const reader = makeReader('blog/*');
    expect(await reader.list()).toEqual(['stray']);
    expect(await reader.read('en/hello')).toBeNull();
  });

  test('globstar behaviour is unchanged', async () => {
    const reader = makeReader('blog/**');
    expect((await reader.list()).sort()).toEqual([
      'en/deep/too-deep',
      'en/hello',
      'fr/bonjour',
      'stray',
    ]);
  });

  test('works with directory-style entries and a suffix', async () => {
    const fs = memoryFs({
      'blog/en/hello/data/index.yaml': 'title: Hello\n',
      'blog/en/orphan/index.yaml': 'title: Orphan\n',
    });
    const reader = makeReader('blog/*/*/data/', fs);
    expect(await reader.read('en/hello')).toEqual({ title: 'Hello' });
  });
});
