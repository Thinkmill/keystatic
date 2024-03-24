import {
  UseStore,
  createStore,
  keys,
  entries,
  delMany,
  set,
  setMany,
  get,
  clear,
} from 'idb-keyval';
import { TreeNode, getTreeNodeAtPath, updateTreeWithChanges } from './trees';
import * as s from 'superstruct';
import { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { serializeRepoConfig } from './repo-config';
import { Config } from '..';
import { hydrateBlobCache } from './useItemData';

type StoredTreeEntry = {
  path: string;
  sha: string;
  mode: string;
};

let _treeStore: UseStore;

function getTreeStore() {
  if (!_treeStore) {
    _treeStore = createStore('keystatic-trees', 'trees');
  }
  return _treeStore;
}

let _blobStore: UseStore;

function getBlobStore() {
  if (!_blobStore) {
    _blobStore = createStore('keystatic-blobs', 'blobs');
  }
  return _blobStore;
}

export function setBlobToPersistedCache(sha: string, val: Uint8Array) {
  return set(sha, val, getBlobStore());
}

export async function getBlobFromPersistedCache(sha: string) {
  const stored = await get(sha, getBlobStore());
  if (stored instanceof Uint8Array) {
    return stored;
  }
}
let _storedTreeCache: Map<string, StoredTreeEntry[]> | undefined;

const treeSchema = s.array(
  s.object({
    path: s.string(),
    mode: s.string(),
    sha: s.string(),
  })
);

function getStoredTrees() {
  if (_storedTreeCache) {
    return _storedTreeCache;
  }
  const cache = new Map<string, StoredTreeEntry[]>();
  return entries(getTreeStore()).then(entries => {
    for (const [sha, tree] of entries) {
      if (typeof sha !== 'string') continue;
      let parsed;
      try {
        parsed = treeSchema.create(tree);
      } catch {
        continue;
      }
      cache.set(sha, parsed);
    }
    _storedTreeCache = cache;
    return cache;
  });
}

function constructTreeFromStoredTrees(
  sha: string,
  trees: Map<string, StoredTreeEntry[]>,
  parentPath = ''
): TreeNode | undefined {
  const tree = new Map<string, TreeNode>();
  const storedTree = trees.get(sha);
  if (!storedTree) {
    return;
  }
  for (const entry of storedTree) {
    const innerPath = (parentPath === '' ? '' : parentPath + '/') + entry.path;
    if (entry.mode === '040000') {
      const child = constructTreeFromStoredTrees(entry.sha, trees, innerPath);
      if (child) {
        tree.set(entry.path, child);
        continue;
      }
      return;
    }
    tree.set(entry.path, {
      entry: {
        mode: entry.mode,
        path: innerPath,
        sha: entry.sha,
        type: entry.mode === '120000' ? 'symlink' : 'blob',
      },
    });
  }
  return {
    entry: {
      mode: '040000',
      path: parentPath,
      sha,
      type: 'tree',
    },
    children: tree,
  };
}

export function getTreeFromPersistedCache(sha: string) {
  const stored = getStoredTrees();
  if (stored instanceof Map) {
    return constructTreeFromStoredTrees(sha, stored);
  }
  return stored.then(stored => constructTreeFromStoredTrees(sha, stored));
}

const extraRootsSchema = s.record(
  s.string(),
  s.object({
    sha: s.string(),
    updatedAt: s.coerce(s.date(), s.string(), x => new Date(x)),
  })
);

const ExtraRootsContext = createContext<{
  roots: Map<string, { sha: string; updatedAt: Date }>;
  set: (branch: string, sha: string) => void;
  remove: (branch: string) => void;
}>({
  roots: new Map(),
  remove: () => {},
  set: () => {},
});

export function useExtraRoots() {
  return useContext(ExtraRootsContext);
}

function getExtraRootsKey(config: Config) {
  return `ks-roots-${
    config.storage.kind === 'local'
      ? 'local'
      : config.storage.kind === 'github'
      ? serializeRepoConfig(config.storage.repo)
      : config.cloud?.project || 'cloud'
  }`;
}

export function ExtraRootsProvider(props: {
  children: ReactNode;
  config: Config;
}) {
  const [roots, setRoots] = useState<
    Map<string, { sha: string; updatedAt: Date }>
  >(() => getExtraRoots(props.config));

  const context = useMemo(() => {
    const setVal = (map: Map<string, { sha: string; updatedAt: Date }>) => {
      setRoots(map);
      localStorage.setItem(
        getExtraRootsKey(props.config),
        JSON.stringify(
          Object.fromEntries(
            [...map].map(([k, v]) => [
              k,
              { sha: v.sha, updatedAt: v.updatedAt.toISOString() },
            ])
          )
        )
      );
    };
    return {
      roots,
      set: (branch: string, sha: string) => {
        setVal(new Map(roots).set(branch, { sha, updatedAt: new Date() }));
      },
      remove: (branch: string) => {
        const newRoots = new Map(roots);
        newRoots.delete(branch);
        setVal(newRoots);
      },
    };
  }, [props.config, roots]);
  return (
    <ExtraRootsContext.Provider value={context}>
      {props.children}
    </ExtraRootsContext.Provider>
  );
}
export function getExtraRoots(
  config: Config
): Map<string, { sha: string; updatedAt: Date }> {
  const val = localStorage.getItem(getExtraRootsKey(config));
  if (!val) return new Map();
  try {
    const parsed = JSON.parse(val);
    const result = extraRootsSchema.create(parsed);
    return new Map(Object.entries(result));
  } catch {
    return new Map();
  }
}

export async function garbageCollectGitObjects(
  config: Config,
  _roots: string[]
) {
  const roots = [
    ..._roots,
    ...[...getExtraRoots(config).values()].map(x => x.sha),
  ];
  const treesToDelete = new Map<string, StoredTreeEntry[]>();
  const invalidTrees: IDBValidKey[] = [];
  for (const [sha, tree] of await getStoredTrees()) {
    if (typeof sha !== 'string') {
      invalidTrees.push(sha);
      continue;
    }
    let parsed;
    try {
      parsed = treeSchema.create(tree);
    } catch {
      invalidTrees.push(sha);
      continue;
    }
    treesToDelete.set(sha, parsed);
  }

  const allBlobs = (await keys(getBlobStore())) as string[];
  const blobsToDelete = new Set<string>(allBlobs);
  const queue = new Set<string>(roots);
  for (const sha of queue) {
    if (blobsToDelete.has(sha)) {
      blobsToDelete.delete(sha);
      continue;
    }
    const tree = treesToDelete.get(sha);
    if (tree) {
      for (const entry of tree) {
        queue.add(entry.sha);
      }
      treesToDelete.delete(sha);
      continue;
    }
  }
  const treeKeysToDelete = [...treesToDelete.keys(), ...invalidTrees];
  await Promise.all([
    delMany([...blobsToDelete], getBlobStore()),
    delMany([...treesToDelete.keys(), ...invalidTrees], getTreeStore()),
  ]);
  for (const key of treeKeysToDelete) {
    _storedTreeCache?.delete(key as string);
  }
}

export function setTreeToPersistedCache(
  sha: string,
  children: Map<string, TreeNode>
) {
  const allTrees: [string, StoredTreeEntry[]][] = [];
  collectTrees(sha, children, allTrees);
  if (_storedTreeCache) {
    for (const [key, value] of allTrees) {
      _storedTreeCache.set(key, value);
    }
  }
  return setMany(allTrees, getTreeStore());
}

function collectTrees(
  sha: string,
  children: Map<string, TreeNode>,
  allTrees: [string, StoredTreeEntry[]][]
) {
  const entries: StoredTreeEntry[] = [];
  for (const [path, entry] of children) {
    entries.push({
      path: path.replace(/.*\//, ''),
      mode: entry.entry.mode,
      sha: entry.entry.sha,
    });
    if (entry.children) {
      collectTrees(entry.entry.sha, entry.children, allTrees);
    }
  }
  allTrees.push([sha, entries]);
}

export async function clearObjectStore(config: Config) {
  localStorage.removeItem(getExtraRootsKey(config));
  await Promise.all([clear(getBlobStore()), clear(getTreeStore())]);
}

export async function writeChangesToLocalObjectStore(opts: {
  additions: { path: string; contents: Uint8Array }[];
  initialFiles: string[];
  unscopedTree: Map<string, TreeNode>;
}) {
  const additionPathToSha = new Map(
    await Promise.all(
      opts.additions.map(
        async addition =>
          [addition.path, await hydrateBlobCache(addition.contents)] as const
      )
    )
  );

  const filesToDelete = new Set(opts.initialFiles);
  for (const file of opts.additions) {
    filesToDelete.delete(file.path);
  }

  const additions = opts.additions.filter(addition => {
    const sha = additionPathToSha.get(addition.path)!;
    const existing = getTreeNodeAtPath(opts.unscopedTree, addition.path);
    return existing?.entry.sha !== sha;
  });

  const updatedTree = await updateTreeWithChanges(opts.unscopedTree, {
    additions,
    deletions: [...filesToDelete],
  });
  await setTreeToPersistedCache(updatedTree.sha, updatedTree.tree);
  return updatedTree.sha;
}
