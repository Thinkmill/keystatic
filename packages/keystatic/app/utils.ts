import { isDefined } from 'emery';

import { Config, GitHubConfig } from '../config';
import { ComponentSchema, fields, SlugFormField } from '../src';
import {
  getCollectionFormat,
  getCollectionItemPath,
  getCollectionPath,
  getDataFileExtension,
} from './path-utils';
import { collectDirectoriesUsedInSchema, getTreeKey } from './tree-key';
import { getTreeNodeAtPath, TreeNode } from './trees';

export * from './path-utils';

export function pluralize(
  count: number,
  options: { singular: string; plural?: string; inclusive?: boolean }
) {
  const { singular, plural = singular + 's', inclusive = true } = options;
  const variant = count === 1 ? singular : plural;
  return inclusive ? `${count} ${variant}` : variant;
}

export function arrayOf<T>(arr: readonly (T | null)[]): T[] {
  return arr.filter(isDefined);
}
export function keyedEntries<T extends Record<string, any>>(
  obj: T
): ({ key: string } & T[keyof T])[] {
  return Object.entries(obj).map(([key, value]) => ({ key, ...value }));
}

export type MaybePromise<T> = T | Promise<T>;

export async function sha1(content: Uint8Array) {
  const hashBuffer = await crypto.subtle.digest('SHA-1', content);
  let str = '';
  for (const byte of new Uint8Array(hashBuffer)) {
    str += byte.toString(16).padStart(2, '0');
  }
  return str;
}

const textEncoder = new TextEncoder();

export function blobSha(contents: Uint8Array) {
  const blobPrefix = textEncoder.encode('blob ' + contents.length + '\0');
  const array = new Uint8Array(blobPrefix.byteLength + contents.byteLength);
  array.set(blobPrefix, 0);
  array.set(contents, blobPrefix.byteLength);
  return sha1(array);
}

export function isGitHubConfig(config: Config): config is GitHubConfig {
  return config.storage.kind === 'github';
}

export function isSlugFormField(
  schema: ComponentSchema
): schema is SlugFormField<unknown, unknown, unknown> {
  return (
    schema.kind === 'form' &&
    'slug' in schema &&
    typeof schema.slug === 'object'
  );
}

export function getSlugFromState(
  collectionConfig: {
    slugField: string;
    schema: Record<string, ComponentSchema>;
  },
  state: Record<string, unknown>
) {
  const value = state[collectionConfig.slugField];
  const field = collectionConfig.schema[collectionConfig.slugField];
  if (!isSlugFormField(field)) {
    throw new Error(`slugField is not a slug field`);
  }
  return field.slug.serialize(value).slug;
}

export function getEntriesInCollectionWithTreeKey(
  config: Config,
  collection: string,
  rootTree: Map<string, TreeNode>
): { key: string; slug: string }[] {
  const collectionConfig = config.collections![collection];
  const schema = fields.object(collectionConfig.schema);
  const formatInfo = getCollectionFormat(config, collection);
  const extension = getDataFileExtension(formatInfo);
  const collectionPath = getCollectionPath(config, collection);
  const directory: Map<string, TreeNode> =
    getTreeNodeAtPath(rootTree, collectionPath)?.children ?? new Map();
  const entries: { key: string; slug: string }[] = [];
  const directoriesUsedInSchema = [...collectDirectoriesUsedInSchema(schema)];
  for (const [key, entry] of directory) {
    if (formatInfo.dataLocation === 'index') {
      const actualEntry = getTreeNodeAtPath(
        rootTree,
        getCollectionItemPath(config, collection, key)
      );
      if (actualEntry?.children?.has('index' + extension)) {
        entries.push({
          key: getTreeKey(
            [
              actualEntry.entry.path,
              ...directoriesUsedInSchema.map(x => `${x}/${key}`),
            ],
            rootTree
          ),
          slug: key,
        });
      }
    } else {
      if (!entry.children && key.endsWith(extension)) {
        const slug = key.slice(0, -extension.length);
        entries.push({
          key: getTreeKey(
            [
              entry.entry.path,
              `${collectionPath}/${slug}`,
              ...directoriesUsedInSchema.map(x => `${x}/${slug}`),
            ],
            rootTree
          ),
          slug,
        });
      }
    }
  }
  return entries;
}
