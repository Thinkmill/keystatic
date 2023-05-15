import { Collection, Config, Glob, Singleton } from '../config';
import {
  ComponentSchema,
  fields,
  ObjectField,
  SlugFormField,
  ValueForReading,
  ValueForReadingDeep,
} from '../form/api';
import fs from 'fs/promises';
import nodePath from 'path';
import {
  FormatInfo,
  getCollectionFormat,
  getCollectionItemPath,
  getCollectionPath,
  getDataFileExtension,
  getEntryDataFilepath,
  getSingletonFormat,
  getSingletonPath,
  getSlugGlobForCollection,
} from '../app/path-utils';
import { parseProps } from '../form/parse-props';
import { loadDataFile } from '../app/required-files';
import { getValueAtPropPath } from '../form/props-value';
import { Dirent } from 'fs';
import { ReadonlyPropPath } from '../form/fields/document/DocumentEditor/component-blocks/utils';
import { formatFormDataError } from '../form/errors';
import { cache } from '#react-cache-in-react-server';

type EntryReaderOpts = { resolveLinkedFiles?: boolean };

type ValueForReadingWithMode<
  Schema extends ComponentSchema,
  ResolveLinkedFiles extends boolean | undefined
> = ResolveLinkedFiles extends true
  ? ValueForReadingDeep<Schema>
  : ValueForReading<Schema>;

type OptionalChain<
  T extends {} | undefined,
  Key extends keyof (T & {})
> = T extends {} ? T[Key] : undefined;

export type Entry<
  CollectionOrSingleton extends Collection<any, any> | Singleton<any>
> = CollectionOrSingleton extends Collection<infer Schema, infer SlugField>
  ? CollectionEntry<Schema, SlugField>
  : CollectionOrSingleton extends Singleton<infer Schema>
  ? SingletonEntry<Schema>
  : never;

export type EntryWithResolvedLinkedFiles<
  CollectionOrSingleton extends Collection<any, any> | Singleton<any>
> = CollectionOrSingleton extends Collection<infer Schema, infer SlugField>
  ? CollectionEntryWithResolvedLinkedFiles<Schema, SlugField>
  : CollectionOrSingleton extends Singleton<infer Schema>
  ? SingletonEntryWithResolvedLinkedFiles<Schema>
  : never;

type CollectionEntryWithResolvedLinkedFiles<
  Schema extends Record<string, ComponentSchema>,
  SlugField extends string
> = {
  [Key in keyof Schema]: SlugField extends Key
    ? Schema[Key] extends SlugFormField<
        any,
        any,
        any,
        infer SlugSerializedValue
      >
      ? SlugSerializedValue
      : ValueForReadingDeep<Schema[Key]>
    : ValueForReadingDeep<Schema[Key]>;
};

type CollectionEntry<
  Schema extends Record<string, ComponentSchema>,
  SlugField extends string
> = {
  [Key in keyof Schema]: SlugField extends Key
    ? Schema[Key] extends SlugFormField<
        any,
        any,
        any,
        infer SlugSerializedValue
      >
      ? SlugSerializedValue
      : ValueForReading<Schema[Key]>
    : ValueForReading<Schema[Key]>;
};

type SingletonEntryWithResolvedLinkedFiles<
  Schema extends Record<string, ComponentSchema>
> = ValueForReadingDeep<ObjectField<Schema>>;

type SingletonEntry<Schema extends Record<string, ComponentSchema>> =
  ValueForReading<ObjectField<Schema>>;

type CollectionReader<
  Schema extends Record<string, ComponentSchema>,
  SlugField extends string
> = {
  read: <Opts extends [opts?: EntryReaderOpts]>(
    slug: string,
    ...opts: Opts & [opts?: EntryReaderOpts]
  ) => Promise<
    | {
        [Key in keyof Schema]: SlugField extends Key
          ? Schema[Key] extends SlugFormField<
              any,
              any,
              any,
              infer SlugSerializedValue
            >
            ? SlugSerializedValue
            : ValueForReadingWithMode<
                Schema[Key],
                OptionalChain<Opts[0], 'resolveLinkedFiles'>
              >
          : ValueForReadingWithMode<
              Schema[Key],
              OptionalChain<Opts[0], 'resolveLinkedFiles'>
            >;
      }
    | null
  >;
  readOrThrow: <Opts extends [opts?: EntryReaderOpts]>(
    slug: string,
    ...opts: Opts & [opts?: EntryReaderOpts]
  ) => Promise<{
    [Key in keyof Schema]: SlugField extends Key
      ? Schema[Key] extends SlugFormField<
          any,
          any,
          any,
          infer SlugSerializedValue
        >
        ? SlugSerializedValue
        : ValueForReadingWithMode<
            Schema[Key],
            OptionalChain<Opts[0], 'resolveLinkedFiles'>
          >
      : ValueForReadingWithMode<
          Schema[Key],
          OptionalChain<Opts[0], 'resolveLinkedFiles'>
        >;
  }>;
  all: <Opts extends [opts?: EntryReaderOpts]>(
    ...opts: Opts & [opts?: EntryReaderOpts]
  ) => Promise<
    {
      slug: string;
      entry: {
        [Key in keyof Schema]: SlugField extends Key
          ? Schema[Key] extends SlugFormField<
              any,
              any,
              any,
              infer SlugSerializedValue
            >
            ? SlugSerializedValue
            : ValueForReadingWithMode<
                Schema[Key],
                OptionalChain<Opts[0], 'resolveLinkedFiles'>
              >
          : ValueForReadingWithMode<
              Schema[Key],
              OptionalChain<Opts[0], 'resolveLinkedFiles'>
            >;
      };
    }[]
  >;
  list: () => Promise<string[]>;
};

