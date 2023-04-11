import { Collection, Config, Glob, Singleton } from '../config';
import {
  ComponentSchema,
  fields,
  ObjectField,
  SlugFormField,
  ValueForReading,
  ValueForReadingDeep,
} from '../DocumentEditor/component-blocks/api';
import fs from 'fs/promises';
import path from 'path';
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
import { validateComponentBlockProps } from '../validate-component-block-props';
import {
  getRequiredFiles,
  loadDataFile,
  parseSerializedFormField,
} from '../app/required-files';
import { getValueAtPropPath } from '../DocumentEditor/component-blocks/utils';
import { Dirent } from 'fs';

type EntryReaderOpts = { resolveLinkedFiles?: boolean };

type ValueForReadingWithMode<
  Schema extends ComponentSchema,
  Opts extends boolean | undefined
> = Opts extends true ? ValueForReadingDeep<Schema> : ValueForReading<Schema>;

type OptionalChain<
  T extends {} | undefined,
  Key extends keyof (T & {})
> = T extends {} ? T[Key] : undefined;

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
          ? Schema[Key] extends SlugFormField<any, infer SlugSerializedValue>
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
  all: <Opts extends [opts?: EntryReaderOpts]>(
    ...opts: Opts & [opts?: EntryReaderOpts]
  ) => Promise<
    {
      slug: string;
      entry: {
        [Key in keyof Schema]: SlugField extends Key
          ? Schema[Key] extends SlugFormField<any, infer SlugSerializedValue>
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
};

async function getAllEntries(
  root: string,
  prefix: string
): Promise<{ entry: Dirent; name: string }[]> {
  return (
    await Promise.all(
      (
        await fs
          .readdir(path.join(root, prefix), { withFileTypes: true })
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
  async function list() {
    const entries: { entry: Dirent; name: string }[] =
      glob === '*'
        ? (
            await fs
              .readdir(path.join(repoPath, collectionPath), {
                withFileTypes: true,
              })
              .catch(err => {
                if ((err as any).code === 'ENOENT') {
                  return [];
                }
                throw err;
              })
          ).map(x => ({ entry: x, name: x.name }))
        : await getAllEntries(path.join(repoPath, collectionPath), '');

    return (
      await Promise.all(
        entries.map(async x => {
          if (formatInfo.dataLocation === 'index') {
            if (!x.entry.isDirectory()) return [];
            try {
              await fs.stat(
                path.join(
                  repoPath,
                  getEntryDataFilepath(
                    `${collectionPath}/${x.name}`,
                    formatInfo
                  )
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
  }
  const read: CollectionReader<any, any>['read'] = (slug, ...args) =>
    readItem(
      schema,
      formatInfo,
      getCollectionItemPath(config, collection, slug),
      {
        field: collectionConfig.slugField,
        slug,
        glob,
      },
      repoPath,
      args[0]
    );

  return {
    read,
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

async function readItem(
  schema: ComponentSchema,
  formatInfo: FormatInfo,
  itemDir: string,
  slugField:
    | {
        slug: string;
        field: string;
        glob: Glob;
      }
    | undefined,
  repoPath: string,
  opts: EntryReaderOpts | undefined
) {
  let dataFile: Uint8Array;
  try {
    dataFile = await fs.readFile(
      path.resolve(repoPath, getEntryDataFilepath(itemDir, formatInfo))
    );
  } catch (err) {
    if ((err as any).code === 'ENOENT') {
      return null;
    }
    throw err;
  }
  const { loaded, extraFakeFile } = loadDataFile(dataFile, formatInfo);
  const validated = validateComponentBlockProps(
    schema,
    loaded,
    [],
    slugField === undefined
      ? undefined
      : {
          field: slugField.field,
          slug: slugField.slug,
          mode: 'read',
          slugs: new Set(),
          glob: slugField.glob,
        }
  );
  const requiredFiles = getRequiredFiles(validated, schema, slugField?.slug);
  await Promise.all(
    requiredFiles.map(async file => {
      const parentValue = getValueAtPropPath(
        validated,
        file.path.slice(0, -1)
      ) as any;
      const keyOnParent = file.path[file.path.length - 1];
      const originalValue = parentValue[keyOnParent];
      if (file.schema.serializeToFile.reader.requiresContentInReader) {
        const loadData = async () => {
          const loadedFiles = new Map<string, Uint8Array>();
          if (file.file) {
            const filepath = `${
              file.file.parent
                ? `${file.file.parent}${slugField ? slugField.slug : ''}`
                : itemDir
            }/${file.file.filename}`;
            if (file.file.filename === extraFakeFile?.path) {
              loadedFiles.set(filepath, extraFakeFile.contents);
            } else {
              const contents = await fs
                .readFile(path.resolve(repoPath, filepath))
                .catch(x => {
                  if ((x as any).code === 'ENOENT') return undefined;
                  throw x;
                });
              if (contents) {
                loadedFiles.set(filepath, contents);
              }
            }
          }
          return parseSerializedFormField(
            originalValue,
            file,
            loadedFiles,
            'read',
            itemDir,
            slugField?.slug,
            validated,
            schema
          );
        };
        if (opts?.resolveLinkedFiles) {
          parentValue[keyOnParent] = await loadData();
        } else {
          parentValue[keyOnParent] = loadData;
        }
      } else {
        parentValue[keyOnParent] = parseSerializedFormField(
          originalValue,
          file,
          new Map(),
          'read',
          itemDir,
          slugField?.slug,
          validated,
          schema
        );
      }
    })
  );

  return validated;
}

function singletonReader(
  repoPath: string,
  singleton: string,
  config: Config
): SingletonReader<any> {
  const formatInfo = getSingletonFormat(config, singleton);
  const singletonPath = getSingletonPath(config, singleton);
  const schema = fields.object(config.singletons![singleton].schema);
  return {
    read: (...args) =>
      readItem(schema, formatInfo, singletonPath, undefined, repoPath, args[0]),
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
