import nodePath from 'node:path';
import nodeFs from 'node:fs/promises';
import { c as collectionReader, s as singletonReader } from '../../dist/generic-3e9d56e7.react-server.esm.js';
import 'react/jsx-runtime';
import '../../dist/index-5160e4ae.react-server.esm.js';
import '@markdoc/markdoc';
import 'slate';
import 'emery/assertions';
import 'emery';
import 'js-base64';
import '../../dist/hex-2b4d164f.react-server.esm.js';
import '../../dist/empty-field-ui-1936cae8.react-server.esm.js';
import '@emotion/weak-memoize';
import '@sindresorhus/slugify';
import '@braintree/sanitize-url';
import '../../dist/required-files-991f5a5b.react-server.esm.js';
import 'js-yaml';
import 'react';

function createReader(repoPath, config) {
  const fs = {
    async fileExists(path) {
      try {
        await nodeFs.stat(nodePath.join(repoPath, path));
        return true;
      } catch (err) {
        if (err.code === 'ENOENT') return false;
        throw err;
      }
    },
    async readdir(path) {
      try {
        const entries = await nodeFs.readdir(nodePath.join(repoPath, path), {
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
        return await nodeFs.readFile(nodePath.join(repoPath, path));
      } catch (err) {
        if (err.code === 'ENOENT') return null;
        throw err;
      }
    }
  };
  return {
    collections: Object.fromEntries(Object.keys(config.collections || {}).map(key => [key, collectionReader(key, config, fs)])),
    singletons: Object.fromEntries(Object.keys(config.singletons || {}).map(key => [key, singletonReader(key, config, fs)])),
    repoPath,
    config
  };
}

export { createReader };
