import { isDefined } from 'emery';

import { Config, GitHubConfig } from '../config';
import { getCollectionItemSlugSuffix } from './path-utils';
import { getTreeNodeAtPath, TreeNode } from './trees';

export * from './path-utils';

export function getTreeNodeForItem(config: Config, collection: string, node: TreeNode) {
  const collectionItemSlugSuffix = getCollectionItemSlugSuffix(config, collection);
  if (!collectionItemSlugSuffix) return node;
  if (!node.children) return;
  return getTreeNodeAtPath(node.children, collectionItemSlugSuffix.slice(1));
}

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
