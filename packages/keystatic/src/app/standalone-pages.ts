import { useCallback, useMemo } from 'react';

import { Config } from '../config';
import { ComponentSchema, ObjectField } from '../form/api';
import { getInitialPropsValue } from '../form/initial-values';
import { parseProps } from '../form/parse-props';

import { loadDataFile } from './required-files';
import { useConfig } from './shell/context';
import { useBaseCommit, useChanged, useRepoInfo, useTree } from './shell/data';
import { LOADING, useData } from './useData';
import { useItemData, fetchBlob } from './useItemData';
import {
  FormatInfo,
  getCollectionFormat,
  getCollectionItemPath,
  getEntriesInCollectionWithTreeKey,
  getEntryDataFilepath,
  getSingletonFormat,
  getSingletonPath,
  getSlugFromState,
  getSlugGlobForCollection,
} from './utils';

type StandalonePageSourceKind = 'collection' | 'singleton';

export type StandalonePageRoute =
  | {
      key: string;
      kind: 'create';
      sourceKind: StandalonePageSourceKind;
    }
  | {
      key: string;
      kind: 'edit';
      slug: string;
      sourceKind: StandalonePageSourceKind;
    };

export type StandalonePageItem = {
  changed: boolean;
  href: string;
  id: string;
  key: string;
  label: string;
  slug: string;
  sourceKind: StandalonePageSourceKind;
};

export type StandalonePageCollection = {
  createHref: string;
  key: string;
  label: string;
  sourceKind: StandalonePageSourceKind;
};

export type StandalonePageSingleton = {
  itemSchema: ObjectField<Record<string, ComponentSchema>>;
  itemsField: string;
  key: string;
  label: string;
  slugField: string;
  titleField?: string;
};

const EMPTY_SCHEMA: Record<string, ComponentSchema> = {};
const EMPTY_FORMAT: FormatInfo = {
  contentField: undefined,
  data: 'yaml',
  dataLocation: 'index',
};

export function getStandalonePageSingleton(
  config: Config
): StandalonePageSingleton | undefined {
  for (const [key, singleton] of Object.entries(config.singletons ?? {})) {
    if (
      !key.toLowerCase().includes('page') &&
      !singleton.label.toLowerCase().includes('page')
    ) {
      continue;
    }
    const itemsField = singleton.schema.items;
    if (!itemsField || itemsField.kind !== 'array') {
      continue;
    }
    if (itemsField.element.kind !== 'object') {
      continue;
    }
    const itemSchema: ObjectField<Record<string, ComponentSchema>> =
      itemsField.element;

    const slugField = Object.keys(itemSchema.fields).find(fieldKey => {
      const field = itemSchema.fields[fieldKey];
      return field.kind === 'form' && field.formKind === 'slug';
    });

    if (!slugField) {
      continue;
    }

    const titleField = 'title' in itemSchema.fields ? 'title' : undefined;

    return {
      itemSchema,
      itemsField: 'items',
      key,
      label: singleton.label,
      slugField,
      titleField,
    };
  }
}

export function getStandalonePageCollectionKeys(config: Config) {
  return Object.keys(config.collections ?? {}).filter(collection => {
    const collectionConfig = config.collections?.[collection];
    if (!collectionConfig) {
      return false;
    }
    return (
      collection.toLowerCase().includes('page') ||
      collectionConfig.label.toLowerCase().includes('page')
    );
  });
}

function getStandalonePageDefinition(config: Config) {
  const singleton = getStandalonePageSingleton(config);
  if (singleton) {
    return { kind: 'singleton' as const, key: singleton.key };
  }
  const collections = getStandalonePageCollectionKeys(config);
  if (collections.length) {
    return { kind: 'collection' as const, key: collections[0] };
  }
}

export function getStandalonePageRouteBase(
  config: Config,
  basePath: string,
  key: string
) {
  const singleton = getStandalonePageSingleton(config);
  if (singleton?.key === key) {
    return `${basePath}/page`;
  }

  const standaloneCollections = getStandalonePageCollectionKeys(config);
  if (standaloneCollections.length === 1 && standaloneCollections[0] === key) {
    return `${basePath}/page`;
  }
  return `${basePath}/page/${encodeURIComponent(key)}`;
}

export function getStandalonePageCreatePath(
  config: Config,
  basePath: string,
  key?: string
) {
  const definition = getStandalonePageDefinition(config);
  const resolvedKey = key ?? definition?.key;
  if (!resolvedKey) {
    return `${basePath}/page/create`;
  }
  return `${getStandalonePageRouteBase(config, basePath, resolvedKey)}/create`;
}

export function getStandalonePagePath(
  config: Config,
  basePath: string,
  key: string,
  slug: string
) {
  return `${getStandalonePageRouteBase(
    config,
    basePath,
    key
  )}/${encodeURIComponent(slug)}`;
}

