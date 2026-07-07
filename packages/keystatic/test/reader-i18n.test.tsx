/** @jest-environment node */
import { expect, test, describe } from '@jest/globals';
import { config, collection, singleton, fields } from '../src';
import { createReader } from '../src/reader';
import { getAllowedDirectories } from '../src/api/read-local';
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
