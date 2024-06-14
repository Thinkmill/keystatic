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

function createMinimalFsForGitHubWithRecursiveTree(opts: {
  token: string | undefined;
  ref: string;
  pathPrefix: string;
  fetch: typeof globalThis.fetch;
  repo: string;
}): MinimalFs {
  const getTree = cache(async function loadTree() {
    const res = await opts.fetch(
      `https://api.github.com/repos/${opts.repo}/git/trees/${opts.ref}?recursive=1`,
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
  return {
    async fileExists(path) {
      const { tree } = await getTree();
      const node = getTreeNodeAtPath(
        tree,
        fixPath(`${opts.pathPrefix}${path}`)
      );
      return node?.entry.type === 'blob';
    },
    async readdir(path) {
      const { tree } = await getTree();
      const node = getTreeNodeAtPath(
        tree,
        fixPath(`${opts.pathPrefix}${path}`)
      );
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
      const res = await opts.fetch(
        `https://raw.githubusercontent.com/${opts.repo}/${sha}/${opts.pathPrefix}${path}`,
        { headers: opts.token ? { Authorization: `Bearer ${opts.token}` } : {} }
      );
      if (res.status === 404) return null;
      if (!res.ok) {
        throw new Error(`Failed to fetch ${path}: ${await res.text()}`);
      }
      return new Uint8Array(await res.arrayBuffer());
    },
  };
}

const lastPartOfPathRegex = /([^/]+)$/;

function toTreeNodes(entries: TreeEntry[]) {
  const nodes = new Map<string, TreeEntry>();
  for (const entry of entries) {
    const lastPart = entry.path.match(lastPartOfPathRegex)?.[1];
    if (!lastPart) continue;
    nodes.set(lastPart, entry);
  }
  return nodes;
}

function createMinimalFsForGitHubWithShallowTree(opts: {
  token: string | undefined;
  ref: string;
  pathPrefix: string;
  fetch: typeof globalThis.fetch;
  repo: string;
}): MinimalFs {
  const getRootTree = cache(async function loadTree() {
    const res = await opts.fetch(
      `https://api.github.com/repos/${opts.repo}/git/trees/${opts.ref}`,
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

    return { tree: toTreeNodes(tree), sha };
  });
  const getChildTree = cache(async function loadChildTree(treeSha: string) {
    const res = await opts.fetch(
      `https://api.github.com/repos/${opts.repo}/git/trees/${treeSha}`,
      { headers: opts.token ? { Authorization: `Bearer ${opts.token}` } : {} }
    );
    if (!res.ok) {
      throw new Error(
        `Failed to fetch tree: ${res.status} ${await res.text()}`
      );
    }
    const { tree }: { tree: TreeEntry[] } = await res.json();
    return toTreeNodes(tree);
  });

  async function getTreeForPath(path: string[]) {
    const { tree } = await getRootTree();
    let currentTree = tree;
    for (const part of path) {
      const node = currentTree.get(part);
      if (node?.type !== 'tree') return undefined;
      currentTree = await getChildTree(node.sha);
    }
    return currentTree;
  }
  return {
    async fileExists(path) {
      const fullPath = fixPath(`${opts.pathPrefix}${path}`).split('/');
      const tree = await getTreeForPath(fullPath.slice(0, -1));
      return tree?.get(fullPath[fullPath.length - 1])?.type === 'blob';
    },
    async readdir(path) {
      const fullPath = fixPath(`${opts.pathPrefix}${path}`).split('/');
      const tree = await getTreeForPath(fullPath);
      if (!tree) return [];
      const filtered: { name: string; kind: 'file' | 'directory' }[] = [];
      for (const [name, val] of tree) {
        if (val.type === 'tree') {
          filtered.push({ name, kind: 'directory' });
        }
        if (val.type === 'blob') {
          filtered.push({ name, kind: 'file' });
        }
      }
      return filtered;
    },
    async readFile(path) {
      const { sha } = await getRootTree();
      const res = await opts.fetch(
        `https://raw.githubusercontent.com/${opts.repo}/${sha}/${opts.pathPrefix}${path}`,
        { headers: opts.token ? { Authorization: `Bearer ${opts.token}` } : {} }
      );
      if (res.status === 404) return null;
      if (!res.ok) {
        throw new Error(`Failed to fetch ${path}: ${await res.text()}`);
      }
      return new Uint8Array(await res.arrayBuffer());
    },
  };
}

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
    /**
     * - `recursive` fetches the entire git tree at once, which is faster
     *    latency-wise but downloads more data and each tree can't be cached
     * - `shallow` fetches each level of the tree as needed
     *   This will be worse latency-wise because there will be more
     *   round-trips to GitHub but less data will be downloaded
     *   and each tree can be cached separately
     *
     * @default 'recursive'
     */
    treeFetchStrategy?: 'recursive' | 'shallow';
    fetch?: typeof globalThis.fetch;
  }
): Reader<Collections, Singletons> {
  const fetch = opts.fetch ?? globalThis.fetch;
  const ref = opts.ref ?? 'HEAD';
  const pathPrefix = opts.pathPrefix ? fixPath(opts.pathPrefix) + '/' : '';
  const fs = (
    opts.treeFetchStrategy === 'shallow'
      ? createMinimalFsForGitHubWithShallowTree
      : createMinimalFsForGitHubWithRecursiveTree
  )({
    pathPrefix,
    ref,
    token: opts.token,
    fetch,
    repo: opts.repo,
  });
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
