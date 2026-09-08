/** @jest-environment node */
import { expect, test, describe } from '@jest/globals';
import { config, collection, singleton, fields } from '../src';
import { createReader } from '../src/reader';
import { getAllowedDirectories, readToDirEntries } from '../src/api/read-local';
import { getEntriesInCollectionWithTreeKey } from '../src/app/utils';
import { treeEntriesToTreeNodes } from '../src/app/trees';
import { testdir } from './test-utils';

const i18nConfig = config({
  storage: { kind: 'local' },
  i18n: {
    locales: { en: 'English', fr: 'Français' },
    defaultLocale: 'en',
  },
  collections: {
    posts: collection({
      label: 'Posts',
      localized: true,
      path: 'content/posts/{locale}/*',
      slugField: 'title',
      schema: {
        title: fields.text({ label: 'Title' }),
        body: fields.text({ label: 'Body' }),
      },
    }),
    tags: collection({
      label: 'Tags',
      path: 'content/tags/*',
      slugField: 'name',
      schema: {
        name: fields.text({ label: 'Name' }),
        value: fields.text({ label: 'Value' }),
      },
    }),
  },
  singletons: {
    homepage: singleton({
      label: 'Homepage',
      localized: true,
      path: 'content/homepage/{locale}',
      schema: { headline: fields.text({ label: 'Headline' }) },
    }),
    settings: singleton({
      label: 'Settings',
      path: 'content/settings',
      schema: { title: fields.text({ label: 'Title' }) },
    }),
  },
});

function fixture() {
  return testdir({
    'content/posts/en/hello.yaml': 'body: English body\n',
    'content/posts/fr/hello.yaml': 'body: French body\n',
    'content/tags/x.yaml': 'value: shared value\n',
    'content/homepage/en.yaml': 'headline: EN home\n',
    'content/homepage/fr.yaml': 'headline: FR home\n',
    'content/settings.yaml': 'title: shared settings\n',
  });
}

describe('reader reads the active locale', () => {
  test('localized collection reads the matching language', async () => {
    const dir = await fixture();
    const en = createReader(dir, i18nConfig, { locale: 'en' });
    const fr = createReader(dir, i18nConfig, { locale: 'fr' });

    expect(await en.collections.posts.list()).toEqual(['hello']);
    expect(await fr.collections.posts.list()).toEqual(['hello']);

    expect(await en.collections.posts.read('hello')).toMatchObject({
      body: 'English body',
    });
    expect(await fr.collections.posts.read('hello')).toMatchObject({
      body: 'French body',
    });
  });

  test('localized singleton reads the matching language', async () => {
    const dir = await fixture();
    const en = createReader(dir, i18nConfig, { locale: 'en' });
    const fr = createReader(dir, i18nConfig, { locale: 'fr' });

    expect(await en.singletons.homepage.read()).toMatchObject({
      headline: 'EN home',
    });
    expect(await fr.singletons.homepage.read()).toMatchObject({
      headline: 'FR home',
    });
  });

  test('shared collections/singletons are identical across locales', async () => {
    const dir = await fixture();
    const en = createReader(dir, i18nConfig, { locale: 'en' });
    const fr = createReader(dir, i18nConfig, { locale: 'fr' });

    expect(await en.collections.tags.read('x')).toMatchObject({
      value: 'shared value',
    });
    expect(await fr.collections.tags.read('x')).toMatchObject({
      value: 'shared value',
    });
    expect(await en.singletons.settings.read()).toMatchObject({
      title: 'shared settings',
    });
    expect(await fr.singletons.settings.read()).toMatchObject({
      title: 'shared settings',
    });
  });
});

describe('reader created without a locale', () => {
  test('can read shared content but throws for localized content', async () => {
    const dir = await fixture();
    const reader = createReader(dir, i18nConfig);

    expect(await reader.singletons.settings.read()).toMatchObject({
      title: 'shared settings',
    });

    expect(() => reader.collections.posts.list()).toThrow(/locale/);
    expect(() => reader.singletons.homepage.read()).toThrow(/locale/);
    await expect(reader.collections.posts.all()).rejects.toThrow(/locale/);
  });
});

