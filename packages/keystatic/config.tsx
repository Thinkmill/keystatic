import {
  ComponentSchema,
  SlugFormField,
} from './DocumentEditor/component-blocks/api';

export type DataFormat = 'json' | 'yaml';
export type Format =
  | DataFormat
  | {
      data?: DataFormat;
      contentField?: string;
      location?: 'index' | 'outside';
    };

export type Collection<
  Schema extends Record<string, ComponentSchema>,
  SlugField extends string
> = {
  label: string;
  directory?: string;
  directorySuffix?: string;
  format?: Format;
  slugField: SlugField;
  schema: Schema;
};

export type Singleton<Schema extends Record<string, ComponentSchema>> = {
  label: string;
  directory?: string;
  format?: Format;
  schema: Schema;
};

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
  }
> = {
  storage: {
    kind: 'github';
    repo: { owner: string; name: string };
  };
  collections?: Collections;
  singletons?: Singletons;
};

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
  }
> = {
  storage: {
    kind: 'local';
  };
  collections?: Collections;
  singletons?: Singletons;
};

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
  }
> =
  | GitHubConfig<Collections, Singletons>
  | LocalConfig<Collections, Singletons>;

export function config<
  Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
  },
  Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
  }
>(config: Config<Collections, Singletons>) {
  return config;
}

export function collection<
  Schema extends Record<string, ComponentSchema>,
  SlugField extends {
    [K in keyof Schema]: Schema[K] extends SlugFormField<any, any, any>
      ? K
      : never;
  }[keyof Schema]
>(
  collection: Collection<Schema, SlugField & string>
): Collection<Schema, SlugField & string> {
  return collection;
}

export function singleton<Schema extends Record<string, ComponentSchema>>(
  collection: Singleton<Schema>
): Singleton<Schema> {
  return collection;
}