export function parseStandalonePageRoute(
  config: Config,
  params: string[]
): StandalonePageRoute | null {
  if (params[0] !== 'page') {
    return null;
  }

  const singleton = getStandalonePageSingleton(config);
  if (singleton) {
    if (params.length === 2 && params[1] === 'create') {
      return { key: singleton.key, kind: 'create', sourceKind: 'singleton' };
    }
    if (params.length === 2) {
      return {
        key: singleton.key,
        kind: 'edit',
        slug: params[1],
        sourceKind: 'singleton',
      };
    }
    return null;
  }

  const standaloneCollections = getStandalonePageCollectionKeys(config);
  if (!standaloneCollections.length) {
    return null;
  }

  if (standaloneCollections.length === 1) {
    const key = standaloneCollections[0];
    if (params.length === 2 && params[1] === 'create') {
      return { key, kind: 'create', sourceKind: 'collection' };
    }
    if (params.length === 2) {
      return { key, kind: 'edit', slug: params[1], sourceKind: 'collection' };
    }
    return null;
  }

  if (
    params.length !== 3 ||
    !standaloneCollections.includes(params[1]) ||
    params[2] === ''
  ) {
    return null;
  }

  return params[2] === 'create'
    ? { key: params[1], kind: 'create', sourceKind: 'collection' }
    : {
        key: params[1],
        kind: 'edit',
        slug: params[2],
        sourceKind: 'collection',
      };
}

export function getStandalonePageItemsFromState(
  singleton: StandalonePageSingleton,
  state: Record<string, unknown> | null | undefined
) {
  const items = state?.[singleton.itemsField];
  return Array.isArray(items) ? (items as Record<string, unknown>[]) : [];
}

export function getStandalonePageItemSlug(
  singleton: StandalonePageSingleton,
  item: Record<string, unknown>
) {
  return getSlugFromState(
    {
      schema: singleton.itemSchema.fields,
      slugField: singleton.slugField,
    },
    item
  );
}

export function getStandalonePageItemLabel(
  singleton: StandalonePageSingleton,
  item: Record<string, unknown>
) {
  if (singleton.titleField) {
    const title = item[singleton.titleField];
    if (typeof title === 'string' && title.trim()) {
      return title.trim();
    }
  }

  const slugValue = item[singleton.slugField];
  if (slugValue && typeof slugValue === 'object') {
    if ('name' in slugValue && typeof slugValue.name === 'string') {
      const name = slugValue.name.trim();
      if (name) {
        return name;
      }
    }
    if ('slug' in slugValue && typeof slugValue.slug === 'string') {
      const slug = slugValue.slug.trim();
      if (slug) {
        return humanizeSlug(slug);
      }
    }
  }

  try {
    return humanizeSlug(getStandalonePageItemSlug(singleton, item));
  } catch {
    return 'Untitled page';
  }
}

export function createStandalonePageItem(singleton: StandalonePageSingleton) {
  return getInitialPropsValue(singleton.itemSchema);
}

