import { assert } from 'emery';
import { sha1 } from '#sha1';

type Changes = {
  additions: {
    path: string;
    contents: Uint8Array | { sha: string };
  }[];
  deletions: string[];
};

const textEncoder = new TextEncoder();

const blobShaCache = new WeakMap<Uint8Array, string | Promise<string>>();

export async function blobSha(contents: Uint8Array) {
  const cached = blobShaCache.get(contents);
  if (cached !== undefined) return cached;
  const blobPrefix = textEncoder.encode('blob ' + contents.length + '\0');
  const array = new Uint8Array(blobPrefix.byteLength + contents.byteLength);
  array.set(blobPrefix, 0);
  array.set(contents, blobPrefix.byteLength);
  const digestPromise = sha1(array);
  blobShaCache.set(contents, digestPromise);
  digestPromise.then(digest => blobShaCache.set(contents, digest));
  return digestPromise;
}

export type TreeNode = { entry: TreeEntry; children?: Map<string, TreeNode> };

export function getTreeNodeAtPath(root: Map<string, TreeNode>, path: string) {
  const parts = path.split('/');
  let node: TreeNode | undefined = root.get(parts[0]);
  for (const part of parts.slice(1)) {
    if (!node) return undefined;
    if (!node.children) return undefined;
    node = node.children.get(part);
  }
  return node;
}

export type TreeEntry = {
  path: string;
  mode: string;
  type: string;
  sha: string;
};

type TreeChanges = Map<string, NodeChanges>;
type NodeChanges = Uint8Array | { sha: string } | 'delete' | TreeChanges;

function getNodeAtPath(tree: TreeChanges, path: string): TreeChanges {
  if (path === '') return tree;
  let node = tree;
  for (const part of path.split('/')) {
    if (!node.has(part)) {
      node.set(part, new Map());
    }
    const innerNode = node.get(part);
    assert(innerNode instanceof Map, 'expected tree');
    node = innerNode;
  }
  return node;
}

