import { ColorScheme } from '@keystar/ui/types';
import { ReactElement } from 'react';

import { ComponentSchema, FormField, SlugFormField } from './form/api';
import type { Locale } from './app/l10n/locales';
import { RepoConfig } from './app/repo-config';

// Common
// ----------------------------------------------------------------------------

export type DataFormat = 'json' | 'yaml';
export type Format =
  | DataFormat
  | {
      data?: DataFormat;
      contentField?: string | [string, ...string[]];
    };
export type EntryLayout = 'content' | 'form';
export type Glob = '*' | '**';

type GlobSegmentsInPath<
  Path extends string,
  Segments extends readonly Glob[] = [],
> = Path extends `${infer Segment}/${infer Rest}`
  ? GlobSegmentsInPath<
      Rest,
      Segment extends Glob ? readonly [...Segments, Segment] : Segments
    >
  : Path extends Glob
  ? readonly [...Segments, Path]
  : Segments;

export type Collection<
  Schema extends Record<string, ComponentSchema>,
  SlugField extends string,
  SlugFields extends readonly string[] = readonly [SlugField],
> = {
  label: string;
  path?: `${string}/${Glob}` | `${string}/${Glob}/${string}`;
  entryLayout?: EntryLayout;
  format?: Format;
  previewUrl?: string;
  columns?: string[];
  template?: string;
  parseSlugForSort?: (slug: string) => string | number;
  slugField: SlugField;
  /**
   * Multiple slug fields, mapped onto the `*` segments of `path` in order.
   * The last entry must be the `slugField`. An entry's slug is the segment
   * values joined with a slash, so with `slugFields: ['locale', 'title']` and
   * two star segments in `path`, an entry with the locale `en` and the
   * slug `my-post` is stored at `content/blog/en/my-post`.
   */
  slugFields?: SlugFields;
  schema: Schema;
};

export type Singleton<Schema extends Record<string, ComponentSchema>> = {
  label: string;
  path?: string;
  entryLayout?: EntryLayout;
  format?: Format;
  previewUrl?: string;
  schema: Schema;
};

type CommonConfig<Collections, Singletons> = {
  locale?: Locale;
  cloud?: { project: string };
  ui?: UserInterface<Collections, Singletons>;
};

type CommonRemoteStorageConfig = {
  pathPrefix?: string;
  branchPrefix?: string;
};

// Interface
// ----------------------------------------------------------------------------

type BrandMark = (props: {
  colorScheme: Exclude<ColorScheme, 'auto'>; // we resolve "auto" to "light" or "dark" on the client
}) => ReactElement;
export const NAVIGATION_DIVIDER_KEY = '---';
type UserInterface<Collections, Singletons> = {
  brand?: {
    mark?: BrandMark;
    name: string;
  };
  navigation?: Navigation<
    | (keyof Collections & string)
    | (keyof Singletons & string)
    | typeof NAVIGATION_DIVIDER_KEY
  >;
};

type Navigation<K> = K[] | { [section: string]: K[] };

// Storage
// ----------------------------------------------------------------------------

type GitHubStorageConfig = {
  kind: 'github';
  repo: RepoConfig;
} & CommonRemoteStorageConfig;

export type GitHubConfig<
  Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string, readonly string[]>;
  } = {
    [key: string]: Collection<Record<string, ComponentSchema>, string, readonly string[]>;
  },
  Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
  } = {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
  },
> = {
  storage: GitHubStorageConfig;
  collections?: Collections;
  singletons?: Singletons;
} & CommonConfig<Collections, Singletons>;

type LocalStorageConfig = { kind: 'local' };

export type LocalConfig<
  Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string, readonly string[]>;
  } = {
    [key: string]: Collection<Record<string, ComponentSchema>, string, readonly string[]>;
  },
  Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
  } = {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
  },
> = {
  storage: LocalStorageConfig;
  collections?: Collections;
  singletons?: Singletons;
} & CommonConfig<Collections, Singletons>;

