import { ColorScheme } from '@keystar/ui/types';
import { ReactElement, ReactNode } from 'react';

import { ComponentSchema, FormField, SlugFormField } from './form/api';
import type { Locale } from './app/l10n/locales';
import { RepoConfig } from './app/repo-config';
import type { ToastOptions } from '@keystar/ui/toast';

// Common
// ----------------------------------------------------------------------------

export type ActionContext<Schema extends Record<string, ComponentSchema>> = {
  schema: Schema;
  currentState: Record<string, unknown>;
  setState: (newState: Record<string, unknown>) => void;
  collectionConfig: Collection<Schema, any>;
  validateState: () => boolean;
  toast: {
    positive: (message: string, options?: ToastOptions) => void;
    negative: (message: string, options?: ToastOptions) => void;
  };
};

export type ActionResult =
  | { success: true; message?: string; newState?: Record<string, unknown> }
  | { success: false; error: string };

export type CollectionAction<
  Schema extends Record<string, ComponentSchema> = any,
> = {
  key: string;
  label: string;
  icon?: ReactElement | ((props: any) => ReactElement | null) | any;
  description?: string;
  handler: (context: ActionContext<Schema>) => Promise<ActionResult>;
  condition?: (context: ActionContext<Schema>) => boolean;
  component?: (props: {
    context: ActionContext<Schema>;
    onAction: () => Promise<void>;
  }) => ReactElement | ReactNode;
};

export type DataFormat = 'json' | 'yaml';
export type Format =
  | DataFormat
  | {
      data?: DataFormat;
      contentField?: string | [string, ...string[]];
    };
export type EntryLayout = 'content' | 'form';
export type Glob = '*' | '**';
export type Collection<
  Schema extends Record<string, ComponentSchema>,
  SlugField extends string,
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
  schema: Schema;
  actions?: CollectionAction<Schema>[];
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

// LFS Configuration
// ----------------------------------------------------------------------------

/**
 * Git LFS configuration for storing binary files on a custom LFS server
 * instead of base64-encoding them directly into Git commits.
 *
 * Uses a proxy endpoint to inject credentials server-side, keeping secrets
 * out of client-side code.
 */
export type LfsConfig = {
  /** Enable LFS support */
  enabled: boolean;
  /**
   * Proxy endpoint that handles LFS batch requests with server-side credentials.
   * The proxy receives the batch request, injects R2 credentials, and forwards
   * to the LFS server. Bucket is passed as a query parameter.
   * @default '/api/keystatic/lfs/batch'
   */
  proxyEndpoint?: string;
  /** R2 bucket name (passed to proxy as query parameter) */
  bucket: string;
  /** File size threshold in bytes (default: 0 = all matched files) */
  fileSizeThreshold?: number;
  /** File patterns to use LFS for (default: common binary patterns) */
  patterns?: string[];
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
  /** Optional LFS configuration for binary file storage */
  lfs?: LfsConfig;
} & CommonRemoteStorageConfig;

export type GitHubConfig<
  Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
  } = {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
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
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
  } = {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
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
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
  } = {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
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
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
  } = {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
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
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
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
>(
  collection: Collection<Schema, SlugField & string> & {
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
  }
): Collection<Schema, SlugField & string> {
  return collection;
}

export function singleton<Schema extends Record<string, ComponentSchema>>(
  collection: Singleton<Schema>
): Singleton<Schema> {
  return collection;
}