describe('createReader validates i18n config', () => {
  test('throws for an invalid config', async () => {
    const dir = await fixture();
    const bad = config({
      storage: { kind: 'local' },
      i18n: { locales: { en: 'English' }, defaultLocale: 'pl' },
    });
    expect(() => createReader(dir, bad)).toThrow(
      /defaultLocale "pl" is not one of/
    );
  });
});

describe('getAllowedDirectories', () => {
  test('allows every locale directory for localized entries', () => {
    const dirs = getAllowedDirectories(i18nConfig as any);
    expect(dirs).toEqual(
      expect.arrayContaining([
        'content/posts/en',
        'content/posts/fr',
        'content/tags',
        'content/homepage/en',
        'content/homepage/fr',
      ])
    );
  });
});

const unprefixedConfig = config({
  storage: { kind: 'local' },
  i18n: {
    locales: { en: 'English', fr: 'Français' },
    defaultLocale: 'en',
    prefixDefaultLocale: false,
  },
  collections: {
    docs: collection({
      label: 'Docs',
      localized: true,
      path: 'src/content/docs/{locale}/**',
      slugField: 'title',
      schema: {
        title: fields.text({ label: 'Title' }),
        body: fields.text({ label: 'Body' }),
      },
    }),
    posts: collection({
      label: 'Posts',
      localized: true,
      path: 'content/posts/{locale}/*',
      slugField: 'title',
      schema: {
        title: fields.text({ label: 'Title' }),
        body: fields.text({ label: 'Body' }),
      },
    }),
  },
  singletons: {
    homepage: singleton({
      label: 'Homepage',
      localized: true,
      path: 'content/homepage/{locale}',
      schema: { headline: fields.text({ label: 'Headline' }) },
    }),
  },
});

function unprefixedFixture() {
  return testdir({
    'src/content/docs/index.yaml': 'body: EN index\n',
    'src/content/docs/guides/intro.yaml': 'body: EN intro\n',
    'src/content/docs/fr/index.yaml': 'body: FR index\n',
    'src/content/docs/fr/guides/intro.yaml': 'body: FR intro\n',
    'content/posts/hello.yaml': 'body: EN body\n',
    'content/posts/fr/hello.yaml': 'body: FR body\n',
    'content/homepage.yaml': 'headline: EN home\n',
    'content/homepage/fr.yaml': 'headline: FR home\n',
  });
}

