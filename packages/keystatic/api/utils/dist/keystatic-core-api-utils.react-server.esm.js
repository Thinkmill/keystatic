import 'fs/promises';
import 'path';
import { a1 as getDirectoriesForTreeKey, l as getCollectionPath, N as object, aa as getSingletonFormat, c as getSingletonPath } from '../../../dist/index-5160e4ae.react-server.esm.js';
import 'emery';
import 'react/jsx-runtime';
import '@sindresorhus/slugify';
import '@braintree/sanitize-url';
import 'ignore';
import '@markdoc/markdoc';
import 'slate';
import 'emery/assertions';
import 'js-base64';
import '../../../dist/hex-2b4d164f.react-server.esm.js';
import '../../../dist/empty-field-ui-1936cae8.react-server.esm.js';
import '@emotion/weak-memoize';

const textEncoder = new TextEncoder();
textEncoder.encode('tree ');

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

export { getAllowedDirectories };