type SingletonReader<Schema extends Record<string, ComponentSchema>> = {
  read: <Opts extends [opts?: EntryReaderOpts]>(
    ...opts: Opts & [opts?: EntryReaderOpts]
  ) => Promise<ValueForReadingWithMode<
    ObjectField<Schema>,
    OptionalChain<Opts[0], 'resolveLinkedFiles'>
  > | null>;
  readOrThrow: <Opts extends [opts?: EntryReaderOpts]>(
    ...opts: Opts & [opts?: EntryReaderOpts]
  ) => Promise<
    ValueForReadingWithMode<
      ObjectField<Schema>,
      OptionalChain<Opts[0], 'resolveLinkedFiles'>
    >
  >;
};

async function getAllEntries(
  root: string,
  prefix: string
): Promise<{ entry: Dirent; name: string }[]> {
  return (
    await Promise.all(
      (
        await fs
          .readdir(nodePath.join(root, prefix), { withFileTypes: true })
          .catch(err => {
            if ((err as any).code === 'ENOENT') {
              return [];
            }
            throw err;
          })
      ).map(async dirent => {
        const name = `${prefix}${dirent.name}`;
        const entry = { entry: dirent, name };
        if (dirent.isDirectory()) {
          return [entry, ...(await getAllEntries(root, `${name}/`))];
        }
        if (dirent.isFile()) {
          return entry;
        }
        return [];
      })
    )
  ).flat();
}

const listCollection = cache(async function listCollection(
  repoPath: string,
  collectionPath: string,
  glob: Glob,
  formatInfo: FormatInfo,
  extension: string
) {
  const entries: { entry: Dirent; name: string }[] =
    glob === '*'
      ? (
          await fs
            .readdir(nodePath.join(repoPath, collectionPath), {
              withFileTypes: true,
            })
            .catch(err => {
              if ((err as any).code === 'ENOENT') {
                return [];
              }
              throw err;
            })
        ).map(x => ({ entry: x, name: x.name }))
      : await getAllEntries(nodePath.join(repoPath, collectionPath), '');

  return (
    await Promise.all(
      entries.map(async x => {
        if (formatInfo.dataLocation === 'index') {
          if (!x.entry.isDirectory()) return [];
          try {
            await fs.stat(
              nodePath.join(
                repoPath,
                getEntryDataFilepath(`${collectionPath}/${x.name}`, formatInfo)
              )
            );
            return [x.name];
          } catch (err) {
            if ((err as any).code === 'ENOENT') {
              return [];
            }
            throw err;
          }
        } else {
          if (!x.entry.isFile() || !x.name.endsWith(extension)) return [];
          return [x.name.slice(0, -extension.length)];
        }
      })
    )
  ).flat();
});

function collectionReader(
  repoPath: string,
  collection: string,
  config: Config
): CollectionReader<any, any> {
  const formatInfo = getCollectionFormat(config, collection);
  const collectionPath = getCollectionPath(config, collection);
  const collectionConfig = config.collections![collection];
  const schema = fields.object(collectionConfig.schema);
  const glob = getSlugGlobForCollection(config, collection);
  const extension = getDataFileExtension(formatInfo);

  const read: CollectionReader<any, any>['read'] = (slug, ...args) =>
    readItem(
      schema,
      formatInfo,
      getCollectionItemPath(config, collection, slug),
      repoPath,
      args[0]?.resolveLinkedFiles,
      `"${slug}" in collection "${collection}"`,
      slug,
      collectionConfig.slugField,
      glob
    );

  const list = () =>
    listCollection(repoPath, collectionPath, glob, formatInfo, extension);

  return {
    read,
    readOrThrow: async (...args) => {
      const entry = await (read as any)(...args);
      if (entry === null) {
        throw new Error(
          `Entry "${args[0]}" not found in collection "${collection}"`
        );
      }
      return entry;
    },
    // TODO: this could drop the fs.stat call that list does for each item
    // since we just immediately read it
    all: async (...args) => {
      const slugs = await list();
      return (
        await Promise.all(
          slugs.map(async slug => {
            const entry = await read(slug, args[0]);
            if (entry === null) return [];
            return [{ slug, entry }];
          })
        )
      ).flat();
    },
    list,
  };
}

