import { Collection, Config, Singleton } from '../config';
import {
  ComponentSchema,
  fields,
  ObjectField,
  SlugFormField,
  ValueForReading,
} from '../DocumentEditor/component-blocks/api';
import fs from 'fs/promises';
import path from 'path';
import {
  FormatInfo,
  getCollectionFormat,
  getCollectionItemPath,
  getCollectionPath,
  getEntryDataFilepath,
  getSingletonFormat,
  getSingletonPath,
} from '../app/path-utils';
import { validateComponentBlockProps } from '../validate-component-block-props';
import {
  getRequiredFiles,
  loadDataFile,
  parseSerializedFormField,
} from '../app/required-files';
import { getValueAtPropPath } from '../DocumentEditor/component-blocks/utils';

type CollectionReader<
  Schema extends Record<string, ComponentSchema>,
  SlugField extends string
> = {
  read: (id: string) => Promise<
    | {
        [Key in keyof Schema]: SlugField extends Key
          ? Schema[Key] extends SlugFormField<any, any, infer Value>
            ? Value
            : ValueForReading<Schema[Key]>
          : ValueForReading<Schema[Key]>;
      }
    | null
  >;
  list: () => Promise<string[]>;
};

type SingletonReader<Schema extends Record<string, ComponentSchema>> = {
  read: () => Promise<ValueForReading<ObjectField<Schema>> | null>;
};

function collectionReader(
  repoPath: string,
  collection: string,
  config: Config
): CollectionReader<any, any> {
  const formatInfo = getCollectionFormat(config, collection);
  const collectionPath = getCollectionPath(config, collection);
  const collectionConfig = config.collections![collection];
  const schema = fields.object(collectionConfig.schema);
  return {
    read: (slug: string) => {
      return readItem(
        schema,
        formatInfo,
        getCollectionItemPath(config, collection, slug),
        {
          field: collectionConfig.slugField,
          slug,
        },
        repoPath
      );
    },
    async list() {
      const entries = await fs.readdir(path.join(repoPath, collectionPath), {
        withFileTypes: true,
      });

      return (
        await Promise.all(
          entries.map(async x => {
            if (!x.isDirectory()) return [];
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
          })
        )
      ).flat();
    },
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
      }
    | undefined,
  repoPath: string
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
        }
  );
  const requiredFiles = getRequiredFiles(validated, schema);
  for (const file of requiredFiles) {
    const parentValue = getValueAtPropPath(
      validated,
      file.path.slice(0, -1)
    ) as any;
    const keyOnParent = file.path[file.path.length - 1];
    const originalValue = parentValue[keyOnParent];
    if (file.schema.serializeToFile.reader.requiresContentInReader) {
      parentValue[keyOnParent] = async () => {
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
  }

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
    read: () =>
      readItem(schema, formatInfo, singletonPath, undefined, repoPath),
  };
}

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
): {
  collections: {
    [Key in keyof Collections]: CollectionReader<
      Collections[Key]['schema'],
      Collections[Key]['slugField']
    >;
  };
  singletons: {
    [Key in keyof Singletons]: SingletonReader<Singletons[Key]['schema']>;
  };
} {
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
  };
}
