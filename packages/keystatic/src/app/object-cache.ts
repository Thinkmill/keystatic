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
import { TreeNode } from './trees';
import * as s from 'superstruct';

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

export async function garbageCollectGitObjects(roots: string[]) {
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

export async function clearObjectCache() {
  await Promise.all([clear(getBlobStore()), clear(getTreeStore())]);
}
