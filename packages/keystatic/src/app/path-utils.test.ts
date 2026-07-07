import { expect, test, describe } from '@jest/globals';

import { config, collection, singleton, fields } from '../index';
import { Config } from '../config';
import {
  assertValidI18nConfig,
  getCollectionItemPath,
  getCollectionPath,
  getContentLocales,
  getSingletonPath,
  getSlugGlobForCollection,
  isLocalized,
  substituteLocale,
} from './path-utils';
import { resolveInitialLocale } from './shell/content-locale';

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
      schema: { title: fields.text({ label: 'Title' }) },
    }),
    tags: collection({
      label: 'Tags',
      path: 'content/tags/*',
      slugField: 'name',
      schema: { name: fields.text({ label: 'Name' }) },
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
}) as Config;

describe('substituteLocale', () => {
  test('leaves a tokenless path unchanged', () => {
    expect(substituteLocale('content/posts', 'en')).toBe('content/posts');
    expect(substituteLocale('content/posts', undefined)).toBe('content/posts');
  });
  test('replaces the token with the locale', () => {
    expect(substituteLocale('content/{locale}/posts', 'en')).toBe(
      'content/en/posts'
    );
    expect(substituteLocale('content/posts/{locale}', 'fr')).toBe(
      'content/posts/fr'
    );
  });
  test('throws when the token is present but no locale is given', () => {
    expect(() =>
      substituteLocale('content/{locale}/posts', undefined)
    ).toThrowErrorMatchingInlineSnapshot(
      `"Path "content/{locale}/posts" contains the {locale} token but no locale was provided. Pass a locale (e.g. \`createReader(dir, config, { locale })\`) or set config.i18n."`
    );
  });
});

describe('locale-aware path resolution', () => {
  test('getCollectionPath substitutes the active locale', () => {
    expect(getCollectionPath(i18nConfig, 'posts', 'en')).toBe(
      'content/posts/en'
    );
    expect(getCollectionPath(i18nConfig, 'posts', 'fr')).toBe(
      'content/posts/fr'
    );
  });
  test('getCollectionItemPath substitutes the active locale', () => {
    expect(getCollectionItemPath(i18nConfig, 'posts', 'my-post', 'en')).toBe(
      'content/posts/en/my-post'
    );
  });
  test('getSingletonPath substitutes the active locale', () => {
    expect(getSingletonPath(i18nConfig, 'homepage', 'fr')).toBe(
      'content/homepage/fr'
    );
  });
  test('non-localized entries ignore the locale', () => {
    expect(getCollectionPath(i18nConfig, 'tags', 'en')).toBe('content/tags');
    expect(getCollectionPath(i18nConfig, 'tags', undefined)).toBe(
      'content/tags'
    );
    expect(getSingletonPath(i18nConfig, 'settings', 'en')).toBe(
      'content/settings'
    );
  });
  test('a localized path without a locale throws', () => {
    expect(() => getCollectionPath(i18nConfig, 'posts')).toThrow(
      /\{locale\} token/
    );
    expect(() => getSingletonPath(i18nConfig, 'homepage')).toThrow(
      /\{locale\} token/
    );
  });
});

describe('locale is orthogonal to glob and format', () => {
  test('getSlugGlobForCollection is unaffected by the token', () => {
    expect(getSlugGlobForCollection(i18nConfig, 'posts')).toBe('*');
    const doubleGlob = config({
      storage: { kind: 'local' },
      i18n: { locales: { en: 'English' }, defaultLocale: 'en' },
      collections: {
        docs: collection({
          label: 'Docs',
          localized: true,
          path: 'content/{locale}/docs/**',
          slugField: 'title',
          schema: { title: fields.text({ label: 'Title' }) },
        }),
      },
    }) as Config;
    expect(getSlugGlobForCollection(doubleGlob, 'docs')).toBe('**');
  });
});

describe('getContentLocales / isLocalized', () => {
  test('getContentLocales returns declared locale codes', () => {
    expect(getContentLocales(i18nConfig)).toEqual(['en', 'fr']);
    expect(
      getContentLocales(config({ storage: { kind: 'local' } }) as Config)
    ).toEqual([]);
  });
  test('isLocalized reflects the flag', () => {
    expect(isLocalized(i18nConfig.collections!.posts)).toBe(true);
    expect(isLocalized(i18nConfig.collections!.tags)).toBe(false);
    expect(isLocalized(undefined)).toBe(false);
  });
});

describe('assertValidI18nConfig', () => {
  test('accepts a valid config', () => {
    expect(() => assertValidI18nConfig(i18nConfig)).not.toThrow();
  });
  test('accepts a config with no i18n', () => {
    expect(() =>
      assertValidI18nConfig(config({ storage: { kind: 'local' } }) as Config)
    ).not.toThrow();
  });

  test('(a) rejects a {locale} token without config.i18n', () => {
    const bad = config({
      storage: { kind: 'local' },
      collections: {
        posts: collection({
          label: 'Posts',
          localized: true,
          path: 'content/posts/{locale}/*',
          slugField: 'title',
          schema: { title: fields.text({ label: 'Title' }) },
        }),
      },
    }) as Config;
    expect(() => assertValidI18nConfig(bad)).toThrow(/config.i18n is not set/);
  });

  test('(b) rejects localized: true without a {locale} token', () => {
    const bad = config({
      storage: { kind: 'local' },
      i18n: { locales: { en: 'English' }, defaultLocale: 'en' },
      collections: {
        posts: collection({
          label: 'Posts',
          localized: true,
          path: 'content/posts/*',
          slugField: 'title',
          schema: { title: fields.text({ label: 'Title' }) },
        }),
      },
    }) as Config;
    expect(() => assertValidI18nConfig(bad)).toThrow(
      /does not contain the \{locale\} token/
    );
  });

  test('(c) rejects a {locale} token without localized: true', () => {
    const bad = config({
      storage: { kind: 'local' },
      i18n: { locales: { en: 'English' }, defaultLocale: 'en' },
      collections: {
        posts: collection({
          label: 'Posts',
          path: 'content/posts/{locale}/*',
          slugField: 'title',
          schema: { title: fields.text({ label: 'Title' }) },
        }),
      },
    }) as Config;
    expect(() => assertValidI18nConfig(bad)).toThrow(/is not marked localized/);
  });

  test('(d) rejects a defaultLocale not present in locales', () => {
    const bad = config({
      storage: { kind: 'local' },
      i18n: { locales: { en: 'English' }, defaultLocale: 'pl' },
    }) as Config;
    expect(() => assertValidI18nConfig(bad)).toThrow(
      /defaultLocale "pl" is not one of/
    );
  });
});

describe('resolveInitialLocale', () => {
  const i18n = {
    locales: { en: 'English', fr: 'Français' },
    defaultLocale: 'en',
  };
  test('returns undefined when there is no i18n', () => {
    expect(resolveInitialLocale('en', undefined)).toBeUndefined();
  });
  test('returns a stored locale when it is still valid', () => {
    expect(resolveInitialLocale('fr', i18n)).toBe('fr');
  });
  test('falls back to the default when stored is missing or invalid', () => {
    expect(resolveInitialLocale(null, i18n)).toBe('en');
    expect(resolveInitialLocale('de', i18n)).toBe('en');
  });
});
