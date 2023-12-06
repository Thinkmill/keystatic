import fs from 'fs/promises';
import path from 'path';
import { ak as sha1, a1 as getDirectoriesForTreeKey, l as getCollectionPath, N as object, aa as getSingletonFormat, c as getSingletonPath } from './index-38c42f5e.node.react-server.esm.js';
import { assert } from 'emery';
import 'react/jsx-runtime';
import '@sindresorhus/slugify';
import '@braintree/sanitize-url';
import ignore from 'ignore';

function blobSha(contents) {
  const blobPrefix = textEncoder.encode('blob ' + contents.length + '\0');
  const array = new Uint8Array(blobPrefix.byteLength + contents.byteLength);
  array.set(blobPrefix, 0);
  array.set(contents, blobPrefix.byteLength);
  return sha1(array);
}
function getNodeAtPath(tree, path) {
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
function getFilename(path) {
  return path.replace(/.*\//, '');
}
function getDirname(path) {
  if (!path.includes('/')) return '';
  return path.replace(/\/[^/]+$/, '');
}
function toTreeChanges(changes) {
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
const textEncoder = new TextEncoder();
const SPACE_CHAR_CODE = 32;
const space = new Uint8Array([SPACE_CHAR_CODE]);
const nullchar = new Uint8Array([0]);
const tree = textEncoder.encode('tree ');

// based on https://github.com/isomorphic-git/isomorphic-git/blob/c09dfa20ffe0ab9e6602e0fa172d72ba8994e443/src/models/GitTree.js#L108-L122
function treeSha(children) {
  const entries = [...children].map(([name, node]) => ({
    name,
    sha: node.entry.sha,
    mode: node.entry.mode
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
  return sha1(concatBytes([tree, textEncoder.encode(treeObject.reduce((sum, val) => sum + val.byteLength, 0).toString()), nullchar, ...treeObject]));
}
function concatBytes(byteArrays) {
  const totalLength = byteArrays.reduce((sum, arr) => sum + arr.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of byteArrays) {
    result.set(arr, offset);
    offset += arr.byteLength;
  }
  return result;
}
function hexToBytes(str) {
  const bytes = new Uint8Array(str.length / 2);
  for (var i = 0; i < bytes.byteLength; i += 1) {
    const start = i * 2;
    bytes[i] = parseInt(str.slice(start, start + 2), 16);
  }
  return bytes;
}
async function createTreeNodeEntry(path, children) {
  const sha = await treeSha(children);
  return {
    path,
    mode: '040000',
    type: 'tree',
    sha
  };
}
async function createBlobNodeEntry(path, contents) {
  const sha = 'sha' in contents ? contents.sha : await blobSha(contents);
  return {
    path,
    mode: '100644',
    type: 'blob',
    sha,
    size: contents.byteLength
  };
}
async function updateTreeWithChanges(tree, changes) {
  var _await$updateTree;
  const newTree = (_await$updateTree = await updateTree(tree, toTreeChanges(changes), [])) !== null && _await$updateTree !== void 0 ? _await$updateTree : new Map();
  return {
    entries: treeToEntries(newTree),
    sha: await treeSha(newTree !== null && newTree !== void 0 ? newTree : new Map())
  };
}
function treeToEntries(tree) {
  return [...tree.values()].flatMap(x => x.children ? [x.entry, ...treeToEntries(x.children)] : [x.entry]);
}
async function updateTree(tree, changedTree, path) {
  const newTree = new Map(tree);
  for (const [key, value] of changedTree) {
    if (value === 'delete') {
      newTree.delete(key);
    }
    if (value instanceof Map) {
      var _newTree$get$children, _newTree$get;
      const existingChildren = (_newTree$get$children = (_newTree$get = newTree.get(key)) === null || _newTree$get === void 0 ? void 0 : _newTree$get.children) !== null && _newTree$get$children !== void 0 ? _newTree$get$children : new Map();
      const children = await updateTree(existingChildren, value, path.concat(key));
      if (children === undefined) {
        newTree.delete(key);
        continue;
      }
      const entry = await createTreeNodeEntry(path.concat(key).join('/'), children);
      newTree.set(key, {
        entry,
        children
      });
    }
    if (typeof value === 'object' && 'sha' in value) {
      const entry = await createBlobNodeEntry(path.concat(key).join('/'), value);
      newTree.set(key, {
        entry
      });
    }
  }
  if (newTree.size === 0) {
    return undefined;
  }
  return newTree;
}

async function readDirEntries(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, {
      withFileTypes: true
    });
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }
  return entries;
}
async function collectEntriesInDir(baseDir, ancestors) {
  const currentRelativeDir = ancestors.map(p => p.segment).join('/');
  const entries = await readDirEntries(path.join(baseDir, currentRelativeDir));
  const gitignore = entries.find(entry => entry.isFile() && entry.name === '.gitignore');
  const gitignoreFilterForDescendents = gitignore ? ignore().add(await fs.readFile(path.join(baseDir, currentRelativeDir, gitignore.name), 'utf8')).createFilter() : () => true;
  const pathSegments = ancestors.map(x => x.segment);
  return (await Promise.all(entries.filter(entry => {
    if (!entry.isDirectory() && !entry.isFile() || entry.name === '.git' || entry.name === 'node_modules' || entry.name === '.next') {
      return false;
    }
    const innerPath = `${pathSegments.concat(entry.name).join('/')}${entry.isDirectory() ? '/' : ''}`;
    if (!gitignoreFilterForDescendents(innerPath)) {
      return false;
    }
    let currentPath = entry.name;
    for (let i = ancestors.length - 1; i >= 0; i--) {
      const ancestor = ancestors[i];
      currentPath = `${ancestor.segment}/${currentPath}`;
      if (!ancestor.gitignoreFilterForDescendents(currentPath)) {
        return false;
      }
    }
    return true;
  }).map(async entry => {
    if (entry.isDirectory()) {
      return collectEntriesInDir(baseDir, [...ancestors, {
        gitignoreFilterForDescendents,
        segment: entry.name
      }]);
    } else {
      const innerPath = pathSegments.concat(entry.name).join('/');
      const contents = await fs.readFile(path.join(baseDir, innerPath));
      return {
        path: innerPath,
        contents: {
          byteLength: contents.byteLength,
          sha: await blobSha(contents)
        }
      };
    }
  }))).flat();
}
async function readToDirEntries(baseDir) {
  const additions = await collectEntriesInDir(baseDir, []);
  const {
    entries
  } = await updateTreeWithChanges(new Map(), {
    additions: additions,
    deletions: []
  });
  return entries;
}
function getAllowedDirectories(config) {
  const allowedDirectories = [];
  for (const [collection, collectionConfig] of Object.entries((_config$collections = config.collections) !== null && _config$collections !== void 0 ? _config$collections : {})) {
    var _config$collections;
    allowedDirectories.push(...getDirectoriesForTreeKey(object(collectionConfig.schema), getCollectionPath(config, collection), undefined, {
      data: 'yaml',
      contentField: undefined,
      dataLocation: 'index'
    }));
  }
  for (const [singleton, singletonConfig] of Object.entries((_config$singletons = config.singletons) !== null && _config$singletons !== void 0 ? _config$singletons : {})) {
    var _config$singletons;
    allowedDirectories.push(...getDirectoriesForTreeKey(object(singletonConfig.schema), getSingletonPath(config, singleton), undefined, getSingletonFormat(config, singleton)));
  }
  return [...new Set(allowedDirectories)];
}

export { blobSha as b, getAllowedDirectories as g, readToDirEntries as r };