export function useStandalonePages(basePath: string) {
  const config = useConfig();
  const changeMap = useChanged();
  const trees = useTree();
  const baseCommit = useBaseCommit();
  const repoInfo = useRepoInfo();
  const singleton = useMemo(() => getStandalonePageSingleton(config), [config]);

  const singletonData = useItemData({
    config,
    dirpath: singleton
      ? getSingletonPath(config, singleton.key)
      : '__keystatic_unused_pages__',
    format: singleton
      ? getSingletonFormat(config, singleton.key)
      : EMPTY_FORMAT,
    schema: singleton ? config.singletons![singleton.key].schema : EMPTY_SCHEMA,
    slug: undefined,
  });

  const collections = useMemo(() => {
    if (singleton) {
      return [
        {
          createHref: getStandalonePageCreatePath(
            config,
            basePath,
            singleton.key
          ),
          key: singleton.key,
          label: singleton.label,
          sourceKind: 'singleton' as const,
        },
      ];
    }

    return getStandalonePageCollectionKeys(config).map(key => ({
      createHref: getStandalonePageCreatePath(config, basePath, key),
      key,
      label: config.collections![key].label,
      sourceKind: 'collection' as const,
    }));
  }, [basePath, config, singleton]);

  const singletonItems = useMemo(() => {
    if (!singleton || singletonData.kind !== 'loaded') {
      return [] as StandalonePageItem[];
    }

    const state =
      singletonData.data === 'not-found'
        ? null
        : singletonData.data.initialState;
    const items: StandalonePageItem[] = [];
    for (const item of getStandalonePageItemsFromState(singleton, state)) {
      try {
        const slug = getStandalonePageItemSlug(singleton, item);
        items.push({
          changed: changeMap.singletons.has(singleton.key),
          href: getStandalonePagePath(config, basePath, singleton.key, slug),
          id: `${singleton.key}:${slug}`,
          key: singleton.key,
          label: getStandalonePageItemLabel(singleton, item),
          slug,
          sourceKind: 'singleton',
        });
      } catch {
        continue;
      }
    }
    return items;
  }, [basePath, changeMap.singletons, config, singleton, singletonData]);

  const fallbackItems = useMemo(() => {
    const mergedTree = trees.merged;
    if (singleton || mergedTree.kind !== 'loaded') {
      return [] as StandalonePageItem[];
    }

    const items = collections.flatMap(collection => {
      const changeInfo = changeMap.collections.get(collection.key);
      return getEntriesInCollectionWithTreeKey(
        config,
        collection.key,
        mergedTree.data.current.tree
      ).map(entry => ({
        changed:
          changeInfo?.added.has(entry.slug) === true ||
          changeInfo?.changed.has(entry.slug) === true,
        href: getStandalonePagePath(
          config,
          basePath,
          collection.key,
          entry.slug
        ),
        id: `${collection.key}:${entry.slug}`,
        key: collection.key,
        label: humanizeSlug(entry.slug),
        slug: entry.slug,
        sourceKind: 'collection' as const,
      }));
    });

    return items.sort((a, b) => {
      if (a.key !== b.key) {
        return a.key.localeCompare(b.key);
      }
      return a.label.localeCompare(b.label);
    });
  }, [
    basePath,
    changeMap.collections,
    collections,
    config,
    singleton,
    trees.merged,
  ]);

  const labelData = useData(
    useCallback(async () => {
      const mergedTree = trees.merged;
      if (singleton || mergedTree.kind !== 'loaded') {
        return singleton ? new Map<string, string>() : LOADING;
      }

      const labels = new Map<string, string>();
      await Promise.all(
        fallbackItems.map(async item => {
          const collectionConfig = config.collections?.[item.key];
          if (!collectionConfig) {
            return;
          }
          try {
            const formatInfo = getCollectionFormat(config, item.key);
            const dirpath = getCollectionItemPath(config, item.key, item.slug);
            const filepath = getEntryDataFilepath(dirpath, formatInfo);
            const entry = mergedTree.data.current.entries.get(filepath);
            if (!entry) {
              return;
            }
            const blob = await fetchBlob(
              config,
              entry.sha,
              filepath,
              baseCommit,
              repoInfo
            );
            const { loaded } = loadDataFile(blob, formatInfo);
            const parsed = parseProps(
              {
                kind: 'object' as const,
                fields: collectionConfig.schema,
              },
              loaded,
              [],
              [],
              (schema, value, path) => {
                if (
                  path.length === 1 &&
                  path[0] === collectionConfig.slugField
                ) {
                  if (schema.formKind !== 'slug') {
                    throw new Error(
                      `Standalone page collection "${item.key}" must use a slug field`
                    );
                  }
                  return schema.reader.parseWithSlug(value, {
                    glob: getSlugGlobForCollection(config, item.key),
                    slug: item.slug,
                  });
                }
                if (schema.formKind === 'asset') {
                  return schema.reader.parse(value);
                }
                if (
                  schema.formKind === 'content' ||
                  schema.formKind === 'assets'
                ) {
                  return;
                }
                return schema.reader.parse(value);
              },
              true
            ) as Record<string, unknown>;
            const label = parsed[collectionConfig.slugField];
            if (typeof label === 'string' && label.trim()) {
              labels.set(item.id, label.trim());
            }
          } catch {
            return;
          }
        })
      );
      return labels;
    }, [baseCommit, config, fallbackItems, repoInfo, singleton, trees.merged])
  );

  const items = useMemo(() => {
    if (singleton) {
      return singletonItems;
    }
    if (labelData.kind !== 'loaded') {
      return fallbackItems;
    }
    return fallbackItems.map(item => ({
      ...item,
      label: labelData.data.get(item.id) ?? item.label,
    }));
  }, [fallbackItems, labelData, singleton, singletonItems]);

  const itemsByCollection = useMemo(() => {
    const grouped = new Map<string, StandalonePageItem[]>();
    for (const collection of collections) {
      grouped.set(
        collection.key,
        items.filter(item => item.key === collection.key)
      );
    }
    return grouped;
  }, [collections, items]);

  return {
    collections,
    isLoading: singleton
      ? singletonData.kind !== 'loaded'
      : trees.merged.kind !== 'loaded',
    items,
    itemsByCollection,
    singleton,
    sourceKind: singleton ? ('singleton' as const) : ('collection' as const),
  };
}

function humanizeSlug(slug: string) {
  return slug
    .split(/[-_]+/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}
