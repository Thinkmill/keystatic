import path from 'node:path';
import fs from 'node:fs/promises';
import { c as collectionReader, s as singletonReader } from '../../dist/generic-3995a9b3.node.react-server.esm.js';
import 'react/jsx-runtime';
import '../../dist/index-38c42f5e.node.react-server.esm.js';
import '@markdoc/markdoc';
import 'slate';
import 'emery/assertions';
import 'emery';
import 'js-base64';
import 'crypto';
import '../../dist/empty-field-ui-5b08ee07.node.react-server.esm.js';
import '@emotion/weak-memoize';
import '@sindresorhus/slugify';
import '@braintree/sanitize-url';
import '../../dist/required-files-0b1772f9.node.react-server.esm.js';
import 'js-yaml';
import 'react';

function createReader(repoPath, config) {
  const fs$1 = {
    async fileExists(path$1) {
      try {
        await fs.stat(path.join(repoPath, path$1));
        return true;
      } catch (err) {
        if (err.code === 'ENOENT') return false;
        throw err;
      }
    },
    async readdir(path$1) {
      try {
        const entries = await fs.readdir(path.join(repoPath, path$1), {
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
    async readFile(path$1) {
      try {
        return await fs.readFile(path.join(repoPath, path$1));
      } catch (err) {
        if (err.code === 'ENOENT') return null;
        throw err;
      }
    }
  };
  return {
    collections: Object.fromEntries(Object.keys(config.collections || {}).map(key => [key, collectionReader(key, config, fs$1)])),
    singletons: Object.fromEntries(Object.keys(config.singletons || {}).map(key => [key, singletonReader(key, config, fs$1)])),
    repoPath,
    config
  };
}

export { createReader };