function getFilename(path: string) {
  return path.replace(/.*\//, '');
}

export function getDirname(path: string) {
  if (!path.includes('/')) return '';
  return path.replace(/\/[^/]+$/, '');
}

export function toTreeChanges(changes: Changes): TreeChanges {
  const changesRoot = new Map();
  for (const deletion of changes.deletions) {
    const parentTree = getNodeAtPath(changesRoot, getDirname(deletion));
    parentTree.set(getFilename(deletion), 'delete');
  }
  for (const addition of changes.additions) {
    const parentTree = getNodeAtPath(changesRoot, getDirname(addition.path));
    parentTree.set(getFilename(addition.path), addition.contents);
  }
  return changesRoot;
}

const SPACE_CHAR_CODE = 32;
const space = new Uint8Array([SPACE_CHAR_CODE]);
const nullchar = new Uint8Array([0]);
const tree = textEncoder.encode('tree ');

// based on https://github.com/isomorphic-git/isomorphic-git/blob/c09dfa20ffe0ab9e6602e0fa172d72ba8994e443/src/models/GitTree.js#L108-L122
export function treeSha(children: Map<string, TreeNode>) {
  const entries = [...children].map(([name, node]) => ({
    name,
    sha: node.entry.sha,
    mode: node.entry.mode,
  }));
  entries.sort((a, b) => {
    const aName = a.mode === '040000' ? a.name + '/' : a.name;
    const bName = b.mode === '040000' ? b.name + '/' : b.name;
    return aName === bName ? 0 : aName < bName ? -1 : 1;
  });
  const treeObject = entries.flatMap(entry => {
    const mode = textEncoder.encode(entry.mode.replace(/^0/, ''));
    const name = textEncoder.encode(entry.name);
    const sha = hexToBytes(entry.sha);
    return [mode, space, name, nullchar, sha];
  });
  return sha1(
    concatBytes([
      tree,
      textEncoder.encode(
        treeObject.reduce((sum, val) => sum + val.byteLength, 0).toString()
      ),
      nullchar,
      ...treeObject,
    ])
  );
}

function concatBytes(byteArrays: Uint8Array[]) {
  const totalLength = byteArrays.reduce((sum, arr) => sum + arr.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of byteArrays) {
    result.set(arr, offset);
    offset += arr.byteLength;
  }
  return result;
}

function hexToBytes(str: string) {
  const bytes = new Uint8Array(str.length / 2);
  for (var i = 0; i < bytes.byteLength; i += 1) {
    const start = i * 2;
    bytes[i] = parseInt(str.slice(start, start + 2), 16);
  }
  return bytes;
}

export async function createTreeNodeEntry(
  path: string,
  children: Map<string, TreeNode>
): Promise<TreeEntry> {
  const sha = await treeSha(children);
  return {
    path,
    mode: '040000',
    type: 'tree',
    sha,
  };
}

async function createBlobNodeEntry(
  path: string,
  contents: Uint8Array | { sha: string }
): Promise<TreeEntry> {
  const sha = 'sha' in contents ? contents.sha : await blobSha(contents);
  return { path, mode: '100644', type: 'blob', sha };
}

export async function updateTreeWithChanges(
  tree: Map<string, TreeNode>,
  changes: Changes
): Promise<{
  tree: Map<string, TreeNode>;
  entries: TreeEntry[];
  sha: string;
}> {
  const newTree =
    (await updateTree(tree, toTreeChanges(changes), [])) ?? new Map();
  return {
    tree: newTree,
    entries: treeToEntries(newTree),
    sha: await treeSha(newTree ?? new Map()),
  };
}

export function treeToEntries(tree: Map<string, TreeNode>): TreeEntry[] {
  return [...tree.values()].flatMap(x =>
    x.children ? [x.entry, ...treeToEntries(x.children)] : [x.entry]
  );
}

async function updateTree(
  tree: Map<string, TreeNode>,
  changedTree: TreeChanges,
  path: string[]
): Promise<Map<string, TreeNode> | undefined> {
  const newTree = new Map(tree);
  for (const [key, value] of changedTree) {
    if (value === 'delete') {
      newTree.delete(key);
    }
    if (value instanceof Map) {
      const existingChildren = newTree.get(key)?.children ?? new Map();
      const children = await updateTree(
        existingChildren,
        value,
        path.concat(key)
      );
      if (children === undefined) {
        newTree.delete(key);
        continue;
      }
      const entry = await createTreeNodeEntry(
        path.concat(key).join('/'),
        children
      );
      newTree.set(key, { entry, children });
    }
    if (
      value instanceof Uint8Array ||
      (typeof value === 'object' && 'sha' in value)
    ) {
      const entry = await createBlobNodeEntry(
        path.concat(key).join('/'),
        value
      );
      newTree.set(key, { entry });
    }
  }
  if (newTree.size === 0) {
    return undefined;
  }
  return newTree;
}

export async function replaceEntryAtPathInTree(
  tree: Map<string, TreeNode>,
  newEntry: TreeNode,
  parentPath: string
): Promise<Map<string, TreeNode>> {
  const newTree = new Map(tree);
  if (!parentPath) {
    newTree.set(newEntry.entry.path, newEntry);
    return newTree;
  }
  const [firstPartOfTree, restOfPath] = parentPath.split('/', 1);
  const parent = newTree.get(firstPartOfTree);
  if (!parent || !parent.children) {
    const innerEntry = await replaceEntryAtPathInTree(
      new Map(),
      newEntry,
      restOfPath
    );
    const entry = await createTreeNodeEntry(firstPartOfTree, innerEntry);
    newTree.set(firstPartOfTree, {
      entry,
      children: innerEntry,
    });
    return newTree;
  }
  const newChildren = await replaceEntryAtPathInTree(
    parent.children,
    newEntry,
    restOfPath
  );
  const entry = await createTreeNodeEntry(firstPartOfTree, newChildren);
  newTree.set(firstPartOfTree, {
    entry,
    children: newChildren,
  });
  return newTree;
}

export function treeEntriesToTreeNodes(
  entries: TreeEntry[]
): Map<string, TreeNode> {
  const root = new Map<string, TreeNode>();
  const getChildrenAtPath = (parts: string[]) => {
    if (parts.length === 0) {
      return root;
    }
    let node: TreeNode | undefined = root.get(parts[0]);
    for (const part of parts.slice(1)) {
      if (!node) return undefined;
      if (!node.children) return undefined;
      node = node.children.get(part);
    }
    return node?.children;
  };
  for (const entry of entries) {
    const split = entry.path.split('/');
    const children = getChildrenAtPath(split.slice(0, -1));
    if (children) {
      children.set(split[split.length - 1], {
        entry,
        children: entry.type === 'tree' ? new Map() : undefined,
      });
    }
  }
  return root;
}
