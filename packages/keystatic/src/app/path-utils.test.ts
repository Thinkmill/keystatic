import { describe, expect, test } from 'vitest';
import { collection, fields, type Config } from '..';
import {
  getCollectionItemPath,
  getCollectionPath,
  getEntryDataFilepath,
  getCollectionFormat,
  getSlugGlobForCollection,
  getSlugSegmentCount,
  parseCollectionPathWildcards,
  slugHasSegmentCount,
} from './path-utils';
import { validateText } from '../form/fields/text/validateText';

function makeConfig(path?: string) {
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
  return c;
}

describe('parseCollectionPathWildcards', () => {
  test.each([
    ['posts/*', { glob: '*', segments: undefined, suffix: '' }],
    ['posts/*/', { glob: '*', segments: undefined, suffix: '' }],
    ['posts/*/inner', { glob: '*', segments: undefined, suffix: 'inner' }],
    ['posts/**', { glob: '**', segments: undefined, suffix: '' }],
    ['posts/**/inner', { glob: '**', segments: undefined, suffix: 'inner' }],
    ['posts/*/*', { glob: '**', segments: 2, suffix: '' }],
    ['posts/*/*/', { glob: '**', segments: 2, suffix: '' }],
    ['posts/*/*/*/x/y', { glob: '**', segments: 3, suffix: 'x/y' }],
  ])('%s', (path, expected) => {
    expect(parseCollectionPathWildcards(path)).toEqual(expected);
  });

  test.each(['posts/*/x/*', 'posts/**/*', 'posts/*/**', 'posts/**/**'])(
    'rejects non-adjacent or mixed wildcards: %s',
    path => {
      expect(() => parseCollectionPathWildcards(path)).toThrow();
    }
  );
});

describe('collection path helpers', () => {
  test('defaults are unchanged', () => {
    const c = makeConfig();
    expect(getCollectionPath(c, 'posts')).toBe('posts');
    expect(getCollectionItemPath(c, 'posts', 'a')).toBe('posts/a');
    expect(getSlugGlobForCollection(c, 'posts')).toBe('*');
    expect(getSlugSegmentCount(c, 'posts')).toBeUndefined();
    expect(getCollectionFormat(c, 'posts').dataLocation).toBe('index');
  });

  test('single wildcard with suffix is unchanged', () => {
    const c = makeConfig('content/posts/*/entry');
    expect(getCollectionPath(c, 'posts')).toBe('content/posts');
    expect(getCollectionItemPath(c, 'posts', 'a')).toBe(
      'content/posts/a/entry'
    );
    expect(getSlugSegmentCount(c, 'posts')).toBeUndefined();
  });

  test('globstar is unchanged', () => {
    const c = makeConfig('posts/**');
    expect(getSlugGlobForCollection(c, 'posts')).toBe('**');
    expect(getSlugSegmentCount(c, 'posts')).toBeUndefined();
    expect(getCollectionItemPath(c, 'posts', 'a/b/c')).toBe('posts/a/b/c');
  });

  test('multiple wildcards, data file outside a directory', () => {
    const c = makeConfig('src/content/blog/*/*');
    expect(getCollectionPath(c, 'posts')).toBe('src/content/blog');
    expect(getSlugGlobForCollection(c, 'posts')).toBe('**');
    expect(getSlugSegmentCount(c, 'posts')).toBe(2);
    expect(getCollectionItemPath(c, 'posts', 'en/hello')).toBe(
      'src/content/blog/en/hello'
    );
    const format = getCollectionFormat(c, 'posts');
    expect(format.dataLocation).toBe('outer');
    expect(getEntryDataFilepath('src/content/blog/en/hello', format)).toBe(
      'src/content/blog/en/hello.yaml'
    );
  });

  test('multiple wildcards, data file in a directory', () => {
    const c = makeConfig('blog/*/*/');
    expect(getCollectionItemPath(c, 'posts', 'en/hello')).toBe('blog/en/hello');
    const format = getCollectionFormat(c, 'posts');
    expect(format.dataLocation).toBe('index');
    expect(getEntryDataFilepath('blog/en/hello', format)).toBe(
      'blog/en/hello/index.yaml'
    );
  });

  test('multiple wildcards with a suffix', () => {
    const c = makeConfig('blog/*/*/data');
    expect(getCollectionItemPath(c, 'posts', 'en/hello')).toBe(
      'blog/en/hello/data'
    );
  });

  test('invalid paths throw', () => {
    expect(() => getCollectionPath(makeConfig('blog/*/x/*'), 'posts')).toThrow(
      /adjacent/
    );
    expect(() => getCollectionPath(makeConfig('blog/x'), 'posts')).toThrow(
      /must end with/
    );
  });
});

describe('slugHasSegmentCount', () => {
  test.each([
    ['en/hello', 2, true],
    ['hello', 2, false],
    ['a/b/c', 2, false],
    ['/hello', 2, false],
    ['en/', 2, false],
    ['en//x', 3, false],
    ['hello', 1, true],
  ])('%s with %i', (slug, count, expected) => {
    expect(slugHasSegmentCount(slug, count)).toBe(expected);
  });
});

describe('validateText with a segment count', () => {
  const slugs = new Set(['en/taken']);
  const validate = (val: string) =>
    validateText(
      val,
      1,
      Infinity,
      'Slug',
      { slugs, glob: '**', segments: 2 },
      undefined
    );

  test('accepts the right number of segments', () => {
    expect(validate('en/hello')).toBeUndefined();
  });
  test('rejects the wrong number of segments', () => {
    expect(validate('hello')).toMatch(/exactly 2/);
    expect(validate('a/b/c')).toMatch(/exactly 2/);
    expect(validate('en/')).toMatch(/exactly 2/);
  });
  test('still rejects duplicates and dot segments', () => {
    expect(validate('en/taken')).toMatch(/unique/);
    expect(validate('en/..')).toMatch(/\.\./);
  });
});
