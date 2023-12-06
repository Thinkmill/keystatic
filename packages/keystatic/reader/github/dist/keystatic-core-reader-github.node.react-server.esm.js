import { a as cache, c as collectionReader, s as singletonReader } from '../../../dist/generic-3995a9b3.node.react-server.esm.js';
import { ag as fixPath, t as treeEntriesToTreeNodes, d as getTreeNodeAtPath } from '../../../dist/index-38c42f5e.node.react-server.esm.js';
import 'react/jsx-runtime';
import '@sindresorhus/slugify';
import '@braintree/sanitize-url';
import '../../../dist/required-files-0b1772f9.node.react-server.esm.js';
import 'emery';
import 'js-yaml';
import 'react';
import '@markdoc/markdoc';
import 'slate';
import 'emery/assertions';
import 'js-base64';
import 'crypto';
import '../../../dist/empty-field-ui-5b08ee07.node.react-server.esm.js';
import '@emotion/weak-memoize';

function createGitHubReader(config, opts) {
  var _opts$ref;
  const ref = (_opts$ref = opts.ref) !== null && _opts$ref !== void 0 ? _opts$ref : 'HEAD';
  const pathPrefix = opts.pathPrefix ? fixPath(opts.pathPrefix) + '/' : '';
  const getTree = cache(async function loadTree() {
    const res = await fetch(`https://api.github.com/repos/${opts.repo}/git/trees/${ref}?recursive=1`, {
      headers: opts.token ? {
        Authorization: `Bearer ${opts.token}`
      } : {},
      cache: 'no-store'
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch tree: ${res.status} ${await res.text()}`);
    }
    const {
      tree,
      sha
    } = await res.json();
    return {
      tree: treeEntriesToTreeNodes(tree),
      sha
    };
  });
  const fs = {
    async fileExists(path) {
      const {
        tree
      } = await getTree();
      const node = getTreeNodeAtPath(tree, fixPath(`${pathPrefix}${path}`));
      return (node === null || node === void 0 ? void 0 : node.entry.type) === 'blob';
    },
    async readdir(path) {
      const {
        tree
      } = await getTree();
      const node = getTreeNodeAtPath(tree, fixPath(`${pathPrefix}${path}`));
      if (!(node !== null && node !== void 0 && node.children)) return [];
      const filtered = [];
      for (const [name, val] of node.children) {
        if (val.entry.type === 'tree') {
          filtered.push({
            name,
            kind: 'directory'
          });
        }
        if (val.entry.type === 'blob') {
          filtered.push({
            name,
            kind: 'file'
          });
        }
      }
      return filtered;
    },
    async readFile(path) {
      const {
        sha
      } = await getTree();
      const res = await fetch(`https://raw.githubusercontent.com/${opts.repo}/${sha}/${pathPrefix}${path}`, {
        headers: opts.token ? {
          Authorization: `Bearer ${opts.token}`
        } : {}
      });
      if (res.status === 404) return null;
      if (!res.ok) {
        throw new Error(`Failed to fetch ${path}: ${await res.text()}`);
      }
      return new Uint8Array(await res.arrayBuffer());
    }
  };
  return {
    collections: Object.fromEntries(Object.keys(config.collections || {}).map(key => [key, collectionReader(key, config, fs)])),
    singletons: Object.fromEntries(Object.keys(config.singletons || {}).map(key => [key, singletonReader(key, config, fs)])),
    config
  };
}

export { createGitHubReader };
