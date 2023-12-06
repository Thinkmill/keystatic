'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('node:path');
var fs = require('node:fs/promises');
var generic = require('../../dist/generic-e8f8efb7.node.react-server.cjs.js');
require('react/jsx-runtime');
require('../../dist/index-bdb1ae89.node.react-server.cjs.js');
require('@markdoc/markdoc');
require('slate');
require('emery/assertions');
require('emery');
require('js-base64');
require('crypto');
require('../../dist/empty-field-ui-11e96e9f.node.react-server.cjs.js');
require('@emotion/weak-memoize');
require('@sindresorhus/slugify');
require('@braintree/sanitize-url');
require('../../dist/required-files-524b6d35.node.react-server.cjs.js');
require('js-yaml');
require('react');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefault(path);
var fs__default = /*#__PURE__*/_interopDefault(fs);

function createReader(repoPath, config) {
  const fs = {
    async fileExists(path) {
      try {
        await fs__default["default"].stat(path__default["default"].join(repoPath, path));
        return true;
      } catch (err) {
        if (err.code === 'ENOENT') return false;
        throw err;
      }
    },
    async readdir(path) {
      try {
        const entries = await fs__default["default"].readdir(path__default["default"].join(repoPath, path), {
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
        return await fs__default["default"].readFile(path__default["default"].join(repoPath, path));
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
