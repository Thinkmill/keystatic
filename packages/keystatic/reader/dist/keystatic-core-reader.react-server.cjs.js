'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var nodePath = require('node:path');
var nodeFs = require('node:fs/promises');
var generic = require('../../dist/generic-f6e020c6.react-server.cjs.js');
require('react/jsx-runtime');
require('../../dist/index-ad9bbf27.react-server.cjs.js');
require('@markdoc/markdoc');
require('slate');
require('emery/assertions');
require('emery');
require('js-base64');
require('../../dist/hex-f8a6aa90.react-server.cjs.js');
require('../../dist/empty-field-ui-563fc621.react-server.cjs.js');
require('@emotion/weak-memoize');
require('@sindresorhus/slugify');
require('@braintree/sanitize-url');
require('../../dist/required-files-1bf7fa9c.react-server.cjs.js');
require('js-yaml');
require('react');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var nodePath__default = /*#__PURE__*/_interopDefault(nodePath);
var nodeFs__default = /*#__PURE__*/_interopDefault(nodeFs);

function createReader(repoPath, config) {
  const fs = {
    async fileExists(path) {
      try {
        await nodeFs__default["default"].stat(nodePath__default["default"].join(repoPath, path));
        return true;
      } catch (err) {
        if (err.code === 'ENOENT') return false;
        throw err;
      }
    },
    async readdir(path) {
      try {
        const entries = await nodeFs__default["default"].readdir(nodePath__default["default"].join(repoPath, path), {
          withFileTypes: true
        });
        const filtered = [];
        for (const entry of entries) {
          if (entry.isDirectory()) {
            filtered.push({
              name: entry.name,
              kind: 'directory'
            });
          }
          if (entry.isFile()) {
            filtered.push({
              name: entry.name,
              kind: 'file'
            });
          }
        }
        return filtered;
      } catch (err) {
        if (err.code === 'ENOENT') return [];
        throw err;
      }
    },
    async readFile(path) {
      try {
        return await nodeFs__default["default"].readFile(nodePath__default["default"].join(repoPath, path));
      } catch (err) {
        if (err.code === 'ENOENT') return null;
        throw err;
      }
    }
  };
  return {
    collections: Object.fromEntries(Object.keys(config.collections || {}).map(key => [key, generic.collectionReader(key, config, fs)])),
    singletons: Object.fromEntries(Object.keys(config.singletons || {}).map(key => [key, generic.singletonReader(key, config, fs)])),
    repoPath,
    config
  };
}

exports.createReader = createReader;