type CloudStorageConfig = { kind: 'cloud' } & CommonRemoteStorageConfig;

export type CloudConfig<
  Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string, readonly string[]>;
  } = {
    [key: string]: Collection<Record<string, ComponentSchema>, string, readonly string[]>;
  },
  Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
  } = {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
  },
> = {
  storage: CloudStorageConfig;
  cloud: { project: string };
  collections?: Collections;
  singletons?: Singletons;
} & CommonConfig<Collections, Singletons>;

export type Config<
  Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string, readonly string[]>;
  } = {
    [key: string]: Collection<Record<string, ComponentSchema>, string, readonly string[]>;
  },
  Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
  } = {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
  },
> = {
  storage: LocalStorageConfig | GitHubStorageConfig | CloudStorageConfig;
  collections?: Collections;
  singletons?: Singletons;
} & ({} extends Collections ? {} : { collections: Collections }) &
  ({} extends Singletons ? {} : { singletons: Singletons }) &
  CommonConfig<Collections, Singletons>;

// ============================================================================
// Functions
// ============================================================================

export function config<
  Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string, readonly string[]>;
  },
  Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
  },
>(config: Config<Collections, Singletons>) {
  return config;
}

export function collection<
  Schema extends Record<string, ComponentSchema>,
  SlugField extends {
    [K in keyof Schema]: Schema[K] extends SlugFormField<any, any, any, any>
      ? K
      : never;
  }[keyof Schema],
  const Path extends Collection<Schema, SlugField & string>['path'] = undefined,
  const SlugFields extends
    | readonly [
        {
          [K in keyof Schema]: Schema[K] extends SlugFormField<
            any,
            any,
            any,
            any
          >
            ? K & string
            : never;
        }[keyof Schema],
        ...{
          [K in keyof Schema]: Schema[K] extends SlugFormField<
            any,
            any,
            any,
            any
          >
            ? K & string
            : never;
        }[keyof Schema][],
      ]
    | undefined = undefined,
>(
  collection: Omit<Collection<Schema, SlugField & string>, 'slugFields'> & {
    columns?: {
      [K in keyof Schema]: Schema[K] extends
        | FormField<
            any,
            any,
            string | number | boolean | Date | null | undefined
          >
        | SlugFormField<any, any, any, string>
        ? K & string
        : never;
    }[keyof Schema][];
    path?: Path;
    slugFields?: SlugFields &
      (SlugFields extends readonly unknown[]
        ? [Path] extends [undefined]
          ? // without an explicit path, the collection path has a single * segment
            SlugFields['length'] extends 1
            ? unknown
            : 'slugFields with multiple entries requires a path with one * segment per entry'
          : string extends Path
          ? unknown
          : '**' extends GlobSegmentsInPath<Exclude<Path, undefined>>[number]
          ? SlugFields['length'] extends 1
            ? unknown
            : 'slugFields with multiple entries cannot be used with a ** segment in path'
          : GlobSegmentsInPath<
              Exclude<Path, undefined>
            >['length'] extends SlugFields['length']
          ? unknown
          : 'slugFields must contain exactly one entry per * segment in path'
        : unknown) &
      (SlugFields extends readonly [...(readonly unknown[]), infer Last]
        ? Last extends SlugField
          ? unknown
          : 'the last entry of slugFields must be the slugField'
        : unknown);
  }
): Collection<
  Schema,
  SlugField & string,
  [SlugFields] extends [readonly string[]]
    ? SlugFields
    : readonly [SlugField & string]
> {
  // the validation intersections on slugFields are opaque to the compiler,
  // but they always resolve to either the tuple itself or an error message
  // that rejects the call site
  return collection as Collection<
    Schema,
    SlugField & string,
    [SlugFields] extends [readonly string[]]
      ? SlugFields
      : readonly [SlugField & string]
  >;
}

export function singleton<Schema extends Record<string, ComponentSchema>>(
  collection: Singleton<Schema>
): Singleton<Schema> {
  return collection;
}