describe('prefixDefaultLocale: false', () => {
  test('the default locale reads from the collection root', async () => {
    const dir = await unprefixedFixture();
    const en = createReader(dir, unprefixedConfig, { locale: 'en' });

    expect((await en.collections.docs.list()).sort()).toEqual([
      'guides/intro',
      'index',
    ]);
    expect(await en.collections.docs.read('index')).toMatchObject({
      body: 'EN index',
    });
  });

  test('a nested `**` listing does not pick up the other locales', async () => {
    const dir = await unprefixedFixture();
    const en = createReader(dir, unprefixedConfig, { locale: 'en' });

    const slugs = await en.collections.docs.list();
    expect(slugs).not.toContain('fr/index');
    expect(slugs).not.toContain('fr/guides/intro');
  });

  test('the other locales read from their own directory', async () => {
    const dir = await unprefixedFixture();
    const fr = createReader(dir, unprefixedConfig, { locale: 'fr' });

    expect((await fr.collections.docs.list()).sort()).toEqual([
      'guides/intro',
      'index',
    ]);
    expect(await fr.collections.docs.read('guides/intro')).toMatchObject({
      body: 'FR intro',
    });
  });

  test('reading across a locale directory returns null rather than the other language', async () => {
    const dir = await unprefixedFixture();
    const en = createReader(dir, unprefixedConfig, { locale: 'en' });

    expect(await en.collections.docs.read('fr/index')).toBe(null);
    expect(await en.collections.docs.read('fr/guides/intro')).toBe(null);
  });

  test('a `*` collection keeps the default at the root', async () => {
    const dir = await unprefixedFixture();
    const en = createReader(dir, unprefixedConfig, { locale: 'en' });
    const fr = createReader(dir, unprefixedConfig, { locale: 'fr' });

    expect(await en.collections.posts.list()).toEqual(['hello']);
    expect(await en.collections.posts.read('hello')).toMatchObject({
      body: 'EN body',
    });
    expect(await fr.collections.posts.read('hello')).toMatchObject({
      body: 'FR body',
    });
  });

  test('singletons resolve to an unprefixed file for the default locale', async () => {
    const dir = await unprefixedFixture();
    const en = createReader(dir, unprefixedConfig, { locale: 'en' });
    const fr = createReader(dir, unprefixedConfig, { locale: 'fr' });

    expect(await en.singletons.homepage.read()).toMatchObject({
      headline: 'EN home',
    });
    expect(await fr.singletons.homepage.read()).toMatchObject({
      headline: 'FR home',
    });
  });

  test('getAllowedDirectories covers the unprefixed default and every other locale', () => {
    const dirs = getAllowedDirectories(unprefixedConfig as any);
    expect(dirs).toContain('src/content/docs');
    expect(dirs).toContain('src/content/docs/fr');
    expect(dirs).not.toContain('');
  });
});

describe('the Admin UI listing matches the reader', () => {
  test('a `**` collection hides the other locales from the default', async () => {
    const dir = await unprefixedFixture();
    const tree = treeEntriesToTreeNodes(await readToDirEntries(dir));

    const en = getEntriesInCollectionWithTreeKey(
      unprefixedConfig as any,
      'docs',
      tree,
      'en'
    ).map(x => x.slug);
    const fr = getEntriesInCollectionWithTreeKey(
      unprefixedConfig as any,
      'docs',
      tree,
      'fr'
    ).map(x => x.slug);

    expect(en.sort()).toEqual(['guides/intro', 'index']);
    expect(fr.sort()).toEqual(['guides/intro', 'index']);
    expect(en.filter(x => x.startsWith('fr/'))).toEqual([]);
  });

  test('the default locale still sees a `*` collection at the root', async () => {
    const dir = await unprefixedFixture();
    const tree = treeEntriesToTreeNodes(await readToDirEntries(dir));

    expect(
      getEntriesInCollectionWithTreeKey(
        unprefixedConfig as any,
        'posts',
        tree,
        'en'
      ).map(x => x.slug)
    ).toEqual(['hello']);
  });
});

const templateConfig = config({
  storage: { kind: 'local' },
  i18n: { locales: { en: 'English', fr: 'Français' }, defaultLocale: 'en' },
  collections: {
    posts: collection({
      label: 'Posts',
      localized: true,
      path: 'content/posts/{locale}/*',
      template: 'content/posts/{locale}/_template',
      slugField: 'title',
      schema: { title: fields.text({ label: 'Title' }) },
    }),
    shared: collection({
      label: 'Shared',
      localized: true,
      path: 'content/shared/{locale}/*',
      template: 'content/_templates/shared',
      slugField: 'title',
      schema: { title: fields.text({ label: 'Title' }) },
    }),
  },
});

describe('templates resolve the locale', () => {
  test('a localized template is allowed for every locale, never as a raw token', () => {
    const dirs = getAllowedDirectories(templateConfig as any);
    expect(dirs).toContain('content/posts/en/_template');
    expect(dirs).toContain('content/posts/fr/_template');
    expect(dirs).not.toContain('content/posts/{locale}/_template');
  });
  test('a template without the token is shared across locales', () => {
    const dirs = getAllowedDirectories(templateConfig as any);
    expect(dirs.filter(x => x === 'content/_templates/shared')).toEqual([
      'content/_templates/shared',
    ]);
  });
});
