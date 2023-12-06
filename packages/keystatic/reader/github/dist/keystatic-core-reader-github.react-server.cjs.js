'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var generic = require('../../../dist/generic-f6e020c6.react-server.cjs.js');
var index = require('../../../dist/index-ad9bbf27.react-server.cjs.js');
require('react/jsx-runtime');
require('@sindresorhus/slugify');
require('@braintree/sanitize-url');
require('../../../dist/required-files-1bf7fa9c.react-server.cjs.js');
require('emery');
require('js-yaml');
require('react');
require('@markdoc/markdoc');
require('slate');
require('emery/assertions');
require('js-base64');
require('../../../dist/hex-f8a6aa90.react-server.cjs.js');
require('../../../dist/empty-field-ui-563fc621.react-server.cjs.js');
require('@emotion/weak-memoize');

function createGitHubReader(config, opts) {
  var _opts$ref;
  const ref = (_opts$ref = opts.ref) !== null && _opts$ref !== void 0 ? _opts$ref : 'HEAD';
  const pathPrefix = opts.pathPrefix ? index.fixPath(opts.pathPrefix) + '/' : '';
  const getTree = generic.cache(async function loadTree() {
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
      tree: index.treeEntriesToTreeNodes(tree),
      sha
    };
  });
  const fs = {
    async fileExists(path) {
      const {
        tree
      } = await getTree();
      const node = index.getTreeNodeAtPath(tree, index.fixPath(`${pathPrefix}${path}`));
      return (node === null || node === void 0 ? void 0 : node.entry.type) === 'blob';
    },
    async readdir(path) {
      const {
        tree
      } = await getTree();
      const node = index.getTreeNodeAtPath(tree, index.fixPath(`${pathPrefix}${path}`));
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
    collections: Object.fromEntries(Object.keys(config.collections || {}).map(key => [key, generic.collectionReader(key, config, fs)])),
    singletons: Object.fromEntries(Object.keys(config.singletons || {}).map(key => [key, generic.singletonReader(key, config, fs)])),
    config
  };
}

exports.createGitHubReader = createGitHubReader;
