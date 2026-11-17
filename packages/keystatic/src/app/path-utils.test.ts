import { expect, test, describe } from '@jest/globals';

import { config, collection, singleton, fields } from '../index';
import { Config } from '../config';
import {
  assertValidI18nConfig,
  getCollectionItemPath,
  getCollectionPath,
  getCollectionTemplatePath,
  getContentLocales,
  getLocaleDirsToSkip,
  getSingletonPath,
  getSlugGlobForCollection,
  isLocalized,
  singletonDirHoldsOtherLocales,
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

const unprefixedConfig = config({
  storage: { kind: 'local' },
  i18n: {
    locales: { en: 'English', fr: 'Français', de: 'Deutsch' },
    defaultLocale: 'en',
    prefixDefaultLocale: false,
  },
  collections: {
    docs: collection({
      label: 'Docs',
      localized: true,
      path: 'src/content/docs/{locale}/**',
      slugField: 'title',
      schema: { title: fields.text({ label: 'Title' }) },
    }),
    posts: collection({
      label: 'Posts',
      localized: true,
      path: 'content/posts/{locale}/*',
      slugField: 'title',
      schema: { title: fields.text({ label: 'Title' }) },
    }),
    guides: collection({
      label: 'Guides',
      localized: true,
      path: 'content/{locale}/guides/**',
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

describe('prefixDefaultLocale: false', () => {
  const i18n = unprefixedConfig.i18n;
  test('the default locale loses the token segment', () => {
    expect(substituteLocale('content/posts/{locale}', 'en', i18n)).toBe(
      'content/posts'
    );
    expect(substituteLocale('content/{locale}/posts', 'en', i18n)).toBe(
      'content/posts'
    );
  });
  test('other locales keep their directory', () => {
    expect(substituteLocale('content/posts/{locale}', 'fr', i18n)).toBe(
      'content/posts/fr'
    );
    expect(substituteLocale('content/{locale}/posts', 'de', i18n)).toBe(
      'content/de/posts'
    );
  });
  test('the default locale keeps its directory when the flag is unset or true', () => {
    expect(substituteLocale('content/posts/{locale}', 'en')).toBe(
      'content/posts/en'
    );
    expect(
      substituteLocale('content/posts/{locale}', 'en', {
        locales: { en: 'English' },
        defaultLocale: 'en',
        prefixDefaultLocale: true,
      })
    ).toBe('content/posts/en');
  });
  test('collection and singleton paths resolve to the unprefixed default', () => {
    expect(getCollectionPath(unprefixedConfig, 'docs', 'en')).toBe(
      'src/content/docs'
    );
    expect(getCollectionPath(unprefixedConfig, 'docs', 'fr')).toBe(
      'src/content/docs/fr'
    );
    expect(getSingletonPath(unprefixedConfig, 'homepage', 'en')).toBe(
      'content/homepage'
    );
    expect(getSingletonPath(unprefixedConfig, 'homepage', 'fr')).toBe(
      'content/homepage/fr'
    );
  });
  test('shared entries are untouched', () => {
    expect(getCollectionPath(unprefixedConfig, 'tags', 'en')).toBe(
      'content/tags'
    );
    expect(getSingletonPath(unprefixedConfig, 'settings', 'en')).toBe(
      'content/settings'
    );
  });
});

describe('the locale never resolves against a slug', () => {
  test('a slug that looks like the token stays inside the collection', () => {
    expect(
      getCollectionItemPath(unprefixedConfig, 'posts', '{locale}', 'en')
    ).toBe('content/posts/{locale}');
    expect(getCollectionItemPath(i18nConfig, 'posts', '{locale}', 'en')).toBe(
      'content/posts/en/{locale}'
    );
  });
  test('a slug that looks like the token does not throw without i18n', () => {
    const noI18n = config({
      storage: { kind: 'local' },
      collections: {
        tags: collection({
          label: 'Tags',
          path: 'content/tags/*',
          slugField: 'name',
          schema: { name: fields.text({ label: 'Name' }) },
        }),
      },
    }) as Config;
    expect(getCollectionItemPath(noI18n, 'tags', '{locale}')).toBe(
      'content/tags/{locale}'
    );
  });
});

describe('getLocaleDirsToSkip', () => {
  test('skips the other locales when their directories nest inside the default', () => {
    expect(getLocaleDirsToSkip(unprefixedConfig, 'docs', 'en')).toEqual(
      new Set(['fr', 'de'])
    );
  });
  test('skips nothing for the locales that have their own directory', () => {
    expect(getLocaleDirsToSkip(unprefixedConfig, 'docs', 'fr')).toEqual(
      new Set()
    );
  });
  test('skips nothing when the locale directories are siblings', () => {
    expect(getLocaleDirsToSkip(unprefixedConfig, 'guides', 'en')).toEqual(
      new Set()
    );
  });
  test('skips nothing for a `*` collection, where a slug cannot reach into a directory', () => {
    expect(getLocaleDirsToSkip(unprefixedConfig, 'posts', 'en')).toEqual(
      new Set()
    );
  });
  test('skips nothing when the default locale is prefixed', () => {
    expect(getLocaleDirsToSkip(i18nConfig, 'posts', 'en')).toEqual(new Set());
  });
  test('skips nothing for a shared collection', () => {
    expect(getLocaleDirsToSkip(unprefixedConfig, 'tags', 'en')).toEqual(
      new Set()
    );
  });
});

describe('singletonDirHoldsOtherLocales', () => {
  test('is true for the unprefixed default', () => {
    expect(
      singletonDirHoldsOtherLocales(unprefixedConfig, 'homepage', 'en')
    ).toBe(true);
  });
  test('is false for the other locales and for shared singletons', () => {
    expect(
      singletonDirHoldsOtherLocales(unprefixedConfig, 'homepage', 'fr')
    ).toBe(false);
    expect(
      singletonDirHoldsOtherLocales(unprefixedConfig, 'settings', 'en')
    ).toBe(false);
  });
  test('is false when the default locale is prefixed', () => {
    expect(singletonDirHoldsOtherLocales(i18nConfig, 'homepage', 'en')).toBe(
      false
    );
  });
});

describe('assertValidI18nConfig with prefixDefaultLocale: false', () => {
  test('accepts the valid config', () => {
    expect(() => assertValidI18nConfig(unprefixedConfig)).not.toThrow();
  });
  test('rejects a token that is not a whole path segment', () => {
    const bad = config({
      storage: { kind: 'local' },
      i18n: {
        locales: { en: 'English', fr: 'Français' },
        defaultLocale: 'en',
        prefixDefaultLocale: false,
      },
      collections: {
        posts: collection({
          label: 'Posts',
          localized: true,
          path: 'content/posts-{locale}/*',
          slugField: 'title',
          schema: { title: fields.text({ label: 'Title' }) },
        }),
      },
    }) as Config;
    expect(() => assertValidI18nConfig(bad)).toThrow(
      /must be a whole path segment/
    );
  });
  test('rejects a path that would be empty for the default locale', () => {
    const bad = config({
      storage: { kind: 'local' },
      i18n: {
        locales: { en: 'English', fr: 'Français' },
        defaultLocale: 'en',
        prefixDefaultLocale: false,
      },
      collections: {
        posts: collection({
          label: 'Posts',
          localized: true,
          path: '{locale}/*',
          slugField: 'title',
          schema: { title: fields.text({ label: 'Title' }) },
        }),
      },
    }) as Config;
    expect(() => assertValidI18nConfig(bad)).toThrow(/empty path/);
  });
  test('rejects a singleton that would be empty for the default locale', () => {
    const bad = config({
      storage: { kind: 'local' },
      i18n: {
        locales: { en: 'English', fr: 'Français' },
        defaultLocale: 'en',
        prefixDefaultLocale: false,
      },
      singletons: {
        homepage: singleton({
          label: 'Homepage',
          localized: true,
          path: '{locale}',
          schema: { headline: fields.text({ label: 'Headline' }) },
        }),
      },
    }) as Config;
    expect(() => assertValidI18nConfig(bad)).toThrow(/empty path/);
  });
  test('a partial-segment token is still allowed when the default locale is prefixed', () => {
    const ok = config({
      storage: { kind: 'local' },
      i18n: { locales: { en: 'English' }, defaultLocale: 'en' },
      collections: {
        posts: collection({
          label: 'Posts',
          localized: true,
          path: 'content/posts-{locale}/*',
          slugField: 'title',
          schema: { title: fields.text({ label: 'Title' }) },
        }),
      },
    }) as Config;
    expect(() => assertValidI18nConfig(ok)).not.toThrow();
  });
});

describe('locale codes must be usable as a directory name', () => {
  const withCode = (code: string) =>
    config({
      storage: { kind: 'local' },
      i18n: { locales: { en: 'English', [code]: 'Bad' }, defaultLocale: 'en' },
    }) as Config;
  test('rejects codes that are not a single path segment', () => {
    expect(() => assertValidI18nConfig(withCode('a/b'))).toThrow(
      /single path segment/
    );
    expect(() => assertValidI18nConfig(withCode('..'))).toThrow(
      /single path segment/
    );
    expect(() => assertValidI18nConfig(withCode(''))).toThrow(
      /single path segment/
    );
  });
});

const templateConfig = config({
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
    plain: collection({
      label: 'Plain',
      path: 'content/plain/*',
      slugField: 'title',
      schema: { title: fields.text({ label: 'Title' }) },
    }),
  },
}) as Config;

describe('getCollectionTemplatePath', () => {
  test('resolves the locale in a template path', () => {
    expect(getCollectionTemplatePath(templateConfig, 'posts', 'en')).toBe(
      'content/posts/en/_template'
    );
    expect(getCollectionTemplatePath(templateConfig, 'posts', 'fr')).toBe(
      'content/posts/fr/_template'
    );
  });
  test('leaves a template without the token shared across locales', () => {
    expect(getCollectionTemplatePath(templateConfig, 'shared', 'en')).toBe(
      'content/_templates/shared'
    );
    expect(getCollectionTemplatePath(templateConfig, 'shared', 'fr')).toBe(
      'content/_templates/shared'
    );
  });
  test('is undefined when the collection has no template', () => {
    expect(getCollectionTemplatePath(templateConfig, 'plain', 'en')).toBe(
      undefined
    );
  });
  test('drops the segment for the unprefixed default locale', () => {
    const unprefixed = config({
      storage: { kind: 'local' },
      i18n: {
        locales: { en: 'English', fr: 'Français' },
        defaultLocale: 'en',
        prefixDefaultLocale: false,
      },
      collections: {
        posts: collection({
          label: 'Posts',
          localized: true,
          path: 'content/posts/{locale}/*',
          template: 'content/posts/{locale}/_template',
          slugField: 'title',
          schema: { title: fields.text({ label: 'Title' }) },
        }),
      },
    }) as Config;
    expect(getCollectionTemplatePath(unprefixed, 'posts', 'en')).toBe(
      'content/posts/_template'
    );
    expect(getCollectionTemplatePath(unprefixed, 'posts', 'fr')).toBe(
      'content/posts/fr/_template'
    );
  });
});

describe('assertValidI18nConfig checks templates', () => {
  test('accepts a localized template and a shared one', () => {
    expect(() => assertValidI18nConfig(templateConfig)).not.toThrow();
  });
  test('rejects the token in a template when i18n is not set', () => {
    const bad = config({
      storage: { kind: 'local' },
      collections: {
        posts: collection({
          label: 'Posts',
          path: 'content/posts/*',
          template: 'content/posts/{locale}/_template',
          slugField: 'title',
          schema: { title: fields.text({ label: 'Title' }) },
        }),
      },
    }) as Config;
    expect(() => assertValidI18nConfig(bad)).toThrow(
      /template but config.i18n is not set/
    );
  });
  test('rejects the token in a template when the collection is not localized', () => {
    const bad = config({
      storage: { kind: 'local' },
      i18n: { locales: { en: 'English' }, defaultLocale: 'en' },
      collections: {
        posts: collection({
          label: 'Posts',
          path: 'content/posts/*',
          template: 'content/posts/{locale}/_template',
          slugField: 'title',
          schema: { title: fields.text({ label: 'Title' }) },
        }),
      },
    }) as Config;
    expect(() => assertValidI18nConfig(bad)).toThrow(/is not marked localized/);
  });
  test('rejects a partial-segment token in a template when the default locale is unprefixed', () => {
    const bad = config({
      storage: { kind: 'local' },
      i18n: {
        locales: { en: 'English', fr: 'Français' },
        defaultLocale: 'en',
        prefixDefaultLocale: false,
      },
      collections: {
        posts: collection({
          label: 'Posts',
          localized: true,
          path: 'content/posts/{locale}/*',
          template: 'content/posts/tpl-{locale}',
          slugField: 'title',
          schema: { title: fields.text({ label: 'Title' }) },
        }),
      },
    }) as Config;
    expect(() => assertValidI18nConfig(bad)).toThrow(
      /must be a whole path segment/
    );
  });
});
