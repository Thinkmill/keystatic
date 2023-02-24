import { Collection, Config, Singleton } from '../config';
import {
  ComponentSchema,
  fields,
  ObjectField,
  ValueForReading,
} from '../DocumentEditor/component-blocks/api';
import fs from 'fs/promises';
import path from 'path';
import {
  FormatInfo,
  getCollectionFormat,
  getCollectionItemPath,
  getCollectionPath,
  getDataFileExtension,
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

type CollectionReader<Schema extends Record<string, ComponentSchema>> = {
  read: (id: string) => Promise<ValueForReading<ObjectField<Schema>> | null>;
  list: () => Promise<string[]>;
};

type SingletonReader<Schema extends Record<string, ComponentSchema>> = {
  read: () => Promise<ValueForReading<ObjectField<Schema>> | null>;
};

function collectionReader(
  repoPath: string,
  collection: string,
  config: Config
): CollectionReader<any> {
  const formatInfo = getCollectionFormat(config, collection);
  const extension = getDataFileExtension(formatInfo);
  const collectionPath = getCollectionPath(config, collection);
  const collectionConfig = config.collections![collection];
  const schema = fields.object(collectionConfig.schema);
  return {
    read: (slug: string) => {
      const itemDir = path.join(
        repoPath,
        getCollectionItemPath(config, collection, slug)
      );
      return readItem(schema, formatInfo, extension, itemDir, {
        field: collectionConfig.slugField,
        slug,
      });
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
                path.join(repoPath, collectionPath, x.name, `index${extension}`)
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
  extension: string,
  itemDir: string,
  slugField:
    | {
        slug: string;
        field: string;
      }
    | undefined
) {
  let dataFile: Uint8Array;
  try {
    dataFile = await fs.readFile(path.join(itemDir, `index${extension}`));
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
    {},
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
        const loadedBinaryFiles = new Map(
          (
            await Promise.all(
              file.files.map(
                async x =>
                  [
                    x,
                    x === extraFakeFile?.path
                      ? extraFakeFile.contents
                      : await fs.readFile(path.join(itemDir, x)).catch(x => {
                          if ((x as any).code === 'ENOENT') return undefined;
                          throw x;
                        }),
                  ] as const
              )
            )
          ).filter((x): x is [string, Buffer] => x[1] !== undefined)
        );
        return parseSerializedFormField(
          originalValue,
          file,
          loadedBinaryFiles,
          'read'
        );
      };
    } else {
      parentValue[keyOnParent] = parseSerializedFormField(
        originalValue,
        file,
        new Map(),
        'read'
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
  const extension = getDataFileExtension(formatInfo);
  return {
    read: () =>
      readItem(
        schema,
        formatInfo,
        extension,
        path.join(repoPath, singletonPath),
        undefined
      ),
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
    [Key in keyof Collections]: CollectionReader<Collections[Key]['schema']>;
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
