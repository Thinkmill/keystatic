'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('fs/promises');
require('path');
var index = require('../../../dist/index-ad9bbf27.react-server.cjs.js');
require('emery');
require('react/jsx-runtime');
require('@sindresorhus/slugify');
require('@braintree/sanitize-url');
require('ignore');
require('@markdoc/markdoc');
require('slate');
require('emery/assertions');
require('js-base64');
require('../../../dist/hex-f8a6aa90.react-server.cjs.js');
require('../../../dist/empty-field-ui-563fc621.react-server.cjs.js');
require('@emotion/weak-memoize');

const textEncoder = new TextEncoder();
textEncoder.encode('tree ');

function getAllowedDirectories(config) {
  const allowedDirectories = [];
  for (const [collection, collectionConfig] of Object.entries((_config$collections = config.collections) !== null && _config$collections !== void 0 ? _config$collections : {})) {
    var _config$collections;
    allowedDirectories.push(...index.getDirectoriesForTreeKey(index.object(collectionConfig.schema), index.getCollectionPath(config, collection), undefined, {
      data: 'yaml',
      contentField: undefined,
      dataLocation: 'index'
    }));
  }
  for (const [singleton, singletonConfig] of Object.entries((_config$singletons = config.singletons) !== null && _config$singletons !== void 0 ? _config$singletons : {})) {
    var _config$singletons;
    allowedDirectories.push(...index.getDirectoriesForTreeKey(index.object(singletonConfig.schema), index.getSingletonPath(config, singleton), undefined, index.getSingletonFormat(config, singleton)));
  }
  return [...new Set(allowedDirectories)];
}

exports.getAllowedDirectories = getAllowedDirectories;
