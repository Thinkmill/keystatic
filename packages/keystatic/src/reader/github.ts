import { Collection, ComponentSchema, Config, Singleton } from '..';
import {
  BaseReader,
  MinimalFs,
  collectionReader,
  singletonReader,
} from './generic';
import {
  TreeEntry,
  getTreeNodeAtPath,
  treeEntriesToTreeNodes,
} from '../app/trees';
import { cache } from '#react-cache-in-react-server';
import { fixPath } from '../app/path-utils';

export type { Entry, EntryWithResolvedLinkedFiles } from './generic';

export type Reader<
  Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
  },
  Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
  },
> = BaseReader<Collections, Singletons>;

export function createGitHubReader<
  Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
  },
  Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
  },
>(
  config: Config<Collections, Singletons>,
  opts: {
    repo: `${string}/${string}`;
    pathPrefix?: string;
    ref?: string;
    token?: string;
  }
): Reader<Collections, Singletons> {
  const ref = opts.ref ?? 'HEAD';
  const pathPrefix = opts.pathPrefix ? fixPath(opts.pathPrefix) + '/' : '';
  const getTree = cache(async function loadTree() {
    const res = await fetch(
      `https://api.github.com/repos/${opts.repo}/git/trees/${ref}?recursive=1`,
      {
        headers: opts.token ? { Authorization: `Bearer ${opts.token}` } : {},
        cache: 'no-store',
      }
    );
    if (!res.ok) {
      throw new Error(
        `Failed to fetch tree: ${res.status} ${await res.text()}`
      );
    }
    const { tree, sha }: { tree: TreeEntry[]; sha: string } = await res.json();
    return { tree: treeEntriesToTreeNodes(tree), sha };
  });
  const fs: MinimalFs = {
    async fileExists(path) {
      const { tree } = await getTree();
      const node = getTreeNodeAtPath(tree, fixPath(`${pathPrefix}${path}`));
      return node?.entry.type === 'blob';
    },
    async readdir(path) {
      const { tree } = await getTree();
      const node = getTreeNodeAtPath(tree, fixPath(`${pathPrefix}${path}`));
      if (!node?.children) return [];
      const filtered: { name: string; kind: 'file' | 'directory' }[] = [];
      for (const [name, val] of node.children) {
        if (val.entry.type === 'tree') {
          filtered.push({ name, kind: 'directory' });
        }
        if (val.entry.type === 'blob') {
          filtered.push({ name, kind: 'file' });
        }
      }
      return filtered;
    },
    async readFile(path) {
      const { sha } = await getTree();
      const res = await fetch(
        `https://raw.githubusercontent.com/${opts.repo}/${sha}/${pathPrefix}${path}`,
        { headers: opts.token ? { Authorization: `Bearer ${opts.token}` } : {} }
      );
      if (res.status === 404) return null;
      if (!res.ok) {
        throw new Error(`Failed to fetch ${path}: ${await res.text()}`);
      }
      return new Uint8Array(await res.arrayBuffer());
    },
  };
  return {
    collections: Object.fromEntries(
      Object.keys(config.collections || {}).map(key => [
        key,
        collectionReader(key, config as Config, fs),
      ])
    ) as any,
    singletons: Object.fromEntries(
      Object.keys(config.singletons || {}).map(key => [
        key,
        singletonReader(key, config as Config, fs),
      ])
    ) as any,
    config,
  };
}
