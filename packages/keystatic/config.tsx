import {
  ObjectField,
  ValueForComponentSchema,
  ComponentSchema,
} from './DocumentEditor/component-blocks/api';

export type DataFormat = 'json' | 'yaml';
export type Format =
  | DataFormat
  | { frontmatter: DataFormat; contentField: string };

export type Collection<Schema extends Record<string, ComponentSchema>> = {
  label: string;
  directory?: string;
  directorySuffix?: string;
  format?: Format;
  getItemSlug: (value: ValueForComponentSchema<ObjectField<Schema>>) => string;
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
    [key: string]: Collection<Record<string, ComponentSchema>>;
  } = {
    [key: string]: Collection<Record<string, ComponentSchema>>;
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
    [key: string]: Collection<Record<string, ComponentSchema>>;
  } = {
    [key: string]: Collection<Record<string, ComponentSchema>>;
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
    [key: string]: Collection<Record<string, ComponentSchema>>;
  } = {
    [key: string]: Collection<Record<string, ComponentSchema>>;
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
    [key: string]: Collection<any>;
  },
  Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
  }
>(config: Config<Collections, Singletons>) {
  return config;
}

export function collection<Schema extends Record<string, ComponentSchema>>(
  collection: Collection<Schema>
): Collection<Schema> {
  return collection;
}

export function singleton<Schema extends Record<string, ComponentSchema>>(
  collection: Singleton<Schema>
): Singleton<Schema> {
  return collection;
}