const readItem = cache(async function readItem(
  rootSchema: ComponentSchema,
  formatInfo: FormatInfo,
  itemDir: string,
  repoPath: string,
  resolveLinkedFiles: boolean | undefined,
  debugReference: string,
  ...slugInfo: [slug: undefined] | [slug: string, field: string, glob: Glob]
) {
  let dataFile: Uint8Array;
  try {
    dataFile = await fs.readFile(
      nodePath.resolve(repoPath, getEntryDataFilepath(itemDir, formatInfo))
    );
  } catch (err) {
    if ((err as any).code === 'ENOENT') {
      return null;
    }
    throw err;
  }
  const { loaded, extraFakeFile } = loadDataFile(dataFile, formatInfo);

  const contentFieldPathsToEagerlyResolve: ReadonlyPropPath[] | undefined =
    resolveLinkedFiles ? [] : undefined;
  let validated: any;
  try {
    validated = parseProps(
      rootSchema,
      loaded,
      [],
      [],
      (schema, value, path, pathWithArrayFieldSlugs) => {
        if (schema.formKind === 'asset') {
          return schema.reader.parse(value);
        }
        if (schema.formKind === 'content') {
          contentFieldPathsToEagerlyResolve?.push(path);
          return async () => {
            let content: undefined | Uint8Array;
            const filename =
              pathWithArrayFieldSlugs.join('/') + schema.contentExtension;
            if (filename === extraFakeFile?.path) {
              content = extraFakeFile.contents;
            } else {
              content = await fs
                .readFile(nodePath.resolve(repoPath, `${itemDir}/${filename}`))
                .catch(x => {
                  if ((x as any).code === 'ENOENT') return undefined;
                  throw x;
                });
            }

            return schema.reader.parse(value, { content });
          };
        }
        if (path.length === 1 && slugInfo[0] !== undefined) {
          const [slug, slugField, glob] = slugInfo;
          if (path[0] === slugField) {
            if (schema.formKind !== 'slug') {
              throw new Error(`Slug field ${slugInfo[1]} is not a slug field`);
            }
            return schema.reader.parseWithSlug(value, { slug, glob });
          }
        }
        return schema.reader.parse(value);
      },
      true
    );

    if (contentFieldPathsToEagerlyResolve?.length) {
      await Promise.all(
        contentFieldPathsToEagerlyResolve.map(async path => {
          const parentValue = getValueAtPropPath(
            validated,
            path.slice(0, -1)
          ) as any;
          const keyOnParent = path[path.length - 1];
          const originalValue = parentValue[keyOnParent];
          parentValue[keyOnParent] = await originalValue();
        })
      );
    }
  } catch (err) {
    const formatted = formatFormDataError(err);
    throw new Error(`Invalid data for ${debugReference}:\n${formatted}`);
  }

  return validated;
});

function singletonReader(
  repoPath: string,
  singleton: string,
  config: Config
): SingletonReader<any> {
  const formatInfo = getSingletonFormat(config, singleton);
  const singletonPath = getSingletonPath(config, singleton);
  const schema = fields.object(config.singletons![singleton].schema);
  const read: SingletonReader<any>['read'] = (...args) =>
    readItem(
      schema,
      formatInfo,
      singletonPath,
      repoPath,
      args[0]?.resolveLinkedFiles,
      `singleton "${singleton}"`,
      undefined
    );
  return {
    read,
    readOrThrow: async (...opts) => {
      const entry = await (read as any)(...opts);
      if (entry === null) {
        throw new Error(`Singleton "${singleton}" not found`);
      }
      return entry;
    },
  };
}

export type Reader<
  Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
  },
  Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
  }
> = {
  collections: {
    [Key in keyof Collections]: CollectionReader<
      Collections[Key]['schema'],
      Collections[Key]['slugField']
    >;
  };
  singletons: {
    [Key in keyof Singletons]: SingletonReader<Singletons[Key]['schema']>;
  };
  config: Config<Collections, Singletons>;
  repoPath: string;
};

export function createReader<
  Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
  },
  Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
  }
>(
  repoPath: string,
  config: Config<Collections, Singletons>
): Reader<Collections, Singletons> {
  return {
    collections: Object.fromEntries(
      Object.keys(config.collections || {}).map(key => [
        key,
        collectionReader(repoPath, key, config),
      ])
    ) as any,
    singletons: Object.fromEntries(
      Object.keys(config.singletons || {}).map(key => [
        key,
        singletonReader(repoPath, key, config),
      ])
    ) as any,
    repoPath,
    config,
  };
}
