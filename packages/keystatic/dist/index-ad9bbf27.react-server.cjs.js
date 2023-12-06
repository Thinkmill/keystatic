'use strict';

var Markdoc = require('@markdoc/markdoc');
var slate = require('slate');
var assertions = require('emery/assertions');
var emery = require('emery');
var jsBase64 = require('js-base64');
var hex = require('./hex-f8a6aa90.react-server.cjs.js');
var emptyFieldUi = require('./empty-field-ui-563fc621.react-server.cjs.js');
var jsxRuntime = require('react/jsx-runtime');
var weakMemoize = require('@emotion/weak-memoize');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var Markdoc__default = /*#__PURE__*/_interopDefault(Markdoc);
var weakMemoize__default = /*#__PURE__*/_interopDefault(weakMemoize);

function fixPath(path) {
  return path.replace(/^\.?\/+/, '').replace(/\/*$/, '');
}
const collectionPath = /\/\*\*?(?:$|\/)/;
function getConfiguredCollectionPath(config, collection) {
  var _collectionConfig$pat;
  const collectionConfig = config.collections[collection];
  const path = (_collectionConfig$pat = collectionConfig.path) !== null && _collectionConfig$pat !== void 0 ? _collectionConfig$pat : `${collection}/*/`;
  if (!collectionPath.test(path)) {
    throw new Error(`Collection path must end with /* or /** or include /*/ or /**/ but ${collection} has ${path}`);
  }
  return path;
}
function getCollectionPath(config, collection) {
  const configuredPath = getConfiguredCollectionPath(config, collection);
  const path = fixPath(configuredPath.replace(/\*\*?.*$/, ''));
  return path;
}
function getCollectionFormat(config, collection) {
  var _collectionConfig$for;
  const collectionConfig = config.collections[collection];
  return getFormatInfo((_collectionConfig$for = collectionConfig.format) !== null && _collectionConfig$for !== void 0 ? _collectionConfig$for : 'yaml', collectionConfig.schema, getConfiguredCollectionPath(config, collection));
}
function getSingletonFormat(config, singleton) {
  var _singletonConfig$form, _singletonConfig$path;
  const singletonConfig = config.singletons[singleton];
  return getFormatInfo((_singletonConfig$form = singletonConfig.format) !== null && _singletonConfig$form !== void 0 ? _singletonConfig$form : 'yaml', singletonConfig.schema, (_singletonConfig$path = singletonConfig.path) !== null && _singletonConfig$path !== void 0 ? _singletonConfig$path : `${singleton}/`);
}
function getCollectionItemPath(config, collection, slug) {
  const basePath = getCollectionPath(config, collection);
  const suffix = getCollectionItemSlugSuffix(config, collection);
  return `${basePath}/${slug}${suffix}`;
}
function getEntryDataFilepath(dir, formatInfo) {
  return `${dir}${formatInfo.dataLocation === 'index' ? '/index' : ''}${getDataFileExtension(formatInfo)}`;
}
function getSlugGlobForCollection(config, collection) {
  const collectionPath = getConfiguredCollectionPath(config, collection);
  return collectionPath.includes('**') ? '**' : '*';
}
function getCollectionItemSlugSuffix(config, collection) {
  const configuredPath = getConfiguredCollectionPath(config, collection);
  const path = fixPath(configuredPath.replace(/^[^*]+\*\*?/, ''));
  return path ? `/${path}` : '';
}
function getSingletonPath(config, singleton) {
  var _singleton$path, _singleton$path2;
  if ((_singleton$path = config.singletons[singleton].path) !== null && _singleton$path !== void 0 && _singleton$path.includes('*')) {
    throw new Error(`Singleton paths cannot include * but ${singleton} has ${config.singletons[singleton].path}`);
  }
  return fixPath((_singleton$path2 = config.singletons[singleton].path) !== null && _singleton$path2 !== void 0 ? _singleton$path2 : singleton);
}
function getDataFileExtension(formatInfo) {
  return formatInfo.contentField ? formatInfo.contentField.config.contentExtension : '.' + formatInfo.data;
}
function getFormatInfo(format, schema, path) {
  var _format$data;
  const dataLocation = path.endsWith('/') ? 'index' : 'outer';
  if (typeof format === 'string') {
    return {
      dataLocation,
      contentField: undefined,
      data: format
    };
  }
  let contentField;
  if (format.contentField) {
    const field = schema[format.contentField];
    emery.assert((field === null || field === void 0 ? void 0 : field.kind) === 'form', `${format.contentField} is not a form field`);
    emery.assert(field.formKind === 'content', `${format.contentField} is not a content field`);
    contentField = {
      key: format.contentField,
      config: field
    };
  }
  return {
    data: (_format$data = format.data) !== null && _format$data !== void 0 ? _format$data : 'yaml',
    contentField,
    dataLocation
  };
}
function getPathPrefix(storage) {
  if (storage.kind === 'local' || !storage.pathPrefix) {
    return undefined;
  }
  return fixPath(storage.pathPrefix) + '/';
}

async function sha1(content) {
  const hashBuffer = await crypto.subtle.digest('SHA-1', content);
  return hex.bytesToHex(new Uint8Array(hashBuffer));
}

const textEncoder$2 = new TextEncoder();
function blobSha(contents) {
  const blobPrefix = textEncoder$2.encode('blob ' + contents.length + '\0');
  const array = new Uint8Array(blobPrefix.byteLength + contents.byteLength);
  array.set(blobPrefix, 0);
  array.set(contents, blobPrefix.byteLength);
  return sha1(array);
}
function getTreeNodeAtPath(root, path) {
  const parts = path.split('/');
  let node = root.get(parts[0]);
  for (const part of parts.slice(1)) {
    if (!node) return undefined;
    if (!node.children) return undefined;
    node = node.children.get(part);
  }
  return node;
}
function getNodeAtPath(tree, path) {
  let node = tree;
  for (const part of path.split('/')) {
    if (!node.has(part)) {
      node.set(part, new Map());
    }
    const innerNode = node.get(part);
    emery.assert(innerNode instanceof Map, 'expected tree');
    node = innerNode;
  }
  return node;
}
function getFilename(path) {
  return path.replace(/.*\//, '');
}
function getDirname(path) {
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
const SPACE_CHAR_CODE = 32;
const space = new Uint8Array([SPACE_CHAR_CODE]);
const nullchar = new Uint8Array([0]);
const tree = textEncoder$2.encode('tree ');

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
    const mode = textEncoder$2.encode(entry.mode.replace(/^0/, ''));
    const name = textEncoder$2.encode(entry.name);
    const sha = hexToBytes(entry.sha);
    return [mode, space, name, nullchar, sha];
  });
  return sha1(concatBytes([tree, textEncoder$2.encode(treeObject.reduce((sum, val) => sum + val.byteLength, 0).toString()), nullchar, ...treeObject]));
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
    if (value instanceof Uint8Array || typeof value === 'object' && 'sha' in value) {
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
function treeEntriesToTreeNodes(entries) {
  const root = new Map();
  const getChildrenAtPath = parts => {
    var _node;
    if (parts.length === 0) {
      return root;
    }
    let node = root.get(parts[0]);
    for (const part of parts.slice(1)) {
      if (!node) return undefined;
      if (!node.children) return undefined;
      node = node.children.get(part);
    }
    return (_node = node) === null || _node === void 0 ? void 0 : _node.children;
  };
  for (const entry of entries) {
    const split = entry.path.split('/');
    const children = getChildrenAtPath(split.slice(0, -1));
    if (children) {
      children.set(split[split.length - 1], {
        entry,
        children: entry.type === 'tree' ? new Map() : undefined
      });
    }
  }
  return root;
}

function collectDirectoriesUsedInSchemaInner(schema, directories, seenSchemas) {
  if (seenSchemas.has(schema)) {
    return;
  }
  seenSchemas.add(schema);
  if (schema.kind === 'array') {
    return collectDirectoriesUsedInSchemaInner(schema.element, directories, seenSchemas);
  }
  if (schema.kind === 'child') {
    return;
  }
  if (schema.kind === 'form') {
    if (schema.formKind === 'asset' && schema.directory !== undefined) {
      directories.add(fixPath(schema.directory));
    }
    if (schema.formKind === 'content' && schema.directories !== undefined) {
      for (const directory of schema.directories) {
        directories.add(fixPath(directory));
      }
    }
    return;
  }
  if (schema.kind === 'object') {
    for (const field of Object.values(schema.fields)) {
      collectDirectoriesUsedInSchemaInner(field, directories, seenSchemas);
    }
    return;
  }
  if (schema.kind === 'conditional') {
    for (const innerSchema of Object.values(schema.values)) {
      collectDirectoriesUsedInSchemaInner(innerSchema, directories, seenSchemas);
    }
    return;
  }
  emery.assertNever(schema);
}
function collectDirectoriesUsedInSchema(schema) {
  const directories = new Set();
  collectDirectoriesUsedInSchemaInner(schema, directories, new Set());
  return directories;
}
function getDirectoriesForTreeKey(schema, directory, slug, format) {
  const directories = [fixPath(directory)];
  if (format.dataLocation === 'outer') {
    directories.push(fixPath(directory) + getDataFileExtension(format));
  }
  const toAdd = slug === undefined ? '' : `/${slug}`;
  for (const directory of collectDirectoriesUsedInSchema(schema)) {
    directories.push(directory + toAdd);
  }
  return directories;
}
function getTreeKey(directories, tree) {
  return directories.map(d => {
    var _getTreeNodeAtPath;
    return (_getTreeNodeAtPath = getTreeNodeAtPath(tree, d)) === null || _getTreeNodeAtPath === void 0 ? void 0 : _getTreeNodeAtPath.entry.sha;
  }).join('-');
}

var pkgJson = {
	name: "@keystatic/core",
	version: "0.2.4",
	license: "MIT",
	repository: {
		type: "git",
		url: "https://github.com/Thinkmill/keystatic/",
		directory: "packages/keystatic"
	},
	exports: {
		"./ui": {
			types: "./ui/dist/keystatic-core-ui.cjs.js",
			node: {
				"react-server": {
					module: "./ui/dist/keystatic-core-ui.node.react-server.esm.js",
					"default": "./ui/dist/keystatic-core-ui.node.react-server.cjs.js"
				},
				module: "./ui/dist/keystatic-core-ui.node.esm.js",
				"default": "./ui/dist/keystatic-core-ui.node.cjs.js"
			},
			"react-server": {
				module: "./ui/dist/keystatic-core-ui.react-server.esm.js",
				"default": "./ui/dist/keystatic-core-ui.react-server.cjs.js"
			},
			module: "./ui/dist/keystatic-core-ui.esm.js",
			"default": "./ui/dist/keystatic-core-ui.cjs.js"
		},
		".": {
			types: "./dist/keystatic-core.cjs.js",
			node: {
				"react-server": {
					module: "./dist/keystatic-core.node.react-server.esm.js",
					"default": "./dist/keystatic-core.node.react-server.cjs.js"
				},
				module: "./dist/keystatic-core.node.esm.js",
				"default": "./dist/keystatic-core.node.cjs.js"
			},
			"react-server": {
				module: "./dist/keystatic-core.react-server.esm.js",
				"default": "./dist/keystatic-core.react-server.cjs.js"
			},
			module: "./dist/keystatic-core.esm.js",
			"default": "./dist/keystatic-core.cjs.js"
		},
		"./api/utils": {
			types: "./api/utils/dist/keystatic-core-api-utils.cjs.js",
			node: {
				"react-server": {
					module: "./api/utils/dist/keystatic-core-api-utils.node.react-server.esm.js",
					"default": "./api/utils/dist/keystatic-core-api-utils.node.react-server.cjs.js"
				},
				module: "./api/utils/dist/keystatic-core-api-utils.node.esm.js",
				"default": "./api/utils/dist/keystatic-core-api-utils.node.cjs.js"
			},
			"react-server": {
				module: "./api/utils/dist/keystatic-core-api-utils.react-server.esm.js",
				"default": "./api/utils/dist/keystatic-core-api-utils.react-server.cjs.js"
			},
			module: "./api/utils/dist/keystatic-core-api-utils.esm.js",
			"default": "./api/utils/dist/keystatic-core-api-utils.cjs.js"
		},
		"./renderer": {
			types: "./renderer/dist/keystatic-core-renderer.cjs.js",
			node: {
				"react-server": {
					module: "./renderer/dist/keystatic-core-renderer.node.react-server.esm.js",
					"default": "./renderer/dist/keystatic-core-renderer.node.react-server.cjs.js"
				},
				module: "./renderer/dist/keystatic-core-renderer.node.esm.js",
				"default": "./renderer/dist/keystatic-core-renderer.node.cjs.js"
			},
			"react-server": {
				module: "./renderer/dist/keystatic-core-renderer.react-server.esm.js",
				"default": "./renderer/dist/keystatic-core-renderer.react-server.cjs.js"
			},
			module: "./renderer/dist/keystatic-core-renderer.esm.js",
			"default": "./renderer/dist/keystatic-core-renderer.cjs.js"
		},
		"./api/generic": {
			types: "./api/generic/dist/keystatic-core-api-generic.cjs.js",
			node: {
				"react-server": {
					module: "./api/generic/dist/keystatic-core-api-generic.node.react-server.esm.js",
					"default": "./api/generic/dist/keystatic-core-api-generic.node.react-server.cjs.js"
				},
				module: "./api/generic/dist/keystatic-core-api-generic.node.esm.js",
				"default": "./api/generic/dist/keystatic-core-api-generic.node.cjs.js"
			},
			"react-server": {
				module: "./api/generic/dist/keystatic-core-api-generic.react-server.esm.js",
				"default": "./api/generic/dist/keystatic-core-api-generic.react-server.cjs.js"
			},
			module: "./api/generic/dist/keystatic-core-api-generic.esm.js",
			"default": "./api/generic/dist/keystatic-core-api-generic.cjs.js"
		},
		"./reader": {
			types: "./reader/dist/keystatic-core-reader.cjs.js",
			node: {
				"react-server": {
					module: "./reader/dist/keystatic-core-reader.node.react-server.esm.js",
					"default": "./reader/dist/keystatic-core-reader.node.react-server.cjs.js"
				},
				module: "./reader/dist/keystatic-core-reader.node.esm.js",
				"default": "./reader/dist/keystatic-core-reader.node.cjs.js"
			},
			"react-server": {
				module: "./reader/dist/keystatic-core-reader.react-server.esm.js",
				"default": "./reader/dist/keystatic-core-reader.react-server.cjs.js"
			},
			module: "./reader/dist/keystatic-core-reader.esm.js",
			"default": "./reader/dist/keystatic-core-reader.cjs.js"
		},
		"./reader/github": {
			types: "./reader/github/dist/keystatic-core-reader-github.cjs.js",
			node: {
				"react-server": {
					module: "./reader/github/dist/keystatic-core-reader-github.node.react-server.esm.js",
					"default": "./reader/github/dist/keystatic-core-reader-github.node.react-server.cjs.js"
				},
				module: "./reader/github/dist/keystatic-core-reader-github.node.esm.js",
				"default": "./reader/github/dist/keystatic-core-reader-github.node.cjs.js"
			},
			"react-server": {
				module: "./reader/github/dist/keystatic-core-reader-github.react-server.esm.js",
				"default": "./reader/github/dist/keystatic-core-reader-github.react-server.cjs.js"
			},
			module: "./reader/github/dist/keystatic-core-reader-github.esm.js",
			"default": "./reader/github/dist/keystatic-core-reader-github.cjs.js"
		},
		"./component-blocks": {
			types: "./component-blocks/dist/keystatic-core-component-blocks.cjs.js",
			node: {
				"react-server": {
					module: "./component-blocks/dist/keystatic-core-component-blocks.node.react-server.esm.js",
					"default": "./component-blocks/dist/keystatic-core-component-blocks.node.react-server.cjs.js"
				},
				module: "./component-blocks/dist/keystatic-core-component-blocks.node.esm.js",
				"default": "./component-blocks/dist/keystatic-core-component-blocks.node.cjs.js"
			},
			"react-server": {
				module: "./component-blocks/dist/keystatic-core-component-blocks.react-server.esm.js",
				"default": "./component-blocks/dist/keystatic-core-component-blocks.react-server.cjs.js"
			},
			module: "./component-blocks/dist/keystatic-core-component-blocks.esm.js",
			"default": "./component-blocks/dist/keystatic-core-component-blocks.cjs.js"
		},
		"./form/fields/markdoc": {
			types: "./form/fields/markdoc/dist/keystatic-core-form-fields-markdoc.cjs.js",
			node: {
				"react-server": {
					module: "./form/fields/markdoc/dist/keystatic-core-form-fields-markdoc.node.react-server.esm.js",
					"default": "./form/fields/markdoc/dist/keystatic-core-form-fields-markdoc.node.react-server.cjs.js"
				},
				module: "./form/fields/markdoc/dist/keystatic-core-form-fields-markdoc.node.esm.js",
				"default": "./form/fields/markdoc/dist/keystatic-core-form-fields-markdoc.node.cjs.js"
			},
			"react-server": {
				module: "./form/fields/markdoc/dist/keystatic-core-form-fields-markdoc.react-server.esm.js",
				"default": "./form/fields/markdoc/dist/keystatic-core-form-fields-markdoc.react-server.cjs.js"
			},
			module: "./form/fields/markdoc/dist/keystatic-core-form-fields-markdoc.esm.js",
			"default": "./form/fields/markdoc/dist/keystatic-core-form-fields-markdoc.cjs.js"
		},
		"./package.json": "./package.json"
	},
	main: "dist/keystatic-core.cjs.js",
	module: "dist/keystatic-core.esm.js",
	files: [
		"dist",
		"api",
		"reader",
		"renderer",
		"ui",
		"form",
		"component-blocks"
	],
	scripts: {
		setup: "ts-gql build && tsx scripts/l10n.ts && tsx scripts/build-prism.ts",
		build: "pnpm run setup && next build",
		dev: "next dev",
		start: "next start"
	},
	dependencies: {
		"@babel/runtime": "^7.18.3",
		"@braintree/sanitize-url": "^6.0.2",
		"@emotion/css": "^11.9.0",
		"@emotion/weak-memoize": "^0.3.0",
		"@floating-ui/react": "^0.24.0",
		"@internationalized/string": "^3.1.1",
		"@keystar/ui": "^0.4.4",
		"@markdoc/markdoc": "^0.3.0",
		"@react-aria/focus": "^3.14.3",
		"@react-aria/i18n": "^3.8.0",
		"@react-aria/interactions": "^3.19.1",
		"@react-aria/overlays": "^3.18.1",
		"@react-aria/selection": "^3.17.1",
		"@react-aria/utils": "^3.21.1",
		"@react-aria/visually-hidden": "^3.8.6",
		"@react-stately/collections": "^3.10.2",
		"@react-stately/list": "^3.10.0",
		"@react-stately/overlays": "^3.6.3",
		"@react-stately/utils": "^3.8.0",
		"@react-types/shared": "^3.21.0",
		"@sindresorhus/slugify": "^1.1.2",
		"@ts-gql/tag": "^0.7.0",
		"@types/node": "16.11.13",
		"@types/react": "^18.2.8",
		"@types/react-dom": "^18.0.11",
		"@urql/core": "^4.1.3",
		"@urql/exchange-auth": "^2.1.6",
		"@urql/exchange-graphcache": "^6.3.3",
		"@urql/exchange-persisted": "^4.1.0",
		cookie: "^0.5.0",
		emery: "^1.4.1",
		"escape-string-regexp": "^4.0.0",
		"fast-deep-equal": "^3.1.3",
		graphql: "^16.6.0",
		"idb-keyval": "^6.2.1",
		ignore: "^5.2.4",
		"iron-webcrypto": "^0.10.1",
		"is-hotkey": "^0.2.0",
		"js-base64": "^3.7.5",
		"js-yaml": "^4.1.0",
		"lru-cache": "^7.14.1",
		"match-sorter": "^6.3.1",
		"mdast-util-from-markdown": "^0.8.5",
		"mdast-util-gfm-autolink-literal": "^0.1.3",
		"mdast-util-gfm-strikethrough": "^0.2.3",
		"micromark-extension-gfm-autolink-literal": "0.5.7",
		"micromark-extension-gfm-strikethrough": "0.6.5",
		minimatch: "^7.1.0",
		"prosemirror-commands": "^1.5.1",
		"prosemirror-history": "^1.3.0",
		"prosemirror-keymap": "^1.2.1",
		"prosemirror-model": "^1.19.0",
		"prosemirror-state": "^1.4.2",
		"prosemirror-tables": "^1.3.4",
		"prosemirror-transform": "^1.7.1",
		"prosemirror-view": "^1.30.2",
		"scroll-into-view-if-needed": "^3.0.3",
		slate: "^0.91.4",
		"slate-history": "^0.86.0",
		"slate-react": "^0.91.9",
		urql: "^4.0.0",
		zod: "^3.20.2"
	},
	devDependencies: {
		"@testing-library/user-event": "^14.4.3",
		"@ts-gql/compiler": "^0.16.1",
		"@ts-gql/eslint-plugin": "^0.8.5",
		"@ts-gql/next": "^17.0.0",
		"@types/cookie": "^0.5.1",
		"@types/is-hotkey": "^0.1.7",
		"@types/js-yaml": "^4.0.5",
		"@types/prismjs": "^1.26.0",
		"@types/signal-exit": "^3.0.1",
		eslint: "^8.18.0",
		"fast-glob": "^3.2.12",
		"jest-diff": "^29.0.1",
		outdent: "^0.8.0",
		"pretty-format": "^29.0.1",
		prismjs: "^1.29.0",
		react: "^18.2.0",
		"react-dom": "^18.2.0",
		"react-element-to-jsx-string": "^15.0.0",
		"resize-observer-polyfill": "^1.5.1",
		"signal-exit": "^3.0.7",
		"slate-hyperscript": "^0.77.0",
		tsx: "^3.8.0",
		typescript: "^5.2.2"
	},
	peerDependencies: {
		react: "^18.2.0",
		"react-dom": "^18.2.0"
	},
	preconstruct: {
		entrypoints: [
			"index.ts",
			"api/generic.ts",
			"api/utils.ts",
			"reader/index.ts",
			"reader/github.ts",
			"renderer.tsx",
			"ui.tsx",
			"form/fields/markdoc/index.tsx",
			"component-blocks/index.tsx"
		]
	},
	"ts-gql": {
		schema: "./github.graphql",
		mode: "no-transform",
		addTypename: false,
		scalars: {
			GitObjectID: "string"
		}
	},
	imports: {
		"#react-cache-in-react-server": {
			"react-server": "./src/reader/react-server-cache.ts",
			"default": "./src/reader/noop-cache.ts"
		},
		"#sha1": {
			node: "./src/sha1/node.ts",
			"default": "./src/sha1/webcrypto.ts"
		},
		"#webcrypto": {
			node: "./src/api/webcrypto/node.ts",
			"default": "./src/api/webcrypto/default.ts"
		},
		"#api-handler": {
			node: "./src/api/api-node.ts",
			"default": "./src/api/api-noop.ts"
		},
		"#field-ui/*": {
			"react-server": "./src/form/fields/empty-field-ui.tsx",
			"default": "./src/form/fields/*/ui.tsx"
		},
		"#component-block-primitives": {
			"react-server": "./src/form/fields/document/DocumentEditor/primitives/blank-for-react-server.tsx",
			"default": "./src/form/fields/document/DocumentEditor/primitives/index.tsx"
		},
		"#cloud-image-preview": {
			"react-server": "./src/component-blocks/blank-for-react-server.tsx",
			"default": "./src/component-blocks/cloud-image-preview.tsx"
		}
	}
};

function object(fields, opts) {
  return {
    ...opts,
    kind: 'object',
    fields
  };
}

function pluralize(count, options) {
  const {
    singular,
    plural = singular + 's',
    inclusive = true
  } = options;
  const variant = count === 1 ? singular : plural;
  return inclusive ? `${count} ${variant}` : variant;
}
function getBranchPrefix(config) {
  return config.storage.kind !== 'local' ? config.storage.branchPrefix : undefined;
}
function isGitHubConfig(config) {
  return config.storage.kind === 'github';
}
function isLocalConfig(config) {
  return config.storage.kind === 'local';
}
function isCloudConfig(config) {
  var _config$cloud;
  if (config.storage.kind !== 'cloud') return false;
  if (!((_config$cloud = config.cloud) !== null && _config$cloud !== void 0 && _config$cloud.project) || !config.cloud.project.includes('/')) {
    throw new Error(`Keystatic is set to \`storage: { kind: 'cloud' }\` but \`cloud.project\` isn't set.
config({
  storage: { kind: 'cloud' },
  cloud: { project: 'team/project' },
})`);
  }
  return true;
}
function getSplitCloudProject(config) {
  var _config$cloud2;
  if (!((_config$cloud2 = config.cloud) !== null && _config$cloud2 !== void 0 && _config$cloud2.project)) return undefined;
  const [team, project] = config.cloud.project.split('/');
  return {
    team,
    project
  };
}
function getRepoPath(config) {
  return `${config.mainOwner}/${config.mainRepo}`;
}
function getRepoUrl(config) {
  return `https://github.com/${getRepoPath(config)}`;
}
function getSlugFromState(collectionConfig, state) {
  const value = state[collectionConfig.slugField];
  const field = collectionConfig.schema[collectionConfig.slugField];
  if (field.kind !== 'form' || field.formKind !== 'slug') {
    throw new Error(`slugField is not a slug field`);
  }
  return field.serializeWithSlug(value).slug;
}
function getEntriesInCollectionWithTreeKey(config, collection, rootTree) {
  var _getTreeNodeAtPath$ch, _getTreeNodeAtPath;
  const collectionConfig = config.collections[collection];
  const schema = object(collectionConfig.schema);
  const formatInfo = getCollectionFormat(config, collection);
  const extension = getDataFileExtension(formatInfo);
  const glob = getSlugGlobForCollection(config, collection);
  const collectionPath = getCollectionPath(config, collection);
  const directory = (_getTreeNodeAtPath$ch = (_getTreeNodeAtPath = getTreeNodeAtPath(rootTree, collectionPath)) === null || _getTreeNodeAtPath === void 0 ? void 0 : _getTreeNodeAtPath.children) !== null && _getTreeNodeAtPath$ch !== void 0 ? _getTreeNodeAtPath$ch : new Map();
  const entries = [];
  const directoriesUsedInSchema = [...collectDirectoriesUsedInSchema(schema)];
  const suffix = getCollectionItemSlugSuffix(config, collection);
  const possibleEntries = new Map(directory);
  if (glob === '**') {
    const handleDirectory = (dir, prefix) => {
      for (const [key, entry] of dir) {
        if (entry.children) {
          possibleEntries.set(`${prefix}${key}`, entry);
          handleDirectory(entry.children, `${prefix}${key}/`);
        } else {
          possibleEntries.set(`${prefix}${key}`, entry);
        }
      }
    };
    handleDirectory(directory, '');
  }
  for (const [key, entry] of possibleEntries) {
    if (formatInfo.dataLocation === 'index') {
      var _actualEntry$children;
      const actualEntry = getTreeNodeAtPath(rootTree, getCollectionItemPath(config, collection, key));
      if (!(actualEntry !== null && actualEntry !== void 0 && (_actualEntry$children = actualEntry.children) !== null && _actualEntry$children !== void 0 && _actualEntry$children.has('index' + extension))) continue;
      entries.push({
        key: getTreeKey([actualEntry.entry.path, ...directoriesUsedInSchema.map(x => `${x}/${key}`)], rootTree),
        slug: key
      });
    } else {
      if (suffix) {
        const newEntry = getTreeNodeAtPath(rootTree, getCollectionItemPath(config, collection, key) + extension);
        if (!newEntry || newEntry.children) continue;
        entries.push({
          key: getTreeKey([entry.entry.path, getCollectionItemPath(config, collection, key), ...directoriesUsedInSchema.map(x => `${x}/${key}`)], rootTree),
          slug: key
        });
      }
      if (entry.children || !key.endsWith(extension)) continue;
      const slug = key.slice(0, -extension.length);
      entries.push({
        key: getTreeKey([entry.entry.path, getCollectionItemPath(config, collection, slug), ...directoriesUsedInSchema.map(x => `${x}/${slug}`)], rootTree),
        slug
      });
    }
  }
  return entries;
}
const KEYSTATIC_CLOUD_API_URL = 'https://api.keystatic.cloud';
const KEYSTATIC_CLOUD_HEADERS = {
  'x-keystatic-version': pkgJson.version
};
const textEncoder$1 = new TextEncoder();
async function redirectToCloudAuth(from, config) {
  var _config$cloud3;
  if (!((_config$cloud3 = config.cloud) !== null && _config$cloud3 !== void 0 && _config$cloud3.project)) {
    throw new Error('Not a cloud config');
  }
  const code_verifier = jsBase64.fromUint8Array(crypto.getRandomValues(new Uint8Array(32)), true);
  const code_challenge = jsBase64.fromUint8Array(new Uint8Array(await crypto.subtle.digest('SHA-256', textEncoder$1.encode(code_verifier))), true);
  const state = jsBase64.fromUint8Array(crypto.getRandomValues(new Uint8Array(32)), true);
  localStorage.setItem('keystatic-cloud-state', JSON.stringify({
    state,
    from,
    code_verifier
  }));
  const url = new URL(`${KEYSTATIC_CLOUD_API_URL}/oauth/authorize`);
  url.searchParams.set('state', state);
  url.searchParams.set('client_id', config.cloud.project);
  url.searchParams.set('redirect_uri', `${window.location.origin}/keystatic/cloud/oauth/callback`);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('code_challenge_method', 'S256');
  url.searchParams.set('code_challenge', code_challenge);
  url.searchParams.set('keystatic_version', pkgJson.version);
  window.location.href = url.toString();
}

const tableCellChildren = ['paragraph', 'code', 'heading', 'ordered-list', 'unordered-list', 'divider', 'image'];
const blockquoteChildren = [...tableCellChildren, 'table'];
const paragraphLike = [...blockquoteChildren, 'blockquote'];
const insideOfLayouts = [...paragraphLike, 'component-block'];
function blockContainer(args) {
  return {
    kind: 'blocks',
    allowedChildren: new Set(args.allowedChildren),
    blockToWrapInlinesIn: args.allowedChildren[0],
    invalidPositionHandleMode: args.invalidPositionHandleMode
  };
}
function inlineContainer(args) {
  return {
    kind: 'inlines',
    invalidPositionHandleMode: args.invalidPositionHandleMode
  };
}
const editorSchema = {
  editor: blockContainer({
    allowedChildren: [...insideOfLayouts, 'layout'],
    invalidPositionHandleMode: 'move'
  }),
  layout: blockContainer({
    allowedChildren: ['layout-area'],
    invalidPositionHandleMode: 'move'
  }),
  'layout-area': blockContainer({
    allowedChildren: insideOfLayouts,
    invalidPositionHandleMode: 'unwrap'
  }),
  blockquote: blockContainer({
    allowedChildren: blockquoteChildren,
    invalidPositionHandleMode: 'move'
  }),
  paragraph: inlineContainer({
    invalidPositionHandleMode: 'unwrap'
  }),
  code: inlineContainer({
    invalidPositionHandleMode: 'move'
  }),
  divider: inlineContainer({
    invalidPositionHandleMode: 'move'
  }),
  heading: inlineContainer({
    invalidPositionHandleMode: 'unwrap'
  }),
  'component-block': blockContainer({
    allowedChildren: ['component-block-prop', 'component-inline-prop'],
    invalidPositionHandleMode: 'move'
  }),
  'component-inline-prop': inlineContainer({
    invalidPositionHandleMode: 'unwrap'
  }),
  'component-block-prop': blockContainer({
    allowedChildren: insideOfLayouts,
    invalidPositionHandleMode: 'unwrap'
  }),
  'ordered-list': blockContainer({
    allowedChildren: ['list-item'],
    invalidPositionHandleMode: 'move'
  }),
  'unordered-list': blockContainer({
    allowedChildren: ['list-item'],
    invalidPositionHandleMode: 'move'
  }),
  'list-item': blockContainer({
    allowedChildren: ['list-item-content', 'ordered-list', 'unordered-list'],
    invalidPositionHandleMode: 'unwrap'
  }),
  'list-item-content': inlineContainer({
    invalidPositionHandleMode: 'unwrap'
  }),
  image: inlineContainer({
    invalidPositionHandleMode: 'move'
  }),
  table: blockContainer({
    invalidPositionHandleMode: 'move',
    allowedChildren: ['table-head', 'table-body']
  }),
  'table-body': blockContainer({
    invalidPositionHandleMode: 'move',
    allowedChildren: ['table-row']
  }),
  'table-row': blockContainer({
    invalidPositionHandleMode: 'move',
    allowedChildren: ['table-cell']
  }),
  'table-cell': blockContainer({
    invalidPositionHandleMode: 'move',
    allowedChildren: tableCellChildren
  }),
  'table-head': blockContainer({
    invalidPositionHandleMode: 'move',
    allowedChildren: ['table-row']
  })
};
const inlineContainerTypes = new Set(Object.entries(editorSchema).filter(([, value]) => value.kind === 'inlines').map(([type]) => type));
function isInlineContainer(node) {
  return node.type !== undefined && inlineContainerTypes.has(node.type);
}
const blockTypes = new Set(Object.keys(editorSchema).filter(x => x !== 'editor'));
function isBlock(node) {
  return blockTypes.has(node.type);
}

// to print the editor schema in Graphviz if you want to visualize it
// function printEditorSchema(editorSchema: EditorSchema) {
//   return `digraph G {
//   concentrate=true;
//   ${Object.keys(editorSchema)
//     .map(key => {
//       let val = editorSchema[key];
//       if (val.kind === 'inlines') {
//         return `"${key}" -> inlines`;
//       }
//       if (val.kind === 'blocks') {
//         return `"${key}" -> {${[...val.allowedChildren].map(x => JSON.stringify(x)).join(' ')}}`;
//       }
//     })
//     .join('\n  ')}
// }`;
// }

function getWholeDocumentFeaturesForChildField(editorDocumentFeatures, options) {
  var _options$formatting, _options$formatting2, _options$formatting3, _options$formatting4, _options$formatting5, _options$formatting6, _options$formatting7;
  const inlineMarksFromOptions = (_options$formatting = options.formatting) === null || _options$formatting === void 0 ? void 0 : _options$formatting.inlineMarks;
  const inlineMarks = Object.fromEntries(Object.keys(editorDocumentFeatures.formatting.inlineMarks).map(_mark => {
    const mark = _mark;
    return [mark, inlineMarksFromOptions === 'inherit' || (inlineMarksFromOptions === null || inlineMarksFromOptions === void 0 ? void 0 : inlineMarksFromOptions[mark]) === 'inherit' ? editorDocumentFeatures.formatting.inlineMarks[mark] : false];
  }));
  const headingLevels = (_options$formatting2 = options.formatting) === null || _options$formatting2 === void 0 ? void 0 : _options$formatting2.headingLevels;
  return {
    formatting: {
      inlineMarks,
      softBreaks: ((_options$formatting3 = options.formatting) === null || _options$formatting3 === void 0 ? void 0 : _options$formatting3.softBreaks) === 'inherit' && editorDocumentFeatures.formatting.softBreaks,
      alignment: {
        center: editorDocumentFeatures.formatting.alignment.center && ((_options$formatting4 = options.formatting) === null || _options$formatting4 === void 0 ? void 0 : _options$formatting4.alignment) === 'inherit',
        end: editorDocumentFeatures.formatting.alignment.end && ((_options$formatting5 = options.formatting) === null || _options$formatting5 === void 0 ? void 0 : _options$formatting5.alignment) === 'inherit'
      },
      blockTypes: ((_options$formatting6 = options.formatting) === null || _options$formatting6 === void 0 ? void 0 : _options$formatting6.blockTypes) === 'inherit' ? editorDocumentFeatures.formatting.blockTypes : {
        blockquote: false,
        code: false
      },
      headings: headingLevels === 'inherit' ? editorDocumentFeatures.formatting.headings : {
        levels: headingLevels ? editorDocumentFeatures.formatting.headings.levels.filter(level => headingLevels.includes(level)) : [],
        schema: editorDocumentFeatures.formatting.headings.schema
      },
      listTypes: ((_options$formatting7 = options.formatting) === null || _options$formatting7 === void 0 ? void 0 : _options$formatting7.listTypes) === 'inherit' ? editorDocumentFeatures.formatting.listTypes : {
        ordered: false,
        unordered: false
      }
    },
    dividers: options.dividers === 'inherit' ? editorDocumentFeatures.dividers : false,
    images: options.images === 'inherit' && editorDocumentFeatures.images,
    layouts: [],
    links: options.links === 'inherit' && editorDocumentFeatures.links,
    tables: options.tables === 'inherit' && editorDocumentFeatures.tables
  };
}
function getDocumentFeaturesForChildField(editorDocumentFeatures, options) {
  var _options$formatting8, _options$formatting10, _options$formatting11, _options$formatting12, _options$formatting13, _options$formatting14;
  // an important note for this: normalization based on document features
  // is done based on the document features returned here
  // and the editor document features
  // so the result for any given child prop will be the things that are
  // allowed by both these document features
  // AND the editor document features
  const inlineMarksFromOptions = (_options$formatting8 = options.formatting) === null || _options$formatting8 === void 0 ? void 0 : _options$formatting8.inlineMarks;
  const inlineMarks = inlineMarksFromOptions === 'inherit' ? 'inherit' : Object.fromEntries(Object.keys(editorDocumentFeatures.formatting.inlineMarks).map(mark => {
    return [mark, !!(inlineMarksFromOptions || {})[mark]];
  }));
  if (options.kind === 'inline') {
    var _options$formatting9;
    return {
      kind: 'inline',
      inlineMarks,
      documentFeatures: {
        links: options.links === 'inherit'
      },
      softBreaks: ((_options$formatting9 = options.formatting) === null || _options$formatting9 === void 0 ? void 0 : _options$formatting9.softBreaks) === 'inherit'
    };
  }
  const headingLevels = (_options$formatting10 = options.formatting) === null || _options$formatting10 === void 0 ? void 0 : _options$formatting10.headingLevels;
  return {
    kind: 'block',
    inlineMarks,
    softBreaks: ((_options$formatting11 = options.formatting) === null || _options$formatting11 === void 0 ? void 0 : _options$formatting11.softBreaks) === 'inherit',
    documentFeatures: {
      layouts: [],
      dividers: options.dividers === 'inherit' ? editorDocumentFeatures.dividers : false,
      formatting: {
        alignment: ((_options$formatting12 = options.formatting) === null || _options$formatting12 === void 0 ? void 0 : _options$formatting12.alignment) === 'inherit' ? editorDocumentFeatures.formatting.alignment : {
          center: false,
          end: false
        },
        blockTypes: ((_options$formatting13 = options.formatting) === null || _options$formatting13 === void 0 ? void 0 : _options$formatting13.blockTypes) === 'inherit' ? editorDocumentFeatures.formatting.blockTypes : {
          blockquote: false,
          code: false
        },
        headings: headingLevels === 'inherit' ? editorDocumentFeatures.formatting.headings : {
          levels: headingLevels ? editorDocumentFeatures.formatting.headings.levels.filter(level => headingLevels.includes(level)) : [],
          schema: editorDocumentFeatures.formatting.headings.schema
        },
        listTypes: ((_options$formatting14 = options.formatting) === null || _options$formatting14 === void 0 ? void 0 : _options$formatting14.listTypes) === 'inherit' ? editorDocumentFeatures.formatting.listTypes : {
          ordered: false,
          unordered: false
        }
      },
      links: options.links === 'inherit',
      images: options.images === 'inherit' ? editorDocumentFeatures.images : false,
      tables: options.tables === 'inherit'
    },
    componentBlocks: options.componentBlocks === 'inherit'
  };
}
function getSchemaAtPropPathInner(path, value, schema) {
  // because we're checking the length here
  // the non-null asserts on shift below are fine
  if (path.length === 0) {
    return schema;
  }
  if (schema.kind === 'child' || schema.kind === 'form') {
    return;
  }
  if (schema.kind === 'conditional') {
    const key = path.shift();
    if (key === 'discriminant') {
      return getSchemaAtPropPathInner(path, value.discriminant, schema.discriminant);
    }
    if (key === 'value') {
      const propVal = schema.values[value.discriminant];
      return getSchemaAtPropPathInner(path, value.value, propVal);
    }
    return;
  }
  if (schema.kind === 'object') {
    const key = path.shift();
    return getSchemaAtPropPathInner(path, value[key], schema.fields[key]);
  }
  if (schema.kind === 'array') {
    const index = path.shift();
    return getSchemaAtPropPathInner(path, value[index], schema.element);
  }
  emery.assertNever(schema);
}
function getSchemaAtPropPath(path, value, props) {
  return getSchemaAtPropPathInner([...path], value, {
    kind: 'object',
    fields: props
  });
}
function getAncestorSchemas(rootSchema, path, value) {
  const ancestors = [];
  const currentPath = [...path];
  let currentProp = rootSchema;
  let currentValue = value;
  while (currentPath.length) {
    ancestors.push(currentProp);
    const key = currentPath.shift(); // this code only runs when path.length is truthy so this non-null assertion is fine
    if (currentProp.kind === 'array') {
      currentProp = currentProp.element;
      currentValue = currentValue[key];
    } else if (currentProp.kind === 'conditional') {
      currentProp = currentProp.values[value.discriminant];
      currentValue = currentValue.value;
    } else if (currentProp.kind === 'object') {
      currentValue = currentValue[key];
      currentProp = currentProp.fields[key];
    } else if (currentProp.kind === 'child' || currentProp.kind === 'form') {
      throw new Error(`unexpected prop "${key}"`);
    } else {
      emery.assertNever(currentProp);
    }
  }
  return ancestors;
}
function getPlaceholderTextForPropPath(propPath, fields, formProps) {
  const field = getSchemaAtPropPath(propPath, formProps, fields);
  if ((field === null || field === void 0 ? void 0 : field.kind) === 'child' && (field.options.kind === 'block' && field.options.editIn !== 'modal' || field.options.kind === 'inline')) {
    return field.options.placeholder;
  }
  return '';
}
function cloneDescendent(node) {
  if (slate.Element.isElement(node)) {
    return {
      ...node,
      children: node.children.map(cloneDescendent)
    };
  }
  return {
    ...node
  };
}

const allMarks = ['bold', 'italic', 'underline', 'strikethrough', 'code', 'superscript', 'subscript', 'keyboard'];
const isElementActive = (editor, format) => {
  const [match] = slate.Editor.nodes(editor, {
    match: n => n.type === format
  });
  return !!match;
};
function clearFormatting(editor) {
  slate.Transforms.unwrapNodes(editor, {
    match: node => node.type === 'heading' || node.type === 'blockquote' || node.type === 'code'
  });
  slate.Transforms.unsetNodes(editor, allMarks, {
    match: slate.Text.isText
  });
}
function moveChildren(editor, parent, to, shouldMoveNode = () => true) {
  const parentPath = slate.Path.isPath(parent) ? parent : parent[1];
  const parentNode = slate.Path.isPath(parent) ? slate.Node.get(editor, parentPath) : parent[0];
  if (!isBlock(parentNode)) return;
  for (let i = parentNode.children.length - 1; i >= 0; i--) {
    if (shouldMoveNode(parentNode.children[i], i)) {
      const childPath = [...parentPath, i];
      slate.Transforms.moveNodes(editor, {
        at: childPath,
        to
      });
    }
  }
}

/**
 * This is equivalent to Editor.after except that it ignores points that have no content
 * like the point in a void text node, an empty text node and the last point in a text node
 */
// TODO: this would probably break if you were trying to get the last point in the editor?
function EditorAfterButIgnoringingPointsWithNoContent(editor, at, {
  distance = 1
} = {}) {
  const anchor = slate.Editor.point(editor, at, {
    edge: 'end'
  });
  const focus = slate.Editor.end(editor, []);
  const range = {
    anchor,
    focus
  };
  let d = 0;
  let target;
  for (const p of slate.Editor.positions(editor, {
    at: range
  })) {
    if (d > distance) {
      break;
    }

    // this is the important change
    const node = slate.Node.get(editor, p.path);
    if (node.text.length === p.offset) {
      continue;
    }
    if (d !== 0) {
      target = p;
    }
    d++;
  }
  return target;
}
function nodeTypeMatcher(...args) {
  if (args.length === 1) {
    const type = args[0];
    return node => node.type === type;
  }
  const set = new Set(args);
  return node => typeof node.type === 'string' && set.has(node.type);
}
function getAncestorComponentChildFieldDocumentFeatures(editor, editorDocumentFeatures, componentBlocks) {
  const ancestorComponentProp = slate.Editor.above(editor, {
    match: nodeTypeMatcher('component-block-prop', 'component-inline-prop')
  });
  if (ancestorComponentProp) {
    const propPath = ancestorComponentProp[0].propPath;
    const ancestorComponent = slate.Editor.parent(editor, ancestorComponentProp[1]);
    if (ancestorComponent[0].type === 'component-block') {
      const component = ancestorComponent[0].component;
      const componentBlock = componentBlocks[component];
      if (componentBlock && propPath) {
        const childField = getSchemaAtPropPath(propPath, ancestorComponent[0].props, componentBlock.schema);
        if ((childField === null || childField === void 0 ? void 0 : childField.kind) === 'child') {
          return getDocumentFeaturesForChildField(editorDocumentFeatures, childField.options);
        }
      }
    }
  }
}

class FieldDataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'FieldDataError';
  }
}

function assertRequired(value, validation, label) {
  if (value === null && validation !== null && validation !== void 0 && validation.isRequired) {
    throw new FieldDataError(`${label} is required`);
  }
}
function basicFormFieldWithSimpleReaderParse(config) {
  return {
    kind: 'form',
    Input: config.Input,
    defaultValue: config.defaultValue,
    parse: config.parse,
    serialize: config.serialize,
    validate: config.validate,
    reader: {
      parse(value) {
        return config.validate(config.parse(value));
      }
    }
  };
}

const arrayValuesToElementKeys = new WeakMap();
let counter = 0;
function getKeysForArrayValue(value) {
  if (!arrayValuesToElementKeys.has(value)) {
    arrayValuesToElementKeys.set(value, Array.from({
      length: value.length
    }, getNewArrayElementKey));
  }
  return arrayValuesToElementKeys.get(value);
}
function setKeysForArrayValue(value, elementIds) {
  arrayValuesToElementKeys.set(value, elementIds);
}
function getNewArrayElementKey() {
  return (counter++).toString();
}
const getInitialPropsValue = _getInitialPropsValue;
function _getInitialPropsValue(schema) {
  switch (schema.kind) {
    case 'form':
      return schema.defaultValue();
    case 'child':
      return schema.options.kind === 'block' ? [{
        type: 'paragraph',
        children: [{
          text: ''
        }]
      }] : null;
    case 'conditional':
      {
        const defaultValue = schema.discriminant.defaultValue();
        return {
          discriminant: defaultValue,
          value: getInitialPropsValue(schema.values[defaultValue.toString()])
        };
      }
    case 'object':
      {
        const obj = {};
        for (const key of Object.keys(schema.fields)) {
          obj[key] = getInitialPropsValue(schema.fields[key]);
        }
        return obj;
      }
    case 'array':
      {
        return [];
      }
  }
  emery.assertNever(schema);
}
function getInitialPropsValueFromInitializer(schema, initializer) {
  switch (schema.kind) {
    case 'form':
      return initializer === undefined ? schema.defaultValue() : initializer;
    case 'child':
      return initializer !== null && initializer !== void 0 ? initializer : schema.options.kind === 'block' ? [{
        type: 'paragraph',
        children: [{
          text: ''
        }]
      }] : null;
    case 'conditional':
      {
        const defaultValue = initializer === undefined ? schema.discriminant.defaultValue() : initializer.discriminant;
        return {
          discriminant: defaultValue,
          value: getInitialPropsValueFromInitializer(schema.values[defaultValue.toString()], initializer === undefined ? undefined : initializer.value)
        };
      }
    case 'object':
      {
        const obj = {};
        for (const key of Object.keys(schema.fields)) {
          obj[key] = getInitialPropsValueFromInitializer(schema.fields[key], initializer === undefined ? undefined : initializer[key]);
        }
        return obj;
      }
    case 'array':
      {
        return (initializer !== null && initializer !== void 0 ? initializer : []).map(x => getInitialPropsValueFromInitializer(schema.element, x.value));
      }
  }
  emery.assertNever(schema);
}
function updateValue(schema, currentValue, updater) {
  if (updater === undefined) return currentValue;
  switch (schema.kind) {
    case 'form':
      return updater;
    case 'child':
      return updater;
    case 'conditional':
      {
        return {
          discriminant: updater.discriminant,
          value: updater.discriminant === currentValue.discriminant ? updateValue(schema.values[updater.discriminant.toString()], currentValue.value, updater.value) : getInitialPropsValueFromInitializer(schema.values[updater.discriminant.toString()], updater.value)
        };
      }
    case 'object':
      {
        const obj = {};
        for (const key of Object.keys(schema.fields)) {
          obj[key] = updateValue(schema.fields[key], currentValue[key], updater[key]);
        }
        return obj;
      }
    case 'array':
      {
        const currentArrVal = currentValue;
        const newVal = updater;
        const uniqueKeys = new Set();
        for (const x of newVal) {
          if (x.key !== undefined) {
            if (uniqueKeys.has(x.key)) {
              throw new Error('Array elements must have unique keys');
            }
            uniqueKeys.add(x.key);
          }
        }
        const keys = newVal.map(x => {
          if (x.key !== undefined) return x.key;
          let elementKey = getNewArrayElementKey();
          // just in case someone gives a key that is above our counter
          while (uniqueKeys.has(elementKey)) {
            elementKey = getNewArrayElementKey();
          }
          uniqueKeys.add(elementKey);
          return elementKey;
        });
        const prevKeys = getKeysForArrayValue(currentArrVal);
        const prevValuesByKey = new Map(currentArrVal.map((value, i) => {
          return [prevKeys[i], value];
        }));
        const val = newVal.map((x, i) => {
          const id = keys[i];
          if (prevValuesByKey.has(id)) {
            return updateValue(schema.element, prevValuesByKey.get(id), x.value);
          }
          return getInitialPropsValueFromInitializer(schema.element, x.value);
        });
        setKeysForArrayValue(val, keys);
        return val;
      }
  }
  emery.assertNever(schema);
}

function getValueAtPropPath(value, inputPath) {
  const path = [...inputPath];
  while (path.length) {
    const key = path.shift();
    value = value[key];
  }
  return value;
}
function traverseProps(schema, value, visitor, path = []) {
  if (schema.kind === 'form' || schema.kind === 'child') {
    visitor(schema, value, path);
    return;
  }
  if (schema.kind === 'object') {
    for (const [key, childProp] of Object.entries(schema.fields)) {
      traverseProps(childProp, value[key], visitor, [...path, key]);
    }
    visitor(schema, value, path);
    return;
  }
  if (schema.kind === 'array') {
    for (const [idx, val] of value.entries()) {
      traverseProps(schema.element, val, visitor, path.concat(idx));
    }
    return visitor(schema, value, path);
  }
  if (schema.kind === 'conditional') {
    const discriminant = value.discriminant;
    visitor(schema, discriminant, path.concat('discriminant'));
    traverseProps(schema.values[discriminant.toString()], value.value, visitor, path.concat('value'));
    visitor(schema, value, path);
    return;
  }
  assertions.assertNever(schema);
}
function transformProps(schema, value, visitors, path = []) {
  if (schema.kind === 'form' || schema.kind === 'child') {
    if (visitors[schema.kind]) {
      return visitors[schema.kind](schema, value, path);
    }
    return value;
  }
  if (schema.kind === 'object') {
    const val = Object.fromEntries(Object.entries(schema.fields).map(([key, val]) => {
      return [key, transformProps(val, value[key], visitors, [...path, key])];
    }));
    if (visitors.object) {
      return visitors[schema.kind](schema, val, path);
    }
    return val;
  }
  if (schema.kind === 'array') {
    const val = value.map((val, idx) => transformProps(schema.element, val, visitors, path.concat(idx)));
    if (visitors.array) {
      return visitors[schema.kind](schema, val, path);
    }
    return val;
  }
  if (schema.kind === 'conditional') {
    const discriminant = transformProps(schema.discriminant, value.discriminant, visitors, path.concat('discriminant'));
    const conditionalVal = transformProps(schema.values[discriminant.toString()], value.value, visitors, path.concat('value'));
    const val = {
      discriminant,
      value: conditionalVal
    };
    if (visitors.conditional) {
      return visitors[schema.kind](schema, val, path);
    }
    return val;
  }
  assertions.assertNever(schema);
}
function replaceValueAtPropPath(schema, value, newValue, path) {
  if (path.length === 0) {
    return newValue;
  }
  const [key, ...newPath] = path;
  if (schema.kind === 'object') {
    return {
      ...value,
      [key]: replaceValueAtPropPath(schema.fields[key], value[key], newValue, newPath)
    };
  }
  if (schema.kind === 'conditional') {
    const conditionalValue = value;
    // replaceValueAtPropPath should not be used to only update the discriminant of a conditional field
    // if you want to update the discriminant of a conditional field, replace the value of the whole conditional field
    assertions.assert(key === 'value');
    return {
      discriminant: conditionalValue.discriminant,
      value: replaceValueAtPropPath(schema.values[key], conditionalValue.value, newValue, newPath)
    };
  }
  if (schema.kind === 'array') {
    const prevVal = value;
    const newVal = [...prevVal];
    setKeysForArrayValue(newVal, getKeysForArrayValue(prevVal));
    newVal[key] = replaceValueAtPropPath(schema.element, newVal[key], newValue, newPath);
    return newVal;
  }

  // we should never reach here since form or child fields don't contain other fields
  // so the only thing that can happen to them is to be replaced which happens at the start of this function when path.length === 0
  assertions.assert(schema.kind !== 'form' && schema.kind !== 'child');
  assertions.assertNever(schema);
}

// a v important note
// marks in the markdown ast/html are represented quite differently to how they are in slate
// if you had the markdown **something https://keystonejs.com something**
// the bold node is the parent of the link node
// but in slate, marks are only represented on text nodes
const currentlyActiveMarks = new Set();
const currentlyDisabledMarks = new Set();
let currentLink = null;
function addMarkToChildren(mark, cb) {
  const wasPreviouslyActive = currentlyActiveMarks.has(mark);
  currentlyActiveMarks.add(mark);
  try {
    return cb();
  } finally {
    if (!wasPreviouslyActive) {
      currentlyActiveMarks.delete(mark);
    }
  }
}
function setLinkForChildren(href, cb) {
  // we'll only use the outer link
  if (currentLink !== null) {
    return cb();
  }
  currentLink = href;
  try {
    return cb();
  } finally {
    currentLink = null;
  }
}
function addMarksToChildren(marks, cb) {
  const marksToRemove = new Set();
  for (const mark of marks) {
    if (!currentlyActiveMarks.has(mark)) {
      marksToRemove.add(mark);
    }
    currentlyActiveMarks.add(mark);
  }
  try {
    return cb();
  } finally {
    for (const mark of marksToRemove) {
      currentlyActiveMarks.delete(mark);
    }
  }
}
function forceDisableMarkForChildren(mark, cb) {
  const wasPreviouslyDisabled = currentlyDisabledMarks.has(mark);
  currentlyDisabledMarks.add(mark);
  try {
    return cb();
  } finally {
    if (!wasPreviouslyDisabled) {
      currentlyDisabledMarks.delete(mark);
    }
  }
}

/**
 * This type is more strict than `Element & { type: 'link'; }` because `children`
 * is constrained to only contain Text nodes. This can't be assumed generally around the editor
 * (because of potentially future inline components or nested links(which are normalized away but the editor needs to not break if it happens))
 * but where this type is used, we're only going to allow links to contain Text and that's important
 * so that we know a block will never be inside an inline because Slate gets unhappy when that happens
 * (really the link inline should probably be a mark rather than an inline,
 * non-void inlines are probably always bad but that would imply changing the document
 * structure which would be such unnecessary breakage)
 */

function getInlineNodes(text) {
  const node = {
    text
  };
  for (const mark of currentlyActiveMarks) {
    if (!currentlyDisabledMarks.has(mark)) {
      node[mark] = true;
    }
  }
  if (currentLink !== null) {
    return [{
      text: ''
    }, {
      type: 'link',
      href: currentLink,
      children: [node]
    }, {
      text: ''
    }];
  }
  return [node];
}

class VariableChildFields extends Error {
  constructor() {
    super('There are a variable number of child fields');
  }
}
function findSingleChildField(schema) {
  try {
    const result = _findConstantChildFields(schema, [], new Set());
    if (result.length === 1) {
      return result[0];
    }
    return;
  } catch (err) {
    if (err instanceof VariableChildFields) {
      return;
    }
    throw err;
  }
}
function _findConstantChildFields(schema, path, seenSchemas) {
  if (seenSchemas.has(schema)) {
    return [];
  }
  seenSchemas.add(schema);
  switch (schema.kind) {
    case 'form':
      return [];
    case 'child':
      return [{
        relativePath: path,
        options: schema.options,
        kind: 'child'
      }];
    case 'conditional':
      {
        if (couldContainChildField(schema)) {
          throw new VariableChildFields();
        }
        return [];
      }
    case 'array':
      {
        if (schema.asChildTag) {
          const child = _findConstantChildFields(schema.element, [], seenSchemas);
          if (child.length > 1) {
            return [];
          }
          return [{
            kind: 'array',
            asChildTag: schema.asChildTag,
            field: schema,
            relativePath: path,
            child: child[0]
          }];
        }
        if (couldContainChildField(schema)) {
          throw new VariableChildFields();
        }
        return [];
      }
    case 'object':
      {
        const paths = [];
        for (const [key, value] of Object.entries(schema.fields)) {
          paths.push(..._findConstantChildFields(value, path.concat(key), seenSchemas));
        }
        return paths;
      }
  }
}
function couldContainChildField(schema, seen = new Set()) {
  if (seen.has(schema)) {
    return false;
  }
  seen.add(schema);
  switch (schema.kind) {
    case 'form':
      return false;
    case 'child':
      return true;
    case 'conditional':
      return Object.values(schema.values).some(value => couldContainChildField(value, seen));
    case 'object':
      return Object.keys(schema.fields).some(key => couldContainChildField(schema.fields[key], seen));
    case 'array':
      return couldContainChildField(schema.element, seen);
  }
}

function inlineNodeFromMarkdoc(node) {
  if (node.type === 'inline') {
    return inlineChildrenFromMarkdoc(node.children);
  }
  if (node.type === 'link') {
    return setLinkForChildren(node.attributes.href, () => inlineChildrenFromMarkdoc(node.children));
  }
  if (node.type === 'text') {
    return getInlineNodes(node.attributes.content);
  }
  if (node.type === 'strong') {
    return addMarkToChildren('bold', () => inlineChildrenFromMarkdoc(node.children));
  }
  if (node.type === 'code') {
    return addMarkToChildren('code', () => getInlineNodes(node.attributes.content));
  }
  if (node.type === 'em') {
    return addMarkToChildren('italic', () => inlineChildrenFromMarkdoc(node.children));
  }
  if (node.type === 's') {
    return addMarkToChildren('strikethrough', () => inlineChildrenFromMarkdoc(node.children));
  }
  if (node.type === 'tag') {
    if (node.tag === 'u') {
      return addMarkToChildren('underline', () => inlineChildrenFromMarkdoc(node.children));
    }
    if (node.tag === 'kbd') {
      return addMarkToChildren('keyboard', () => inlineChildrenFromMarkdoc(node.children));
    }
    if (node.tag === 'sub') {
      return addMarkToChildren('subscript', () => inlineChildrenFromMarkdoc(node.children));
    }
    if (node.tag === 'sup') {
      return addMarkToChildren('superscript', () => inlineChildrenFromMarkdoc(node.children));
    }
  }
  if (node.type === 'softbreak') {
    return getInlineNodes(' ');
  }
  if (node.type === 'hardbreak') {
    return getInlineNodes('\n');
  }
  if (node.tag === 'component-inline-prop' && Array.isArray(node.attributes.propPath) && node.attributes.propPath.every(x => typeof x === 'string' || typeof x === 'number')) {
    return {
      type: 'component-inline-prop',
      children: inlineFromMarkdoc(node.children),
      propPath: node.attributes.propPath
    };
  }
  throw new Error(`Unknown inline node type: ${node.type}`);
}
function inlineChildrenFromMarkdoc(nodes) {
  return nodes.flatMap(inlineNodeFromMarkdoc);
}
function inlineFromMarkdoc(nodes) {
  const transformedNodes = nodes.flatMap(inlineNodeFromMarkdoc);
  const nextNodes = [];
  let lastNode;
  for (const [idx, node] of transformedNodes.entries()) {
    var _lastNode;
    if (node.type === undefined && node.text === '' && ((_lastNode = lastNode) === null || _lastNode === void 0 ? void 0 : _lastNode.type) === undefined && idx !== transformedNodes.length - 1) {
      continue;
    }
    nextNodes.push(node);
    lastNode = node;
  }
  if (!nextNodes.length) {
    nextNodes.push({
      text: ''
    });
  }
  return nextNodes;
}
function fromMarkdoc(node, componentBlocks) {
  const nodes = node.children.flatMap(x => fromMarkdocNode(x, componentBlocks));
  if (nodes.length === 0) {
    return [{
      type: 'paragraph',
      children: [{
        text: ''
      }]
    }];
  }
  if (nodes[nodes.length - 1].type !== 'paragraph') {
    nodes.push({
      type: 'paragraph',
      children: [{
        text: ''
      }]
    });
  }
  return nodes;
}
function fromMarkdocNode(node, componentBlocks) {
  if (node.type === 'blockquote') {
    return {
      type: 'blockquote',
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === 'fence') {
    const {
      language,
      content,
      ...rest
    } = node.attributes;
    return {
      type: 'code',
      children: [{
        text: content.replace(/\n$/, '')
      }],
      ...(typeof language === 'string' ? {
        language
      } : {}),
      ...rest
    };
  }
  if (node.type === 'heading') {
    return {
      ...node.attributes,
      level: node.attributes.level,
      type: 'heading',
      children: inlineFromMarkdoc(node.children)
    };
  }
  if (node.type === 'list') {
    return {
      type: node.attributes.ordered ? 'ordered-list' : 'unordered-list',
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === 'item') {
    var _node$children$;
    const children = [{
      type: 'list-item-content',
      children: node.children.length ? inlineFromMarkdoc([node.children[0]]) : [{
        text: ''
      }]
    }];
    if (((_node$children$ = node.children[1]) === null || _node$children$ === void 0 ? void 0 : _node$children$.type) === 'list') {
      const list = node.children[1];
      children.push({
        type: list.attributes.ordered ? 'ordered-list' : 'unordered-list',
        children: list.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
      });
    }
    return {
      type: 'list-item',
      children
    };
  }
  if (node.type === 'paragraph') {
    if (node.children.length === 1 && node.children[0].type === 'inline' && node.children[0].children.length === 1 && node.children[0].children[0].type === 'image') {
      var _image$attributes$tit;
      const image = node.children[0].children[0];
      return {
        type: 'image',
        src: decodeURI(image.attributes.src),
        alt: image.attributes.alt,
        title: (_image$attributes$tit = image.attributes.title) !== null && _image$attributes$tit !== void 0 ? _image$attributes$tit : '',
        children: [{
          text: ''
        }]
      };
    }
    const children = inlineFromMarkdoc(node.children);
    if (children.length === 1 && children[0].type === 'component-inline-prop') {
      return children[0];
    }
    return {
      type: 'paragraph',
      children,
      textAlign: node.attributes.textAlign
    };
  }
  if (node.type === 'hr') {
    return {
      type: 'divider',
      children: [{
        text: ''
      }]
    };
  }
  if (node.type === 'table') {
    return {
      type: 'table',
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === 'tbody') {
    return {
      type: 'table-body',
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === 'thead') {
    if (!node.children.length) return [];
    return {
      type: 'table-head',
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === 'tr') {
    return {
      type: 'table-row',
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === 'td') {
    return {
      type: 'table-cell',
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === 'th') {
    return {
      type: 'table-cell',
      header: true,
      children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
    };
  }
  if (node.type === 'tag') {
    if (node.tag === 'table') {
      return fromMarkdocNode(node.children[0], componentBlocks);
    }
    if (node.tag === 'layout') {
      return {
        type: 'layout',
        layout: node.attributes.layout,
        children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
      };
    }
    if (node.tag === 'layout-area') {
      return {
        type: 'layout-area',
        children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
      };
    }
    if (node.tag === 'component-block') {
      return {
        type: 'component-block',
        component: node.attributes.component,
        props: node.attributes.props,
        children: node.children.length === 0 ? [{
          type: 'component-inline-prop',
          children: [{
            text: ''
          }]
        }] : node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
      };
    }
    if (node.tag === 'component-block-prop' && Array.isArray(node.attributes.propPath) && node.attributes.propPath.every(x => typeof x === 'string' || typeof x === 'number')) {
      return {
        type: 'component-block-prop',
        children: node.children.flatMap(x => fromMarkdocNode(x, componentBlocks)),
        propPath: node.attributes.propPath
      };
    }
    if (node.tag) {
      const componentBlock = componentBlocks[node.tag];
      if (componentBlock) {
        const singleChildField = findSingleChildField({
          kind: 'object',
          fields: componentBlock.schema
        });
        if (singleChildField) {
          const newAttributes = JSON.parse(JSON.stringify(node.attributes));
          const children = [];
          toChildrenAndProps$1(node.children, children, newAttributes, singleChildField, [], componentBlocks);
          return {
            type: 'component-block',
            component: node.tag,
            props: newAttributes,
            children
          };
        }
        return {
          type: 'component-block',
          component: node.tag,
          props: node.attributes,
          children: node.children.length === 0 ? [{
            type: 'component-inline-prop',
            children: [{
              text: ''
            }]
          }] : node.children.flatMap(x => fromMarkdocNode(x, componentBlocks))
        };
      }
    }
    throw new Error(`Unknown tag: ${node.tag}`);
  }
  return inlineNodeFromMarkdoc(node);
}
function toChildrenAndProps$1(fromMarkdoc, resultingChildren, value, singleChildField, parentPropPath, componentBlocks) {
  if (singleChildField.kind === 'child') {
    const children = fromMarkdoc.flatMap(x => fromMarkdocNode(x, componentBlocks));
    resultingChildren.push({
      type: `component-${singleChildField.options.kind}-prop`,
      propPath: [...parentPropPath, ...singleChildField.relativePath],
      children
    });
  }
  if (singleChildField.kind === 'array') {
    const arr = [];
    for (let [idx, child] of fromMarkdoc.entries()) {
      if (child.type === 'paragraph') {
        child = child.children[0].children[0];
      }
      if (child.type !== 'tag') {
        throw new Error(`expected tag ${singleChildField.asChildTag}, found type: ${child.type}`);
      }
      if (child.tag !== singleChildField.asChildTag) {
        throw new Error(`expected tag ${singleChildField.asChildTag}, found tag: ${child.tag}`);
      }
      const attributes = JSON.parse(JSON.stringify(child.attributes));
      if (singleChildField.child) {
        toChildrenAndProps$1(child.children, resultingChildren, attributes, singleChildField.child, [...parentPropPath, ...singleChildField.relativePath, idx], componentBlocks);
      }
      arr.push(attributes);
    }
    const key = singleChildField.relativePath[singleChildField.relativePath.length - 1];
    const parent = getValueAtPropPath(value, singleChildField.relativePath.slice(0, -1));
    parent[key] = arr;
  }
}

function areArraysEqual(a, b) {
  return a.length === b.length && a.every((x, i) => x === b[i]);
}
function normalizeTextBasedOnInlineMarksAndSoftBreaks([node, path], editor, inlineMarks, softBreaks) {
  const marksToRemove = Object.keys(node).filter(x => x !== 'text' && x !== 'insertMenu' && inlineMarks[x] !== true);
  if (marksToRemove.length) {
    slate.Transforms.unsetNodes(editor, marksToRemove, {
      at: path
    });
    return true;
  }
  if (!softBreaks) {
    const hasSoftBreaks = node.text.includes('\n');
    if (hasSoftBreaks) {
      const [parentNode] = slate.Editor.parent(editor, path);
      if (parentNode.type !== 'code') {
        for (const position of slate.Editor.positions(editor, {
          at: path
        })) {
          const character = slate.Node.get(editor, position.path).text[position.offset];
          if (character === '\n') {
            slate.Transforms.delete(editor, {
              at: position
            });
            return true;
          }
        }
      }
    }
  }
  return false;
}
function normalizeInlineBasedOnLinks([node, path], editor, links) {
  if (node.type === 'link' && !links) {
    slate.Transforms.insertText(editor, ` (${node.href})`, {
      at: slate.Editor.end(editor, path)
    });
    slate.Transforms.unwrapNodes(editor, {
      at: path
    });
    return true;
  }
  return false;
}
function normalizeElementBasedOnDocumentFeatures([node, path], editor, {
  formatting,
  dividers,
  layouts,
  links,
  images,
  tables
}) {
  if (node.type === 'heading' && (!formatting.headings.levels.length || !formatting.headings.levels.includes(node.level)) || node.type === 'ordered-list' && !formatting.listTypes.ordered || node.type === 'unordered-list' && !formatting.listTypes.unordered || node.type === 'code' && !formatting.blockTypes.code || node.type === 'blockquote' && !formatting.blockTypes.blockquote || node.type === 'image' && !images || node.type === 'table' && !tables || node.type === 'layout' && (layouts.length === 0 || !layouts.some(layout => areArraysEqual(layout, node.layout)))) {
    slate.Transforms.unwrapNodes(editor, {
      at: path
    });
    return true;
  }
  if ((node.type === 'paragraph' || node.type === 'heading') && (!formatting.alignment.center && node.textAlign === 'center' || !formatting.alignment.end && node.textAlign === 'end' || 'textAlign' in node && node.textAlign !== 'center' && node.textAlign !== 'end')) {
    slate.Transforms.unsetNodes(editor, 'textAlign', {
      at: path
    });
    return true;
  }
  if (node.type === 'divider' && !dividers) {
    slate.Transforms.removeNodes(editor, {
      at: path
    });
    return true;
  }
  return normalizeInlineBasedOnLinks([node, path], editor, links);
}
function withDocumentFeaturesNormalization(documentFeatures, editor) {
  const {
    normalizeNode
  } = editor;
  editor.normalizeNode = ([node, path]) => {
    if (slate.Text.isText(node)) {
      normalizeTextBasedOnInlineMarksAndSoftBreaks([node, path], editor, documentFeatures.formatting.inlineMarks, documentFeatures.formatting.softBreaks);
    } else if (slate.Element.isElement(node)) {
      normalizeElementBasedOnDocumentFeatures([node, path], editor, documentFeatures);
    }
    normalizeNode([node, path]);
  };
  return editor;
}

function getSrcPrefix(publicPath, slug) {
  return typeof publicPath === 'string' ? `${publicPath.replace(/\/*$/, '')}/${slug === undefined ? '' : slug + '/'}` : '';
}

function deserializeFiles(nodes, componentBlocks, files, otherFiles, mode, documentFeatures, slug) {
  return nodes.map(node => {
    if (node.type === 'component-block') {
      const componentBlock = componentBlocks[node.component];
      if (!componentBlock) return node;
      const schema = object(componentBlock.schema);
      return {
        ...node,
        props: deserializeProps(schema, node.props, files, otherFiles, mode, slug)
      };
    }
    if (node.type === 'image' && typeof node.src === 'string' && mode === 'edit') {
      var _ref;
      const prefix = getSrcPrefixForImageBlock(documentFeatures, slug);
      const filename = node.src.slice(prefix.length);
      const content = (_ref = typeof documentFeatures.images === 'object' && typeof documentFeatures.images.directory === 'string' ? otherFiles.get(fixPath(documentFeatures.images.directory)) : files) === null || _ref === void 0 ? void 0 : _ref.get(filename);
      if (!content) {
        return {
          type: 'paragraph',
          children: [{
            text: `Missing image ${filename}`
          }]
        };
      }
      return {
        type: 'image',
        src: {
          filename,
          content
        },
        alt: node.alt,
        title: node.title,
        children: [{
          text: ''
        }]
      };
    }
    if (typeof node.type === 'string') {
      const children = deserializeFiles(node.children, componentBlocks, files, otherFiles, mode, documentFeatures, slug);
      return {
        ...node,
        children
      };
    }
    return node;
  });
}
function deserializeProps(schema, value, files, otherFiles, mode, slug) {
  return transformProps(schema, value, {
    form: (schema, value) => {
      if (schema.formKind === 'asset') {
        var _otherFiles$get;
        if (mode === 'read') {
          return schema.reader.parse(value);
        }
        const filename = schema.filename(value, {
          slug,
          suggestedFilenamePrefix: undefined
        });
        return schema.parse(value, {
          asset: filename ? schema.directory ? (_otherFiles$get = otherFiles.get(schema.directory)) === null || _otherFiles$get === void 0 ? void 0 : _otherFiles$get.get(filename) : files.get(filename) : undefined,
          slug
        });
      }
      if (schema.formKind === 'content') {
        throw new Error('Not implemented');
      }
      if (mode === 'read') {
        return schema.reader.parse(value);
      }
      return schema.parse(value, undefined);
    }
  });
}
function getSrcPrefixForImageBlock(documentFeatures, slug) {
  return getSrcPrefix(typeof documentFeatures.images === 'object' ? documentFeatures.images.publicPath : undefined, slug);
}

function serializeProps(rootValue, rootSchema,
// note you might have a slug without a slug field when serializing props inside a component block or etc. in the editor
slugField, slug, shouldSuggestFilenamePrefix) {
  const extraFiles = [];
  return {
    value: transformProps(rootSchema, rootValue, {
      form(schema, value, propPath) {
        if (propPath.length === 1 && slugField === propPath[0]) {
          if (schema.formKind !== 'slug') {
            throw new Error('slugField is a not a slug field');
          }
          return schema.serializeWithSlug(value).value;
        }
        if (schema.formKind === 'asset') {
          const {
            asset,
            value: forYaml
          } = schema.serialize(value, {
            suggestedFilenamePrefix: shouldSuggestFilenamePrefix ? getPropPathPortion(propPath, rootSchema, rootValue) : undefined,
            slug
          });
          if (asset) {
            extraFiles.push({
              path: asset.filename,
              contents: asset.content,
              parent: schema.directory
            });
          }
          return forYaml;
        }
        if (schema.formKind === 'content') {
          const {
            other,
            external,
            content,
            value: forYaml
          } = schema.serialize(value, {
            slug
          });
          if (content) {
            extraFiles.push({
              path: getPropPathPortion(propPath, rootSchema, rootValue) + schema.contentExtension,
              contents: content,
              parent: undefined
            });
          }
          for (const [key, contents] of other) {
            extraFiles.push({
              path: getPropPathPortion(propPath, rootSchema, rootValue) + '/' + key,
              contents,
              parent: undefined
            });
          }
          const allowedDirectories = new Set(schema.directories);
          for (const [directory, contents] of external) {
            if (!allowedDirectories.has(directory)) {
              throw new Error(`Invalid directory ${directory} in content field serialization`);
            }
            for (const [filename, fileContents] of contents) {
              extraFiles.push({
                path: filename,
                contents: fileContents,
                parent: directory
              });
            }
          }
          return forYaml;
        }
        return schema.serialize(value).value;
      },
      object(_schema, value) {
        return Object.fromEntries(Object.entries(value).filter(([_, val]) => val !== undefined));
      },
      array(_schema, value) {
        return value.map(val => val === undefined ? null : val);
      },
      child() {
        return undefined;
      }
    }),
    extraFiles
  };
}
function getPropPathPortion(path, schema, value) {
  const end = [];
  for (const portion of path) {
    if (schema.kind === 'array') {
      value = value[portion];
      if (schema.slugField && schema.element.kind === 'object') {
        const slug = getSlugFromState({
          schema: schema.element.fields,
          slugField: schema.slugField
        }, value);
        end.push(slug);
      } else {
        end.push(portion);
      }
      schema = schema.element;
      continue;
    }
    end.push(portion);
    if (schema.kind === 'object') {
      value = value[portion];
      schema = schema.fields[portion];
      continue;
    }
    if (schema.kind === 'conditional') {
      if (portion === 'discriminant') {
        schema = schema.discriminant;
      } else if (portion === 'value') {
        schema = schema.values[value.discriminant];
      }
      value = value[portion];
      continue;
    }
    throw new Error(`unexpected ${schema.kind}`);
  }
  return end.join('/');
}

function toInline(nodes) {
  return new Markdoc.Ast.Node('inline', {}, nodes.flatMap(toMarkdocInline));
}
const markToMarkdoc = {
  bold: {
    type: 'strong'
  },
  code: {
    type: 'code'
  },
  italic: {
    type: 'em'
  },
  underline: {
    type: 'tag',
    tag: 'u'
  },
  keyboard: {
    type: 'tag',
    tag: 'kbd'
  },
  strikethrough: {
    type: 's'
  },
  subscript: {
    type: 'tag',
    tag: 'sub'
  },
  superscript: {
    type: 'tag',
    tag: 'sup'
  }
};
function toMarkdocInline(node) {
  if (node.type === 'link') {
    return new Markdoc.Ast.Node('link', {
      href: node.href
    }, node.children.flatMap(toMarkdocInline));
  }
  if (node.type !== undefined) {
    throw new Error(`unexpected inline node type: ${node.type}`);
  }
  const marks = Object.keys(node).filter(mark => mark !== 'text' && mark !== 'code').sort();
  let markdocNode = node.code ? new Markdoc.Ast.Node('code', {
    content: node.text
  }, []) : new Markdoc.Ast.Node('text', {
    content: node.text
  });
  for (const mark of marks) {
    const config = markToMarkdoc[mark];
    if (config) {
      markdocNode = new Markdoc.Ast.Node(config.type, {}, [markdocNode], config.tag);
    }
  }
  return markdocNode;
}
function toMarkdocDocument(nodes, _config) {
  const extraFiles = [];
  const config = {
    ..._config,
    extraFiles
  };
  const node = new Markdoc.Ast.Node('document', {}, nodes.flatMap(x => toMarkdoc(x, config)));
  return {
    node,
    extraFiles
  };
}
function toChildrenAndProps(childrenAsMarkdoc, resultingChildren, value, singleChildField) {
  if (singleChildField.kind === 'child') {
    const child = childrenAsMarkdoc.find(x => areArraysEqual(x.propPath, singleChildField.relativePath));
    if (child) {
      resultingChildren.push(...child.children);
    }
    return;
  }
  if (singleChildField.kind === 'array') {
    const key = singleChildField.relativePath[singleChildField.relativePath.length - 1];
    const parent = getValueAtPropPath(value, singleChildField.relativePath.slice(0, -1));
    const valueAtPropPath = parent[key];
    delete parent[key];
    const childNodes = new Map();
    for (const child of childrenAsMarkdoc) {
      const innerPropPath = child.propPath.slice(singleChildField.relativePath.length + 1);
      const num = child.propPath[singleChildField.relativePath.length];
      if (childNodes.get(num) === undefined) {
        childNodes.set(num, []);
      }
      childNodes.get(num).push({
        children: child.children,
        propPath: innerPropPath
      });
    }
    resultingChildren.push(...valueAtPropPath.map((x, i) => {
      var _childNodes$get;
      const newChildrenAsMarkdoc = (_childNodes$get = childNodes.get(i)) !== null && _childNodes$get !== void 0 ? _childNodes$get : [];
      const children = [];
      toChildrenAndProps(newChildrenAsMarkdoc, children, x, singleChildField.child);
      return new Markdoc.Ast.Node('tag', x, children, singleChildField.asChildTag);
    }));
  }
}
function toMarkdoc(node, config) {
  if (node.type === 'paragraph') {
    const markdocNode = new Markdoc.Ast.Node('paragraph', node.textAlign ? {
      textAlign: node.textAlign
    } : {}, [toInline(node.children)]);
    if (node.textAlign) {
      markdocNode.annotations.push({
        name: 'textAlign',
        value: node.textAlign,
        type: 'attribute'
      });
    }
    return markdocNode;
  }
  if (node.type === 'image') {
    config.extraFiles.push({
      contents: node.src.content,
      path: node.src.filename,
      parent: typeof config.documentFeatures.images === 'object' && typeof config.documentFeatures.images.directory === 'string' ? fixPath(config.documentFeatures.images.directory) : undefined
    });
    return new Markdoc.Ast.Node('paragraph', {}, [new Markdoc.Ast.Node('inline', {}, [new Markdoc.Ast.Node('image', {
      src: encodeURI(`${getSrcPrefixForImageBlock(config.documentFeatures, config.slug)}${node.src.filename}`),
      alt: node.alt,
      title: node.title
    })])]);
  }
  if (node.type === 'code') {
    const extraAttributes = {};
    const {
      children,
      language,
      type,
      ...rest
    } = node;
    const schema = typeof config.documentFeatures.formatting.blockTypes.code === 'object' ? config.documentFeatures.formatting.blockTypes.code.schema : undefined;
    if (schema && Object.keys(schema.fields).length > 0) {
      const serialized = serializeProps(getInitialPropsValueFromInitializer(schema, rest), schema, undefined, config.slug, false);
      Object.assign(extraAttributes, serialized.value);
      config.extraFiles.push(...serialized.extraFiles);
    }
    let content = children[0].text + '\n';
    const markdocNode = new Markdoc.Ast.Node('fence', {
      content,
      language,
      ...extraAttributes
    }, [new Markdoc.Ast.Node('text', {
      content
    })]);
    for (const [key, value] of Object.entries(extraAttributes)) {
      markdocNode.annotations.push({
        name: key,
        value,
        type: 'attribute'
      });
    }
    return markdocNode;
  }
  const _toMarkdoc = node => toMarkdoc(node, config);
  if (node.type === 'blockquote') {
    return new Markdoc.Ast.Node('blockquote', {}, node.children.map(_toMarkdoc));
  }
  if (node.type === 'divider') {
    return new Markdoc.Ast.Node('hr');
  }
  if (node.type === 'table') {
    const head = node.children.find(x => x.type === 'table-head');
    return new Markdoc.Ast.Node('tag', {}, [new Markdoc.Ast.Node('table', {}, [new Markdoc.Ast.Node('thead', {}, head ? head.children.map(_toMarkdoc) : []), _toMarkdoc(node.children.find(x => x.type === 'table-body'))])], 'table');
  }
  if (node.type === 'table-body') {
    return new Markdoc.Ast.Node('tbody', {}, node.children.map(_toMarkdoc));
  }
  if (node.type === 'table-row') {
    return new Markdoc.Ast.Node('tr', {}, node.children.map(_toMarkdoc));
  }
  if (node.type === 'table-cell') {
    return new Markdoc.Ast.Node(node.header ? 'th' : 'td', {}, node.children.map(_toMarkdoc));
  }
  if (node.type === 'heading') {
    const extraAttributes = {};
    if (node.textAlign) {
      extraAttributes.textAlign = node.textAlign;
    }
    const {
      children,
      level,
      textAlign,
      type,
      ...rest
    } = node;
    const schema = config.documentFeatures.formatting.headings.schema;
    if (Object.keys(schema.fields).length > 0) {
      Object.assign(extraAttributes, serializeProps(getInitialPropsValueFromInitializer(schema, rest), schema, undefined, config.slug, false).value);
    }
    const markdocNode = new Markdoc.Ast.Node('heading', {
      level: node.level,
      ...extraAttributes
    }, [toInline(node.children)]);
    for (const [key, value] of Object.entries(extraAttributes)) {
      markdocNode.annotations.push({
        name: key,
        value,
        type: 'attribute'
      });
    }
    return markdocNode;
  }
  if (node.type === 'ordered-list') {
    return new Markdoc.Ast.Node('list', {
      ordered: true
    }, node.children.map(_toMarkdoc));
  }
  if (node.type === 'unordered-list') {
    return new Markdoc.Ast.Node('list', {
      ordered: false
    }, node.children.map(_toMarkdoc));
  }
  if (node.type === 'layout') {
    return new Markdoc.Ast.Node('tag', {
      layout: node.layout
    }, node.children.map(_toMarkdoc), 'layout');
  }
  if (node.type === 'layout-area') {
    return new Markdoc.Ast.Node('tag', {}, node.children.flatMap(_toMarkdoc), 'layout-area');
  }
  if (node.type === 'component-block') {
    const isVoid = node.children.length === 1 && node.children[0].type === 'component-inline-prop' && node.children[0].propPath === undefined;
    const componentBlock = config.componentBlocks[node.component];
    const childrenAsMarkdoc = [];
    for (const child of node.children) {
      if ((child.type === 'component-block-prop' || child.type === 'component-inline-prop') && child.propPath !== undefined) {
        childrenAsMarkdoc.push({
          type: child.type,
          propPath: child.propPath,
          children: child.type === 'component-block-prop' ? child.children.flatMap(_toMarkdoc) : [toInline(child.children)]
        });
      }
    }
    let attributes = node.props;
    if (componentBlock) {
      const serialized = serializeProps(node.props, {
        kind: 'object',
        fields: componentBlock.schema
      }, undefined, config.slug, false);
      attributes = serialized.value;
      config.extraFiles.push(...serialized.extraFiles);
      const singleChildField = findSingleChildField({
        kind: 'object',
        fields: componentBlock.schema
      });
      if (singleChildField) {
        const children = [];
        toChildrenAndProps(childrenAsMarkdoc, children, attributes, singleChildField);
        return new Markdoc.Ast.Node('tag', attributes, children, node.component);
      }
    }
    const children = isVoid ? [] : childrenAsMarkdoc.map(x => new Markdoc.Ast.Node('tag', {
      propPath: x.propPath
    }, x.children, x.type));
    return new Markdoc.Ast.Node('tag', attributes, children, node.component);
  }
  if (node.type === 'component-block-prop' || node.type === 'component-inline-prop') {
    return new Markdoc.Ast.Node('tag', {
      propPath: node.propPath
    }, node.type === 'component-inline-prop' ? [toInline(node.children)] : node.children.flatMap(_toMarkdoc), node.type);
  }
  if (node.type === 'list-item') {
    const listItemContent = node.children[0];
    if (listItemContent.type !== 'list-item-content') {
      throw new Error('list item content must contain a list-item-content');
    }
    const inline = toInline(listItemContent.children);
    const children = [inline];
    const nestedList = node.children[1];
    if (nestedList) {
      children.push(toMarkdoc(nestedList, config));
    }
    return new Markdoc.Ast.Node('item', {}, children);
  }
  if (node.type === 'list-item-content') {
    throw new Error('list-item-content in unexpected position');
  }
  debugger;
  throw new Error(`unexpected node type: ${node.type}`);
}

function validateText(val, min, max, fieldLabel, slugInfo) {
  if (val.length < min) {
    if (min === 1) {
      return `${fieldLabel} must not be empty`;
    } else {
      return `${fieldLabel} must be at least ${min} characters long`;
    }
  }
  if (val.length > max) {
    return `${fieldLabel} must be no longer than ${max} characters`;
  }
  if (slugInfo) {
    if (val === '') {
      return `${fieldLabel} must not be empty`;
    }
    if (val === '..') {
      return `${fieldLabel} must not be ..`;
    }
    if (val === '.') {
      return `${fieldLabel} must not be .`;
    }
    if (slugInfo.glob === '**') {
      const split = val.split('/');
      if (split.some(s => s === '..')) {
        return `${fieldLabel} must not contain ..`;
      }
      if (split.some(s => s === '.')) {
        return `${fieldLabel} must not be .`;
      }
    }
    if ((slugInfo.glob === '*' ? /[\\/]/ : /[\\]/).test(val)) {
      return `${fieldLabel} must not contain slashes`;
    }
    if (/^\s|\s$/.test(val)) {
      return `${fieldLabel} must not start or end with spaces`;
    }
    if (slugInfo.slugs.has(val)) {
      return `${fieldLabel} must be unique`;
    }
  }
}

function parseAsNormalField(value) {
  if (value === undefined) {
    return '';
  }
  if (typeof value !== 'string') {
    throw new FieldDataError('Must be a string');
  }
  return value;
}
const emptySet = new Set();
function text({
  label,
  defaultValue = '',
  validation: {
    length: {
      max = Infinity,
      min = 0
    } = {}
  } = {},
  description,
  multiline = false
}) {
  function validate(value, slugField) {
    const message = validateText(value, min, max, label, slugField);
    if (message !== undefined) {
      throw new FieldDataError(message);
    }
    return value;
  }
  return {
    kind: 'form',
    formKind: 'slug',
    Input(props) {
      return /*#__PURE__*/jsxRuntime.jsx(emptyFieldUi.TextFieldInput, {
        label: label,
        description: description,
        min: min,
        max: max,
        multiline: multiline,
        ...props
      });
    },
    defaultValue() {
      return typeof defaultValue === 'string' ? defaultValue : defaultValue();
    },
    parse(value, args) {
      if ((args === null || args === void 0 ? void 0 : args.slug) !== undefined) {
        return args.slug;
      }
      return parseAsNormalField(value);
    },
    serialize(value) {
      return {
        value: value === '' ? undefined : value
      };
    },
    serializeWithSlug(value) {
      return {
        slug: value,
        value: undefined
      };
    },
    reader: {
      parse(value) {
        const parsed = parseAsNormalField(value);
        return validate(parsed, undefined);
      },
      parseWithSlug(_value, args) {
        validate(parseAsNormalField(args.slug), {
          glob: args.glob,
          slugs: emptySet
        });
        return null;
      }
    },
    validate(value, args) {
      return validate(value, args === null || args === void 0 ? void 0 : args.slugField);
    }
  };
}

/* eslint-disable */
globalThis.Prism = {
  manual: true
};

/* **********************************************
     Begin prism-core.js
********************************************** */

/// <reference lib="WebWorker"/>

var _self = globalThis;

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 *
 * @license MIT <https://opensource.org/licenses/MIT>
 * @author Lea Verou <https://lea.verou.me>
 * @namespace
 * @public
 */
var Prism = function (_self) {
  // Private helper vars
  var lang = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i;
  var uniqueId = 0;

  // The grammar object for plaintext
  var plainTextGrammar = {};
  var _ = {
    /**
     * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
     * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
     * additional languages or plugins yourself.
     *
     * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
     *
     * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
     * empty Prism object into the global scope before loading the Prism script like this:
     *
     * ```js
     * window.Prism = window.Prism || {};
     * Prism.manual = true;
     * // add a new <script> to load Prism's script
     * ```
     *
     * @default false
     * @type {boolean}
     * @memberof Prism
     * @public
     */
    manual: _self.Prism && _self.Prism.manual,
    /**
     * By default, if Prism is in a web worker, it assumes that it is in a worker it created itself, so it uses
     * `addEventListener` to communicate with its parent instance. However, if you're using Prism manually in your
     * own worker, you don't want it to do this.
     *
     * By setting this value to `true`, Prism will not add its own listeners to the worker.
     *
     * You obviously have to change this value before Prism executes. To do this, you can add an
     * empty Prism object into the global scope before loading the Prism script like this:
     *
     * ```js
     * window.Prism = window.Prism || {};
     * Prism.disableWorkerMessageHandler = true;
     * // Load Prism's script
     * ```
     *
     * @default false
     * @type {boolean}
     * @memberof Prism
     * @public
     */
    disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
    /**
     * A namespace for utility methods.
     *
     * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
     * change or disappear at any time.
     *
     * @namespace
     * @memberof Prism
     */
    util: {
      encode: function encode(tokens) {
        if (tokens instanceof Token) {
          return new Token(tokens.type, encode(tokens.content), tokens.alias);
        } else if (Array.isArray(tokens)) {
          return tokens.map(encode);
        } else {
          return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
        }
      },
      /**
       * Returns the name of the type of the given value.
       *
       * @param {any} o
       * @returns {string}
       * @example
       * type(null)      === 'Null'
       * type(undefined) === 'Undefined'
       * type(123)       === 'Number'
       * type('foo')     === 'String'
       * type(true)      === 'Boolean'
       * type([1, 2])    === 'Array'
       * type({})        === 'Object'
       * type(String)    === 'Function'
       * type(/abc+/)    === 'RegExp'
       */
      type: function (o) {
        return Object.prototype.toString.call(o).slice(8, -1);
      },
      /**
       * Returns a unique number for the given object. Later calls will still return the same number.
       *
       * @param {Object} obj
       * @returns {number}
       */
      objId: function (obj) {
        if (!obj['__id']) {
          Object.defineProperty(obj, '__id', {
            value: ++uniqueId
          });
        }
        return obj['__id'];
      },
      /**
       * Creates a deep clone of the given object.
       *
       * The main intended use of this function is to clone language definitions.
       *
       * @param {T} o
       * @param {Record<number, any>} [visited]
       * @returns {T}
       * @template T
       */
      clone: function deepClone(o, visited) {
        visited = visited || {};
        var clone;
        var id;
        switch (_.util.type(o)) {
          case 'Object':
            id = _.util.objId(o);
            if (visited[id]) {
              return visited[id];
            }
            clone = /** @type {Record<string, any>} */{};
            visited[id] = clone;
            for (var key in o) {
              if (o.hasOwnProperty(key)) {
                clone[key] = deepClone(o[key], visited);
              }
            }
            return (/** @type {any} */clone
            );
          case 'Array':
            id = _.util.objId(o);
            if (visited[id]) {
              return visited[id];
            }
            clone = [];
            visited[id] = clone;
            /** @type {Array} */ /** @type {any} */o.forEach(function (v, i) {
              clone[i] = deepClone(v, visited);
            });
            return (/** @type {any} */clone
            );
          default:
            return o;
        }
      },
      /**
       * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
       *
       * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
       *
       * @param {Element} element
       * @returns {string}
       */
      getLanguage: function (element) {
        while (element) {
          var m = lang.exec(element.className);
          if (m) {
            return m[1].toLowerCase();
          }
          element = element.parentElement;
        }
        return 'none';
      },
      /**
       * Sets the Prism `language-xxxx` class of the given element.
       *
       * @param {Element} element
       * @param {string} language
       * @returns {void}
       */
      setLanguage: function (element, language) {
        // remove all `language-xxxx` classes
        // (this might leave behind a leading space)
        element.className = element.className.replace(RegExp(lang, 'gi'), '');

        // add the new `language-xxxx` class
        // (using `classList` will automatically clean up spaces for us)
        element.classList.add('language-' + language);
      },
      /**
       * Returns the script element that is currently executing.
       *
       * This does __not__ work for line script element.
       *
       * @returns {HTMLScriptElement | null}
       */
      currentScript: function () {
        if (typeof document === 'undefined') {
          return null;
        }
        if ('currentScript' in document && 1 < 2 /* hack to trip TS' flow analysis */) {
          return (/** @type {any} */document.currentScript
          );
        }

        // IE11 workaround
        // we'll get the src of the current script by parsing IE11's error stack trace
        // this will not work for inline scripts

        try {
          throw new Error();
        } catch (err) {
          // Get file src url from stack. Specifically works with the format of stack traces in IE.
          // A stack will look like this:
          //
          // Error
          //    at _.util.currentScript (http://localhost/components/prism-core.js:119:5)
          //    at Global code (http://localhost/components/prism-core.js:606:1)

          var src = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(err.stack) || [])[1];
          if (src) {
            var scripts = document.getElementsByTagName('script');
            for (var i in scripts) {
              if (scripts[i].src == src) {
                return scripts[i];
              }
            }
          }
          return null;
        }
      },
      /**
       * Returns whether a given class is active for `element`.
       *
       * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
       * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
       * given class is just the given class with a `no-` prefix.
       *
       * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
       * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
       * ancestors have the given class or the negated version of it, then the default activation will be returned.
       *
       * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
       * version of it, the class is considered active.
       *
       * @param {Element} element
       * @param {string} className
       * @param {boolean} [defaultActivation=false]
       * @returns {boolean}
       */
      isActive: function (element, className, defaultActivation) {
        var no = 'no-' + className;
        while (element) {
          var classList = element.classList;
          if (classList.contains(className)) {
            return true;
          }
          if (classList.contains(no)) {
            return false;
          }
          element = element.parentElement;
        }
        return !!defaultActivation;
      }
    },
    /**
     * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
     *
     * @namespace
     * @memberof Prism
     * @public
     */
    languages: {
      /**
       * The grammar for plain, unformatted text.
       */
      plain: plainTextGrammar,
      plaintext: plainTextGrammar,
      text: plainTextGrammar,
      txt: plainTextGrammar,
      /**
       * Creates a deep copy of the language with the given id and appends the given tokens.
       *
       * If a token in `redef` also appears in the copied language, then the existing token in the copied language
       * will be overwritten at its original position.
       *
       * ## Best practices
       *
       * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
       * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
       * understand the language definition because, normally, the order of tokens matters in Prism grammars.
       *
       * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
       * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
       *
       * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
       * @param {Grammar} redef The new tokens to append.
       * @returns {Grammar} The new language created.
       * @public
       * @example
       * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
       *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
       *     // at its original position
       *     'comment': { ... },
       *     // CSS doesn't have a 'color' token, so this token will be appended
       *     'color': /\b(?:red|green|blue)\b/
       * });
       */
      extend: function (id, redef) {
        var lang = _.util.clone(_.languages[id]);
        for (var key in redef) {
          lang[key] = redef[key];
        }
        return lang;
      },
      /**
       * Inserts tokens _before_ another token in a language definition or any other grammar.
       *
       * ## Usage
       *
       * This helper method makes it easy to modify existing languages. For example, the CSS language definition
       * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
       * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
       * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
       * this:
       *
       * ```js
       * Prism.languages.markup.style = {
       *     // token
       * };
       * ```
       *
       * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
       * before existing tokens. For the CSS example above, you would use it like this:
       *
       * ```js
       * Prism.languages.insertBefore('markup', 'cdata', {
       *     'style': {
       *         // token
       *     }
       * });
       * ```
       *
       * ## Special cases
       *
       * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
       * will be ignored.
       *
       * This behavior can be used to insert tokens after `before`:
       *
       * ```js
       * Prism.languages.insertBefore('markup', 'comment', {
       *     'comment': Prism.languages.markup.comment,
       *     // tokens after 'comment'
       * });
       * ```
       *
       * ## Limitations
       *
       * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
       * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
       * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
       * deleting properties which is necessary to insert at arbitrary positions.
       *
       * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
       * Instead, it will create a new object and replace all references to the target object with the new one. This
       * can be done without temporarily deleting properties, so the iteration order is well-defined.
       *
       * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
       * you hold the target object in a variable, then the value of the variable will not change.
       *
       * ```js
       * var oldMarkup = Prism.languages.markup;
       * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
       *
       * assert(oldMarkup !== Prism.languages.markup);
       * assert(newMarkup === Prism.languages.markup);
       * ```
       *
       * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
       * object to be modified.
       * @param {string} before The key to insert before.
       * @param {Grammar} insert An object containing the key-value pairs to be inserted.
       * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
       * object to be modified.
       *
       * Defaults to `Prism.languages`.
       * @returns {Grammar} The new grammar object.
       * @public
       */
      insertBefore: function (inside, before, insert, root) {
        root = root || /** @type {any} */_.languages;
        var grammar = root[inside];
        /** @type {Grammar} */
        var ret = {};
        for (var token in grammar) {
          if (grammar.hasOwnProperty(token)) {
            if (token == before) {
              for (var newToken in insert) {
                if (insert.hasOwnProperty(newToken)) {
                  ret[newToken] = insert[newToken];
                }
              }
            }

            // Do not insert token which also occur in insert. See #1525
            if (!insert.hasOwnProperty(token)) {
              ret[token] = grammar[token];
            }
          }
        }
        var old = root[inside];
        root[inside] = ret;

        // Update references in other language definitions
        _.languages.DFS(_.languages, function (key, value) {
          if (value === old && key != inside) {
            this[key] = ret;
          }
        });
        return ret;
      },
      // Traverse a language definition with Depth First Search
      DFS: function DFS(o, callback, type, visited) {
        visited = visited || {};
        var objId = _.util.objId;
        for (var i in o) {
          if (o.hasOwnProperty(i)) {
            callback.call(o, i, o[i], type || i);
            var property = o[i];
            var propertyType = _.util.type(property);
            if (propertyType === 'Object' && !visited[objId(property)]) {
              visited[objId(property)] = true;
              DFS(property, callback, null, visited);
            } else if (propertyType === 'Array' && !visited[objId(property)]) {
              visited[objId(property)] = true;
              DFS(property, callback, i, visited);
            }
          }
        }
      }
    },
    plugins: {},
    /**
     * This is the most high-level function in Prism’s API.
     * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
     * each one of them.
     *
     * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
     *
     * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
     * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
     * @memberof Prism
     * @public
     */
    highlightAll: function (async, callback) {
      _.highlightAllUnder(document, async, callback);
    },
    /**
     * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
     * {@link Prism.highlightElement} on each one of them.
     *
     * The following hooks will be run:
     * 1. `before-highlightall`
     * 2. `before-all-elements-highlight`
     * 3. All hooks of {@link Prism.highlightElement} for each element.
     *
     * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
     * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
     * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
     * @memberof Prism
     * @public
     */
    highlightAllUnder: function (container, async, callback) {
      var env = {
        callback: callback,
        container: container,
        selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
      };
      _.hooks.run('before-highlightall', env);
      env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));
      _.hooks.run('before-all-elements-highlight', env);
      for (var i = 0, element; element = env.elements[i++];) {
        _.highlightElement(element, async === true, env.callback);
      }
    },
    /**
     * Highlights the code inside a single element.
     *
     * The following hooks will be run:
     * 1. `before-sanity-check`
     * 2. `before-highlight`
     * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
     * 4. `before-insert`
     * 5. `after-highlight`
     * 6. `complete`
     *
     * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
     * the element's language.
     *
     * @param {Element} element The element containing the code.
     * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
     * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
     * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
     * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
     *
     * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
     * asynchronous highlighting to work. You can build your own bundle on the
     * [Download page](https://prismjs.com/download.html).
     * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
     * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
     * @memberof Prism
     * @public
     */
    highlightElement: function (element, async, callback) {
      // Find language
      var language = _.util.getLanguage(element);
      var grammar = _.languages[language];

      // Set language on the element, if not present
      _.util.setLanguage(element, language);

      // Set language on the parent, for styling
      var parent = element.parentElement;
      if (parent && parent.nodeName.toLowerCase() === 'pre') {
        _.util.setLanguage(parent, language);
      }
      var code = element.textContent;
      var env = {
        element: element,
        language: language,
        grammar: grammar,
        code: code
      };
      function insertHighlightedCode(highlightedCode) {
        env.highlightedCode = highlightedCode;
        _.hooks.run('before-insert', env);
        env.element.innerHTML = env.highlightedCode;
        _.hooks.run('after-highlight', env);
        _.hooks.run('complete', env);
        callback && callback.call(env.element);
      }
      _.hooks.run('before-sanity-check', env);

      // plugins may change/add the parent/element
      parent = env.element.parentElement;
      if (parent && parent.nodeName.toLowerCase() === 'pre' && !parent.hasAttribute('tabindex')) {
        parent.setAttribute('tabindex', '0');
      }
      if (!env.code) {
        _.hooks.run('complete', env);
        callback && callback.call(env.element);
        return;
      }
      _.hooks.run('before-highlight', env);
      if (!env.grammar) {
        insertHighlightedCode(_.util.encode(env.code));
        return;
      }
      if (async && _self.Worker) {
        var worker = new Worker(_.filename);
        worker.onmessage = function (evt) {
          insertHighlightedCode(evt.data);
        };
        worker.postMessage(JSON.stringify({
          language: env.language,
          code: env.code,
          immediateClose: true
        }));
      } else {
        insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
      }
    },
    /**
     * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
     * and the language definitions to use, and returns a string with the HTML produced.
     *
     * The following hooks will be run:
     * 1. `before-tokenize`
     * 2. `after-tokenize`
     * 3. `wrap`: On each {@link Token}.
     *
     * @param {string} text A string with the code to be highlighted.
     * @param {Grammar} grammar An object containing the tokens to use.
     *
     * Usually a language definition like `Prism.languages.markup`.
     * @param {string} language The name of the language definition passed to `grammar`.
     * @returns {string} The highlighted HTML.
     * @memberof Prism
     * @public
     * @example
     * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
     */
    highlight: function (text, grammar, language) {
      var env = {
        code: text,
        grammar: grammar,
        language: language
      };
      _.hooks.run('before-tokenize', env);
      if (!env.grammar) {
        throw new Error('The language "' + env.language + '" has no grammar.');
      }
      env.tokens = _.tokenize(env.code, env.grammar);
      _.hooks.run('after-tokenize', env);
      return Token.stringify(_.util.encode(env.tokens), env.language);
    },
    /**
     * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
     * and the language definitions to use, and returns an array with the tokenized code.
     *
     * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
     *
     * This method could be useful in other contexts as well, as a very crude parser.
     *
     * @param {string} text A string with the code to be highlighted.
     * @param {Grammar} grammar An object containing the tokens to use.
     *
     * Usually a language definition like `Prism.languages.markup`.
     * @returns {TokenStream} An array of strings and tokens, a token stream.
     * @memberof Prism
     * @public
     * @example
     * let code = `var foo = 0;`;
     * let tokens = Prism.tokenize(code, Prism.languages.javascript);
     * tokens.forEach(token => {
     *     if (token instanceof Prism.Token && token.type === 'number') {
     *         console.log(`Found numeric literal: ${token.content}`);
     *     }
     * });
     */
    tokenize: function (text, grammar) {
      var rest = grammar.rest;
      if (rest) {
        for (var token in rest) {
          grammar[token] = rest[token];
        }
        delete grammar.rest;
      }
      var tokenList = new LinkedList();
      addAfter(tokenList, tokenList.head, text);
      matchGrammar(text, tokenList, grammar, tokenList.head, 0);
      return toArray(tokenList);
    },
    /**
     * @namespace
     * @memberof Prism
     * @public
     */
    hooks: {
      all: {},
      /**
       * Adds the given callback to the list of callbacks for the given hook.
       *
       * The callback will be invoked when the hook it is registered for is run.
       * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
       *
       * One callback function can be registered to multiple hooks and the same hook multiple times.
       *
       * @param {string} name The name of the hook.
       * @param {HookCallback} callback The callback function which is given environment variables.
       * @public
       */
      add: function (name, callback) {
        var hooks = _.hooks.all;
        hooks[name] = hooks[name] || [];
        hooks[name].push(callback);
      },
      /**
       * Runs a hook invoking all registered callbacks with the given environment variables.
       *
       * Callbacks will be invoked synchronously and in the order in which they were registered.
       *
       * @param {string} name The name of the hook.
       * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
       * @public
       */
      run: function (name, env) {
        var callbacks = _.hooks.all[name];
        if (!callbacks || !callbacks.length) {
          return;
        }
        for (var i = 0, callback; callback = callbacks[i++];) {
          callback(env);
        }
      }
    },
    Token: Token
  };
  _self.Prism = _;

  // Typescript note:
  // The following can be used to import the Token type in JSDoc:
  //
  //   @typedef {InstanceType<import("./prism-core")["Token"]>} Token

  /**
   * Creates a new token.
   *
   * @param {string} type See {@link Token#type type}
   * @param {string | TokenStream} content See {@link Token#content content}
   * @param {string|string[]} [alias] The alias(es) of the token.
   * @param {string} [matchedStr=""] A copy of the full string this token was created from.
   * @class
   * @global
   * @public
   */
  function Token(type, content, alias, matchedStr) {
    /**
     * The type of the token.
     *
     * This is usually the key of a pattern in a {@link Grammar}.
     *
     * @type {string}
     * @see GrammarToken
     * @public
     */
    this.type = type;
    /**
     * The strings or tokens contained by this token.
     *
     * This will be a token stream if the pattern matched also defined an `inside` grammar.
     *
     * @type {string | TokenStream}
     * @public
     */
    this.content = content;
    /**
     * The alias(es) of the token.
     *
     * @type {string|string[]}
     * @see GrammarToken
     * @public
     */
    this.alias = alias;
    // Copy of the full string this token was created from
    this.length = (matchedStr || '').length | 0;
  }

  /**
   * A token stream is an array of strings and {@link Token Token} objects.
   *
   * Token streams have to fulfill a few properties that are assumed by most functions (mostly internal ones) that process
   * them.
   *
   * 1. No adjacent strings.
   * 2. No empty strings.
   *
   *    The only exception here is the token stream that only contains the empty string and nothing else.
   *
   * @typedef {Array<string | Token>} TokenStream
   * @global
   * @public
   */

  /**
   * Converts the given token or token stream to an HTML representation.
   *
   * The following hooks will be run:
   * 1. `wrap`: On each {@link Token}.
   *
   * @param {string | Token | TokenStream} o The token or token stream to be converted.
   * @param {string} language The name of current language.
   * @returns {string} The HTML representation of the token or token stream.
   * @memberof Token
   * @static
   */
  Token.stringify = function stringify(o, language) {
    if (typeof o == 'string') {
      return o;
    }
    if (Array.isArray(o)) {
      var s = '';
      o.forEach(function (e) {
        s += stringify(e, language);
      });
      return s;
    }
    var env = {
      type: o.type,
      content: stringify(o.content, language),
      tag: 'span',
      classes: ['token', o.type],
      attributes: {},
      language: language
    };
    var aliases = o.alias;
    if (aliases) {
      if (Array.isArray(aliases)) {
        Array.prototype.push.apply(env.classes, aliases);
      } else {
        env.classes.push(aliases);
      }
    }
    _.hooks.run('wrap', env);
    var attributes = '';
    for (var name in env.attributes) {
      attributes += ' ' + name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
    }
    return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + attributes + '>' + env.content + '</' + env.tag + '>';
  };

  /**
   * @param {RegExp} pattern
   * @param {number} pos
   * @param {string} text
   * @param {boolean} lookbehind
   * @returns {RegExpExecArray | null}
   */
  function matchPattern(pattern, pos, text, lookbehind) {
    pattern.lastIndex = pos;
    var match = pattern.exec(text);
    if (match && lookbehind && match[1]) {
      // change the match to remove the text matched by the Prism lookbehind group
      var lookbehindLength = match[1].length;
      match.index += lookbehindLength;
      match[0] = match[0].slice(lookbehindLength);
    }
    return match;
  }

  /**
   * @param {string} text
   * @param {LinkedList<string | Token>} tokenList
   * @param {any} grammar
   * @param {LinkedListNode<string | Token>} startNode
   * @param {number} startPos
   * @param {RematchOptions} [rematch]
   * @returns {void}
   * @private
   *
   * @typedef RematchOptions
   * @property {string} cause
   * @property {number} reach
   */
  function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
    for (var token in grammar) {
      if (!grammar.hasOwnProperty(token) || !grammar[token]) {
        continue;
      }
      var patterns = grammar[token];
      patterns = Array.isArray(patterns) ? patterns : [patterns];
      for (var j = 0; j < patterns.length; ++j) {
        if (rematch && rematch.cause == token + ',' + j) {
          return;
        }
        var patternObj = patterns[j];
        var inside = patternObj.inside;
        var lookbehind = !!patternObj.lookbehind;
        var greedy = !!patternObj.greedy;
        var alias = patternObj.alias;
        if (greedy && !patternObj.pattern.global) {
          // Without the global flag, lastIndex won't work
          var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
          patternObj.pattern = RegExp(patternObj.pattern.source, flags + 'g');
        }

        /** @type {RegExp} */
        var pattern = patternObj.pattern || patternObj;
        for (
        // iterate the token list and keep track of the current token/string position
        var currentNode = startNode.next, pos = startPos; currentNode !== tokenList.tail; pos += currentNode.value.length, currentNode = currentNode.next) {
          if (rematch && pos >= rematch.reach) {
            break;
          }
          var str = currentNode.value;
          if (tokenList.length > text.length) {
            // Something went terribly wrong, ABORT, ABORT!
            return;
          }
          if (str instanceof Token) {
            continue;
          }
          var removeCount = 1; // this is the to parameter of removeBetween
          var match;
          if (greedy) {
            match = matchPattern(pattern, pos, text, lookbehind);
            if (!match || match.index >= text.length) {
              break;
            }
            var from = match.index;
            var to = match.index + match[0].length;
            var p = pos;

            // find the node that contains the match
            p += currentNode.value.length;
            while (from >= p) {
              currentNode = currentNode.next;
              p += currentNode.value.length;
            }
            // adjust pos (and p)
            p -= currentNode.value.length;
            pos = p;

            // the current node is a Token, then the match starts inside another Token, which is invalid
            if (currentNode.value instanceof Token) {
              continue;
            }

            // find the last node which is affected by this match
            for (var k = currentNode; k !== tokenList.tail && (p < to || typeof k.value === 'string'); k = k.next) {
              removeCount++;
              p += k.value.length;
            }
            removeCount--;

            // replace with the new match
            str = text.slice(pos, p);
            match.index -= pos;
          } else {
            match = matchPattern(pattern, 0, str, lookbehind);
            if (!match) {
              continue;
            }
          }

          // eslint-disable-next-line no-redeclare
          var from = match.index;
          var matchStr = match[0];
          var before = str.slice(0, from);
          var after = str.slice(from + matchStr.length);
          var reach = pos + str.length;
          if (rematch && reach > rematch.reach) {
            rematch.reach = reach;
          }
          var removeFrom = currentNode.prev;
          if (before) {
            removeFrom = addAfter(tokenList, removeFrom, before);
            pos += before.length;
          }
          removeRange(tokenList, removeFrom, removeCount);
          var wrapped = new Token(token, inside ? _.tokenize(matchStr, inside) : matchStr, alias, matchStr);
          currentNode = addAfter(tokenList, removeFrom, wrapped);
          if (after) {
            addAfter(tokenList, currentNode, after);
          }
          if (removeCount > 1) {
            // at least one Token object was removed, so we have to do some rematching
            // this can only happen if the current pattern is greedy

            /** @type {RematchOptions} */
            var nestedRematch = {
              cause: token + ',' + j,
              reach: reach
            };
            matchGrammar(text, tokenList, grammar, currentNode.prev, pos, nestedRematch);

            // the reach might have been extended because of the rematching
            if (rematch && nestedRematch.reach > rematch.reach) {
              rematch.reach = nestedRematch.reach;
            }
          }
        }
      }
    }
  }

  /**
   * @typedef LinkedListNode
   * @property {T} value
   * @property {LinkedListNode<T> | null} prev The previous node.
   * @property {LinkedListNode<T> | null} next The next node.
   * @template T
   * @private
   */

  /**
   * @template T
   * @private
   */
  function LinkedList() {
    /** @type {LinkedListNode<T>} */
    var head = {
      value: null,
      prev: null,
      next: null
    };
    /** @type {LinkedListNode<T>} */
    var tail = {
      value: null,
      prev: head,
      next: null
    };
    head.next = tail;

    /** @type {LinkedListNode<T>} */
    this.head = head;
    /** @type {LinkedListNode<T>} */
    this.tail = tail;
    this.length = 0;
  }

  /**
   * Adds a new node with the given value to the list.
   *
   * @param {LinkedList<T>} list
   * @param {LinkedListNode<T>} node
   * @param {T} value
   * @returns {LinkedListNode<T>} The added node.
   * @template T
   */
  function addAfter(list, node, value) {
    // assumes that node != list.tail && values.length >= 0
    var next = node.next;
    var newNode = {
      value: value,
      prev: node,
      next: next
    };
    node.next = newNode;
    next.prev = newNode;
    list.length++;
    return newNode;
  }
  /**
   * Removes `count` nodes after the given node. The given node will not be removed.
   *
   * @param {LinkedList<T>} list
   * @param {LinkedListNode<T>} node
   * @param {number} count
   * @template T
   */
  function removeRange(list, node, count) {
    var next = node.next;
    for (var i = 0; i < count && next !== list.tail; i++) {
      next = next.next;
    }
    node.next = next;
    next.prev = node;
    list.length -= i;
  }
  /**
   * @param {LinkedList<T>} list
   * @returns {T[]}
   * @template T
   */
  function toArray(list) {
    var array = [];
    var node = list.head.next;
    while (node !== list.tail) {
      array.push(node.value);
      node = node.next;
    }
    return array;
  }
  if (!_self.document) {
    if (!_self.addEventListener) {
      // in Node.js
      return _;
    }
    if (!_.disableWorkerMessageHandler) {
      // In worker
      _self.addEventListener('message', function (evt) {
        var message = JSON.parse(evt.data);
        var lang = message.language;
        var code = message.code;
        var immediateClose = message.immediateClose;
        _self.postMessage(_.highlight(code, _.languages[lang], lang));
        if (immediateClose) {
          _self.close();
        }
      }, false);
    }
    return _;
  }

  // Get current script and highlight
  var script = _.util.currentScript();
  if (script) {
    _.filename = script.src;
    if (script.hasAttribute('data-manual')) {
      _.manual = true;
    }
  }
  function highlightAutomaticallyCallback() {
    if (!_.manual) {
      _.highlightAll();
    }
  }
  if (!_.manual) {
    // If the document state is "loading", then we'll use DOMContentLoaded.
    // If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
    // DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
    // might take longer one animation frame to execute which can create a race condition where only some plugins have
    // been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
    // See https://github.com/PrismJS/prism/issues/2102
    var readyState = document.readyState;
    if (readyState === 'loading' || readyState === 'interactive' && script && script.defer) {
      document.addEventListener('DOMContentLoaded', highlightAutomaticallyCallback);
    } else {
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(highlightAutomaticallyCallback);
      } else {
        window.setTimeout(highlightAutomaticallyCallback, 16);
      }
    }
  }
  return _;
}(_self);

// some additional documentation/types

/**
 * The expansion of a simple `RegExp` literal to support additional properties.
 *
 * @typedef GrammarToken
 * @property {RegExp} pattern The regular expression of the token.
 * @property {boolean} [lookbehind=false] If `true`, then the first capturing group of `pattern` will (effectively)
 * behave as a lookbehind group meaning that the captured text will not be part of the matched text of the new token.
 * @property {boolean} [greedy=false] Whether the token is greedy.
 * @property {string|string[]} [alias] An optional alias or list of aliases.
 * @property {Grammar} [inside] The nested grammar of this token.
 *
 * The `inside` grammar will be used to tokenize the text value of each token of this kind.
 *
 * This can be used to make nested and even recursive language definitions.
 *
 * Note: This can cause infinite recursion. Be careful when you embed different languages or even the same language into
 * each another.
 * @global
 * @public
 */

/**
 * @typedef Grammar
 * @type {Object<string, RegExp | GrammarToken | Array<RegExp | GrammarToken>>}
 * @property {Grammar} [rest] An optional grammar object that will be appended to this grammar.
 * @global
 * @public
 */

/**
 * A function which will invoked after an element was successfully highlighted.
 *
 * @callback HighlightCallback
 * @param {Element} element The element successfully highlighted.
 * @returns {void}
 * @global
 * @public
 */

/**
 * @callback HookCallback
 * @param {Object<string, any>} env The environment variables of the hook.
 * @returns {void}
 * @global
 * @public
 */

/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
  'comment': {
    pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
    greedy: true
  },
  'prolog': {
    pattern: /<\?[\s\S]+?\?>/,
    greedy: true
  },
  'doctype': {
    // https://www.w3.org/TR/xml/#NT-doctypedecl
    pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
    greedy: true,
    inside: {
      'internal-subset': {
        pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
        lookbehind: true,
        greedy: true,
        inside: null // see below
      },

      'string': {
        pattern: /"[^"]*"|'[^']*'/,
        greedy: true
      },
      'punctuation': /^<!|>$|[[\]]/,
      'doctype-tag': /^DOCTYPE/i,
      'name': /[^\s<>'"]+/
    }
  },
  'cdata': {
    pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
    greedy: true
  },
  'tag': {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    greedy: true,
    inside: {
      'tag': {
        pattern: /^<\/?[^\s>\/]+/,
        inside: {
          'punctuation': /^<\/?/,
          'namespace': /^[^\s>\/:]+:/
        }
      },
      'special-attr': [],
      'attr-value': {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
          'punctuation': [{
            pattern: /^=/,
            alias: 'attr-equals'
          }, {
            pattern: /^(\s*)["']|["']$/,
            lookbehind: true
          }]
        }
      },
      'punctuation': /\/?>/,
      'attr-name': {
        pattern: /[^\s>\/]+/,
        inside: {
          'namespace': /^[^\s>\/:]+:/
        }
      }
    }
  },
  'entity': [{
    pattern: /&[\da-z]{1,8};/i,
    alias: 'named-entity'
  }, /&#x?[\da-f]{1,8};/i]
};
Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] = Prism.languages.markup['entity'];
Prism.languages.markup['doctype'].inside['internal-subset'].inside = Prism.languages.markup;

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function (env) {
  if (env.type === 'entity') {
    env.attributes['title'] = env.content.replace(/&amp;/, '&');
  }
});
Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
  /**
   * Adds an inlined language to markup.
   *
   * An example of an inlined language is CSS with `<style>` tags.
   *
   * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
   * case insensitive.
   * @param {string} lang The language key.
   * @example
   * addInlined('style', 'css');
   */
  value: function addInlined(tagName, lang) {
    var includedCdataInside = {};
    includedCdataInside['language-' + lang] = {
      pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
      lookbehind: true,
      inside: Prism.languages[lang]
    };
    includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;
    var inside = {
      'included-cdata': {
        pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
        inside: includedCdataInside
      }
    };
    inside['language-' + lang] = {
      pattern: /[\s\S]+/,
      inside: Prism.languages[lang]
    };
    var def = {};
    def[tagName] = {
      pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function () {
        return tagName;
      }), 'i'),
      lookbehind: true,
      greedy: true,
      inside: inside
    };
    Prism.languages.insertBefore('markup', 'cdata', def);
  }
});
Object.defineProperty(Prism.languages.markup.tag, 'addAttribute', {
  /**
   * Adds an pattern to highlight languages embedded in HTML attributes.
   *
   * An example of an inlined language is CSS with `style` attributes.
   *
   * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
   * case insensitive.
   * @param {string} lang The language key.
   * @example
   * addAttribute('style', 'css');
   */
  value: function (attrName, lang) {
    Prism.languages.markup.tag.inside['special-attr'].push({
      pattern: RegExp(/(^|["'\s])/.source + '(?:' + attrName + ')' + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source, 'i'),
      lookbehind: true,
      inside: {
        'attr-name': /^[^\s=]+/,
        'attr-value': {
          pattern: /=[\s\S]+/,
          inside: {
            'value': {
              pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
              lookbehind: true,
              alias: [lang, 'language-' + lang],
              inside: Prism.languages[lang]
            },
            'punctuation': [{
              pattern: /^=/,
              alias: 'attr-equals'
            }, /"|'/]
          }
        }
      }
    });
  }
});
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;
Prism.languages.xml = Prism.languages.extend('markup', {});
Prism.languages.ssml = Prism.languages.xml;
Prism.languages.atom = Prism.languages.xml;
Prism.languages.rss = Prism.languages.xml;

/* **********************************************
     Begin prism-css.js
********************************************** */

(function (Prism) {
  var string = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
  Prism.languages.css = {
    'comment': /\/\*[\s\S]*?\*\//,
    'atrule': {
      pattern: RegExp('@[\\w-](?:' + /[^;{\s"']|\s+(?!\s)/.source + '|' + string.source + ')*?' + /(?:;|(?=\s*\{))/.source),
      inside: {
        'rule': /^@[\w-]+/,
        'selector-function-argument': {
          pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
          lookbehind: true,
          alias: 'selector'
        },
        'keyword': {
          pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
          lookbehind: true
        }
        // See rest below
      }
    },

    'url': {
      // https://drafts.csswg.org/css-values-3/#urls
      pattern: RegExp('\\burl\\((?:' + string.source + '|' + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ')\\)', 'i'),
      greedy: true,
      inside: {
        'function': /^url/i,
        'punctuation': /^\(|\)$/,
        'string': {
          pattern: RegExp('^' + string.source + '$'),
          alias: 'url'
        }
      }
    },
    'selector': {
      pattern: RegExp('(^|[{}\\s])[^{}\\s](?:[^{};"\'\\s]|\\s+(?![\\s{])|' + string.source + ')*(?=\\s*\\{)'),
      lookbehind: true
    },
    'string': {
      pattern: string,
      greedy: true
    },
    'property': {
      pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
      lookbehind: true
    },
    'important': /!important\b/i,
    'function': {
      pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
      lookbehind: true
    },
    'punctuation': /[(){};:,]/
  };
  Prism.languages.css['atrule'].inside.rest = Prism.languages.css;
  var markup = Prism.languages.markup;
  if (markup) {
    markup.tag.addInlined('style', 'css');
    markup.tag.addAttribute('style', 'css');
  }
})(Prism);

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
  'comment': [{
    pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
    lookbehind: true,
    greedy: true
  }, {
    pattern: /(^|[^\\:])\/\/.*/,
    lookbehind: true,
    greedy: true
  }],
  'string': {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: true
  },
  'class-name': {
    pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
    lookbehind: true,
    inside: {
      'punctuation': /[.\\]/
    }
  },
  'keyword': /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
  'boolean': /\b(?:false|true)\b/,
  'function': /\b\w+(?=\()/,
  'number': /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
  'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  'punctuation': /[{}[\];(),.:]/
};

/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
  'class-name': [Prism.languages.clike['class-name'], {
    pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
    lookbehind: true
  }],
  'keyword': [{
    pattern: /((?:^|\})\s*)catch\b/,
    lookbehind: true
  }, {
    pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
    lookbehind: true
  }],
  // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
  'function': /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  'number': {
    pattern: RegExp(/(^|[^\w$])/.source + '(?:' + (
    // constant
    /NaN|Infinity/.source + '|' +
    // binary integer
    /0[bB][01]+(?:_[01]+)*n?/.source + '|' +
    // octal integer
    /0[oO][0-7]+(?:_[0-7]+)*n?/.source + '|' +
    // hexadecimal integer
    /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + '|' +
    // decimal bigint
    /\d+(?:_\d+)*n/.source + '|' +
    // decimal number (integer or float) but no bigint
    /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ')' + /(?![\w$])/.source),
    lookbehind: true
  },
  'operator': /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
});
Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;
Prism.languages.insertBefore('javascript', 'keyword', {
  'regex': {
    pattern: RegExp(
    // lookbehind
    // eslint-disable-next-line regexp/no-dupe-characters-character-class
    /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source +
    // Regex pattern:
    // There are 2 regex patterns here. The RegExp set notation proposal added support for nested character
    // classes if the `v` flag is present. Unfortunately, nested CCs are both context-free and incompatible
    // with the only syntax, so we have to define 2 different regex patterns.
    /\//.source + '(?:' + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + '|' +
    // `v` flag syntax. This supports 3 levels of nested character classes.
    /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ')' +
    // lookahead
    /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),
    lookbehind: true,
    greedy: true,
    inside: {
      'regex-source': {
        pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
        lookbehind: true,
        alias: 'language-regex',
        inside: Prism.languages.regex
      },
      'regex-delimiter': /^\/|\/$/,
      'regex-flags': /^[a-z]+$/
    }
  },
  // This must be declared before keyword because we use "function" inside the look-forward
  'function-variable': {
    pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
    alias: 'function'
  },
  'parameter': [{
    pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
    lookbehind: true,
    inside: Prism.languages.javascript
  }, {
    pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
    lookbehind: true,
    inside: Prism.languages.javascript
  }, {
    pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
    lookbehind: true,
    inside: Prism.languages.javascript
  }, {
    pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
    lookbehind: true,
    inside: Prism.languages.javascript
  }],
  'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
});
Prism.languages.insertBefore('javascript', 'string', {
  'hashbang': {
    pattern: /^#!.*/,
    greedy: true,
    alias: 'comment'
  },
  'template-string': {
    pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
    greedy: true,
    inside: {
      'template-punctuation': {
        pattern: /^`|`$/,
        alias: 'string'
      },
      'interpolation': {
        pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
        lookbehind: true,
        inside: {
          'interpolation-punctuation': {
            pattern: /^\$\{|\}$/,
            alias: 'punctuation'
          },
          rest: Prism.languages.javascript
        }
      },
      'string': /[\s\S]+/
    }
  },
  'string-property': {
    pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
    lookbehind: true,
    greedy: true,
    alias: 'property'
  }
});
Prism.languages.insertBefore('javascript', 'operator', {
  'literal-property': {
    pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
    lookbehind: true,
    alias: 'property'
  }
});
if (Prism.languages.markup) {
  Prism.languages.markup.tag.addInlined('script', 'javascript');

  // add attribute support for all DOM events.
  // https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events
  Prism.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source, 'javascript');
}
Prism.languages.js = Prism.languages.javascript;

/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
  if (typeof Prism === 'undefined' || typeof document === 'undefined') {
    return;
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }
  var LOADING_MESSAGE = 'Loading…';
  var FAILURE_MESSAGE = function (status, message) {
    return '✖ Error ' + status + ' while fetching file: ' + message;
  };
  var FAILURE_EMPTY_MESSAGE = '✖ Error: File does not exist or is empty';
  var EXTENSIONS = {
    'js': 'javascript',
    'py': 'python',
    'rb': 'ruby',
    'ps1': 'powershell',
    'psm1': 'powershell',
    'sh': 'bash',
    'bat': 'batch',
    'h': 'c',
    'tex': 'latex'
  };
  var STATUS_ATTR = 'data-src-status';
  var STATUS_LOADING = 'loading';
  var STATUS_LOADED = 'loaded';
  var STATUS_FAILED = 'failed';
  var SELECTOR = 'pre[data-src]:not([' + STATUS_ATTR + '="' + STATUS_LOADED + '"])' + ':not([' + STATUS_ATTR + '="' + STATUS_LOADING + '"])';

  /**
   * Loads the given file.
   *
   * @param {string} src The URL or path of the source file to load.
   * @param {(result: string) => void} success
   * @param {(reason: string) => void} error
   */
  function loadFile(src, success, error) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', src, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status < 400 && xhr.responseText) {
          success(xhr.responseText);
        } else {
          if (xhr.status >= 400) {
            error(FAILURE_MESSAGE(xhr.status, xhr.statusText));
          } else {
            error(FAILURE_EMPTY_MESSAGE);
          }
        }
      }
    };
    xhr.send(null);
  }

  /**
   * Parses the given range.
   *
   * This returns a range with inclusive ends.
   *
   * @param {string | null | undefined} range
   * @returns {[number, number | undefined] | undefined}
   */
  function parseRange(range) {
    var m = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(range || '');
    if (m) {
      var start = Number(m[1]);
      var comma = m[2];
      var end = m[3];
      if (!comma) {
        return [start, start];
      }
      if (!end) {
        return [start, undefined];
      }
      return [start, Number(end)];
    }
    return undefined;
  }
  Prism.hooks.add('before-highlightall', function (env) {
    env.selector += ', ' + SELECTOR;
  });
  Prism.hooks.add('before-sanity-check', function (env) {
    var pre = /** @type {HTMLPreElement} */env.element;
    if (pre.matches(SELECTOR)) {
      env.code = ''; // fast-path the whole thing and go to complete

      pre.setAttribute(STATUS_ATTR, STATUS_LOADING); // mark as loading

      // add code element with loading message
      var code = pre.appendChild(document.createElement('CODE'));
      code.textContent = LOADING_MESSAGE;
      var src = pre.getAttribute('data-src');
      var language = env.language;
      if (language === 'none') {
        // the language might be 'none' because there is no language set;
        // in this case, we want to use the extension as the language
        var extension = (/\.(\w+)$/.exec(src) || [, 'none'])[1];
        language = EXTENSIONS[extension] || extension;
      }

      // set language classes
      Prism.util.setLanguage(code, language);
      Prism.util.setLanguage(pre, language);

      // preload the language
      var autoloader = Prism.plugins.autoloader;
      if (autoloader) {
        autoloader.loadLanguages(language);
      }

      // load file
      loadFile(src, function (text) {
        // mark as loaded
        pre.setAttribute(STATUS_ATTR, STATUS_LOADED);

        // handle data-range
        var range = parseRange(pre.getAttribute('data-range'));
        if (range) {
          var lines = text.split(/\r\n?|\n/g);

          // the range is one-based and inclusive on both ends
          var start = range[0];
          var end = range[1] == null ? lines.length : range[1];
          if (start < 0) {
            start += lines.length;
          }
          start = Math.max(0, Math.min(start - 1, lines.length));
          if (end < 0) {
            end += lines.length;
          }
          end = Math.max(0, Math.min(end, lines.length));
          text = lines.slice(start, end).join('\n');

          // add data-start for line numbers
          if (!pre.hasAttribute('data-start')) {
            pre.setAttribute('data-start', String(start + 1));
          }
        }

        // highlight code
        code.textContent = text;
        Prism.highlightElement(code);
      }, function (error) {
        // mark as failed
        pre.setAttribute(STATUS_ATTR, STATUS_FAILED);
        code.textContent = error;
      });
    }
  });
  Prism.plugins.fileHighlight = {
    /**
     * Executes the File Highlight plugin for all matching `pre` elements under the given container.
     *
     * Note: Elements which are already loaded or currently loading will not be touched by this method.
     *
     * @param {ParentNode} [container=document]
     */
    highlight: function highlight(container) {
      var elements = (container || document).querySelectorAll(SELECTOR);
      for (var i = 0, element; element = elements[i++];) {
        Prism.highlightElement(element);
      }
    }
  };
  var logged = false;
  /** @deprecated Use `Prism.plugins.fileHighlight.highlight` instead. */
  Prism.fileHighlight = function () {
    if (!logged) {
      console.warn('Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead.');
      logged = true;
    }
    Prism.plugins.fileHighlight.highlight.apply(this, arguments);
  };
})();
Prism.languages.clike = {
  'comment': [{
    pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
    lookbehind: true,
    greedy: true
  }, {
    pattern: /(^|[^\\:])\/\/.*/,
    lookbehind: true,
    greedy: true
  }],
  'string': {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: true
  },
  'class-name': {
    pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
    lookbehind: true,
    inside: {
      'punctuation': /[.\\]/
    }
  },
  'keyword': /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
  'boolean': /\b(?:false|true)\b/,
  'function': /\b\w+(?=\()/,
  'number': /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
  'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
  'punctuation': /[{}[\];(),.:]/
};
Prism.languages.c = Prism.languages.extend('clike', {
  'comment': {
    pattern: /\/\/(?:[^\r\n\\]|\\(?:\r\n?|\n|(?![\r\n])))*|\/\*[\s\S]*?(?:\*\/|$)/,
    greedy: true
  },
  'string': {
    // https://en.cppreference.com/w/c/language/string_literal
    pattern: /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
    greedy: true
  },
  'class-name': {
    pattern: /(\b(?:enum|struct)\s+(?:__attribute__\s*\(\([\s\S]*?\)\)\s*)?)\w+|\b[a-z]\w*_t\b/,
    lookbehind: true
  },
  'keyword': /\b(?:_Alignas|_Alignof|_Atomic|_Bool|_Complex|_Generic|_Imaginary|_Noreturn|_Static_assert|_Thread_local|__attribute__|asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|inline|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|typeof|union|unsigned|void|volatile|while)\b/,
  'function': /\b[a-z_]\w*(?=\s*\()/i,
  'number': /(?:\b0x(?:[\da-f]+(?:\.[\da-f]*)?|\.[\da-f]+)(?:p[+-]?\d+)?|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?)[ful]{0,4}/i,
  'operator': />>=?|<<=?|->|([-+&|:])\1|[?:~]|[-+*/%&|^!=<>]=?/
});
Prism.languages.insertBefore('c', 'string', {
  'char': {
    // https://en.cppreference.com/w/c/language/character_constant
    pattern: /'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n]){0,32}'/,
    greedy: true
  }
});
Prism.languages.insertBefore('c', 'string', {
  'macro': {
    // allow for multiline macro definitions
    // spaces after the # character compile fine with gcc
    pattern: /(^[\t ]*)#\s*[a-z](?:[^\r\n\\/]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|\\(?:\r\n|[\s\S]))*/im,
    lookbehind: true,
    greedy: true,
    alias: 'property',
    inside: {
      'string': [{
        // highlight the path of the include statement as a string
        pattern: /^(#\s*include\s*)<[^>]+>/,
        lookbehind: true
      }, Prism.languages.c['string']],
      'char': Prism.languages.c['char'],
      'comment': Prism.languages.c['comment'],
      'macro-name': [{
        pattern: /(^#\s*define\s+)\w+\b(?!\()/i,
        lookbehind: true
      }, {
        pattern: /(^#\s*define\s+)\w+\b(?=\()/i,
        lookbehind: true,
        alias: 'function'
      }],
      // highlight macro directives as keywords
      'directive': {
        pattern: /^(#\s*)[a-z]+/,
        lookbehind: true,
        alias: 'keyword'
      },
      'directive-hash': /^#/,
      'punctuation': /##|\\(?=[\r\n])/,
      'expression': {
        pattern: /\S[\s\S]*/,
        inside: Prism.languages.c
      }
    }
  }
});
Prism.languages.insertBefore('c', 'function', {
  // highlight predefined macros as constants
  'constant': /\b(?:EOF|NULL|SEEK_CUR|SEEK_END|SEEK_SET|__DATE__|__FILE__|__LINE__|__TIMESTAMP__|__TIME__|__func__|stderr|stdin|stdout)\b/
});
delete Prism.languages.c['boolean'];
(function (Prism) {
  var keyword = /\b(?:alignas|alignof|asm|auto|bool|break|case|catch|char|char16_t|char32_t|char8_t|class|co_await|co_return|co_yield|compl|concept|const|const_cast|consteval|constexpr|constinit|continue|decltype|default|delete|do|double|dynamic_cast|else|enum|explicit|export|extern|final|float|for|friend|goto|if|import|inline|int|int16_t|int32_t|int64_t|int8_t|long|module|mutable|namespace|new|noexcept|nullptr|operator|override|private|protected|public|register|reinterpret_cast|requires|return|short|signed|sizeof|static|static_assert|static_cast|struct|switch|template|this|thread_local|throw|try|typedef|typeid|typename|uint16_t|uint32_t|uint64_t|uint8_t|union|unsigned|using|virtual|void|volatile|wchar_t|while)\b/;
  var modName = /\b(?!<keyword>)\w+(?:\s*\.\s*\w+)*\b/.source.replace(/<keyword>/g, function () {
    return keyword.source;
  });
  Prism.languages.cpp = Prism.languages.extend('c', {
    'class-name': [{
      pattern: RegExp(/(\b(?:class|concept|enum|struct|typename)\s+)(?!<keyword>)\w+/.source.replace(/<keyword>/g, function () {
        return keyword.source;
      })),
      lookbehind: true
    },
    // This is intended to capture the class name of method implementations like:
    //   void foo::bar() const {}
    // However! The `foo` in the above example could also be a namespace, so we only capture the class name if
    // it starts with an uppercase letter. This approximation should give decent results.
    /\b[A-Z]\w*(?=\s*::\s*\w+\s*\()/,
    // This will capture the class name before destructors like:
    //   Foo::~Foo() {}
    /\b[A-Z_]\w*(?=\s*::\s*~\w+\s*\()/i,
    // This also intends to capture the class name of method implementations but here the class has template
    // parameters, so it can't be a namespace (until C++ adds generic namespaces).
    /\b\w+(?=\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>\s*::\s*\w+\s*\()/],
    'keyword': keyword,
    'number': {
      pattern: /(?:\b0b[01']+|\b0x(?:[\da-f']+(?:\.[\da-f']*)?|\.[\da-f']+)(?:p[+-]?[\d']+)?|(?:\b[\d']+(?:\.[\d']*)?|\B\.[\d']+)(?:e[+-]?[\d']+)?)[ful]{0,4}/i,
      greedy: true
    },
    'operator': />>=?|<<=?|->|--|\+\+|&&|\|\||[?:~]|<=>|[-+*/%&|^!=<>]=?|\b(?:and|and_eq|bitand|bitor|not|not_eq|or|or_eq|xor|xor_eq)\b/,
    'boolean': /\b(?:false|true)\b/
  });
  Prism.languages.insertBefore('cpp', 'string', {
    'module': {
      // https://en.cppreference.com/w/cpp/language/modules
      pattern: RegExp(/(\b(?:import|module)\s+)/.source + '(?:' +
      // header-name
      /"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|<[^<>\r\n]*>/.source + '|' +
      // module name or partition or both
      /<mod-name>(?:\s*:\s*<mod-name>)?|:\s*<mod-name>/.source.replace(/<mod-name>/g, function () {
        return modName;
      }) + ')'),
      lookbehind: true,
      greedy: true,
      inside: {
        'string': /^[<"][\s\S]+/,
        'operator': /:/,
        'punctuation': /\./
      }
    },
    'raw-string': {
      pattern: /R"([^()\\ ]{0,16})\([\s\S]*?\)\1"/,
      alias: 'string',
      greedy: true
    }
  });
  Prism.languages.insertBefore('cpp', 'keyword', {
    'generic-function': {
      pattern: /\b(?!operator\b)[a-z_]\w*\s*<(?:[^<>]|<[^<>]*>)*>(?=\s*\()/i,
      inside: {
        'function': /^\w+/,
        'generic': {
          pattern: /<[\s\S]+/,
          alias: 'class-name',
          inside: Prism.languages.cpp
        }
      }
    }
  });
  Prism.languages.insertBefore('cpp', 'operator', {
    'double-colon': {
      pattern: /::/,
      alias: 'punctuation'
    }
  });
  Prism.languages.insertBefore('cpp', 'class-name', {
    // the base clause is an optional list of parent classes
    // https://en.cppreference.com/w/cpp/language/class
    'base-clause': {
      pattern: /(\b(?:class|struct)\s+\w+\s*:\s*)[^;{}"'\s]+(?:\s+[^;{}"'\s]+)*(?=\s*[;{])/,
      lookbehind: true,
      greedy: true,
      inside: Prism.languages.extend('cpp', {})
    }
  });
  Prism.languages.insertBefore('inside', 'double-colon', {
    // All untokenized words that are not namespaces should be class names
    'class-name': /\b[a-z_]\w*\b(?!\s*::)/i
  }, Prism.languages.cpp['base-clause']);
})(Prism);
Prism.languages.arduino = Prism.languages.extend('cpp', {
  'keyword': /\b(?:String|array|bool|boolean|break|byte|case|catch|continue|default|do|double|else|finally|for|function|goto|if|in|instanceof|int|integer|long|loop|new|null|return|setup|string|switch|throw|try|void|while|word)\b/,
  'constant': /\b(?:ANALOG_MESSAGE|DEFAULT|DIGITAL_MESSAGE|EXTERNAL|FIRMATA_STRING|HIGH|INPUT|INPUT_PULLUP|INTERNAL|INTERNAL1V1|INTERNAL2V56|LED_BUILTIN|LOW|OUTPUT|REPORT_ANALOG|REPORT_DIGITAL|SET_PIN_MODE|SYSEX_START|SYSTEM_RESET)\b/,
  'builtin': /\b(?:Audio|BSSID|Bridge|Client|Console|EEPROM|Esplora|EsploraTFT|Ethernet|EthernetClient|EthernetServer|EthernetUDP|File|FileIO|FileSystem|Firmata|GPRS|GSM|GSMBand|GSMClient|GSMModem|GSMPIN|GSMScanner|GSMServer|GSMVoiceCall|GSM_SMS|HttpClient|IPAddress|IRread|Keyboard|KeyboardController|LiquidCrystal|LiquidCrystal_I2C|Mailbox|Mouse|MouseController|PImage|Process|RSSI|RobotControl|RobotMotor|SD|SPI|SSID|Scheduler|Serial|Server|Servo|SoftwareSerial|Stepper|Stream|TFT|Task|USBHost|WiFi|WiFiClient|WiFiServer|WiFiUDP|Wire|YunClient|YunServer|abs|addParameter|analogRead|analogReadResolution|analogReference|analogWrite|analogWriteResolution|answerCall|attach|attachGPRS|attachInterrupt|attached|autoscroll|available|background|beep|begin|beginPacket|beginSD|beginSMS|beginSpeaker|beginTFT|beginTransmission|beginWrite|bit|bitClear|bitRead|bitSet|bitWrite|blink|blinkVersion|buffer|changePIN|checkPIN|checkPUK|checkReg|circle|cityNameRead|cityNameWrite|clear|clearScreen|click|close|compassRead|config|connect|connected|constrain|cos|countryNameRead|countryNameWrite|createChar|cursor|debugPrint|delay|delayMicroseconds|detach|detachInterrupt|digitalRead|digitalWrite|disconnect|display|displayLogos|drawBMP|drawCompass|encryptionType|end|endPacket|endSMS|endTransmission|endWrite|exists|exitValue|fill|find|findUntil|flush|gatewayIP|get|getAsynchronously|getBand|getButton|getCurrentCarrier|getIMEI|getKey|getModifiers|getOemKey|getPINUsed|getResult|getSignalStrength|getSocket|getVoiceCallStatus|getXChange|getYChange|hangCall|height|highByte|home|image|interrupts|isActionDone|isDirectory|isListening|isPIN|isPressed|isValid|keyPressed|keyReleased|keyboardRead|knobRead|leftToRight|line|lineFollowConfig|listen|listenOnLocalhost|loadImage|localIP|lowByte|macAddress|maintain|map|max|messageAvailable|micros|millis|min|mkdir|motorsStop|motorsWrite|mouseDragged|mouseMoved|mousePressed|mouseReleased|move|noAutoscroll|noBlink|noBuffer|noCursor|noDisplay|noFill|noInterrupts|noListenOnLocalhost|noStroke|noTone|onReceive|onRequest|open|openNextFile|overflow|parseCommand|parseFloat|parseInt|parsePacket|pauseMode|peek|pinMode|playFile|playMelody|point|pointTo|position|pow|prepare|press|print|printFirmwareVersion|printVersion|println|process|processInput|pulseIn|put|random|randomSeed|read|readAccelerometer|readBlue|readButton|readBytes|readBytesUntil|readGreen|readJoystickButton|readJoystickSwitch|readJoystickX|readJoystickY|readLightSensor|readMessage|readMicrophone|readNetworks|readRed|readSlider|readString|readStringUntil|readTemperature|ready|rect|release|releaseAll|remoteIP|remoteNumber|remotePort|remove|requestFrom|retrieveCallingNumber|rewindDirectory|rightToLeft|rmdir|robotNameRead|robotNameWrite|run|runAsynchronously|runShellCommand|runShellCommandAsynchronously|running|scanNetworks|scrollDisplayLeft|scrollDisplayRight|seek|sendAnalog|sendDigitalPortPair|sendDigitalPorts|sendString|sendSysex|serialEvent|setBand|setBitOrder|setClockDivider|setCursor|setDNS|setDataMode|setFirmwareVersion|setMode|setPINUsed|setSpeed|setTextSize|setTimeout|shiftIn|shiftOut|shutdown|sin|size|sqrt|startLoop|step|stop|stroke|subnetMask|switchPIN|tan|tempoWrite|text|tone|transfer|tuneWrite|turn|updateIR|userNameRead|userNameWrite|voiceCall|waitContinue|width|write|writeBlue|writeGreen|writeJSON|writeMessage|writeMicroseconds|writeRGB|writeRed|yield)\b/
});
Prism.languages.ino = Prism.languages.arduino;
(function (Prism) {
  // $ set | grep '^[A-Z][^[:space:]]*=' | cut -d= -f1 | tr '\n' '|'
  // + LC_ALL, RANDOM, REPLY, SECONDS.
  // + make sure PS1..4 are here as they are not always set,
  // - some useless things.
  var envVars = '\\b(?:BASH|BASHOPTS|BASH_ALIASES|BASH_ARGC|BASH_ARGV|BASH_CMDS|BASH_COMPLETION_COMPAT_DIR|BASH_LINENO|BASH_REMATCH|BASH_SOURCE|BASH_VERSINFO|BASH_VERSION|COLORTERM|COLUMNS|COMP_WORDBREAKS|DBUS_SESSION_BUS_ADDRESS|DEFAULTS_PATH|DESKTOP_SESSION|DIRSTACK|DISPLAY|EUID|GDMSESSION|GDM_LANG|GNOME_KEYRING_CONTROL|GNOME_KEYRING_PID|GPG_AGENT_INFO|GROUPS|HISTCONTROL|HISTFILE|HISTFILESIZE|HISTSIZE|HOME|HOSTNAME|HOSTTYPE|IFS|INSTANCE|JOB|LANG|LANGUAGE|LC_ADDRESS|LC_ALL|LC_IDENTIFICATION|LC_MEASUREMENT|LC_MONETARY|LC_NAME|LC_NUMERIC|LC_PAPER|LC_TELEPHONE|LC_TIME|LESSCLOSE|LESSOPEN|LINES|LOGNAME|LS_COLORS|MACHTYPE|MAILCHECK|MANDATORY_PATH|NO_AT_BRIDGE|OLDPWD|OPTERR|OPTIND|ORBIT_SOCKETDIR|OSTYPE|PAPERSIZE|PATH|PIPESTATUS|PPID|PS1|PS2|PS3|PS4|PWD|RANDOM|REPLY|SECONDS|SELINUX_INIT|SESSION|SESSIONTYPE|SESSION_MANAGER|SHELL|SHELLOPTS|SHLVL|SSH_AUTH_SOCK|TERM|UID|UPSTART_EVENTS|UPSTART_INSTANCE|UPSTART_JOB|UPSTART_SESSION|USER|WINDOWID|XAUTHORITY|XDG_CONFIG_DIRS|XDG_CURRENT_DESKTOP|XDG_DATA_DIRS|XDG_GREETER_DATA_DIR|XDG_MENU_PREFIX|XDG_RUNTIME_DIR|XDG_SEAT|XDG_SEAT_PATH|XDG_SESSION_DESKTOP|XDG_SESSION_ID|XDG_SESSION_PATH|XDG_SESSION_TYPE|XDG_VTNR|XMODIFIERS)\\b';
  var commandAfterHeredoc = {
    pattern: /(^(["']?)\w+\2)[ \t]+\S.*/,
    lookbehind: true,
    alias: 'punctuation',
    // this looks reasonably well in all themes
    inside: null // see below
  };

  var insideString = {
    'bash': commandAfterHeredoc,
    'environment': {
      pattern: RegExp('\\$' + envVars),
      alias: 'constant'
    },
    'variable': [
    // [0]: Arithmetic Environment
    {
      pattern: /\$?\(\([\s\S]+?\)\)/,
      greedy: true,
      inside: {
        // If there is a $ sign at the beginning highlight $(( and )) as variable
        'variable': [{
          pattern: /(^\$\(\([\s\S]+)\)\)/,
          lookbehind: true
        }, /^\$\(\(/],
        'number': /\b0x[\dA-Fa-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:[Ee]-?\d+)?/,
        // Operators according to https://www.gnu.org/software/bash/manual/bashref.html#Shell-Arithmetic
        'operator': /--|\+\+|\*\*=?|<<=?|>>=?|&&|\|\||[=!+\-*/%<>^&|]=?|[?~:]/,
        // If there is no $ sign at the beginning highlight (( and )) as punctuation
        'punctuation': /\(\(?|\)\)?|,|;/
      }
    },
    // [1]: Command Substitution
    {
      pattern: /\$\((?:\([^)]+\)|[^()])+\)|`[^`]+`/,
      greedy: true,
      inside: {
        'variable': /^\$\(|^`|\)$|`$/
      }
    },
    // [2]: Brace expansion
    {
      pattern: /\$\{[^}]+\}/,
      greedy: true,
      inside: {
        'operator': /:[-=?+]?|[!\/]|##?|%%?|\^\^?|,,?/,
        'punctuation': /[\[\]]/,
        'environment': {
          pattern: RegExp('(\\{)' + envVars),
          lookbehind: true,
          alias: 'constant'
        }
      }
    }, /\$(?:\w+|[#?*!@$])/],
    // Escape sequences from echo and printf's manuals, and escaped quotes.
    'entity': /\\(?:[abceEfnrtv\\"]|O?[0-7]{1,3}|U[0-9a-fA-F]{8}|u[0-9a-fA-F]{4}|x[0-9a-fA-F]{1,2})/
  };
  Prism.languages.bash = {
    'shebang': {
      pattern: /^#!\s*\/.*/,
      alias: 'important'
    },
    'comment': {
      pattern: /(^|[^"{\\$])#.*/,
      lookbehind: true
    },
    'function-name': [
    // a) function foo {
    // b) foo() {
    // c) function foo() {
    // but not “foo {”
    {
      // a) and c)
      pattern: /(\bfunction\s+)[\w-]+(?=(?:\s*\(?:\s*\))?\s*\{)/,
      lookbehind: true,
      alias: 'function'
    }, {
      // b)
      pattern: /\b[\w-]+(?=\s*\(\s*\)\s*\{)/,
      alias: 'function'
    }],
    // Highlight variable names as variables in for and select beginnings.
    'for-or-select': {
      pattern: /(\b(?:for|select)\s+)\w+(?=\s+in\s)/,
      alias: 'variable',
      lookbehind: true
    },
    // Highlight variable names as variables in the left-hand part
    // of assignments (“=” and “+=”).
    'assign-left': {
      pattern: /(^|[\s;|&]|[<>]\()\w+(?:\.\w+)*(?=\+?=)/,
      inside: {
        'environment': {
          pattern: RegExp('(^|[\\s;|&]|[<>]\\()' + envVars),
          lookbehind: true,
          alias: 'constant'
        }
      },
      alias: 'variable',
      lookbehind: true
    },
    // Highlight parameter names as variables
    'parameter': {
      pattern: /(^|\s)-{1,2}(?:\w+:[+-]?)?\w+(?:\.\w+)*(?=[=\s]|$)/,
      alias: 'variable',
      lookbehind: true
    },
    'string': [
    // Support for Here-documents https://en.wikipedia.org/wiki/Here_document
    {
      pattern: /((?:^|[^<])<<-?\s*)(\w+)\s[\s\S]*?(?:\r?\n|\r)\2/,
      lookbehind: true,
      greedy: true,
      inside: insideString
    },
    // Here-document with quotes around the tag
    // → No expansion (so no “inside”).
    {
      pattern: /((?:^|[^<])<<-?\s*)(["'])(\w+)\2\s[\s\S]*?(?:\r?\n|\r)\3/,
      lookbehind: true,
      greedy: true,
      inside: {
        'bash': commandAfterHeredoc
      }
    },
    // “Normal” string
    {
      // https://www.gnu.org/software/bash/manual/html_node/Double-Quotes.html
      pattern: /(^|[^\\](?:\\\\)*)"(?:\\[\s\S]|\$\([^)]+\)|\$(?!\()|`[^`]+`|[^"\\`$])*"/,
      lookbehind: true,
      greedy: true,
      inside: insideString
    }, {
      // https://www.gnu.org/software/bash/manual/html_node/Single-Quotes.html
      pattern: /(^|[^$\\])'[^']*'/,
      lookbehind: true,
      greedy: true
    }, {
      // https://www.gnu.org/software/bash/manual/html_node/ANSI_002dC-Quoting.html
      pattern: /\$'(?:[^'\\]|\\[\s\S])*'/,
      greedy: true,
      inside: {
        'entity': insideString.entity
      }
    }],
    'environment': {
      pattern: RegExp('\\$?' + envVars),
      alias: 'constant'
    },
    'variable': insideString.variable,
    'function': {
      pattern: /(^|[\s;|&]|[<>]\()(?:add|apropos|apt|apt-cache|apt-get|aptitude|aspell|automysqlbackup|awk|basename|bash|bc|bconsole|bg|bzip2|cal|cargo|cat|cfdisk|chgrp|chkconfig|chmod|chown|chroot|cksum|clear|cmp|column|comm|composer|cp|cron|crontab|csplit|curl|cut|date|dc|dd|ddrescue|debootstrap|df|diff|diff3|dig|dir|dircolors|dirname|dirs|dmesg|docker|docker-compose|du|egrep|eject|env|ethtool|expand|expect|expr|fdformat|fdisk|fg|fgrep|file|find|fmt|fold|format|free|fsck|ftp|fuser|gawk|git|gparted|grep|groupadd|groupdel|groupmod|groups|grub-mkconfig|gzip|halt|head|hg|history|host|hostname|htop|iconv|id|ifconfig|ifdown|ifup|import|install|ip|java|jobs|join|kill|killall|less|link|ln|locate|logname|logrotate|look|lpc|lpr|lprint|lprintd|lprintq|lprm|ls|lsof|lynx|make|man|mc|mdadm|mkconfig|mkdir|mke2fs|mkfifo|mkfs|mkisofs|mknod|mkswap|mmv|more|most|mount|mtools|mtr|mutt|mv|nano|nc|netstat|nice|nl|node|nohup|notify-send|npm|nslookup|op|open|parted|passwd|paste|pathchk|ping|pkill|pnpm|podman|podman-compose|popd|pr|printcap|printenv|ps|pushd|pv|quota|quotacheck|quotactl|ram|rar|rcp|reboot|remsync|rename|renice|rev|rm|rmdir|rpm|rsync|scp|screen|sdiff|sed|sendmail|seq|service|sftp|sh|shellcheck|shuf|shutdown|sleep|slocate|sort|split|ssh|stat|strace|su|sudo|sum|suspend|swapon|sync|sysctl|tac|tail|tar|tee|time|timeout|top|touch|tr|traceroute|tsort|tty|umount|uname|unexpand|uniq|units|unrar|unshar|unzip|update-grub|uptime|useradd|userdel|usermod|users|uudecode|uuencode|v|vcpkg|vdir|vi|vim|virsh|vmstat|wait|watch|wc|wget|whereis|which|who|whoami|write|xargs|xdg-open|yarn|yes|zenity|zip|zsh|zypper)(?=$|[)\s;|&])/,
      lookbehind: true
    },
    'keyword': {
      pattern: /(^|[\s;|&]|[<>]\()(?:case|do|done|elif|else|esac|fi|for|function|if|in|select|then|until|while)(?=$|[)\s;|&])/,
      lookbehind: true
    },
    // https://www.gnu.org/software/bash/manual/html_node/Shell-Builtin-Commands.html
    'builtin': {
      pattern: /(^|[\s;|&]|[<>]\()(?:\.|:|alias|bind|break|builtin|caller|cd|command|continue|declare|echo|enable|eval|exec|exit|export|getopts|hash|help|let|local|logout|mapfile|printf|pwd|read|readarray|readonly|return|set|shift|shopt|source|test|times|trap|type|typeset|ulimit|umask|unalias|unset)(?=$|[)\s;|&])/,
      lookbehind: true,
      // Alias added to make those easier to distinguish from strings.
      alias: 'class-name'
    },
    'boolean': {
      pattern: /(^|[\s;|&]|[<>]\()(?:false|true)(?=$|[)\s;|&])/,
      lookbehind: true
    },
    'file-descriptor': {
      pattern: /\B&\d\b/,
      alias: 'important'
    },
    'operator': {
      // Lots of redirections here, but not just that.
      pattern: /\d?<>|>\||\+=|=[=~]?|!=?|<<[<-]?|[&\d]?>>|\d[<>]&?|[<>][&=]?|&[>&]?|\|[&|]?/,
      inside: {
        'file-descriptor': {
          pattern: /^\d/,
          alias: 'important'
        }
      }
    },
    'punctuation': /\$?\(\(?|\)\)?|\.\.|[{}[\];\\]/,
    'number': {
      pattern: /(^|\s)(?:[1-9]\d*|0)(?:[.,]\d+)?\b/,
      lookbehind: true
    }
  };
  commandAfterHeredoc.inside = Prism.languages.bash;

  /* Patterns in command substitution. */
  var toBeCopied = ['comment', 'function-name', 'for-or-select', 'assign-left', 'parameter', 'string', 'environment', 'function', 'keyword', 'builtin', 'boolean', 'file-descriptor', 'operator', 'punctuation', 'number'];
  var inside = insideString.variable[1].inside;
  for (var i = 0; i < toBeCopied.length; i++) {
    inside[toBeCopied[i]] = Prism.languages.bash[toBeCopied[i]];
  }
  Prism.languages.sh = Prism.languages.bash;
  Prism.languages.shell = Prism.languages.bash;
})(Prism);
(function (Prism) {
  /**
   * Replaces all placeholders "<<n>>" of given pattern with the n-th replacement (zero based).
   *
   * Note: This is a simple text based replacement. Be careful when using backreferences!
   *
   * @param {string} pattern the given pattern.
   * @param {string[]} replacements a list of replacement which can be inserted into the given pattern.
   * @returns {string} the pattern with all placeholders replaced with their corresponding replacements.
   * @example replace(/a<<0>>a/.source, [/b+/.source]) === /a(?:b+)a/.source
   */
  function replace(pattern, replacements) {
    return pattern.replace(/<<(\d+)>>/g, function (m, index) {
      return '(?:' + replacements[+index] + ')';
    });
  }
  /**
   * @param {string} pattern
   * @param {string[]} replacements
   * @param {string} [flags]
   * @returns {RegExp}
   */
  function re(pattern, replacements, flags) {
    return RegExp(replace(pattern, replacements), flags || '');
  }

  /**
   * Creates a nested pattern where all occurrences of the string `<<self>>` are replaced with the pattern itself.
   *
   * @param {string} pattern
   * @param {number} depthLog2
   * @returns {string}
   */
  function nested(pattern, depthLog2) {
    for (var i = 0; i < depthLog2; i++) {
      pattern = pattern.replace(/<<self>>/g, function () {
        return '(?:' + pattern + ')';
      });
    }
    return pattern.replace(/<<self>>/g, '[^\\s\\S]');
  }

  // https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/
  var keywordKinds = {
    // keywords which represent a return or variable type
    type: 'bool byte char decimal double dynamic float int long object sbyte short string uint ulong ushort var void',
    // keywords which are used to declare a type
    typeDeclaration: 'class enum interface record struct',
    // contextual keywords
    // ("var" and "dynamic" are missing because they are used like types)
    contextual: 'add alias and ascending async await by descending from(?=\\s*(?:\\w|$)) get global group into init(?=\\s*;) join let nameof not notnull on or orderby partial remove select set unmanaged value when where with(?=\\s*{)',
    // all other keywords
    other: 'abstract as base break case catch checked const continue default delegate do else event explicit extern finally fixed for foreach goto if implicit in internal is lock namespace new null operator out override params private protected public readonly ref return sealed sizeof stackalloc static switch this throw try typeof unchecked unsafe using virtual volatile while yield'
  };

  // keywords
  function keywordsToPattern(words) {
    return '\\b(?:' + words.trim().replace(/ /g, '|') + ')\\b';
  }
  var typeDeclarationKeywords = keywordsToPattern(keywordKinds.typeDeclaration);
  var keywords = RegExp(keywordsToPattern(keywordKinds.type + ' ' + keywordKinds.typeDeclaration + ' ' + keywordKinds.contextual + ' ' + keywordKinds.other));
  var nonTypeKeywords = keywordsToPattern(keywordKinds.typeDeclaration + ' ' + keywordKinds.contextual + ' ' + keywordKinds.other);
  var nonContextualKeywords = keywordsToPattern(keywordKinds.type + ' ' + keywordKinds.typeDeclaration + ' ' + keywordKinds.other);

  // types
  var generic = nested(/<(?:[^<>;=+\-*/%&|^]|<<self>>)*>/.source, 2); // the idea behind the other forbidden characters is to prevent false positives. Same for tupleElement.
  var nestedRound = nested(/\((?:[^()]|<<self>>)*\)/.source, 2);
  var name = /@?\b[A-Za-z_]\w*\b/.source;
  var genericName = replace(/<<0>>(?:\s*<<1>>)?/.source, [name, generic]);
  var identifier = replace(/(?!<<0>>)<<1>>(?:\s*\.\s*<<1>>)*/.source, [nonTypeKeywords, genericName]);
  var array = /\[\s*(?:,\s*)*\]/.source;
  var typeExpressionWithoutTuple = replace(/<<0>>(?:\s*(?:\?\s*)?<<1>>)*(?:\s*\?)?/.source, [identifier, array]);
  var tupleElement = replace(/[^,()<>[\];=+\-*/%&|^]|<<0>>|<<1>>|<<2>>/.source, [generic, nestedRound, array]);
  var tuple = replace(/\(<<0>>+(?:,<<0>>+)+\)/.source, [tupleElement]);
  var typeExpression = replace(/(?:<<0>>|<<1>>)(?:\s*(?:\?\s*)?<<2>>)*(?:\s*\?)?/.source, [tuple, identifier, array]);
  var typeInside = {
    'keyword': keywords,
    'punctuation': /[<>()?,.:[\]]/
  };

  // strings & characters
  // https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#character-literals
  // https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#string-literals
  var character = /'(?:[^\r\n'\\]|\\.|\\[Uux][\da-fA-F]{1,8})'/.source; // simplified pattern
  var regularString = /"(?:\\.|[^\\"\r\n])*"/.source;
  var verbatimString = /@"(?:""|\\[\s\S]|[^\\"])*"(?!")/.source;
  Prism.languages.csharp = Prism.languages.extend('clike', {
    'string': [{
      pattern: re(/(^|[^$\\])<<0>>/.source, [verbatimString]),
      lookbehind: true,
      greedy: true
    }, {
      pattern: re(/(^|[^@$\\])<<0>>/.source, [regularString]),
      lookbehind: true,
      greedy: true
    }],
    'class-name': [{
      // Using static
      // using static System.Math;
      pattern: re(/(\busing\s+static\s+)<<0>>(?=\s*;)/.source, [identifier]),
      lookbehind: true,
      inside: typeInside
    }, {
      // Using alias (type)
      // using Project = PC.MyCompany.Project;
      pattern: re(/(\busing\s+<<0>>\s*=\s*)<<1>>(?=\s*;)/.source, [name, typeExpression]),
      lookbehind: true,
      inside: typeInside
    }, {
      // Using alias (alias)
      // using Project = PC.MyCompany.Project;
      pattern: re(/(\busing\s+)<<0>>(?=\s*=)/.source, [name]),
      lookbehind: true
    }, {
      // Type declarations
      // class Foo<A, B>
      // interface Foo<out A, B>
      pattern: re(/(\b<<0>>\s+)<<1>>/.source, [typeDeclarationKeywords, genericName]),
      lookbehind: true,
      inside: typeInside
    }, {
      // Single catch exception declaration
      // catch(Foo)
      // (things like catch(Foo e) is covered by variable declaration)
      pattern: re(/(\bcatch\s*\(\s*)<<0>>/.source, [identifier]),
      lookbehind: true,
      inside: typeInside
    }, {
      // Name of the type parameter of generic constraints
      // where Foo : class
      pattern: re(/(\bwhere\s+)<<0>>/.source, [name]),
      lookbehind: true
    }, {
      // Casts and checks via as and is.
      // as Foo<A>, is Bar<B>
      // (things like if(a is Foo b) is covered by variable declaration)
      pattern: re(/(\b(?:is(?:\s+not)?|as)\s+)<<0>>/.source, [typeExpressionWithoutTuple]),
      lookbehind: true,
      inside: typeInside
    }, {
      // Variable, field and parameter declaration
      // (Foo bar, Bar baz, Foo[,,] bay, Foo<Bar, FooBar<Bar>> bax)
      pattern: re(/\b<<0>>(?=\s+(?!<<1>>|with\s*\{)<<2>>(?:\s*[=,;:{)\]]|\s+(?:in|when)\b))/.source, [typeExpression, nonContextualKeywords, name]),
      inside: typeInside
    }],
    'keyword': keywords,
    // https://docs.microsoft.com/en-us/dotnet/csharp/language-reference/language-specification/lexical-structure#literals
    'number': /(?:\b0(?:x[\da-f_]*[\da-f]|b[01_]*[01])|(?:\B\.\d+(?:_+\d+)*|\b\d+(?:_+\d+)*(?:\.\d+(?:_+\d+)*)?)(?:e[-+]?\d+(?:_+\d+)*)?)(?:[dflmu]|lu|ul)?\b/i,
    'operator': />>=?|<<=?|[-=]>|([-+&|])\1|~|\?\?=?|[-+*/%&|^!=<>]=?/,
    'punctuation': /\?\.?|::|[{}[\];(),.:]/
  });
  Prism.languages.insertBefore('csharp', 'number', {
    'range': {
      pattern: /\.\./,
      alias: 'operator'
    }
  });
  Prism.languages.insertBefore('csharp', 'punctuation', {
    'named-parameter': {
      pattern: re(/([(,]\s*)<<0>>(?=\s*:)/.source, [name]),
      lookbehind: true,
      alias: 'punctuation'
    }
  });
  Prism.languages.insertBefore('csharp', 'class-name', {
    'namespace': {
      // namespace Foo.Bar {}
      // using Foo.Bar;
      pattern: re(/(\b(?:namespace|using)\s+)<<0>>(?:\s*\.\s*<<0>>)*(?=\s*[;{])/.source, [name]),
      lookbehind: true,
      inside: {
        'punctuation': /\./
      }
    },
    'type-expression': {
      // default(Foo), typeof(Foo<Bar>), sizeof(int)
      pattern: re(/(\b(?:default|sizeof|typeof)\s*\(\s*(?!\s))(?:[^()\s]|\s(?!\s)|<<0>>)*(?=\s*\))/.source, [nestedRound]),
      lookbehind: true,
      alias: 'class-name',
      inside: typeInside
    },
    'return-type': {
      // Foo<Bar> ForBar(); Foo IFoo.Bar() => 0
      // int this[int index] => 0; T IReadOnlyList<T>.this[int index] => this[index];
      // int Foo => 0; int Foo { get; set } = 0;
      pattern: re(/<<0>>(?=\s+(?:<<1>>\s*(?:=>|[({]|\.\s*this\s*\[)|this\s*\[))/.source, [typeExpression, identifier]),
      inside: typeInside,
      alias: 'class-name'
    },
    'constructor-invocation': {
      // new List<Foo<Bar[]>> { }
      pattern: re(/(\bnew\s+)<<0>>(?=\s*[[({])/.source, [typeExpression]),
      lookbehind: true,
      inside: typeInside,
      alias: 'class-name'
    },
    /*'explicit-implementation': {
    	// int IFoo<Foo>.Bar => 0; void IFoo<Foo<Foo>>.Foo<T>();
    	pattern: replace(/\b<<0>>(?=\.<<1>>)/, className, methodOrPropertyDeclaration),
    	inside: classNameInside,
    	alias: 'class-name'
    },*/
    'generic-method': {
      // foo<Bar>()
      pattern: re(/<<0>>\s*<<1>>(?=\s*\()/.source, [name, generic]),
      inside: {
        'function': re(/^<<0>>/.source, [name]),
        'generic': {
          pattern: RegExp(generic),
          alias: 'class-name',
          inside: typeInside
        }
      }
    },
    'type-list': {
      // The list of types inherited or of generic constraints
      // class Foo<F> : Bar, IList<FooBar>
      // where F : Bar, IList<int>
      pattern: re(/\b((?:<<0>>\s+<<1>>|record\s+<<1>>\s*<<5>>|where\s+<<2>>)\s*:\s*)(?:<<3>>|<<4>>|<<1>>\s*<<5>>|<<6>>)(?:\s*,\s*(?:<<3>>|<<4>>|<<6>>))*(?=\s*(?:where|[{;]|=>|$))/.source, [typeDeclarationKeywords, genericName, name, typeExpression, keywords.source, nestedRound, /\bnew\s*\(\s*\)/.source]),
      lookbehind: true,
      inside: {
        'record-arguments': {
          pattern: re(/(^(?!new\s*\()<<0>>\s*)<<1>>/.source, [genericName, nestedRound]),
          lookbehind: true,
          greedy: true,
          inside: Prism.languages.csharp
        },
        'keyword': keywords,
        'class-name': {
          pattern: RegExp(typeExpression),
          greedy: true,
          inside: typeInside
        },
        'punctuation': /[,()]/
      }
    },
    'preprocessor': {
      pattern: /(^[\t ]*)#.*/m,
      lookbehind: true,
      alias: 'property',
      inside: {
        // highlight preprocessor directives as keywords
        'directive': {
          pattern: /(#)\b(?:define|elif|else|endif|endregion|error|if|line|nullable|pragma|region|undef|warning)\b/,
          lookbehind: true,
          alias: 'keyword'
        }
      }
    }
  });

  // attributes
  var regularStringOrCharacter = regularString + '|' + character;
  var regularStringCharacterOrComment = replace(/\/(?![*/])|\/\/[^\r\n]*[\r\n]|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>/.source, [regularStringOrCharacter]);
  var roundExpression = nested(replace(/[^"'/()]|<<0>>|\(<<self>>*\)/.source, [regularStringCharacterOrComment]), 2);

  // https://docs.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/attributes/#attribute-targets
  var attrTarget = /\b(?:assembly|event|field|method|module|param|property|return|type)\b/.source;
  var attr = replace(/<<0>>(?:\s*\(<<1>>*\))?/.source, [identifier, roundExpression]);
  Prism.languages.insertBefore('csharp', 'class-name', {
    'attribute': {
      // Attributes
      // [Foo], [Foo(1), Bar(2, Prop = "foo")], [return: Foo(1), Bar(2)], [assembly: Foo(Bar)]
      pattern: re(/((?:^|[^\s\w>)?])\s*\[\s*)(?:<<0>>\s*:\s*)?<<1>>(?:\s*,\s*<<1>>)*(?=\s*\])/.source, [attrTarget, attr]),
      lookbehind: true,
      greedy: true,
      inside: {
        'target': {
          pattern: re(/^<<0>>(?=\s*:)/.source, [attrTarget]),
          alias: 'keyword'
        },
        'attribute-arguments': {
          pattern: re(/\(<<0>>*\)/.source, [roundExpression]),
          inside: Prism.languages.csharp
        },
        'class-name': {
          pattern: RegExp(identifier),
          inside: {
            'punctuation': /\./
          }
        },
        'punctuation': /[:,]/
      }
    }
  });

  // string interpolation
  var formatString = /:[^}\r\n]+/.source;
  // multi line
  var mInterpolationRound = nested(replace(/[^"'/()]|<<0>>|\(<<self>>*\)/.source, [regularStringCharacterOrComment]), 2);
  var mInterpolation = replace(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source, [mInterpolationRound, formatString]);
  // single line
  var sInterpolationRound = nested(replace(/[^"'/()]|\/(?!\*)|\/\*(?:[^*]|\*(?!\/))*\*\/|<<0>>|\(<<self>>*\)/.source, [regularStringOrCharacter]), 2);
  var sInterpolation = replace(/\{(?!\{)(?:(?![}:])<<0>>)*<<1>>?\}/.source, [sInterpolationRound, formatString]);
  function createInterpolationInside(interpolation, interpolationRound) {
    return {
      'interpolation': {
        pattern: re(/((?:^|[^{])(?:\{\{)*)<<0>>/.source, [interpolation]),
        lookbehind: true,
        inside: {
          'format-string': {
            pattern: re(/(^\{(?:(?![}:])<<0>>)*)<<1>>(?=\}$)/.source, [interpolationRound, formatString]),
            lookbehind: true,
            inside: {
              'punctuation': /^:/
            }
          },
          'punctuation': /^\{|\}$/,
          'expression': {
            pattern: /[\s\S]+/,
            alias: 'language-csharp',
            inside: Prism.languages.csharp
          }
        }
      },
      'string': /[\s\S]+/
    };
  }
  Prism.languages.insertBefore('csharp', 'string', {
    'interpolation-string': [{
      pattern: re(/(^|[^\\])(?:\$@|@\$)"(?:""|\\[\s\S]|\{\{|<<0>>|[^\\{"])*"/.source, [mInterpolation]),
      lookbehind: true,
      greedy: true,
      inside: createInterpolationInside(mInterpolation, mInterpolationRound)
    }, {
      pattern: re(/(^|[^@\\])\$"(?:\\.|\{\{|<<0>>|[^\\"{])*"/.source, [sInterpolation]),
      lookbehind: true,
      greedy: true,
      inside: createInterpolationInside(sInterpolation, sInterpolationRound)
    }],
    'char': {
      pattern: RegExp(character),
      greedy: true
    }
  });
  Prism.languages.dotnet = Prism.languages.cs = Prism.languages.csharp;
})(Prism);
Prism.languages.markup = {
  'comment': {
    pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
    greedy: true
  },
  'prolog': {
    pattern: /<\?[\s\S]+?\?>/,
    greedy: true
  },
  'doctype': {
    // https://www.w3.org/TR/xml/#NT-doctypedecl
    pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
    greedy: true,
    inside: {
      'internal-subset': {
        pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
        lookbehind: true,
        greedy: true,
        inside: null // see below
      },

      'string': {
        pattern: /"[^"]*"|'[^']*'/,
        greedy: true
      },
      'punctuation': /^<!|>$|[[\]]/,
      'doctype-tag': /^DOCTYPE/i,
      'name': /[^\s<>'"]+/
    }
  },
  'cdata': {
    pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
    greedy: true
  },
  'tag': {
    pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    greedy: true,
    inside: {
      'tag': {
        pattern: /^<\/?[^\s>\/]+/,
        inside: {
          'punctuation': /^<\/?/,
          'namespace': /^[^\s>\/:]+:/
        }
      },
      'special-attr': [],
      'attr-value': {
        pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
        inside: {
          'punctuation': [{
            pattern: /^=/,
            alias: 'attr-equals'
          }, {
            pattern: /^(\s*)["']|["']$/,
            lookbehind: true
          }]
        }
      },
      'punctuation': /\/?>/,
      'attr-name': {
        pattern: /[^\s>\/]+/,
        inside: {
          'namespace': /^[^\s>\/:]+:/
        }
      }
    }
  },
  'entity': [{
    pattern: /&[\da-z]{1,8};/i,
    alias: 'named-entity'
  }, /&#x?[\da-f]{1,8};/i]
};
Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] = Prism.languages.markup['entity'];
Prism.languages.markup['doctype'].inside['internal-subset'].inside = Prism.languages.markup;

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function (env) {
  if (env.type === 'entity') {
    env.attributes['title'] = env.content.replace(/&amp;/, '&');
  }
});
Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
  /**
   * Adds an inlined language to markup.
   *
   * An example of an inlined language is CSS with `<style>` tags.
   *
   * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
   * case insensitive.
   * @param {string} lang The language key.
   * @example
   * addInlined('style', 'css');
   */
  value: function addInlined(tagName, lang) {
    var includedCdataInside = {};
    includedCdataInside['language-' + lang] = {
      pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
      lookbehind: true,
      inside: Prism.languages[lang]
    };
    includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;
    var inside = {
      'included-cdata': {
        pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
        inside: includedCdataInside
      }
    };
    inside['language-' + lang] = {
      pattern: /[\s\S]+/,
      inside: Prism.languages[lang]
    };
    var def = {};
    def[tagName] = {
      pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function () {
        return tagName;
      }), 'i'),
      lookbehind: true,
      greedy: true,
      inside: inside
    };
    Prism.languages.insertBefore('markup', 'cdata', def);
  }
});
Object.defineProperty(Prism.languages.markup.tag, 'addAttribute', {
  /**
   * Adds an pattern to highlight languages embedded in HTML attributes.
   *
   * An example of an inlined language is CSS with `style` attributes.
   *
   * @param {string} attrName The name of the tag that contains the inlined language. This name will be treated as
   * case insensitive.
   * @param {string} lang The language key.
   * @example
   * addAttribute('style', 'css');
   */
  value: function (attrName, lang) {
    Prism.languages.markup.tag.inside['special-attr'].push({
      pattern: RegExp(/(^|["'\s])/.source + '(?:' + attrName + ')' + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source, 'i'),
      lookbehind: true,
      inside: {
        'attr-name': /^[^\s=]+/,
        'attr-value': {
          pattern: /=[\s\S]+/,
          inside: {
            'value': {
              pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
              lookbehind: true,
              alias: [lang, 'language-' + lang],
              inside: Prism.languages[lang]
            },
            'punctuation': [{
              pattern: /^=/,
              alias: 'attr-equals'
            }, /"|'/]
          }
        }
      }
    });
  }
});
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;
Prism.languages.xml = Prism.languages.extend('markup', {});
Prism.languages.ssml = Prism.languages.xml;
Prism.languages.atom = Prism.languages.xml;
Prism.languages.rss = Prism.languages.xml;
(function (Prism) {
  var string = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
  Prism.languages.css = {
    'comment': /\/\*[\s\S]*?\*\//,
    'atrule': {
      pattern: RegExp('@[\\w-](?:' + /[^;{\s"']|\s+(?!\s)/.source + '|' + string.source + ')*?' + /(?:;|(?=\s*\{))/.source),
      inside: {
        'rule': /^@[\w-]+/,
        'selector-function-argument': {
          pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
          lookbehind: true,
          alias: 'selector'
        },
        'keyword': {
          pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
          lookbehind: true
        }
        // See rest below
      }
    },

    'url': {
      // https://drafts.csswg.org/css-values-3/#urls
      pattern: RegExp('\\burl\\((?:' + string.source + '|' + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ')\\)', 'i'),
      greedy: true,
      inside: {
        'function': /^url/i,
        'punctuation': /^\(|\)$/,
        'string': {
          pattern: RegExp('^' + string.source + '$'),
          alias: 'url'
        }
      }
    },
    'selector': {
      pattern: RegExp('(^|[{}\\s])[^{}\\s](?:[^{};"\'\\s]|\\s+(?![\\s{])|' + string.source + ')*(?=\\s*\\{)'),
      lookbehind: true
    },
    'string': {
      pattern: string,
      greedy: true
    },
    'property': {
      pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
      lookbehind: true
    },
    'important': /!important\b/i,
    'function': {
      pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
      lookbehind: true
    },
    'punctuation': /[(){};:,]/
  };
  Prism.languages.css['atrule'].inside.rest = Prism.languages.css;
  var markup = Prism.languages.markup;
  if (markup) {
    markup.tag.addInlined('style', 'css');
    markup.tag.addAttribute('style', 'css');
  }
})(Prism);
(function (Prism) {
  Prism.languages.diff = {
    'coord': [
    // Match all kinds of coord lines (prefixed by "+++", "---" or "***").
    /^(?:\*{3}|-{3}|\+{3}).*$/m,
    // Match "@@ ... @@" coord lines in unified diff.
    /^@@.*@@$/m,
    // Match coord lines in normal diff (starts with a number).
    /^\d.*$/m]

    // deleted, inserted, unchanged, diff
  };

  /**
   * A map from the name of a block to its line prefix.
   *
   * @type {Object<string, string>}
   */
  var PREFIXES = {
    'deleted-sign': '-',
    'deleted-arrow': '<',
    'inserted-sign': '+',
    'inserted-arrow': '>',
    'unchanged': ' ',
    'diff': '!'
  };

  // add a token for each prefix
  Object.keys(PREFIXES).forEach(function (name) {
    var prefix = PREFIXES[name];
    var alias = [];
    if (!/^\w+$/.test(name)) {
      // "deleted-sign" -> "deleted"
      alias.push(/\w+/.exec(name)[0]);
    }
    if (name === 'diff') {
      alias.push('bold');
    }
    Prism.languages.diff[name] = {
      pattern: RegExp('^(?:[' + prefix + '].*(?:\r\n?|\n|(?![\\s\\S])))+', 'm'),
      alias: alias,
      inside: {
        'line': {
          pattern: /(.)(?=[\s\S]).*(?:\r\n?|\n)?/,
          lookbehind: true
        },
        'prefix': {
          pattern: /[\s\S]/,
          alias: /\w+/.exec(name)[0]
        }
      }
    };
  });

  // make prefixes available to Diff plugin
  Object.defineProperty(Prism.languages.diff, 'PREFIXES', {
    value: PREFIXES
  });
})(Prism);
Prism.languages.go = Prism.languages.extend('clike', {
  'string': {
    pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"|`[^`]*`/,
    lookbehind: true,
    greedy: true
  },
  'keyword': /\b(?:break|case|chan|const|continue|default|defer|else|fallthrough|for|func|go(?:to)?|if|import|interface|map|package|range|return|select|struct|switch|type|var)\b/,
  'boolean': /\b(?:_|false|iota|nil|true)\b/,
  'number': [
  // binary and octal integers
  /\b0(?:b[01_]+|o[0-7_]+)i?\b/i,
  // hexadecimal integers and floats
  /\b0x(?:[a-f\d_]+(?:\.[a-f\d_]*)?|\.[a-f\d_]+)(?:p[+-]?\d+(?:_\d+)*)?i?(?!\w)/i,
  // decimal integers and floats
  /(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?[\d_]+)?i?(?!\w)/i],
  'operator': /[*\/%^!=]=?|\+[=+]?|-[=-]?|\|[=|]?|&(?:=|&|\^=?)?|>(?:>=?|=)?|<(?:<=?|=|-)?|:=|\.\.\./,
  'builtin': /\b(?:append|bool|byte|cap|close|complex|complex(?:64|128)|copy|delete|error|float(?:32|64)|u?int(?:8|16|32|64)?|imag|len|make|new|panic|print(?:ln)?|real|recover|rune|string|uintptr)\b/
});
Prism.languages.insertBefore('go', 'string', {
  'char': {
    pattern: /'(?:\\.|[^'\\\r\n]){0,10}'/,
    greedy: true
  }
});
delete Prism.languages.go['class-name'];
Prism.languages.ini = {
  /**
   * The component mimics the behavior of the Win32 API parser.
   *
   * @see {@link https://github.com/PrismJS/prism/issues/2775#issuecomment-787477723}
   */

  'comment': {
    pattern: /(^[ \f\t\v]*)[#;][^\n\r]*/m,
    lookbehind: true
  },
  'section': {
    pattern: /(^[ \f\t\v]*)\[[^\n\r\]]*\]?/m,
    lookbehind: true,
    inside: {
      'section-name': {
        pattern: /(^\[[ \f\t\v]*)[^ \f\t\v\]]+(?:[ \f\t\v]+[^ \f\t\v\]]+)*/,
        lookbehind: true,
        alias: 'selector'
      },
      'punctuation': /\[|\]/
    }
  },
  'key': {
    pattern: /(^[ \f\t\v]*)[^ \f\n\r\t\v=]+(?:[ \f\t\v]+[^ \f\n\r\t\v=]+)*(?=[ \f\t\v]*=)/m,
    lookbehind: true,
    alias: 'attr-name'
  },
  'value': {
    pattern: /(=[ \f\t\v]*)[^ \f\n\r\t\v]+(?:[ \f\t\v]+[^ \f\n\r\t\v]+)*/,
    lookbehind: true,
    alias: 'attr-value',
    inside: {
      'inner-value': {
        pattern: /^("|').+(?=\1$)/,
        lookbehind: true
      }
    }
  },
  'punctuation': /=/
};
(function (Prism) {
  var keywords = /\b(?:abstract|assert|boolean|break|byte|case|catch|char|class|const|continue|default|do|double|else|enum|exports|extends|final|finally|float|for|goto|if|implements|import|instanceof|int|interface|long|module|native|new|non-sealed|null|open|opens|package|permits|private|protected|provides|public|record(?!\s*[(){}[\]<>=%~.:,;?+\-*/&|^])|requires|return|sealed|short|static|strictfp|super|switch|synchronized|this|throw|throws|to|transient|transitive|try|uses|var|void|volatile|while|with|yield)\b/;

  // full package (optional) + parent classes (optional)
  var classNamePrefix = /(?:[a-z]\w*\s*\.\s*)*(?:[A-Z]\w*\s*\.\s*)*/.source;

  // based on the java naming conventions
  var className = {
    pattern: RegExp(/(^|[^\w.])/.source + classNamePrefix + /[A-Z](?:[\d_A-Z]*[a-z]\w*)?\b/.source),
    lookbehind: true,
    inside: {
      'namespace': {
        pattern: /^[a-z]\w*(?:\s*\.\s*[a-z]\w*)*(?:\s*\.)?/,
        inside: {
          'punctuation': /\./
        }
      },
      'punctuation': /\./
    }
  };
  Prism.languages.java = Prism.languages.extend('clike', {
    'string': {
      pattern: /(^|[^\\])"(?:\\.|[^"\\\r\n])*"/,
      lookbehind: true,
      greedy: true
    },
    'class-name': [className, {
      // variables, parameters, and constructor references
      // this to support class names (or generic parameters) which do not contain a lower case letter (also works for methods)
      pattern: RegExp(/(^|[^\w.])/.source + classNamePrefix + /[A-Z]\w*(?=\s+\w+\s*[;,=()]|\s*(?:\[[\s,]*\]\s*)?::\s*new\b)/.source),
      lookbehind: true,
      inside: className.inside
    }, {
      // class names based on keyword
      // this to support class names (or generic parameters) which do not contain a lower case letter (also works for methods)
      pattern: RegExp(/(\b(?:class|enum|extends|implements|instanceof|interface|new|record|throws)\s+)/.source + classNamePrefix + /[A-Z]\w*\b/.source),
      lookbehind: true,
      inside: className.inside
    }],
    'keyword': keywords,
    'function': [Prism.languages.clike.function, {
      pattern: /(::\s*)[a-z_]\w*/,
      lookbehind: true
    }],
    'number': /\b0b[01][01_]*L?\b|\b0x(?:\.[\da-f_p+-]+|[\da-f_]+(?:\.[\da-f_p+-]+)?)\b|(?:\b\d[\d_]*(?:\.[\d_]*)?|\B\.\d[\d_]*)(?:e[+-]?\d[\d_]*)?[dfl]?/i,
    'operator': {
      pattern: /(^|[^.])(?:<<=?|>>>?=?|->|--|\+\+|&&|\|\||::|[?:~]|[-+*/%&|^!=<>]=?)/m,
      lookbehind: true
    },
    'constant': /\b[A-Z][A-Z_\d]+\b/
  });
  Prism.languages.insertBefore('java', 'string', {
    'triple-quoted-string': {
      // http://openjdk.java.net/jeps/355#Description
      pattern: /"""[ \t]*[\r\n](?:(?:"|"")?(?:\\.|[^"\\]))*"""/,
      greedy: true,
      alias: 'string'
    },
    'char': {
      pattern: /'(?:\\.|[^'\\\r\n]){1,6}'/,
      greedy: true
    }
  });
  Prism.languages.insertBefore('java', 'class-name', {
    'annotation': {
      pattern: /(^|[^.])@\w+(?:\s*\.\s*\w+)*/,
      lookbehind: true,
      alias: 'punctuation'
    },
    'generics': {
      pattern: /<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&)|<(?:[\w\s,.?]|&(?!&))*>)*>)*>)*>/,
      inside: {
        'class-name': className,
        'keyword': keywords,
        'punctuation': /[<>(),.:]/,
        'operator': /[?&|]/
      }
    },
    'import': [{
      pattern: RegExp(/(\bimport\s+)/.source + classNamePrefix + /(?:[A-Z]\w*|\*)(?=\s*;)/.source),
      lookbehind: true,
      inside: {
        'namespace': className.inside.namespace,
        'punctuation': /\./,
        'operator': /\*/,
        'class-name': /\w+/
      }
    }, {
      pattern: RegExp(/(\bimport\s+static\s+)/.source + classNamePrefix + /(?:\w+|\*)(?=\s*;)/.source),
      lookbehind: true,
      alias: 'static',
      inside: {
        'namespace': className.inside.namespace,
        'static': /\b\w+$/,
        'punctuation': /\./,
        'operator': /\*/,
        'class-name': /\w+/
      }
    }],
    'namespace': {
      pattern: RegExp(/(\b(?:exports|import(?:\s+static)?|module|open|opens|package|provides|requires|to|transitive|uses|with)\s+)(?!<keyword>)[a-z]\w*(?:\.[a-z]\w*)*\.?/.source.replace(/<keyword>/g, function () {
        return keywords.source;
      })),
      lookbehind: true,
      inside: {
        'punctuation': /\./
      }
    }
  });
})(Prism);
(function (Prism) {
  var specialEscape = {
    pattern: /\\[\\(){}[\]^$+*?|.]/,
    alias: 'escape'
  };
  var escape = /\\(?:x[\da-fA-F]{2}|u[\da-fA-F]{4}|u\{[\da-fA-F]+\}|0[0-7]{0,2}|[123][0-7]{2}|c[a-zA-Z]|.)/;
  var charSet = {
    pattern: /\.|\\[wsd]|\\p\{[^{}]+\}/i,
    alias: 'class-name'
  };
  var charSetWithoutDot = {
    pattern: /\\[wsd]|\\p\{[^{}]+\}/i,
    alias: 'class-name'
  };
  var rangeChar = '(?:[^\\\\-]|' + escape.source + ')';
  var range = RegExp(rangeChar + '-' + rangeChar);

  // the name of a capturing group
  var groupName = {
    pattern: /(<|')[^<>']+(?=[>']$)/,
    lookbehind: true,
    alias: 'variable'
  };
  Prism.languages.regex = {
    'char-class': {
      pattern: /((?:^|[^\\])(?:\\\\)*)\[(?:[^\\\]]|\\[\s\S])*\]/,
      lookbehind: true,
      inside: {
        'char-class-negation': {
          pattern: /(^\[)\^/,
          lookbehind: true,
          alias: 'operator'
        },
        'char-class-punctuation': {
          pattern: /^\[|\]$/,
          alias: 'punctuation'
        },
        'range': {
          pattern: range,
          inside: {
            'escape': escape,
            'range-punctuation': {
              pattern: /-/,
              alias: 'operator'
            }
          }
        },
        'special-escape': specialEscape,
        'char-set': charSetWithoutDot,
        'escape': escape
      }
    },
    'special-escape': specialEscape,
    'char-set': charSet,
    'backreference': [{
      // a backreference which is not an octal escape
      pattern: /\\(?![123][0-7]{2})[1-9]/,
      alias: 'keyword'
    }, {
      pattern: /\\k<[^<>']+>/,
      alias: 'keyword',
      inside: {
        'group-name': groupName
      }
    }],
    'anchor': {
      pattern: /[$^]|\\[ABbGZz]/,
      alias: 'function'
    },
    'escape': escape,
    'group': [{
      // https://docs.oracle.com/javase/10/docs/api/java/util/regex/Pattern.html
      // https://docs.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-language-quick-reference?view=netframework-4.7.2#grouping-constructs

      // (), (?<name>), (?'name'), (?>), (?:), (?=), (?!), (?<=), (?<!), (?is-m), (?i-m:)
      pattern: /\((?:\?(?:<[^<>']+>|'[^<>']+'|[>:]|<?[=!]|[idmnsuxU]+(?:-[idmnsuxU]+)?:?))?/,
      alias: 'punctuation',
      inside: {
        'group-name': groupName
      }
    }, {
      pattern: /\)/,
      alias: 'punctuation'
    }],
    'quantifier': {
      pattern: /(?:[+*?]|\{\d+(?:,\d*)?\})[?+]?/,
      alias: 'number'
    },
    'alternation': {
      pattern: /\|/,
      alias: 'keyword'
    }
  };
})(Prism);
Prism.languages.javascript = Prism.languages.extend('clike', {
  'class-name': [Prism.languages.clike['class-name'], {
    pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
    lookbehind: true
  }],
  'keyword': [{
    pattern: /((?:^|\})\s*)catch\b/,
    lookbehind: true
  }, {
    pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
    lookbehind: true
  }],
  // Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
  'function': /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  'number': {
    pattern: RegExp(/(^|[^\w$])/.source + '(?:' + (
    // constant
    /NaN|Infinity/.source + '|' +
    // binary integer
    /0[bB][01]+(?:_[01]+)*n?/.source + '|' +
    // octal integer
    /0[oO][0-7]+(?:_[0-7]+)*n?/.source + '|' +
    // hexadecimal integer
    /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + '|' +
    // decimal bigint
    /\d+(?:_\d+)*n/.source + '|' +
    // decimal number (integer or float) but no bigint
    /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ')' + /(?![\w$])/.source),
    lookbehind: true
  },
  'operator': /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
});
Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;
Prism.languages.insertBefore('javascript', 'keyword', {
  'regex': {
    pattern: RegExp(
    // lookbehind
    // eslint-disable-next-line regexp/no-dupe-characters-character-class
    /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source +
    // Regex pattern:
    // There are 2 regex patterns here. The RegExp set notation proposal added support for nested character
    // classes if the `v` flag is present. Unfortunately, nested CCs are both context-free and incompatible
    // with the only syntax, so we have to define 2 different regex patterns.
    /\//.source + '(?:' + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + '|' +
    // `v` flag syntax. This supports 3 levels of nested character classes.
    /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ')' +
    // lookahead
    /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),
    lookbehind: true,
    greedy: true,
    inside: {
      'regex-source': {
        pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
        lookbehind: true,
        alias: 'language-regex',
        inside: Prism.languages.regex
      },
      'regex-delimiter': /^\/|\/$/,
      'regex-flags': /^[a-z]+$/
    }
  },
  // This must be declared before keyword because we use "function" inside the look-forward
  'function-variable': {
    pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
    alias: 'function'
  },
  'parameter': [{
    pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
    lookbehind: true,
    inside: Prism.languages.javascript
  }, {
    pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
    lookbehind: true,
    inside: Prism.languages.javascript
  }, {
    pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
    lookbehind: true,
    inside: Prism.languages.javascript
  }, {
    pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
    lookbehind: true,
    inside: Prism.languages.javascript
  }],
  'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
});
Prism.languages.insertBefore('javascript', 'string', {
  'hashbang': {
    pattern: /^#!.*/,
    greedy: true,
    alias: 'comment'
  },
  'template-string': {
    pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
    greedy: true,
    inside: {
      'template-punctuation': {
        pattern: /^`|`$/,
        alias: 'string'
      },
      'interpolation': {
        pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
        lookbehind: true,
        inside: {
          'interpolation-punctuation': {
            pattern: /^\$\{|\}$/,
            alias: 'punctuation'
          },
          rest: Prism.languages.javascript
        }
      },
      'string': /[\s\S]+/
    }
  },
  'string-property': {
    pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
    lookbehind: true,
    greedy: true,
    alias: 'property'
  }
});
Prism.languages.insertBefore('javascript', 'operator', {
  'literal-property': {
    pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
    lookbehind: true,
    alias: 'property'
  }
});
if (Prism.languages.markup) {
  Prism.languages.markup.tag.addInlined('script', 'javascript');

  // add attribute support for all DOM events.
  // https://developer.mozilla.org/en-US/docs/Web/Events#Standard_events
  Prism.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source, 'javascript');
}
Prism.languages.js = Prism.languages.javascript;
(function (Prism) {
  var javascript = Prism.util.clone(Prism.languages.javascript);
  var space = /(?:\s|\/\/.*(?!.)|\/\*(?:[^*]|\*(?!\/))\*\/)/.source;
  var braces = /(?:\{(?:\{(?:\{[^{}]*\}|[^{}])*\}|[^{}])*\})/.source;
  var spread = /(?:\{<S>*\.{3}(?:[^{}]|<BRACES>)*\})/.source;

  /**
   * @param {string} source
   * @param {string} [flags]
   */
  function re(source, flags) {
    source = source.replace(/<S>/g, function () {
      return space;
    }).replace(/<BRACES>/g, function () {
      return braces;
    }).replace(/<SPREAD>/g, function () {
      return spread;
    });
    return RegExp(source, flags);
  }
  spread = re(spread).source;
  Prism.languages.jsx = Prism.languages.extend('markup', javascript);
  Prism.languages.jsx.tag.pattern = re(/<\/?(?:[\w.:-]+(?:<S>+(?:[\w.:$-]+(?:=(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s{'"/>=]+|<BRACES>))?|<SPREAD>))*<S>*\/?)?>/.source);
  Prism.languages.jsx.tag.inside['tag'].pattern = /^<\/?[^\s>\/]*/;
  Prism.languages.jsx.tag.inside['attr-value'].pattern = /=(?!\{)(?:"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*'|[^\s'">]+)/;
  Prism.languages.jsx.tag.inside['tag'].inside['class-name'] = /^[A-Z]\w*(?:\.[A-Z]\w*)*$/;
  Prism.languages.jsx.tag.inside['comment'] = javascript['comment'];
  Prism.languages.insertBefore('inside', 'attr-name', {
    'spread': {
      pattern: re(/<SPREAD>/.source),
      inside: Prism.languages.jsx
    }
  }, Prism.languages.jsx.tag);
  Prism.languages.insertBefore('inside', 'special-attr', {
    'script': {
      // Allow for two levels of nesting
      pattern: re(/=<BRACES>/.source),
      alias: 'language-javascript',
      inside: {
        'script-punctuation': {
          pattern: /^=(?=\{)/,
          alias: 'punctuation'
        },
        rest: Prism.languages.jsx
      }
    }
  }, Prism.languages.jsx.tag);

  // The following will handle plain text inside tags
  var stringifyToken = function (token) {
    if (!token) {
      return '';
    }
    if (typeof token === 'string') {
      return token;
    }
    if (typeof token.content === 'string') {
      return token.content;
    }
    return token.content.map(stringifyToken).join('');
  };
  var walkTokens = function (tokens) {
    var openedTags = [];
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      var notTagNorBrace = false;
      if (typeof token !== 'string') {
        if (token.type === 'tag' && token.content[0] && token.content[0].type === 'tag') {
          // We found a tag, now find its kind

          if (token.content[0].content[0].content === '</') {
            // Closing tag
            if (openedTags.length > 0 && openedTags[openedTags.length - 1].tagName === stringifyToken(token.content[0].content[1])) {
              // Pop matching opening tag
              openedTags.pop();
            }
          } else {
            if (token.content[token.content.length - 1].content === '/>') ; else {
              // Opening tag
              openedTags.push({
                tagName: stringifyToken(token.content[0].content[1]),
                openedBraces: 0
              });
            }
          }
        } else if (openedTags.length > 0 && token.type === 'punctuation' && token.content === '{') {
          // Here we might have entered a JSX context inside a tag
          openedTags[openedTags.length - 1].openedBraces++;
        } else if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces > 0 && token.type === 'punctuation' && token.content === '}') {
          // Here we might have left a JSX context inside a tag
          openedTags[openedTags.length - 1].openedBraces--;
        } else {
          notTagNorBrace = true;
        }
      }
      if (notTagNorBrace || typeof token === 'string') {
        if (openedTags.length > 0 && openedTags[openedTags.length - 1].openedBraces === 0) {
          // Here we are inside a tag, and not inside a JSX context.
          // That's plain text: drop any tokens matched.
          var plainText = stringifyToken(token);

          // And merge text with adjacent text
          if (i < tokens.length - 1 && (typeof tokens[i + 1] === 'string' || tokens[i + 1].type === 'plain-text')) {
            plainText += stringifyToken(tokens[i + 1]);
            tokens.splice(i + 1, 1);
          }
          if (i > 0 && (typeof tokens[i - 1] === 'string' || tokens[i - 1].type === 'plain-text')) {
            plainText = stringifyToken(tokens[i - 1]) + plainText;
            tokens.splice(i - 1, 1);
            i--;
          }
          tokens[i] = new Prism.Token('plain-text', plainText, null, plainText);
        }
      }
      if (token.content && typeof token.content !== 'string') {
        walkTokens(token.content);
      }
    }
  };
  Prism.hooks.add('after-tokenize', function (env) {
    if (env.language !== 'jsx' && env.language !== 'tsx') {
      return;
    }
    walkTokens(env.tokens);
  });
})(Prism);

// https://www.json.org/json-en.html
Prism.languages.json = {
  'property': {
    pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?=\s*:)/,
    lookbehind: true,
    greedy: true
  },
  'string': {
    pattern: /(^|[^\\])"(?:\\.|[^\\"\r\n])*"(?!\s*:)/,
    lookbehind: true,
    greedy: true
  },
  'comment': {
    pattern: /\/\/.*|\/\*[\s\S]*?(?:\*\/|$)/,
    greedy: true
  },
  'number': /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/i,
  'punctuation': /[{}[\],]/,
  'operator': /:/,
  'boolean': /\b(?:false|true)\b/,
  'null': {
    pattern: /\bnull\b/,
    alias: 'keyword'
  }
};
Prism.languages.webmanifest = Prism.languages.json;
(function (Prism) {
  Prism.languages.kotlin = Prism.languages.extend('clike', {
    'keyword': {
      // The lookbehind prevents wrong highlighting of e.g. kotlin.properties.get
      pattern: /(^|[^.])\b(?:abstract|actual|annotation|as|break|by|catch|class|companion|const|constructor|continue|crossinline|data|do|dynamic|else|enum|expect|external|final|finally|for|fun|get|if|import|in|infix|init|inline|inner|interface|internal|is|lateinit|noinline|null|object|open|operator|out|override|package|private|protected|public|reified|return|sealed|set|super|suspend|tailrec|this|throw|to|try|typealias|val|var|vararg|when|where|while)\b/,
      lookbehind: true
    },
    'function': [{
      pattern: /(?:`[^\r\n`]+`|\b\w+)(?=\s*\()/,
      greedy: true
    }, {
      pattern: /(\.)(?:`[^\r\n`]+`|\w+)(?=\s*\{)/,
      lookbehind: true,
      greedy: true
    }],
    'number': /\b(?:0[xX][\da-fA-F]+(?:_[\da-fA-F]+)*|0[bB][01]+(?:_[01]+)*|\d+(?:_\d+)*(?:\.\d+(?:_\d+)*)?(?:[eE][+-]?\d+(?:_\d+)*)?[fFL]?)\b/,
    'operator': /\+[+=]?|-[-=>]?|==?=?|!(?:!|==?)?|[\/*%<>]=?|[?:]:?|\.\.|&&|\|\||\b(?:and|inv|or|shl|shr|ushr|xor)\b/
  });
  delete Prism.languages.kotlin['class-name'];
  var interpolationInside = {
    'interpolation-punctuation': {
      pattern: /^\$\{?|\}$/,
      alias: 'punctuation'
    },
    'expression': {
      pattern: /[\s\S]+/,
      inside: Prism.languages.kotlin
    }
  };
  Prism.languages.insertBefore('kotlin', 'string', {
    // https://kotlinlang.org/spec/expressions.html#string-interpolation-expressions
    'string-literal': [{
      pattern: /"""(?:[^$]|\$(?:(?!\{)|\{[^{}]*\}))*?"""/,
      alias: 'multiline',
      inside: {
        'interpolation': {
          pattern: /\$(?:[a-z_]\w*|\{[^{}]*\})/i,
          inside: interpolationInside
        },
        'string': /[\s\S]+/
      }
    }, {
      pattern: /"(?:[^"\\\r\n$]|\\.|\$(?:(?!\{)|\{[^{}]*\}))*"/,
      alias: 'singleline',
      inside: {
        'interpolation': {
          pattern: /((?:^|[^\\])(?:\\{2})*)\$(?:[a-z_]\w*|\{[^{}]*\})/i,
          lookbehind: true,
          inside: interpolationInside
        },
        'string': /[\s\S]+/
      }
    }],
    'char': {
      // https://kotlinlang.org/spec/expressions.html#character-literals
      pattern: /'(?:[^'\\\r\n]|\\(?:.|u[a-fA-F0-9]{0,4}))'/,
      greedy: true
    }
  });
  delete Prism.languages.kotlin['string'];
  Prism.languages.insertBefore('kotlin', 'keyword', {
    'annotation': {
      pattern: /\B@(?:\w+:)?(?:[A-Z]\w*|\[[^\]]+\])/,
      alias: 'builtin'
    }
  });
  Prism.languages.insertBefore('kotlin', 'function', {
    'label': {
      pattern: /\b\w+@|@\w+\b/,
      alias: 'symbol'
    }
  });
  Prism.languages.kt = Prism.languages.kotlin;
  Prism.languages.kts = Prism.languages.kotlin;
})(Prism);

/* FIXME :
 :extend() is not handled specifically : its highlighting is buggy.
 Mixin usage must be inside a ruleset to be highlighted.
 At-rules (e.g. import) containing interpolations are buggy.
 Detached rulesets are highlighted as at-rules.
 A comment before a mixin usage prevents the latter to be properly highlighted.
 */

Prism.languages.less = Prism.languages.extend('css', {
  'comment': [/\/\*[\s\S]*?\*\//, {
    pattern: /(^|[^\\])\/\/.*/,
    lookbehind: true
  }],
  'atrule': {
    pattern: /@[\w-](?:\((?:[^(){}]|\([^(){}]*\))*\)|[^(){};\s]|\s+(?!\s))*?(?=\s*\{)/,
    inside: {
      'punctuation': /[:()]/
    }
  },
  // selectors and mixins are considered the same
  'selector': {
    pattern: /(?:@\{[\w-]+\}|[^{};\s@])(?:@\{[\w-]+\}|\((?:[^(){}]|\([^(){}]*\))*\)|[^(){};@\s]|\s+(?!\s))*?(?=\s*\{)/,
    inside: {
      // mixin parameters
      'variable': /@+[\w-]+/
    }
  },
  'property': /(?:@\{[\w-]+\}|[\w-])+(?:\+_?)?(?=\s*:)/,
  'operator': /[+\-*\/]/
});
Prism.languages.insertBefore('less', 'property', {
  'variable': [
  // Variable declaration (the colon must be consumed!)
  {
    pattern: /@[\w-]+\s*:/,
    inside: {
      'punctuation': /:/
    }
  },
  // Variable usage
  /@@?[\w-]+/],
  'mixin-usage': {
    pattern: /([{;]\s*)[.#](?!\d)[\w-].*?(?=[(;])/,
    lookbehind: true,
    alias: 'function'
  }
});
Prism.languages.lua = {
  'comment': /^#!.+|--(?:\[(=*)\[[\s\S]*?\]\1\]|.*)/m,
  // \z may be used to skip the following space
  'string': {
    pattern: /(["'])(?:(?!\1)[^\\\r\n]|\\z(?:\r\n|\s)|\\(?:\r\n|[^z]))*\1|\[(=*)\[[\s\S]*?\]\2\]/,
    greedy: true
  },
  'number': /\b0x[a-f\d]+(?:\.[a-f\d]*)?(?:p[+-]?\d+)?\b|\b\d+(?:\.\B|(?:\.\d*)?(?:e[+-]?\d+)?\b)|\B\.\d+(?:e[+-]?\d+)?\b/i,
  'keyword': /\b(?:and|break|do|else|elseif|end|false|for|function|goto|if|in|local|nil|not|or|repeat|return|then|true|until|while)\b/,
  'function': /(?!\d)\w+(?=\s*(?:[({]))/,
  'operator': [/[-+*%^&|#]|\/\/?|<[<=]?|>[>=]?|[=~]=?/, {
    // Match ".." but don't break "..."
    pattern: /(^|[^.])\.\.(?!\.)/,
    lookbehind: true
  }],
  'punctuation': /[\[\](){},;]|\.+|:+/
};
Prism.languages.makefile = {
  'comment': {
    pattern: /(^|[^\\])#(?:\\(?:\r\n|[\s\S])|[^\\\r\n])*/,
    lookbehind: true
  },
  'string': {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: true
  },
  'builtin-target': {
    pattern: /\.[A-Z][^:#=\s]+(?=\s*:(?!=))/,
    alias: 'builtin'
  },
  'target': {
    pattern: /^(?:[^:=\s]|[ \t]+(?![\s:]))+(?=\s*:(?!=))/m,
    alias: 'symbol',
    inside: {
      'variable': /\$+(?:(?!\$)[^(){}:#=\s]+|(?=[({]))/
    }
  },
  'variable': /\$+(?:(?!\$)[^(){}:#=\s]+|\([@*%<^+?][DF]\)|(?=[({]))/,
  // Directives
  'keyword': /-include\b|\b(?:define|else|endef|endif|export|ifn?def|ifn?eq|include|override|private|sinclude|undefine|unexport|vpath)\b/,
  'function': {
    pattern: /(\()(?:abspath|addsuffix|and|basename|call|dir|error|eval|file|filter(?:-out)?|findstring|firstword|flavor|foreach|guile|if|info|join|lastword|load|notdir|or|origin|patsubst|realpath|shell|sort|strip|subst|suffix|value|warning|wildcard|word(?:list|s)?)(?=[ \t])/,
    lookbehind: true
  },
  'operator': /(?:::|[?:+!])?=|[|@]/,
  'punctuation': /[:;(){}]/
};
(function (Prism) {
  // https://yaml.org/spec/1.2/spec.html#c-ns-anchor-property
  // https://yaml.org/spec/1.2/spec.html#c-ns-alias-node
  var anchorOrAlias = /[*&][^\s[\]{},]+/;
  // https://yaml.org/spec/1.2/spec.html#c-ns-tag-property
  var tag = /!(?:<[\w\-%#;/?:@&=+$,.!~*'()[\]]+>|(?:[a-zA-Z\d-]*!)?[\w\-%#;/?:@&=+$.~*'()]+)?/;
  // https://yaml.org/spec/1.2/spec.html#c-ns-properties(n,c)
  var properties = '(?:' + tag.source + '(?:[ \t]+' + anchorOrAlias.source + ')?|' + anchorOrAlias.source + '(?:[ \t]+' + tag.source + ')?)';
  // https://yaml.org/spec/1.2/spec.html#ns-plain(n,c)
  // This is a simplified version that doesn't support "#" and multiline keys
  // All these long scarry character classes are simplified versions of YAML's characters
  var plainKey = /(?:[^\s\x00-\x08\x0e-\x1f!"#%&'*,\-:>?@[\]`{|}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]|[?:-]<PLAIN>)(?:[ \t]*(?:(?![#:])<PLAIN>|:<PLAIN>))*/.source.replace(/<PLAIN>/g, function () {
    return /[^\s\x00-\x08\x0e-\x1f,[\]{}\x7f-\x84\x86-\x9f\ud800-\udfff\ufffe\uffff]/.source;
  });
  var string = /"(?:[^"\\\r\n]|\\.)*"|'(?:[^'\\\r\n]|\\.)*'/.source;

  /**
   *
   * @param {string} value
   * @param {string} [flags]
   * @returns {RegExp}
   */
  function createValuePattern(value, flags) {
    flags = (flags || '').replace(/m/g, '') + 'm'; // add m flag
    var pattern = /([:\-,[{]\s*(?:\s<<prop>>[ \t]+)?)(?:<<value>>)(?=[ \t]*(?:$|,|\]|\}|(?:[\r\n]\s*)?#))/.source.replace(/<<prop>>/g, function () {
      return properties;
    }).replace(/<<value>>/g, function () {
      return value;
    });
    return RegExp(pattern, flags);
  }
  Prism.languages.yaml = {
    'scalar': {
      pattern: RegExp(/([\-:]\s*(?:\s<<prop>>[ \t]+)?[|>])[ \t]*(?:((?:\r?\n|\r)[ \t]+)\S[^\r\n]*(?:\2[^\r\n]+)*)/.source.replace(/<<prop>>/g, function () {
        return properties;
      })),
      lookbehind: true,
      alias: 'string'
    },
    'comment': /#.*/,
    'key': {
      pattern: RegExp(/((?:^|[:\-,[{\r\n?])[ \t]*(?:<<prop>>[ \t]+)?)<<key>>(?=\s*:\s)/.source.replace(/<<prop>>/g, function () {
        return properties;
      }).replace(/<<key>>/g, function () {
        return '(?:' + plainKey + '|' + string + ')';
      })),
      lookbehind: true,
      greedy: true,
      alias: 'atrule'
    },
    'directive': {
      pattern: /(^[ \t]*)%.+/m,
      lookbehind: true,
      alias: 'important'
    },
    'datetime': {
      pattern: createValuePattern(/\d{4}-\d\d?-\d\d?(?:[tT]|[ \t]+)\d\d?:\d{2}:\d{2}(?:\.\d*)?(?:[ \t]*(?:Z|[-+]\d\d?(?::\d{2})?))?|\d{4}-\d{2}-\d{2}|\d\d?:\d{2}(?::\d{2}(?:\.\d*)?)?/.source),
      lookbehind: true,
      alias: 'number'
    },
    'boolean': {
      pattern: createValuePattern(/false|true/.source, 'i'),
      lookbehind: true,
      alias: 'important'
    },
    'null': {
      pattern: createValuePattern(/null|~/.source, 'i'),
      lookbehind: true,
      alias: 'important'
    },
    'string': {
      pattern: createValuePattern(string),
      lookbehind: true,
      greedy: true
    },
    'number': {
      pattern: createValuePattern(/[+-]?(?:0x[\da-f]+|0o[0-7]+|(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|\.inf|\.nan)/.source, 'i'),
      lookbehind: true
    },
    'tag': tag,
    'important': anchorOrAlias,
    'punctuation': /---|[:[\]{}\-,|>?]|\.\.\./
  };
  Prism.languages.yml = Prism.languages.yaml;
})(Prism);
(function (Prism) {
  // Allow only one line break
  var inner = /(?:\\.|[^\\\n\r]|(?:\n|\r\n?)(?![\r\n]))/.source;

  /**
   * This function is intended for the creation of the bold or italic pattern.
   *
   * This also adds a lookbehind group to the given pattern to ensure that the pattern is not backslash-escaped.
   *
   * _Note:_ Keep in mind that this adds a capturing group.
   *
   * @param {string} pattern
   * @returns {RegExp}
   */
  function createInline(pattern) {
    pattern = pattern.replace(/<inner>/g, function () {
      return inner;
    });
    return RegExp(/((?:^|[^\\])(?:\\{2})*)/.source + '(?:' + pattern + ')');
  }
  var tableCell = /(?:\\.|``(?:[^`\r\n]|`(?!`))+``|`[^`\r\n]+`|[^\\|\r\n`])+/.source;
  var tableRow = /\|?__(?:\|__)+\|?(?:(?:\n|\r\n?)|(?![\s\S]))/.source.replace(/__/g, function () {
    return tableCell;
  });
  var tableLine = /\|?[ \t]*:?-{3,}:?[ \t]*(?:\|[ \t]*:?-{3,}:?[ \t]*)+\|?(?:\n|\r\n?)/.source;
  Prism.languages.markdown = Prism.languages.extend('markup', {});
  Prism.languages.insertBefore('markdown', 'prolog', {
    'front-matter-block': {
      pattern: /(^(?:\s*[\r\n])?)---(?!.)[\s\S]*?[\r\n]---(?!.)/,
      lookbehind: true,
      greedy: true,
      inside: {
        'punctuation': /^---|---$/,
        'front-matter': {
          pattern: /\S+(?:\s+\S+)*/,
          alias: ['yaml', 'language-yaml'],
          inside: Prism.languages.yaml
        }
      }
    },
    'blockquote': {
      // > ...
      pattern: /^>(?:[\t ]*>)*/m,
      alias: 'punctuation'
    },
    'table': {
      pattern: RegExp('^' + tableRow + tableLine + '(?:' + tableRow + ')*', 'm'),
      inside: {
        'table-data-rows': {
          pattern: RegExp('^(' + tableRow + tableLine + ')(?:' + tableRow + ')*$'),
          lookbehind: true,
          inside: {
            'table-data': {
              pattern: RegExp(tableCell),
              inside: Prism.languages.markdown
            },
            'punctuation': /\|/
          }
        },
        'table-line': {
          pattern: RegExp('^(' + tableRow + ')' + tableLine + '$'),
          lookbehind: true,
          inside: {
            'punctuation': /\||:?-{3,}:?/
          }
        },
        'table-header-row': {
          pattern: RegExp('^' + tableRow + '$'),
          inside: {
            'table-header': {
              pattern: RegExp(tableCell),
              alias: 'important',
              inside: Prism.languages.markdown
            },
            'punctuation': /\|/
          }
        }
      }
    },
    'code': [{
      // Prefixed by 4 spaces or 1 tab and preceded by an empty line
      pattern: /((?:^|\n)[ \t]*\n|(?:^|\r\n?)[ \t]*\r\n?)(?: {4}|\t).+(?:(?:\n|\r\n?)(?: {4}|\t).+)*/,
      lookbehind: true,
      alias: 'keyword'
    }, {
      // ```optional language
      // code block
      // ```
      pattern: /^```[\s\S]*?^```$/m,
      greedy: true,
      inside: {
        'code-block': {
          pattern: /^(```.*(?:\n|\r\n?))[\s\S]+?(?=(?:\n|\r\n?)^```$)/m,
          lookbehind: true
        },
        'code-language': {
          pattern: /^(```).+/,
          lookbehind: true
        },
        'punctuation': /```/
      }
    }],
    'title': [{
      // title 1
      // =======

      // title 2
      // -------
      pattern: /\S.*(?:\n|\r\n?)(?:==+|--+)(?=[ \t]*$)/m,
      alias: 'important',
      inside: {
        punctuation: /==+$|--+$/
      }
    }, {
      // # title 1
      // ###### title 6
      pattern: /(^\s*)#.+/m,
      lookbehind: true,
      alias: 'important',
      inside: {
        punctuation: /^#+|#+$/
      }
    }],
    'hr': {
      // ***
      // ---
      // * * *
      // -----------
      pattern: /(^\s*)([*-])(?:[\t ]*\2){2,}(?=\s*$)/m,
      lookbehind: true,
      alias: 'punctuation'
    },
    'list': {
      // * item
      // + item
      // - item
      // 1. item
      pattern: /(^\s*)(?:[*+-]|\d+\.)(?=[\t ].)/m,
      lookbehind: true,
      alias: 'punctuation'
    },
    'url-reference': {
      // [id]: http://example.com "Optional title"
      // [id]: http://example.com 'Optional title'
      // [id]: http://example.com (Optional title)
      // [id]: <http://example.com> "Optional title"
      pattern: /!?\[[^\]]+\]:[\t ]+(?:\S+|<(?:\\.|[^>\\])+>)(?:[\t ]+(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\)))?/,
      inside: {
        'variable': {
          pattern: /^(!?\[)[^\]]+/,
          lookbehind: true
        },
        'string': /(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\((?:\\.|[^)\\])*\))$/,
        'punctuation': /^[\[\]!:]|[<>]/
      },
      alias: 'url'
    },
    'bold': {
      // **strong**
      // __strong__

      // allow one nested instance of italic text using the same delimiter
      pattern: createInline(/\b__(?:(?!_)<inner>|_(?:(?!_)<inner>)+_)+__\b|\*\*(?:(?!\*)<inner>|\*(?:(?!\*)<inner>)+\*)+\*\*/.source),
      lookbehind: true,
      greedy: true,
      inside: {
        'content': {
          pattern: /(^..)[\s\S]+(?=..$)/,
          lookbehind: true,
          inside: {} // see below
        },

        'punctuation': /\*\*|__/
      }
    },
    'italic': {
      // *em*
      // _em_

      // allow one nested instance of bold text using the same delimiter
      pattern: createInline(/\b_(?:(?!_)<inner>|__(?:(?!_)<inner>)+__)+_\b|\*(?:(?!\*)<inner>|\*\*(?:(?!\*)<inner>)+\*\*)+\*/.source),
      lookbehind: true,
      greedy: true,
      inside: {
        'content': {
          pattern: /(^.)[\s\S]+(?=.$)/,
          lookbehind: true,
          inside: {} // see below
        },

        'punctuation': /[*_]/
      }
    },
    'strike': {
      // ~~strike through~~
      // ~strike~
      // eslint-disable-next-line regexp/strict
      pattern: createInline(/(~~?)(?:(?!~)<inner>)+\2/.source),
      lookbehind: true,
      greedy: true,
      inside: {
        'content': {
          pattern: /(^~~?)[\s\S]+(?=\1$)/,
          lookbehind: true,
          inside: {} // see below
        },

        'punctuation': /~~?/
      }
    },
    'code-snippet': {
      // `code`
      // ``code``
      pattern: /(^|[^\\`])(?:``[^`\r\n]+(?:`[^`\r\n]+)*``(?!`)|`[^`\r\n]+`(?!`))/,
      lookbehind: true,
      greedy: true,
      alias: ['code', 'keyword']
    },
    'url': {
      // [example](http://example.com "Optional title")
      // [example][id]
      // [example] [id]
      pattern: createInline(/!?\[(?:(?!\])<inner>)+\](?:\([^\s)]+(?:[\t ]+"(?:\\.|[^"\\])*")?\)|[ \t]?\[(?:(?!\])<inner>)+\])/.source),
      lookbehind: true,
      greedy: true,
      inside: {
        'operator': /^!/,
        'content': {
          pattern: /(^\[)[^\]]+(?=\])/,
          lookbehind: true,
          inside: {} // see below
        },

        'variable': {
          pattern: /(^\][ \t]?\[)[^\]]+(?=\]$)/,
          lookbehind: true
        },
        'url': {
          pattern: /(^\]\()[^\s)]+/,
          lookbehind: true
        },
        'string': {
          pattern: /(^[ \t]+)"(?:\\.|[^"\\])*"(?=\)$)/,
          lookbehind: true
        }
      }
    }
  });
  ['url', 'bold', 'italic', 'strike'].forEach(function (token) {
    ['url', 'bold', 'italic', 'strike', 'code-snippet'].forEach(function (inside) {
      if (token !== inside) {
        Prism.languages.markdown[token].inside.content.inside[inside] = Prism.languages.markdown[inside];
      }
    });
  });
  Prism.hooks.add('after-tokenize', function (env) {
    if (env.language !== 'markdown' && env.language !== 'md') {
      return;
    }
    function walkTokens(tokens) {
      if (!tokens || typeof tokens === 'string') {
        return;
      }
      for (var i = 0, l = tokens.length; i < l; i++) {
        var token = tokens[i];
        if (token.type !== 'code') {
          walkTokens(token.content);
          continue;
        }

        /*
         * Add the correct `language-xxxx` class to this code block. Keep in mind that the `code-language` token
         * is optional. But the grammar is defined so that there is only one case we have to handle:
         *
         * token.content = [
         *     <span class="punctuation">```</span>,
         *     <span class="code-language">xxxx</span>,
         *     '\n', // exactly one new lines (\r or \n or \r\n)
         *     <span class="code-block">...</span>,
         *     '\n', // exactly one new lines again
         *     <span class="punctuation">```</span>
         * ];
         */

        var codeLang = token.content[1];
        var codeBlock = token.content[3];
        if (codeLang && codeBlock && codeLang.type === 'code-language' && codeBlock.type === 'code-block' && typeof codeLang.content === 'string') {
          // this might be a language that Prism does not support

          // do some replacements to support C++, C#, and F#
          var lang = codeLang.content.replace(/\b#/g, 'sharp').replace(/\b\+\+/g, 'pp');
          // only use the first word
          lang = (/[a-z][\w-]*/i.exec(lang) || [''])[0].toLowerCase();
          var alias = 'language-' + lang;

          // add alias
          if (!codeBlock.alias) {
            codeBlock.alias = [alias];
          } else if (typeof codeBlock.alias === 'string') {
            codeBlock.alias = [codeBlock.alias, alias];
          } else {
            codeBlock.alias.push(alias);
          }
        }
      }
    }
    walkTokens(env.tokens);
  });
  Prism.hooks.add('wrap', function (env) {
    if (env.type !== 'code-block') {
      return;
    }
    var codeLang = '';
    for (var i = 0, l = env.classes.length; i < l; i++) {
      var cls = env.classes[i];
      var match = /language-(.+)/.exec(cls);
      if (match) {
        codeLang = match[1];
        break;
      }
    }
    var grammar = Prism.languages[codeLang];
    if (!grammar) {
      if (codeLang && codeLang !== 'none' && Prism.plugins.autoloader) {
        var id = 'md-' + new Date().valueOf() + '-' + Math.floor(Math.random() * 1e16);
        env.attributes['id'] = id;
        Prism.plugins.autoloader.loadLanguages(codeLang, function () {
          var ele = document.getElementById(id);
          if (ele) {
            ele.innerHTML = Prism.highlight(ele.textContent, Prism.languages[codeLang], codeLang);
          }
        });
      }
    } else {
      env.content = Prism.highlight(textContent(env.content), grammar, codeLang);
    }
  });
  var tagPattern = RegExp(Prism.languages.markup.tag.pattern.source, 'gi');

  /**
   * A list of known entity names.
   *
   * This will always be incomplete to save space. The current list is the one used by lowdash's unescape function.
   *
   * @see {@link https://github.com/lodash/lodash/blob/2da024c3b4f9947a48517639de7560457cd4ec6c/unescape.js#L2}
   */
  var KNOWN_ENTITY_NAMES = {
    'amp': '&',
    'lt': '<',
    'gt': '>',
    'quot': '"'
  };

  // IE 11 doesn't support `String.fromCodePoint`
  var fromCodePoint = String.fromCodePoint || String.fromCharCode;

  /**
   * Returns the text content of a given HTML source code string.
   *
   * @param {string} html
   * @returns {string}
   */
  function textContent(html) {
    // remove all tags
    var text = html.replace(tagPattern, '');

    // decode known entities
    text = text.replace(/&(\w{1,8}|#x?[\da-f]{1,8});/gi, function (m, code) {
      code = code.toLowerCase();
      if (code[0] === '#') {
        var value;
        if (code[1] === 'x') {
          value = parseInt(code.slice(2), 16);
        } else {
          value = Number(code.slice(1));
        }
        return fromCodePoint(value);
      } else {
        var known = KNOWN_ENTITY_NAMES[code];
        if (known) {
          return known;
        }

        // unable to decode
        return m;
      }
    });
    return text;
  }
  Prism.languages.md = Prism.languages.markdown;
})(Prism);
Prism.languages.objectivec = Prism.languages.extend('c', {
  'string': {
    pattern: /@?"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"/,
    greedy: true
  },
  'keyword': /\b(?:asm|auto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|in|inline|int|long|register|return|self|short|signed|sizeof|static|struct|super|switch|typedef|typeof|union|unsigned|void|volatile|while)\b|(?:@interface|@end|@implementation|@protocol|@class|@public|@protected|@private|@property|@try|@catch|@finally|@throw|@synthesize|@dynamic|@selector)\b/,
  'operator': /-[->]?|\+\+?|!=?|<<?=?|>>?=?|==?|&&?|\|\|?|[~^%?*\/@]/
});
delete Prism.languages.objectivec['class-name'];
Prism.languages.objc = Prism.languages.objectivec;
(function (Prism) {
  var brackets = /(?:\((?:[^()\\]|\\[\s\S])*\)|\{(?:[^{}\\]|\\[\s\S])*\}|\[(?:[^[\]\\]|\\[\s\S])*\]|<(?:[^<>\\]|\\[\s\S])*>)/.source;
  Prism.languages.perl = {
    'comment': [{
      // POD
      pattern: /(^\s*)=\w[\s\S]*?=cut.*/m,
      lookbehind: true,
      greedy: true
    }, {
      pattern: /(^|[^\\$])#.*/,
      lookbehind: true,
      greedy: true
    }],
    // TODO Could be nice to handle Heredoc too.
    'string': [{
      pattern: RegExp(/\b(?:q|qq|qw|qx)(?![a-zA-Z0-9])\s*/.source + '(?:' + [
      // q/.../
      /([^a-zA-Z0-9\s{(\[<])(?:(?!\1)[^\\]|\\[\s\S])*\1/.source,
      // q a...a
      // eslint-disable-next-line regexp/strict
      /([a-zA-Z0-9])(?:(?!\2)[^\\]|\\[\s\S])*\2/.source,
      // q(...)
      // q{...}
      // q[...]
      // q<...>
      brackets].join('|') + ')'),
      greedy: true
    },
    // "...", `...`
    {
      pattern: /("|`)(?:(?!\1)[^\\]|\\[\s\S])*\1/,
      greedy: true
    },
    // '...'
    // FIXME Multi-line single-quoted strings are not supported as they would break variables containing '
    {
      pattern: /'(?:[^'\\\r\n]|\\.)*'/,
      greedy: true
    }],
    'regex': [{
      pattern: RegExp(/\b(?:m|qr)(?![a-zA-Z0-9])\s*/.source + '(?:' + [
      // m/.../
      /([^a-zA-Z0-9\s{(\[<])(?:(?!\1)[^\\]|\\[\s\S])*\1/.source,
      // m a...a
      // eslint-disable-next-line regexp/strict
      /([a-zA-Z0-9])(?:(?!\2)[^\\]|\\[\s\S])*\2/.source,
      // m(...)
      // m{...}
      // m[...]
      // m<...>
      brackets].join('|') + ')' + /[msixpodualngc]*/.source),
      greedy: true
    },
    // The lookbehinds prevent -s from breaking
    {
      pattern: RegExp(/(^|[^-])\b(?:s|tr|y)(?![a-zA-Z0-9])\s*/.source + '(?:' + [
      // s/.../.../
      // eslint-disable-next-line regexp/strict
      /([^a-zA-Z0-9\s{(\[<])(?:(?!\2)[^\\]|\\[\s\S])*\2(?:(?!\2)[^\\]|\\[\s\S])*\2/.source,
      // s a...a...a
      // eslint-disable-next-line regexp/strict
      /([a-zA-Z0-9])(?:(?!\3)[^\\]|\\[\s\S])*\3(?:(?!\3)[^\\]|\\[\s\S])*\3/.source,
      // s(...)(...)
      // s{...}{...}
      // s[...][...]
      // s<...><...>
      // s(...)[...]
      brackets + /\s*/.source + brackets].join('|') + ')' + /[msixpodualngcer]*/.source),
      lookbehind: true,
      greedy: true
    },
    // /.../
    // The look-ahead tries to prevent two divisions on
    // the same line from being highlighted as regex.
    // This does not support multi-line regex.
    {
      pattern: /\/(?:[^\/\\\r\n]|\\.)*\/[msixpodualngc]*(?=\s*(?:$|[\r\n,.;})&|\-+*~<>!?^]|(?:and|cmp|eq|ge|gt|le|lt|ne|not|or|x|xor)\b))/,
      greedy: true
    }],
    // FIXME Not sure about the handling of ::, ', and #
    'variable': [
    // ${^POSTMATCH}
    /[&*$@%]\{\^[A-Z]+\}/,
    // $^V
    /[&*$@%]\^[A-Z_]/,
    // ${...}
    /[&*$@%]#?(?=\{)/,
    // $foo
    /[&*$@%]#?(?:(?:::)*'?(?!\d)[\w$]+(?![\w$]))+(?:::)*/,
    // $1
    /[&*$@%]\d+/,
    // $_, @_, %!
    // The negative lookahead prevents from breaking the %= operator
    /(?!%=)[$@%][!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]/],
    'filehandle': {
      // <>, <FOO>, _
      pattern: /<(?![<=])\S*?>|\b_\b/,
      alias: 'symbol'
    },
    'v-string': {
      // v1.2, 1.2.3
      pattern: /v\d+(?:\.\d+)*|\d+(?:\.\d+){2,}/,
      alias: 'string'
    },
    'function': {
      pattern: /(\bsub[ \t]+)\w+/,
      lookbehind: true
    },
    'keyword': /\b(?:any|break|continue|default|delete|die|do|else|elsif|eval|for|foreach|given|goto|if|last|local|my|next|our|package|print|redo|require|return|say|state|sub|switch|undef|unless|until|use|when|while)\b/,
    'number': /\b(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0b[01](?:_?[01])*|(?:(?:\d(?:_?\d)*)?\.)?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)\b/,
    'operator': /-[rwxoRWXOezsfdlpSbctugkTBMAC]\b|\+[+=]?|-[-=>]?|\*\*?=?|\/\/?=?|=[=~>]?|~[~=]?|\|\|?=?|&&?=?|<(?:=>?|<=?)?|>>?=?|![~=]?|[%^]=?|\.(?:=|\.\.?)?|[\\?]|\bx(?:=|\b)|\b(?:and|cmp|eq|ge|gt|le|lt|ne|not|or|xor)\b/,
    'punctuation': /[{}[\];(),:]/
  };
})(Prism);
(function (Prism) {
  /**
   * Returns the placeholder for the given language id and index.
   *
   * @param {string} language
   * @param {string|number} index
   * @returns {string}
   */
  function getPlaceholder(language, index) {
    return '___' + language.toUpperCase() + index + '___';
  }
  Object.defineProperties(Prism.languages['markup-templating'] = {}, {
    buildPlaceholders: {
      /**
       * Tokenize all inline templating expressions matching `placeholderPattern`.
       *
       * If `replaceFilter` is provided, only matches of `placeholderPattern` for which `replaceFilter` returns
       * `true` will be replaced.
       *
       * @param {object} env The environment of the `before-tokenize` hook.
       * @param {string} language The language id.
       * @param {RegExp} placeholderPattern The matches of this pattern will be replaced by placeholders.
       * @param {(match: string) => boolean} [replaceFilter]
       */
      value: function (env, language, placeholderPattern, replaceFilter) {
        if (env.language !== language) {
          return;
        }
        var tokenStack = env.tokenStack = [];
        env.code = env.code.replace(placeholderPattern, function (match) {
          if (typeof replaceFilter === 'function' && !replaceFilter(match)) {
            return match;
          }
          var i = tokenStack.length;
          var placeholder;

          // Check for existing strings
          while (env.code.indexOf(placeholder = getPlaceholder(language, i)) !== -1) {
            ++i;
          }

          // Create a sparse array
          tokenStack[i] = match;
          return placeholder;
        });

        // Switch the grammar to markup
        env.grammar = Prism.languages.markup;
      }
    },
    tokenizePlaceholders: {
      /**
       * Replace placeholders with proper tokens after tokenizing.
       *
       * @param {object} env The environment of the `after-tokenize` hook.
       * @param {string} language The language id.
       */
      value: function (env, language) {
        if (env.language !== language || !env.tokenStack) {
          return;
        }

        // Switch the grammar back
        env.grammar = Prism.languages[language];
        var j = 0;
        var keys = Object.keys(env.tokenStack);
        function walkTokens(tokens) {
          for (var i = 0; i < tokens.length; i++) {
            // all placeholders are replaced already
            if (j >= keys.length) {
              break;
            }
            var token = tokens[i];
            if (typeof token === 'string' || token.content && typeof token.content === 'string') {
              var k = keys[j];
              var t = env.tokenStack[k];
              var s = typeof token === 'string' ? token : token.content;
              var placeholder = getPlaceholder(language, k);
              var index = s.indexOf(placeholder);
              if (index > -1) {
                ++j;
                var before = s.substring(0, index);
                var middle = new Prism.Token(language, Prism.tokenize(t, env.grammar), 'language-' + language, t);
                var after = s.substring(index + placeholder.length);
                var replacement = [];
                if (before) {
                  replacement.push.apply(replacement, walkTokens([before]));
                }
                replacement.push(middle);
                if (after) {
                  replacement.push.apply(replacement, walkTokens([after]));
                }
                if (typeof token === 'string') {
                  tokens.splice.apply(tokens, [i, 1].concat(replacement));
                } else {
                  token.content = replacement;
                }
              }
            } else if (token.content /* && typeof token.content !== 'string' */) {
              walkTokens(token.content);
            }
          }
          return tokens;
        }
        walkTokens(env.tokens);
      }
    }
  });
})(Prism);

/**
 * Original by Aaron Harun: http://aahacreative.com/2012/07/31/php-syntax-highlighting-prism/
 * Modified by Miles Johnson: http://milesj.me
 * Rewritten by Tom Pavelec
 *
 * Supports PHP 5.3 - 8.0
 */
(function (Prism) {
  var comment = /\/\*[\s\S]*?\*\/|\/\/.*|#(?!\[).*/;
  var constant = [{
    pattern: /\b(?:false|true)\b/i,
    alias: 'boolean'
  }, {
    pattern: /(::\s*)\b[a-z_]\w*\b(?!\s*\()/i,
    greedy: true,
    lookbehind: true
  }, {
    pattern: /(\b(?:case|const)\s+)\b[a-z_]\w*(?=\s*[;=])/i,
    greedy: true,
    lookbehind: true
  }, /\b(?:null)\b/i, /\b[A-Z_][A-Z0-9_]*\b(?!\s*\()/];
  var number = /\b0b[01]+(?:_[01]+)*\b|\b0o[0-7]+(?:_[0-7]+)*\b|\b0x[\da-f]+(?:_[\da-f]+)*\b|(?:\b\d+(?:_\d+)*\.?(?:\d+(?:_\d+)*)?|\B\.\d+)(?:e[+-]?\d+)?/i;
  var operator = /<?=>|\?\?=?|\.{3}|\??->|[!=]=?=?|::|\*\*=?|--|\+\+|&&|\|\||<<|>>|[?~]|[/^|%*&<>.+-]=?/;
  var punctuation = /[{}\[\](),:;]/;
  Prism.languages.php = {
    'delimiter': {
      pattern: /\?>$|^<\?(?:php(?=\s)|=)?/i,
      alias: 'important'
    },
    'comment': comment,
    'variable': /\$+(?:\w+\b|(?=\{))/,
    'package': {
      pattern: /(namespace\s+|use\s+(?:function\s+)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
      lookbehind: true,
      inside: {
        'punctuation': /\\/
      }
    },
    'class-name-definition': {
      pattern: /(\b(?:class|enum|interface|trait)\s+)\b[a-z_]\w*(?!\\)\b/i,
      lookbehind: true,
      alias: 'class-name'
    },
    'function-definition': {
      pattern: /(\bfunction\s+)[a-z_]\w*(?=\s*\()/i,
      lookbehind: true,
      alias: 'function'
    },
    'keyword': [{
      pattern: /(\(\s*)\b(?:array|bool|boolean|float|int|integer|object|string)\b(?=\s*\))/i,
      alias: 'type-casting',
      greedy: true,
      lookbehind: true
    }, {
      pattern: /([(,?]\s*)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|object|self|static|string)\b(?=\s*\$)/i,
      alias: 'type-hint',
      greedy: true,
      lookbehind: true
    }, {
      pattern: /(\)\s*:\s*(?:\?\s*)?)\b(?:array(?!\s*\()|bool|callable|(?:false|null)(?=\s*\|)|float|int|iterable|mixed|never|object|self|static|string|void)\b/i,
      alias: 'return-type',
      greedy: true,
      lookbehind: true
    }, {
      pattern: /\b(?:array(?!\s*\()|bool|float|int|iterable|mixed|object|string|void)\b/i,
      alias: 'type-declaration',
      greedy: true
    }, {
      pattern: /(\|\s*)(?:false|null)\b|\b(?:false|null)(?=\s*\|)/i,
      alias: 'type-declaration',
      greedy: true,
      lookbehind: true
    }, {
      pattern: /\b(?:parent|self|static)(?=\s*::)/i,
      alias: 'static-context',
      greedy: true
    }, {
      // yield from
      pattern: /(\byield\s+)from\b/i,
      lookbehind: true
    },
    // `class` is always a keyword unlike other keywords
    /\bclass\b/i, {
      // https://www.php.net/manual/en/reserved.keywords.php
      //
      // keywords cannot be preceded by "->"
      // the complex lookbehind means `(?<!(?:->|::)\s*)`
      pattern: /((?:^|[^\s>:]|(?:^|[^-])>|(?:^|[^:]):)\s*)\b(?:abstract|and|array|as|break|callable|case|catch|clone|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|enum|eval|exit|extends|final|finally|fn|for|foreach|function|global|goto|if|implements|include|include_once|instanceof|insteadof|interface|isset|list|match|namespace|never|new|or|parent|print|private|protected|public|readonly|require|require_once|return|self|static|switch|throw|trait|try|unset|use|var|while|xor|yield|__halt_compiler)\b/i,
      lookbehind: true
    }],
    'argument-name': {
      pattern: /([(,]\s*)\b[a-z_]\w*(?=\s*:(?!:))/i,
      lookbehind: true
    },
    'class-name': [{
      pattern: /(\b(?:extends|implements|instanceof|new(?!\s+self|\s+static))\s+|\bcatch\s*\()\b[a-z_]\w*(?!\\)\b/i,
      greedy: true,
      lookbehind: true
    }, {
      pattern: /(\|\s*)\b[a-z_]\w*(?!\\)\b/i,
      greedy: true,
      lookbehind: true
    }, {
      pattern: /\b[a-z_]\w*(?!\\)\b(?=\s*\|)/i,
      greedy: true
    }, {
      pattern: /(\|\s*)(?:\\?\b[a-z_]\w*)+\b/i,
      alias: 'class-name-fully-qualified',
      greedy: true,
      lookbehind: true,
      inside: {
        'punctuation': /\\/
      }
    }, {
      pattern: /(?:\\?\b[a-z_]\w*)+\b(?=\s*\|)/i,
      alias: 'class-name-fully-qualified',
      greedy: true,
      inside: {
        'punctuation': /\\/
      }
    }, {
      pattern: /(\b(?:extends|implements|instanceof|new(?!\s+self\b|\s+static\b))\s+|\bcatch\s*\()(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
      alias: 'class-name-fully-qualified',
      greedy: true,
      lookbehind: true,
      inside: {
        'punctuation': /\\/
      }
    }, {
      pattern: /\b[a-z_]\w*(?=\s*\$)/i,
      alias: 'type-declaration',
      greedy: true
    }, {
      pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
      alias: ['class-name-fully-qualified', 'type-declaration'],
      greedy: true,
      inside: {
        'punctuation': /\\/
      }
    }, {
      pattern: /\b[a-z_]\w*(?=\s*::)/i,
      alias: 'static-context',
      greedy: true
    }, {
      pattern: /(?:\\?\b[a-z_]\w*)+(?=\s*::)/i,
      alias: ['class-name-fully-qualified', 'static-context'],
      greedy: true,
      inside: {
        'punctuation': /\\/
      }
    }, {
      pattern: /([(,?]\s*)[a-z_]\w*(?=\s*\$)/i,
      alias: 'type-hint',
      greedy: true,
      lookbehind: true
    }, {
      pattern: /([(,?]\s*)(?:\\?\b[a-z_]\w*)+(?=\s*\$)/i,
      alias: ['class-name-fully-qualified', 'type-hint'],
      greedy: true,
      lookbehind: true,
      inside: {
        'punctuation': /\\/
      }
    }, {
      pattern: /(\)\s*:\s*(?:\?\s*)?)\b[a-z_]\w*(?!\\)\b/i,
      alias: 'return-type',
      greedy: true,
      lookbehind: true
    }, {
      pattern: /(\)\s*:\s*(?:\?\s*)?)(?:\\?\b[a-z_]\w*)+\b(?!\\)/i,
      alias: ['class-name-fully-qualified', 'return-type'],
      greedy: true,
      lookbehind: true,
      inside: {
        'punctuation': /\\/
      }
    }],
    'constant': constant,
    'function': {
      pattern: /(^|[^\\\w])\\?[a-z_](?:[\w\\]*\w)?(?=\s*\()/i,
      lookbehind: true,
      inside: {
        'punctuation': /\\/
      }
    },
    'property': {
      pattern: /(->\s*)\w+/,
      lookbehind: true
    },
    'number': number,
    'operator': operator,
    'punctuation': punctuation
  };
  var string_interpolation = {
    pattern: /\{\$(?:\{(?:\{[^{}]+\}|[^{}]+)\}|[^{}])+\}|(^|[^\\{])\$+(?:\w+(?:\[[^\r\n\[\]]+\]|->\w+)?)/,
    lookbehind: true,
    inside: Prism.languages.php
  };
  var string = [{
    pattern: /<<<'([^']+)'[\r\n](?:.*[\r\n])*?\1;/,
    alias: 'nowdoc-string',
    greedy: true,
    inside: {
      'delimiter': {
        pattern: /^<<<'[^']+'|[a-z_]\w*;$/i,
        alias: 'symbol',
        inside: {
          'punctuation': /^<<<'?|[';]$/
        }
      }
    }
  }, {
    pattern: /<<<(?:"([^"]+)"[\r\n](?:.*[\r\n])*?\1;|([a-z_]\w*)[\r\n](?:.*[\r\n])*?\2;)/i,
    alias: 'heredoc-string',
    greedy: true,
    inside: {
      'delimiter': {
        pattern: /^<<<(?:"[^"]+"|[a-z_]\w*)|[a-z_]\w*;$/i,
        alias: 'symbol',
        inside: {
          'punctuation': /^<<<"?|[";]$/
        }
      },
      'interpolation': string_interpolation
    }
  }, {
    pattern: /`(?:\\[\s\S]|[^\\`])*`/,
    alias: 'backtick-quoted-string',
    greedy: true
  }, {
    pattern: /'(?:\\[\s\S]|[^\\'])*'/,
    alias: 'single-quoted-string',
    greedy: true
  }, {
    pattern: /"(?:\\[\s\S]|[^\\"])*"/,
    alias: 'double-quoted-string',
    greedy: true,
    inside: {
      'interpolation': string_interpolation
    }
  }];
  Prism.languages.insertBefore('php', 'variable', {
    'string': string,
    'attribute': {
      pattern: /#\[(?:[^"'\/#]|\/(?![*/])|\/\/.*$|#(?!\[).*$|\/\*(?:[^*]|\*(?!\/))*\*\/|"(?:\\[\s\S]|[^\\"])*"|'(?:\\[\s\S]|[^\\'])*')+\](?=\s*[a-z$#])/im,
      greedy: true,
      inside: {
        'attribute-content': {
          pattern: /^(#\[)[\s\S]+(?=\]$)/,
          lookbehind: true,
          // inside can appear subset of php
          inside: {
            'comment': comment,
            'string': string,
            'attribute-class-name': [{
              pattern: /([^:]|^)\b[a-z_]\w*(?!\\)\b/i,
              alias: 'class-name',
              greedy: true,
              lookbehind: true
            }, {
              pattern: /([^:]|^)(?:\\?\b[a-z_]\w*)+/i,
              alias: ['class-name', 'class-name-fully-qualified'],
              greedy: true,
              lookbehind: true,
              inside: {
                'punctuation': /\\/
              }
            }],
            'constant': constant,
            'number': number,
            'operator': operator,
            'punctuation': punctuation
          }
        },
        'delimiter': {
          pattern: /^#\[|\]$/,
          alias: 'punctuation'
        }
      }
    }
  });
  Prism.hooks.add('before-tokenize', function (env) {
    if (!/<\?/.test(env.code)) {
      return;
    }
    var phpPattern = /<\?(?:[^"'/#]|\/(?![*/])|("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|(?:\/\/|#(?!\[))(?:[^?\n\r]|\?(?!>))*(?=$|\?>|[\r\n])|#\[|\/\*(?:[^*]|\*(?!\/))*(?:\*\/|$))*?(?:\?>|$)/g;
    Prism.languages['markup-templating'].buildPlaceholders(env, 'php', phpPattern);
  });
  Prism.hooks.add('after-tokenize', function (env) {
    Prism.languages['markup-templating'].tokenizePlaceholders(env, 'php');
  });
})(Prism);
Prism.languages.python = {
  'comment': {
    pattern: /(^|[^\\])#.*/,
    lookbehind: true,
    greedy: true
  },
  'string-interpolation': {
    pattern: /(?:f|fr|rf)(?:("""|''')[\s\S]*?\1|("|')(?:\\.|(?!\2)[^\\\r\n])*\2)/i,
    greedy: true,
    inside: {
      'interpolation': {
        // "{" <expression> <optional "!s", "!r", or "!a"> <optional ":" format specifier> "}"
        pattern: /((?:^|[^{])(?:\{\{)*)\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}]|\{(?!\{)(?:[^{}])+\})+\})+\}/,
        lookbehind: true,
        inside: {
          'format-spec': {
            pattern: /(:)[^:(){}]+(?=\}$)/,
            lookbehind: true
          },
          'conversion-option': {
            pattern: /![sra](?=[:}]$)/,
            alias: 'punctuation'
          },
          rest: null
        }
      },
      'string': /[\s\S]+/
    }
  },
  'triple-quoted-string': {
    pattern: /(?:[rub]|br|rb)?("""|''')[\s\S]*?\1/i,
    greedy: true,
    alias: 'string'
  },
  'string': {
    pattern: /(?:[rub]|br|rb)?("|')(?:\\.|(?!\1)[^\\\r\n])*\1/i,
    greedy: true
  },
  'function': {
    pattern: /((?:^|\s)def[ \t]+)[a-zA-Z_]\w*(?=\s*\()/g,
    lookbehind: true
  },
  'class-name': {
    pattern: /(\bclass\s+)\w+/i,
    lookbehind: true
  },
  'decorator': {
    pattern: /(^[\t ]*)@\w+(?:\.\w+)*/m,
    lookbehind: true,
    alias: ['annotation', 'punctuation'],
    inside: {
      'punctuation': /\./
    }
  },
  'keyword': /\b(?:_(?=\s*:)|and|as|assert|async|await|break|case|class|continue|def|del|elif|else|except|exec|finally|for|from|global|if|import|in|is|lambda|match|nonlocal|not|or|pass|print|raise|return|try|while|with|yield)\b/,
  'builtin': /\b(?:__import__|abs|all|any|apply|ascii|basestring|bin|bool|buffer|bytearray|bytes|callable|chr|classmethod|cmp|coerce|compile|complex|delattr|dict|dir|divmod|enumerate|eval|execfile|file|filter|float|format|frozenset|getattr|globals|hasattr|hash|help|hex|id|input|int|intern|isinstance|issubclass|iter|len|list|locals|long|map|max|memoryview|min|next|object|oct|open|ord|pow|property|range|raw_input|reduce|reload|repr|reversed|round|set|setattr|slice|sorted|staticmethod|str|sum|super|tuple|type|unichr|unicode|vars|xrange|zip)\b/,
  'boolean': /\b(?:False|None|True)\b/,
  'number': /\b0(?:b(?:_?[01])+|o(?:_?[0-7])+|x(?:_?[a-f0-9])+)\b|(?:\b\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\B\.\d+(?:_\d+)*)(?:e[+-]?\d+(?:_\d+)*)?j?(?!\w)/i,
  'operator': /[-+%=]=?|!=|:=|\*\*?=?|\/\/?=?|<[<=>]?|>[=>]?|[&|^~]/,
  'punctuation': /[{}[\];(),.:]/
};
Prism.languages.python['string-interpolation'].inside['interpolation'].inside.rest = Prism.languages.python;
Prism.languages.py = Prism.languages.python;
Prism.languages.r = {
  'comment': /#.*/,
  'string': {
    pattern: /(['"])(?:\\.|(?!\1)[^\\\r\n])*\1/,
    greedy: true
  },
  'percent-operator': {
    // Includes user-defined operators
    // and %%, %*%, %/%, %in%, %o%, %x%
    pattern: /%[^%\s]*%/,
    alias: 'operator'
  },
  'boolean': /\b(?:FALSE|TRUE)\b/,
  'ellipsis': /\.\.(?:\.|\d+)/,
  'number': [/\b(?:Inf|NaN)\b/, /(?:\b0x[\dA-Fa-f]+(?:\.\d*)?|\b\d+(?:\.\d*)?|\B\.\d+)(?:[EePp][+-]?\d+)?[iL]?/],
  'keyword': /\b(?:NA|NA_character_|NA_complex_|NA_integer_|NA_real_|NULL|break|else|for|function|if|in|next|repeat|while)\b/,
  'operator': /->?>?|<(?:=|<?-)?|[>=!]=?|::?|&&?|\|\|?|[+*\/^$@~]/,
  'punctuation': /[(){}\[\],;]/
};

/**
 * Original by Samuel Flores
 *
 * Adds the following new token classes:
 *     constant, builtin, variable, symbol, regex
 */
(function (Prism) {
  Prism.languages.ruby = Prism.languages.extend('clike', {
    'comment': {
      pattern: /#.*|^=begin\s[\s\S]*?^=end/m,
      greedy: true
    },
    'class-name': {
      pattern: /(\b(?:class|module)\s+|\bcatch\s+\()[\w.\\]+|\b[A-Z_]\w*(?=\s*\.\s*new\b)/,
      lookbehind: true,
      inside: {
        'punctuation': /[.\\]/
      }
    },
    'keyword': /\b(?:BEGIN|END|alias|and|begin|break|case|class|def|define_method|defined|do|each|else|elsif|end|ensure|extend|for|if|in|include|module|new|next|nil|not|or|prepend|private|protected|public|raise|redo|require|rescue|retry|return|self|super|then|throw|undef|unless|until|when|while|yield)\b/,
    'operator': /\.{2,3}|&\.|===|<?=>|[!=]?~|(?:&&|\|\||<<|>>|\*\*|[+\-*/%<>!^&|=])=?|[?:]/,
    'punctuation': /[(){}[\].,;]/
  });
  Prism.languages.insertBefore('ruby', 'operator', {
    'double-colon': {
      pattern: /::/,
      alias: 'punctuation'
    }
  });
  var interpolation = {
    pattern: /((?:^|[^\\])(?:\\{2})*)#\{(?:[^{}]|\{[^{}]*\})*\}/,
    lookbehind: true,
    inside: {
      'content': {
        pattern: /^(#\{)[\s\S]+(?=\}$)/,
        lookbehind: true,
        inside: Prism.languages.ruby
      },
      'delimiter': {
        pattern: /^#\{|\}$/,
        alias: 'punctuation'
      }
    }
  };
  delete Prism.languages.ruby.function;
  var percentExpression = '(?:' + [/([^a-zA-Z0-9\s{(\[<=])(?:(?!\1)[^\\]|\\[\s\S])*\1/.source, /\((?:[^()\\]|\\[\s\S]|\((?:[^()\\]|\\[\s\S])*\))*\)/.source, /\{(?:[^{}\\]|\\[\s\S]|\{(?:[^{}\\]|\\[\s\S])*\})*\}/.source, /\[(?:[^\[\]\\]|\\[\s\S]|\[(?:[^\[\]\\]|\\[\s\S])*\])*\]/.source, /<(?:[^<>\\]|\\[\s\S]|<(?:[^<>\\]|\\[\s\S])*>)*>/.source].join('|') + ')';
  var symbolName = /(?:"(?:\\.|[^"\\\r\n])*"|(?:\b[a-zA-Z_]\w*|[^\s\0-\x7F]+)[?!]?|\$.)/.source;
  Prism.languages.insertBefore('ruby', 'keyword', {
    'regex-literal': [{
      pattern: RegExp(/%r/.source + percentExpression + /[egimnosux]{0,6}/.source),
      greedy: true,
      inside: {
        'interpolation': interpolation,
        'regex': /[\s\S]+/
      }
    }, {
      pattern: /(^|[^/])\/(?!\/)(?:\[[^\r\n\]]+\]|\\.|[^[/\\\r\n])+\/[egimnosux]{0,6}(?=\s*(?:$|[\r\n,.;})#]))/,
      lookbehind: true,
      greedy: true,
      inside: {
        'interpolation': interpolation,
        'regex': /[\s\S]+/
      }
    }],
    'variable': /[@$]+[a-zA-Z_]\w*(?:[?!]|\b)/,
    'symbol': [{
      pattern: RegExp(/(^|[^:]):/.source + symbolName),
      lookbehind: true,
      greedy: true
    }, {
      pattern: RegExp(/([\r\n{(,][ \t]*)/.source + symbolName + /(?=:(?!:))/.source),
      lookbehind: true,
      greedy: true
    }],
    'method-definition': {
      pattern: /(\bdef\s+)\w+(?:\s*\.\s*\w+)?/,
      lookbehind: true,
      inside: {
        'function': /\b\w+$/,
        'keyword': /^self\b/,
        'class-name': /^\w+/,
        'punctuation': /\./
      }
    }
  });
  Prism.languages.insertBefore('ruby', 'string', {
    'string-literal': [{
      pattern: RegExp(/%[qQiIwWs]?/.source + percentExpression),
      greedy: true,
      inside: {
        'interpolation': interpolation,
        'string': /[\s\S]+/
      }
    }, {
      pattern: /("|')(?:#\{[^}]+\}|#(?!\{)|\\(?:\r\n|[\s\S])|(?!\1)[^\\#\r\n])*\1/,
      greedy: true,
      inside: {
        'interpolation': interpolation,
        'string': /[\s\S]+/
      }
    }, {
      pattern: /<<[-~]?([a-z_]\w*)[\r\n](?:.*[\r\n])*?[\t ]*\1/i,
      alias: 'heredoc-string',
      greedy: true,
      inside: {
        'delimiter': {
          pattern: /^<<[-~]?[a-z_]\w*|\b[a-z_]\w*$/i,
          inside: {
            'symbol': /\b\w+/,
            'punctuation': /^<<[-~]?/
          }
        },
        'interpolation': interpolation,
        'string': /[\s\S]+/
      }
    }, {
      pattern: /<<[-~]?'([a-z_]\w*)'[\r\n](?:.*[\r\n])*?[\t ]*\1/i,
      alias: 'heredoc-string',
      greedy: true,
      inside: {
        'delimiter': {
          pattern: /^<<[-~]?'[a-z_]\w*'|\b[a-z_]\w*$/i,
          inside: {
            'symbol': /\b\w+/,
            'punctuation': /^<<[-~]?'|'$/
          }
        },
        'string': /[\s\S]+/
      }
    }],
    'command-literal': [{
      pattern: RegExp(/%x/.source + percentExpression),
      greedy: true,
      inside: {
        'interpolation': interpolation,
        'command': {
          pattern: /[\s\S]+/,
          alias: 'string'
        }
      }
    }, {
      pattern: /`(?:#\{[^}]+\}|#(?!\{)|\\(?:\r\n|[\s\S])|[^\\`#\r\n])*`/,
      greedy: true,
      inside: {
        'interpolation': interpolation,
        'command': {
          pattern: /[\s\S]+/,
          alias: 'string'
        }
      }
    }]
  });
  delete Prism.languages.ruby.string;
  Prism.languages.insertBefore('ruby', 'number', {
    'builtin': /\b(?:Array|Bignum|Binding|Class|Continuation|Dir|Exception|FalseClass|File|Fixnum|Float|Hash|IO|Integer|MatchData|Method|Module|NilClass|Numeric|Object|Proc|Range|Regexp|Stat|String|Struct|Symbol|TMS|Thread|ThreadGroup|Time|TrueClass)\b/,
    'constant': /\b[A-Z][A-Z0-9_]*(?:[?!]|\b)/
  });
  Prism.languages.rb = Prism.languages.ruby;
})(Prism);
(function (Prism) {
  var multilineComment = /\/\*(?:[^*/]|\*(?!\/)|\/(?!\*)|<self>)*\*\//.source;
  for (var i = 0; i < 2; i++) {
    // support 4 levels of nested comments
    multilineComment = multilineComment.replace(/<self>/g, function () {
      return multilineComment;
    });
  }
  multilineComment = multilineComment.replace(/<self>/g, function () {
    return /[^\s\S]/.source;
  });
  Prism.languages.rust = {
    'comment': [{
      pattern: RegExp(/(^|[^\\])/.source + multilineComment),
      lookbehind: true,
      greedy: true
    }, {
      pattern: /(^|[^\\:])\/\/.*/,
      lookbehind: true,
      greedy: true
    }],
    'string': {
      pattern: /b?"(?:\\[\s\S]|[^\\"])*"|b?r(#*)"(?:[^"]|"(?!\1))*"\1/,
      greedy: true
    },
    'char': {
      pattern: /b?'(?:\\(?:x[0-7][\da-fA-F]|u\{(?:[\da-fA-F]_*){1,6}\}|.)|[^\\\r\n\t'])'/,
      greedy: true
    },
    'attribute': {
      pattern: /#!?\[(?:[^\[\]"]|"(?:\\[\s\S]|[^\\"])*")*\]/,
      greedy: true,
      alias: 'attr-name',
      inside: {
        'string': null // see below
      }
    },

    // Closure params should not be confused with bitwise OR |
    'closure-params': {
      pattern: /([=(,:]\s*|\bmove\s*)\|[^|]*\||\|[^|]*\|(?=\s*(?:\{|->))/,
      lookbehind: true,
      greedy: true,
      inside: {
        'closure-punctuation': {
          pattern: /^\||\|$/,
          alias: 'punctuation'
        },
        rest: null // see below
      }
    },

    'lifetime-annotation': {
      pattern: /'\w+/,
      alias: 'symbol'
    },
    'fragment-specifier': {
      pattern: /(\$\w+:)[a-z]+/,
      lookbehind: true,
      alias: 'punctuation'
    },
    'variable': /\$\w+/,
    'function-definition': {
      pattern: /(\bfn\s+)\w+/,
      lookbehind: true,
      alias: 'function'
    },
    'type-definition': {
      pattern: /(\b(?:enum|struct|trait|type|union)\s+)\w+/,
      lookbehind: true,
      alias: 'class-name'
    },
    'module-declaration': [{
      pattern: /(\b(?:crate|mod)\s+)[a-z][a-z_\d]*/,
      lookbehind: true,
      alias: 'namespace'
    }, {
      pattern: /(\b(?:crate|self|super)\s*)::\s*[a-z][a-z_\d]*\b(?:\s*::(?:\s*[a-z][a-z_\d]*\s*::)*)?/,
      lookbehind: true,
      alias: 'namespace',
      inside: {
        'punctuation': /::/
      }
    }],
    'keyword': [
    // https://github.com/rust-lang/reference/blob/master/src/keywords.md
    /\b(?:Self|abstract|as|async|await|become|box|break|const|continue|crate|do|dyn|else|enum|extern|final|fn|for|if|impl|in|let|loop|macro|match|mod|move|mut|override|priv|pub|ref|return|self|static|struct|super|trait|try|type|typeof|union|unsafe|unsized|use|virtual|where|while|yield)\b/,
    // primitives and str
    // https://doc.rust-lang.org/stable/rust-by-example/primitives.html
    /\b(?:bool|char|f(?:32|64)|[ui](?:8|16|32|64|128|size)|str)\b/],
    // functions can technically start with an upper-case letter, but this will introduce a lot of false positives
    // and Rust's naming conventions recommend snake_case anyway.
    // https://doc.rust-lang.org/1.0.0/style/style/naming/README.html
    'function': /\b[a-z_]\w*(?=\s*(?:::\s*<|\())/,
    'macro': {
      pattern: /\b\w+!/,
      alias: 'property'
    },
    'constant': /\b[A-Z_][A-Z_\d]+\b/,
    'class-name': /\b[A-Z]\w*\b/,
    'namespace': {
      pattern: /(?:\b[a-z][a-z_\d]*\s*::\s*)*\b[a-z][a-z_\d]*\s*::(?!\s*<)/,
      inside: {
        'punctuation': /::/
      }
    },
    // Hex, oct, bin, dec numbers with visual separators and type suffix
    'number': /\b(?:0x[\dA-Fa-f](?:_?[\dA-Fa-f])*|0o[0-7](?:_?[0-7])*|0b[01](?:_?[01])*|(?:(?:\d(?:_?\d)*)?\.)?\d(?:_?\d)*(?:[Ee][+-]?\d+)?)(?:_?(?:f32|f64|[iu](?:8|16|32|64|size)?))?\b/,
    'boolean': /\b(?:false|true)\b/,
    'punctuation': /->|\.\.=|\.{1,3}|::|[{}[\];(),:]/,
    'operator': /[-+*\/%!^]=?|=[=>]?|&[&=]?|\|[|=]?|<<?=?|>>?=?|[@?]/
  };
  Prism.languages.rust['closure-params'].inside.rest = Prism.languages.rust;
  Prism.languages.rust['attribute'].inside['string'] = Prism.languages.rust['string'];
})(Prism);
(function (Prism) {
  Prism.languages.sass = Prism.languages.extend('css', {
    // Sass comments don't need to be closed, only indented
    'comment': {
      pattern: /^([ \t]*)\/[\/*].*(?:(?:\r?\n|\r)\1[ \t].+)*/m,
      lookbehind: true,
      greedy: true
    }
  });
  Prism.languages.insertBefore('sass', 'atrule', {
    // We want to consume the whole line
    'atrule-line': {
      // Includes support for = and + shortcuts
      pattern: /^(?:[ \t]*)[@+=].+/m,
      greedy: true,
      inside: {
        'atrule': /(?:@[\w-]+|[+=])/
      }
    }
  });
  delete Prism.languages.sass.atrule;
  var variable = /\$[-\w]+|#\{\$[-\w]+\}/;
  var operator = [/[+*\/%]|[=!]=|<=?|>=?|\b(?:and|not|or)\b/, {
    pattern: /(\s)-(?=\s)/,
    lookbehind: true
  }];
  Prism.languages.insertBefore('sass', 'property', {
    // We want to consume the whole line
    'variable-line': {
      pattern: /^[ \t]*\$.+/m,
      greedy: true,
      inside: {
        'punctuation': /:/,
        'variable': variable,
        'operator': operator
      }
    },
    // We want to consume the whole line
    'property-line': {
      pattern: /^[ \t]*(?:[^:\s]+ *:.*|:[^:\s].*)/m,
      greedy: true,
      inside: {
        'property': [/[^:\s]+(?=\s*:)/, {
          pattern: /(:)[^:\s]+/,
          lookbehind: true
        }],
        'punctuation': /:/,
        'variable': variable,
        'operator': operator,
        'important': Prism.languages.sass.important
      }
    }
  });
  delete Prism.languages.sass.property;
  delete Prism.languages.sass.important;

  // Now that whole lines for other patterns are consumed,
  // what's left should be selectors
  Prism.languages.insertBefore('sass', 'punctuation', {
    'selector': {
      pattern: /^([ \t]*)\S(?:,[^,\r\n]+|[^,\r\n]*)(?:,[^,\r\n]+)*(?:,(?:\r?\n|\r)\1[ \t]+\S(?:,[^,\r\n]+|[^,\r\n]*)(?:,[^,\r\n]+)*)*/m,
      lookbehind: true,
      greedy: true
    }
  });
})(Prism);
Prism.languages.scss = Prism.languages.extend('css', {
  'comment': {
    pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|\/\/.*)/,
    lookbehind: true
  },
  'atrule': {
    pattern: /@[\w-](?:\([^()]+\)|[^()\s]|\s+(?!\s))*?(?=\s+[{;])/,
    inside: {
      'rule': /@[\w-]+/
      // See rest below
    }
  },

  // url, compassified
  'url': /(?:[-a-z]+-)?url(?=\()/i,
  // CSS selector regex is not appropriate for Sass
  // since there can be lot more things (var, @ directive, nesting..)
  // a selector must start at the end of a property or after a brace (end of other rules or nesting)
  // it can contain some characters that aren't used for defining rules or end of selector, & (parent selector), or interpolated variable
  // the end of a selector is found when there is no rules in it ( {} or {\s}) or if there is a property (because an interpolated var
  // can "pass" as a selector- e.g: proper#{$erty})
  // this one was hard to do, so please be careful if you edit this one :)
  'selector': {
    // Initial look-ahead is used to prevent matching of blank selectors
    pattern: /(?=\S)[^@;{}()]?(?:[^@;{}()\s]|\s+(?!\s)|#\{\$[-\w]+\})+(?=\s*\{(?:\}|\s|[^}][^:{}]*[:{][^}]))/,
    inside: {
      'parent': {
        pattern: /&/,
        alias: 'important'
      },
      'placeholder': /%[-\w]+/,
      'variable': /\$[-\w]+|#\{\$[-\w]+\}/
    }
  },
  'property': {
    pattern: /(?:[-\w]|\$[-\w]|#\{\$[-\w]+\})+(?=\s*:)/,
    inside: {
      'variable': /\$[-\w]+|#\{\$[-\w]+\}/
    }
  }
});
Prism.languages.insertBefore('scss', 'atrule', {
  'keyword': [/@(?:content|debug|each|else(?: if)?|extend|for|forward|function|if|import|include|mixin|return|use|warn|while)\b/i, {
    pattern: /( )(?:from|through)(?= )/,
    lookbehind: true
  }]
});
Prism.languages.insertBefore('scss', 'important', {
  // var and interpolated vars
  'variable': /\$[-\w]+|#\{\$[-\w]+\}/
});
Prism.languages.insertBefore('scss', 'function', {
  'module-modifier': {
    pattern: /\b(?:as|hide|show|with)\b/i,
    alias: 'keyword'
  },
  'placeholder': {
    pattern: /%[-\w]+/,
    alias: 'selector'
  },
  'statement': {
    pattern: /\B!(?:default|optional)\b/i,
    alias: 'keyword'
  },
  'boolean': /\b(?:false|true)\b/,
  'null': {
    pattern: /\bnull\b/,
    alias: 'keyword'
  },
  'operator': {
    pattern: /(\s)(?:[-+*\/%]|[=!]=|<=?|>=?|and|not|or)(?=\s)/,
    lookbehind: true
  }
});
Prism.languages.scss['atrule'].inside.rest = Prism.languages.scss;
Prism.languages.sql = {
  'comment': {
    pattern: /(^|[^\\])(?:\/\*[\s\S]*?\*\/|(?:--|\/\/|#).*)/,
    lookbehind: true
  },
  'variable': [{
    pattern: /@(["'`])(?:\\[\s\S]|(?!\1)[^\\])+\1/,
    greedy: true
  }, /@[\w.$]+/],
  'string': {
    pattern: /(^|[^@\\])("|')(?:\\[\s\S]|(?!\2)[^\\]|\2\2)*\2/,
    greedy: true,
    lookbehind: true
  },
  'identifier': {
    pattern: /(^|[^@\\])`(?:\\[\s\S]|[^`\\]|``)*`/,
    greedy: true,
    lookbehind: true,
    inside: {
      'punctuation': /^`|`$/
    }
  },
  'function': /\b(?:AVG|COUNT|FIRST|FORMAT|LAST|LCASE|LEN|MAX|MID|MIN|MOD|NOW|ROUND|SUM|UCASE)(?=\s*\()/i,
  // Should we highlight user defined functions too?
  'keyword': /\b(?:ACTION|ADD|AFTER|ALGORITHM|ALL|ALTER|ANALYZE|ANY|APPLY|AS|ASC|AUTHORIZATION|AUTO_INCREMENT|BACKUP|BDB|BEGIN|BERKELEYDB|BIGINT|BINARY|BIT|BLOB|BOOL|BOOLEAN|BREAK|BROWSE|BTREE|BULK|BY|CALL|CASCADED?|CASE|CHAIN|CHAR(?:ACTER|SET)?|CHECK(?:POINT)?|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMNS?|COMMENT|COMMIT(?:TED)?|COMPUTE|CONNECT|CONSISTENT|CONSTRAINT|CONTAINS(?:TABLE)?|CONTINUE|CONVERT|CREATE|CROSS|CURRENT(?:_DATE|_TIME|_TIMESTAMP|_USER)?|CURSOR|CYCLE|DATA(?:BASES?)?|DATE(?:TIME)?|DAY|DBCC|DEALLOCATE|DEC|DECIMAL|DECLARE|DEFAULT|DEFINER|DELAYED|DELETE|DELIMITERS?|DENY|DESC|DESCRIBE|DETERMINISTIC|DISABLE|DISCARD|DISK|DISTINCT|DISTINCTROW|DISTRIBUTED|DO|DOUBLE|DROP|DUMMY|DUMP(?:FILE)?|DUPLICATE|ELSE(?:IF)?|ENABLE|ENCLOSED|END|ENGINE|ENUM|ERRLVL|ERRORS|ESCAPED?|EXCEPT|EXEC(?:UTE)?|EXISTS|EXIT|EXPLAIN|EXTENDED|FETCH|FIELDS|FILE|FILLFACTOR|FIRST|FIXED|FLOAT|FOLLOWING|FOR(?: EACH ROW)?|FORCE|FOREIGN|FREETEXT(?:TABLE)?|FROM|FULL|FUNCTION|GEOMETRY(?:COLLECTION)?|GLOBAL|GOTO|GRANT|GROUP|HANDLER|HASH|HAVING|HOLDLOCK|HOUR|IDENTITY(?:COL|_INSERT)?|IF|IGNORE|IMPORT|INDEX|INFILE|INNER|INNODB|INOUT|INSERT|INT|INTEGER|INTERSECT|INTERVAL|INTO|INVOKER|ISOLATION|ITERATE|JOIN|KEYS?|KILL|LANGUAGE|LAST|LEAVE|LEFT|LEVEL|LIMIT|LINENO|LINES|LINESTRING|LOAD|LOCAL|LOCK|LONG(?:BLOB|TEXT)|LOOP|MATCH(?:ED)?|MEDIUM(?:BLOB|INT|TEXT)|MERGE|MIDDLEINT|MINUTE|MODE|MODIFIES|MODIFY|MONTH|MULTI(?:LINESTRING|POINT|POLYGON)|NATIONAL|NATURAL|NCHAR|NEXT|NO|NONCLUSTERED|NULLIF|NUMERIC|OFF?|OFFSETS?|ON|OPEN(?:DATASOURCE|QUERY|ROWSET)?|OPTIMIZE|OPTION(?:ALLY)?|ORDER|OUT(?:ER|FILE)?|OVER|PARTIAL|PARTITION|PERCENT|PIVOT|PLAN|POINT|POLYGON|PRECEDING|PRECISION|PREPARE|PREV|PRIMARY|PRINT|PRIVILEGES|PROC(?:EDURE)?|PUBLIC|PURGE|QUICK|RAISERROR|READS?|REAL|RECONFIGURE|REFERENCES|RELEASE|RENAME|REPEAT(?:ABLE)?|REPLACE|REPLICATION|REQUIRE|RESIGNAL|RESTORE|RESTRICT|RETURN(?:ING|S)?|REVOKE|RIGHT|ROLLBACK|ROUTINE|ROW(?:COUNT|GUIDCOL|S)?|RTREE|RULE|SAVE(?:POINT)?|SCHEMA|SECOND|SELECT|SERIAL(?:IZABLE)?|SESSION(?:_USER)?|SET(?:USER)?|SHARE|SHOW|SHUTDOWN|SIMPLE|SMALLINT|SNAPSHOT|SOME|SONAME|SQL|START(?:ING)?|STATISTICS|STATUS|STRIPED|SYSTEM_USER|TABLES?|TABLESPACE|TEMP(?:ORARY|TABLE)?|TERMINATED|TEXT(?:SIZE)?|THEN|TIME(?:STAMP)?|TINY(?:BLOB|INT|TEXT)|TOP?|TRAN(?:SACTIONS?)?|TRIGGER|TRUNCATE|TSEQUAL|TYPES?|UNBOUNDED|UNCOMMITTED|UNDEFINED|UNION|UNIQUE|UNLOCK|UNPIVOT|UNSIGNED|UPDATE(?:TEXT)?|USAGE|USE|USER|USING|VALUES?|VAR(?:BINARY|CHAR|CHARACTER|YING)|VIEW|WAITFOR|WARNINGS|WHEN|WHERE|WHILE|WITH(?: ROLLUP|IN)?|WORK|WRITE(?:TEXT)?|YEAR)\b/i,
  'boolean': /\b(?:FALSE|NULL|TRUE)\b/i,
  'number': /\b0x[\da-f]+\b|\b\d+(?:\.\d*)?|\B\.\d+\b/i,
  'operator': /[-+*\/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?|\b(?:AND|BETWEEN|DIV|ILIKE|IN|IS|LIKE|NOT|OR|REGEXP|RLIKE|SOUNDS LIKE|XOR)\b/i,
  'punctuation': /[;[\]()`,.]/
};
Prism.languages.swift = {
  'comment': {
    // Nested comments are supported up to 2 levels
    pattern: /(^|[^\\:])(?:\/\/.*|\/\*(?:[^/*]|\/(?!\*)|\*(?!\/)|\/\*(?:[^*]|\*(?!\/))*\*\/)*\*\/)/,
    lookbehind: true,
    greedy: true
  },
  'string-literal': [
  // https://docs.swift.org/swift-book/LanguageGuide/StringsAndCharacters.html
  {
    pattern: RegExp(/(^|[^"#])/.source + '(?:'
    // single-line string
    + /"(?:\\(?:\((?:[^()]|\([^()]*\))*\)|\r\n|[^(])|[^\\\r\n"])*"/.source + '|'
    // multi-line string
    + /"""(?:\\(?:\((?:[^()]|\([^()]*\))*\)|[^(])|[^\\"]|"(?!""))*"""/.source + ')' + /(?!["#])/.source),
    lookbehind: true,
    greedy: true,
    inside: {
      'interpolation': {
        pattern: /(\\\()(?:[^()]|\([^()]*\))*(?=\))/,
        lookbehind: true,
        inside: null // see below
      },

      'interpolation-punctuation': {
        pattern: /^\)|\\\($/,
        alias: 'punctuation'
      },
      'punctuation': /\\(?=[\r\n])/,
      'string': /[\s\S]+/
    }
  }, {
    pattern: RegExp(/(^|[^"#])(#+)/.source + '(?:'
    // single-line string
    + /"(?:\\(?:#+\((?:[^()]|\([^()]*\))*\)|\r\n|[^#])|[^\\\r\n])*?"/.source + '|'
    // multi-line string
    + /"""(?:\\(?:#+\((?:[^()]|\([^()]*\))*\)|[^#])|[^\\])*?"""/.source + ')' + '\\2'),
    lookbehind: true,
    greedy: true,
    inside: {
      'interpolation': {
        pattern: /(\\#+\()(?:[^()]|\([^()]*\))*(?=\))/,
        lookbehind: true,
        inside: null // see below
      },

      'interpolation-punctuation': {
        pattern: /^\)|\\#+\($/,
        alias: 'punctuation'
      },
      'string': /[\s\S]+/
    }
  }],
  'directive': {
    // directives with conditions
    pattern: RegExp(/#/.source + '(?:' + (/(?:elseif|if)\b/.source + '(?:[ \t]*'
    // This regex is a little complex. It's equivalent to this:
    //   (?:![ \t]*)?(?:\b\w+\b(?:[ \t]*<round>)?|<round>)(?:[ \t]*(?:&&|\|\|))?
    // where <round> is a general parentheses expression.
    + /(?:![ \t]*)?(?:\b\w+\b(?:[ \t]*\((?:[^()]|\([^()]*\))*\))?|\((?:[^()]|\([^()]*\))*\))(?:[ \t]*(?:&&|\|\|))?/.source + ')+') + '|' + /(?:else|endif)\b/.source + ')'),
    alias: 'property',
    inside: {
      'directive-name': /^#\w+/,
      'boolean': /\b(?:false|true)\b/,
      'number': /\b\d+(?:\.\d+)*\b/,
      'operator': /!|&&|\|\||[<>]=?/,
      'punctuation': /[(),]/
    }
  },
  'literal': {
    pattern: /#(?:colorLiteral|column|dsohandle|file(?:ID|Literal|Path)?|function|imageLiteral|line)\b/,
    alias: 'constant'
  },
  'other-directive': {
    pattern: /#\w+\b/,
    alias: 'property'
  },
  'attribute': {
    pattern: /@\w+/,
    alias: 'atrule'
  },
  'function-definition': {
    pattern: /(\bfunc\s+)\w+/,
    lookbehind: true,
    alias: 'function'
  },
  'label': {
    // https://docs.swift.org/swift-book/LanguageGuide/ControlFlow.html#ID141
    pattern: /\b(break|continue)\s+\w+|\b[a-zA-Z_]\w*(?=\s*:\s*(?:for|repeat|while)\b)/,
    lookbehind: true,
    alias: 'important'
  },
  'keyword': /\b(?:Any|Protocol|Self|Type|actor|as|assignment|associatedtype|associativity|async|await|break|case|catch|class|continue|convenience|default|defer|deinit|didSet|do|dynamic|else|enum|extension|fallthrough|fileprivate|final|for|func|get|guard|higherThan|if|import|in|indirect|infix|init|inout|internal|is|isolated|lazy|left|let|lowerThan|mutating|none|nonisolated|nonmutating|open|operator|optional|override|postfix|precedencegroup|prefix|private|protocol|public|repeat|required|rethrows|return|right|safe|self|set|some|static|struct|subscript|super|switch|throw|throws|try|typealias|unowned|unsafe|var|weak|where|while|willSet)\b/,
  'boolean': /\b(?:false|true)\b/,
  'nil': {
    pattern: /\bnil\b/,
    alias: 'constant'
  },
  'short-argument': /\$\d+\b/,
  'omit': {
    pattern: /\b_\b/,
    alias: 'keyword'
  },
  'number': /\b(?:[\d_]+(?:\.[\de_]+)?|0x[a-f0-9_]+(?:\.[a-f0-9p_]+)?|0b[01_]+|0o[0-7_]+)\b/i,
  // A class name must start with an upper-case letter and be either 1 letter long or contain a lower-case letter.
  'class-name': /\b[A-Z](?:[A-Z_\d]*[a-z]\w*)?\b/,
  'function': /\b[a-z_]\w*(?=\s*\()/i,
  'constant': /\b(?:[A-Z_]{2,}|k[A-Z][A-Za-z_]+)\b/,
  // Operators are generic in Swift. Developers can even create new operators (e.g. +++).
  // https://docs.swift.org/swift-book/ReferenceManual/zzSummaryOfTheGrammar.html#ID481
  // This regex only supports ASCII operators.
  'operator': /[-+*/%=!<>&|^~?]+|\.[.\-+*/%=!<>&|^~?]+/,
  'punctuation': /[{}[\]();,.:\\]/
};
Prism.languages.swift['string-literal'].forEach(function (rule) {
  rule.inside['interpolation'].inside = Prism.languages.swift;
});
(function (Prism) {
  Prism.languages.typescript = Prism.languages.extend('javascript', {
    'class-name': {
      pattern: /(\b(?:class|extends|implements|instanceof|interface|new|type)\s+)(?!keyof\b)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?:\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>)?/,
      lookbehind: true,
      greedy: true,
      inside: null // see below
    },

    'builtin': /\b(?:Array|Function|Promise|any|boolean|console|never|number|string|symbol|unknown)\b/
  });

  // The keywords TypeScript adds to JavaScript
  Prism.languages.typescript.keyword.push(/\b(?:abstract|declare|is|keyof|readonly|require)\b/,
  // keywords that have to be followed by an identifier
  /\b(?:asserts|infer|interface|module|namespace|type)\b(?=\s*(?:[{_$a-zA-Z\xA0-\uFFFF]|$))/,
  // This is for `import type *, {}`
  /\btype\b(?=\s*(?:[\{*]|$))/);

  // doesn't work with TS because TS is too complex
  delete Prism.languages.typescript['parameter'];
  delete Prism.languages.typescript['literal-property'];

  // a version of typescript specifically for highlighting types
  var typeInside = Prism.languages.extend('typescript', {});
  delete typeInside['class-name'];
  Prism.languages.typescript['class-name'].inside = typeInside;
  Prism.languages.insertBefore('typescript', 'function', {
    'decorator': {
      pattern: /@[$\w\xA0-\uFFFF]+/,
      inside: {
        'at': {
          pattern: /^@/,
          alias: 'operator'
        },
        'function': /^[\s\S]+/
      }
    },
    'generic-function': {
      // e.g. foo<T extends "bar" | "baz">( ...
      pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*<(?:[^<>]|<(?:[^<>]|<[^<>]*>)*>)*>(?=\s*\()/,
      greedy: true,
      inside: {
        'function': /^#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*/,
        'generic': {
          pattern: /<[\s\S]+/,
          // everything after the first <
          alias: 'class-name',
          inside: typeInside
        }
      }
    }
  });
  Prism.languages.ts = Prism.languages.typescript;
})(Prism);
(function (Prism) {
  var typescript = Prism.util.clone(Prism.languages.typescript);
  Prism.languages.tsx = Prism.languages.extend('jsx', typescript);

  // doesn't work with TS because TS is too complex
  delete Prism.languages.tsx['parameter'];
  delete Prism.languages.tsx['literal-property'];

  // This will prevent collisions between TSX tags and TS generic types.
  // Idea by https://github.com/karlhorky
  // Discussion: https://github.com/PrismJS/prism/issues/2594#issuecomment-710666928
  var tag = Prism.languages.tsx.tag;
  tag.pattern = RegExp(/(^|[^\w$]|(?=<\/))/.source + '(?:' + tag.pattern.source + ')', tag.pattern.flags);
  tag.lookbehind = true;
})(Prism);
Prism.languages.basic = {
  'comment': {
    pattern: /(?:!|REM\b).+/i,
    inside: {
      'keyword': /^REM/i
    }
  },
  'string': {
    pattern: /"(?:""|[!#$%&'()*,\/:;<=>?^\w +\-.])*"/,
    greedy: true
  },
  'number': /(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:E[+-]?\d+)?/i,
  'keyword': /\b(?:AS|BEEP|BLOAD|BSAVE|CALL(?: ABSOLUTE)?|CASE|CHAIN|CHDIR|CLEAR|CLOSE|CLS|COM|COMMON|CONST|DATA|DECLARE|DEF(?: FN| SEG|DBL|INT|LNG|SNG|STR)|DIM|DO|DOUBLE|ELSE|ELSEIF|END|ENVIRON|ERASE|ERROR|EXIT|FIELD|FILES|FOR|FUNCTION|GET|GOSUB|GOTO|IF|INPUT|INTEGER|IOCTL|KEY|KILL|LINE INPUT|LOCATE|LOCK|LONG|LOOP|LSET|MKDIR|NAME|NEXT|OFF|ON(?: COM| ERROR| KEY| TIMER)?|OPEN|OPTION BASE|OUT|POKE|PUT|READ|REDIM|REM|RESTORE|RESUME|RETURN|RMDIR|RSET|RUN|SELECT CASE|SHARED|SHELL|SINGLE|SLEEP|STATIC|STEP|STOP|STRING|SUB|SWAP|SYSTEM|THEN|TIMER|TO|TROFF|TRON|TYPE|UNLOCK|UNTIL|USING|VIEW PRINT|WAIT|WEND|WHILE|WRITE)(?:\$|\b)/i,
  'function': /\b(?:ABS|ACCESS|ACOS|ANGLE|AREA|ARITHMETIC|ARRAY|ASIN|ASK|AT|ATN|BASE|BEGIN|BREAK|CAUSE|CEIL|CHR|CLIP|COLLATE|COLOR|CON|COS|COSH|COT|CSC|DATE|DATUM|DEBUG|DECIMAL|DEF|DEG|DEGREES|DELETE|DET|DEVICE|DISPLAY|DOT|ELAPSED|EPS|ERASABLE|EXLINE|EXP|EXTERNAL|EXTYPE|FILETYPE|FIXED|FP|GO|GRAPH|HANDLER|IDN|IMAGE|IN|INT|INTERNAL|IP|IS|KEYED|LBOUND|LCASE|LEFT|LEN|LENGTH|LET|LINE|LINES|LOG|LOG10|LOG2|LTRIM|MARGIN|MAT|MAX|MAXNUM|MID|MIN|MISSING|MOD|NATIVE|NUL|NUMERIC|OF|OPTION|ORD|ORGANIZATION|OUTIN|OUTPUT|PI|POINT|POINTER|POINTS|POS|PRINT|PROGRAM|PROMPT|RAD|RADIANS|RANDOMIZE|RECORD|RECSIZE|RECTYPE|RELATIVE|REMAINDER|REPEAT|REST|RETRY|REWRITE|RIGHT|RND|ROUND|RTRIM|SAME|SEC|SELECT|SEQUENTIAL|SET|SETTER|SGN|SIN|SINH|SIZE|SKIP|SQR|STANDARD|STATUS|STR|STREAM|STYLE|TAB|TAN|TANH|TEMPLATE|TEXT|THERE|TIME|TIMEOUT|TRACE|TRANSFORM|TRUNCATE|UBOUND|UCASE|USE|VAL|VARIABLE|VIEWPORT|WHEN|WINDOW|WITH|ZER|ZONEWIDTH)(?:\$|\b)/i,
  'operator': /<[=>]?|>=?|[+\-*\/^=&]|\b(?:AND|EQV|IMP|NOT|OR|XOR)\b/i,
  'punctuation': /[,;:()]/
};
Prism.languages.vbnet = Prism.languages.extend('basic', {
  'comment': [{
    pattern: /(?:!|REM\b).+/i,
    inside: {
      'keyword': /^REM/i
    }
  }, {
    pattern: /(^|[^\\:])'.*/,
    lookbehind: true,
    greedy: true
  }],
  'string': {
    pattern: /(^|[^"])"(?:""|[^"])*"(?!")/,
    lookbehind: true,
    greedy: true
  },
  'keyword': /(?:\b(?:ADDHANDLER|ADDRESSOF|ALIAS|AND|ANDALSO|AS|BEEP|BLOAD|BOOLEAN|BSAVE|BYREF|BYTE|BYVAL|CALL(?: ABSOLUTE)?|CASE|CATCH|CBOOL|CBYTE|CCHAR|CDATE|CDBL|CDEC|CHAIN|CHAR|CHDIR|CINT|CLASS|CLEAR|CLNG|CLOSE|CLS|COBJ|COM|COMMON|CONST|CONTINUE|CSBYTE|CSHORT|CSNG|CSTR|CTYPE|CUINT|CULNG|CUSHORT|DATA|DATE|DECIMAL|DECLARE|DEF(?: FN| SEG|DBL|INT|LNG|SNG|STR)|DEFAULT|DELEGATE|DIM|DIRECTCAST|DO|DOUBLE|ELSE|ELSEIF|END|ENUM|ENVIRON|ERASE|ERROR|EVENT|EXIT|FALSE|FIELD|FILES|FINALLY|FOR(?: EACH)?|FRIEND|FUNCTION|GET|GETTYPE|GETXMLNAMESPACE|GLOBAL|GOSUB|GOTO|HANDLES|IF|IMPLEMENTS|IMPORTS|IN|INHERITS|INPUT|INTEGER|INTERFACE|IOCTL|IS|ISNOT|KEY|KILL|LET|LIB|LIKE|LINE INPUT|LOCATE|LOCK|LONG|LOOP|LSET|ME|MKDIR|MOD|MODULE|MUSTINHERIT|MUSTOVERRIDE|MYBASE|MYCLASS|NAME|NAMESPACE|NARROWING|NEW|NEXT|NOT|NOTHING|NOTINHERITABLE|NOTOVERRIDABLE|OBJECT|OF|OFF|ON(?: COM| ERROR| KEY| TIMER)?|OPEN|OPERATOR|OPTION(?: BASE)?|OPTIONAL|OR|ORELSE|OUT|OVERLOADS|OVERRIDABLE|OVERRIDES|PARAMARRAY|PARTIAL|POKE|PRIVATE|PROPERTY|PROTECTED|PUBLIC|PUT|RAISEEVENT|READ|READONLY|REDIM|REM|REMOVEHANDLER|RESTORE|RESUME|RETURN|RMDIR|RSET|RUN|SBYTE|SELECT(?: CASE)?|SET|SHADOWS|SHARED|SHELL|SHORT|SINGLE|SLEEP|STATIC|STEP|STOP|STRING|STRUCTURE|SUB|SWAP|SYNCLOCK|SYSTEM|THEN|THROW|TIMER|TO|TROFF|TRON|TRUE|TRY|TRYCAST|TYPE|TYPEOF|UINTEGER|ULONG|UNLOCK|UNTIL|USHORT|USING|VIEW PRINT|WAIT|WEND|WHEN|WHILE|WIDENING|WITH|WITHEVENTS|WRITE|WRITEONLY|XOR)|\B(?:#CONST|#ELSE|#ELSEIF|#END|#IF))(?:\$|\b)/i,
  'punctuation': /[,;:(){}]/
});

const languages = [{
  label: 'C',
  value: 'c'
}, {
  label: 'C++',
  value: 'cpp'
}, {
  label: 'Arduino',
  value: 'arduino'
}, {
  label: 'Bash',
  value: 'bash'
}, {
  label: 'C#',
  value: 'csharp'
}, {
  label: 'CSS',
  value: 'css'
}, {
  label: 'Diff',
  value: 'diff'
}, {
  label: 'Go',
  value: 'go'
}, {
  label: 'INI',
  value: 'ini'
}, {
  label: 'Java',
  value: 'java'
}, {
  label: 'JavaScript',
  value: 'javascript'
}, {
  label: 'JSX',
  value: 'jsx'
}, {
  label: 'JSON',
  value: 'json'
}, {
  label: 'Kotlin',
  value: 'kotlin'
}, {
  label: 'Less',
  value: 'less'
}, {
  label: 'Lua',
  value: 'lua'
}, {
  label: 'Makefile',
  value: 'makefile'
}, {
  label: 'Markdown',
  value: 'markdown'
}, {
  label: 'Objective-C',
  value: 'objectivec'
}, {
  label: 'Perl',
  value: 'perl'
}, {
  label: 'PHP',
  value: 'php'
}, {
  label: 'Python',
  value: 'python'
}, {
  label: 'R',
  value: 'r'
}, {
  label: 'Ruby',
  value: 'ruby'
}, {
  label: 'Rust',
  value: 'rust'
}, {
  label: 'Sass',
  value: 'sass'
}, {
  label: 'SCSS',
  value: 'scss'
}, {
  label: 'SQL',
  value: 'sql'
}, {
  label: 'Swift',
  value: 'swift'
}, {
  label: 'TypeScript',
  value: 'typescript'
}, {
  label: 'TSX',
  value: 'tsx'
}, {
  label: 'VB.NET',
  value: 'vbnet'
}, {
  label: 'YAML',
  value: 'yaml'
}];
const canonicalNameToLabel = new Map(languages.map(x => [x.value, x.label]));
const labelToCanonicalName = new Map(languages.map(x => [x.label, x.value]));
const languageToCanonicalName = new Map(languages.map(lang => [Prism.languages[lang.value], lang.value]));
const aliasesToCanonicalName = new Map(Object.keys(Prism.languages).flatMap(lang => {
  const canonicalName = languageToCanonicalName.get(Prism.languages[lang]);
  if (canonicalName === undefined) {
    return [];
  }
  return [[lang, canonicalName]];
}));
const languagesToAliases = new Map(languages.map(lang => [lang.value, []]));
for (const [alias, canonicalName] of aliasesToCanonicalName) {
  languagesToAliases.get(canonicalName).push(alias);
}
const languagesWithAliases = [{
  label: 'Plain text',
  value: 'plain',
  aliases: []
}, ...[...languagesToAliases].map(([canonicalName, aliases]) => ({
  label: canonicalNameToLabel.get(canonicalName),
  value: canonicalName,
  aliases
}))];
const aliasesToLabel = new Map([...aliasesToCanonicalName].map(([alias, canonicalName]) => [alias, canonicalNameToLabel.get(canonicalName)]));

const codeBlockShortcutPattern = /^```(\w+)? ?$/;
function withCodeBlock(documentFeatures, componentBlocks, editor) {
  const {
    insertBreak,
    normalizeNode,
    insertText
  } = editor;
  function codeBlockShortcut(block) {
    var _aliasesToCanonicalNa;
    if ((block === null || block === void 0 ? void 0 : block[0].type) !== 'paragraph' || block[0].children.length !== 1 || block[0].children[0].type !== undefined) {
      return false;
    }
    const match = codeBlockShortcutPattern.exec(block[0].children[0].text);
    if (!match) {
      return false;
    }
    const locationDocumentFeatures = getAncestorComponentChildFieldDocumentFeatures(editor, documentFeatures, componentBlocks);
    if (locationDocumentFeatures && (locationDocumentFeatures.kind === 'inline' || !locationDocumentFeatures.documentFeatures.formatting.blockTypes.code)) {
      return false;
    }

    // so that this starts a new undo group
    editor.history.undos.push({
      operations: [],
      selectionBefore: editor.selection
    });
    slate.Transforms.select(editor, block[1]);
    slate.Transforms.delete(editor);
    slate.Transforms.wrapNodes(editor, {
      type: 'code',
      ...(match[1] ? {
        language: (_aliasesToCanonicalNa = aliasesToCanonicalName.get(match[1].toLowerCase())) !== null && _aliasesToCanonicalNa !== void 0 ? _aliasesToCanonicalNa : match[1]
      } : {}),
      children: []
    }, {
      match: node => node.type === 'paragraph'
    });
    return true;
  }
  editor.insertBreak = () => {
    const block = slate.Editor.above(editor, {
      match: isBlock
    });
    if ((block === null || block === void 0 ? void 0 : block[0].type) === 'code' && slate.Text.isText(block[0].children[0])) {
      const text = block[0].children[0].text;
      if (text[text.length - 1] === '\n' && editor.selection && slate.Range.isCollapsed(editor.selection) && slate.Point.equals(slate.Editor.end(editor, block[1]), editor.selection.anchor)) {
        insertBreak();
        slate.Transforms.setNodes(editor, {
          type: 'paragraph',
          children: []
        });
        slate.Transforms.delete(editor, {
          distance: 1,
          at: {
            path: [...block[1], 0],
            offset: text.length - 1
          }
        });
        return;
      }
      editor.insertText('\n');
      return;
    }
    if (editor.selection && slate.Range.isCollapsed(editor.selection) && codeBlockShortcut(block)) {
      return;
    }
    insertBreak();
  };
  editor.insertText = text => {
    insertText(text);
    if (text === ' ' && editor.selection && slate.Range.isCollapsed(editor.selection)) {
      codeBlockShortcut(slate.Editor.above(editor, {
        match: isBlock
      }));
    }
  };
  editor.normalizeNode = ([node, path]) => {
    if (node.type === 'code' && slate.Element.isElement(node)) {
      for (const [index, childNode] of node.children.entries()) {
        if (!slate.Text.isText(childNode)) {
          if (editor.isVoid(childNode)) {
            slate.Transforms.removeNodes(editor, {
              at: [...path, index]
            });
          } else {
            slate.Transforms.unwrapNodes(editor, {
              at: [...path, index]
            });
          }
          return;
        }
        const marks = Object.keys(childNode).filter(x => x !== 'text');
        if (marks.length) {
          slate.Transforms.unsetNodes(editor, marks, {
            at: [...path, index]
          });
          return;
        }
      }
    }
    normalizeNode([node, path]);
  };
  return editor;
}

function findChildPropPathsForProp(value, schema, path) {
  switch (schema.kind) {
    case 'form':
      return [];
    case 'child':
      return [{
        path: path,
        options: schema.options
      }];
    case 'conditional':
      return findChildPropPathsForProp(value.value, schema.values[value.discriminant], path.concat('value'));
    case 'object':
      {
        const paths = [];
        Object.keys(schema.fields).forEach(key => {
          paths.push(...findChildPropPathsForProp(value[key], schema.fields[key], path.concat(key)));
        });
        return paths;
      }
    case 'array':
      {
        const paths = [];
        value.forEach((val, i) => {
          paths.push(...findChildPropPathsForProp(val, schema.element, path.concat(i)));
        });
        return paths;
      }
  }
}
function findChildPropPaths(value, props) {
  const propPaths = findChildPropPathsForProp(value, {
    kind: 'object',
    fields: props
  }, []);
  if (!propPaths.length) {
    return [{
      path: undefined,
      options: {
        kind: 'inline',
        placeholder: ''
      }
    }];
  }
  return propPaths;
}

function getAncestorComponentBlock(editor) {
  if (editor.selection) {
    const ancestorEntry = slate.Editor.above(editor, {
      match: node => isBlock(node) && node.type !== 'paragraph'
    });
    if (ancestorEntry && (ancestorEntry[0].type === 'component-block-prop' || ancestorEntry[0].type === 'component-inline-prop')) {
      return {
        isInside: true,
        componentBlock: slate.Editor.parent(editor, ancestorEntry[1]),
        prop: ancestorEntry
      };
    }
  }
  return {
    isInside: false
  };
}
const alreadyNormalizedThings = new WeakMap();
function normalizeNodeWithinComponentProp([node, path], editor, fieldOptions) {
  let alreadyNormalizedNodes = alreadyNormalizedThings.get(fieldOptions);
  if (!alreadyNormalizedNodes) {
    alreadyNormalizedNodes = new WeakSet();
    alreadyNormalizedThings.set(fieldOptions, alreadyNormalizedNodes);
  }
  if (alreadyNormalizedNodes.has(node)) {
    return false;
  }
  let didNormalization = false;
  if (fieldOptions.inlineMarks !== 'inherit' && slate.Text.isText(node)) {
    didNormalization = normalizeTextBasedOnInlineMarksAndSoftBreaks([node, path], editor, fieldOptions.inlineMarks, fieldOptions.softBreaks);
  }
  if (slate.Element.isElement(node)) {
    let childrenHasChanged = node.children.map((node, i) => normalizeNodeWithinComponentProp([node, [...path, i]], editor, fieldOptions))
    // .map then .some because we don't want to exit early
    .some(x => x);
    if (fieldOptions.kind === 'block') {
      if (node.type === 'component-block') {
        if (!fieldOptions.componentBlocks) {
          slate.Transforms.unwrapNodes(editor, {
            at: path
          });
          didNormalization = true;
        }
      } else {
        didNormalization = normalizeElementBasedOnDocumentFeatures([node, path], editor, fieldOptions.documentFeatures) || childrenHasChanged;
      }
    } else {
      didNormalization = normalizeInlineBasedOnLinks([node, path], editor, fieldOptions.documentFeatures.links);
    }
  }
  if (didNormalization === false) {
    alreadyNormalizedNodes.add(node);
  }
  return didNormalization;
}
function canSchemaContainChildField(rootSchema) {
  const queue = new Set([rootSchema]);
  for (const schema of queue) {
    if (schema.kind === 'form') ; else if (schema.kind === 'child') {
      return true;
    } else if (schema.kind === 'array') {
      queue.add(schema.element);
    } else if (schema.kind === 'object') {
      for (const innerProp of Object.values(schema.fields)) {
        queue.add(innerProp);
      }
    } else if (schema.kind === 'conditional') {
      for (const innerProp of Object.values(schema.values)) {
        queue.add(innerProp);
      }
    } else {
      emery.assertNever(schema);
    }
  }
  return false;
}
function doesSchemaOnlyEverContainASingleChildField(rootSchema) {
  const queue = new Set([rootSchema]);
  let hasFoundChildField = false;
  for (const schema of queue) {
    if (schema.kind === 'form') ; else if (schema.kind === 'child') {
      if (hasFoundChildField) {
        return false;
      }
      hasFoundChildField = true;
    } else if (schema.kind === 'array') {
      if (canSchemaContainChildField(schema.element)) {
        return false;
      }
    } else if (schema.kind === 'object') {
      for (const innerProp of Object.values(schema.fields)) {
        queue.add(innerProp);
      }
    } else if (schema.kind === 'conditional') {
      for (const innerProp of Object.values(schema.values)) {
        queue.add(innerProp);
      }
    } else {
      emery.assertNever(schema);
    }
  }
  return hasFoundChildField;
}
function findArrayFieldsWithSingleChildField(schema, value) {
  const propPaths = [];
  traverseProps(schema, value, (schema, value, path) => {
    if (schema.kind === 'array' && doesSchemaOnlyEverContainASingleChildField(schema.element)) {
      propPaths.push([path, schema]);
    }
  });
  return propPaths;
}
function isEmptyChildFieldNode(element) {
  const firstChild = element.children[0];
  return element.children.length === 1 && (element.type === 'component-inline-prop' && firstChild.type === undefined && firstChild.text === '' || element.type === 'component-block-prop' && firstChild.type === 'paragraph' && firstChild.children.length === 1 && firstChild.children[0].type === undefined && firstChild.children[0].text === '');
}
function withComponentBlocks(blockComponents, editorDocumentFeatures, editor) {
  // note that conflicts between the editor document features
  // and the child field document features are dealt with elsewhere
  const memoizedGetDocumentFeaturesForChildField = weakMemoize__default["default"](options => {
    return getDocumentFeaturesForChildField(editorDocumentFeatures, options);
  });
  const {
    normalizeNode,
    deleteBackward,
    insertBreak
  } = editor;
  editor.deleteBackward = unit => {
    if (editor.selection) {
      const ancestorComponentBlock = getAncestorComponentBlock(editor);
      if (ancestorComponentBlock.isInside && slate.Range.isCollapsed(editor.selection) && slate.Editor.isStart(editor, editor.selection.anchor, ancestorComponentBlock.prop[1]) && ancestorComponentBlock.prop[1][ancestorComponentBlock.prop[1].length - 1] === 0) {
        slate.Transforms.unwrapNodes(editor, {
          at: ancestorComponentBlock.componentBlock[1]
        });
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.insertBreak = () => {
    const ancestorComponentBlock = getAncestorComponentBlock(editor);
    if (editor.selection && ancestorComponentBlock.isInside) {
      const {
        prop: [componentPropNode, componentPropPath],
        componentBlock: [componentBlockNode, componentBlockPath]
      } = ancestorComponentBlock;
      const isLastProp = componentPropPath[componentPropPath.length - 1] === componentBlockNode.children.length - 1;
      if (componentPropNode.type === 'component-block-prop') {
        const [[paragraphNode, paragraphPath]] = slate.Editor.nodes(editor, {
          match: node => node.type === 'paragraph'
        });
        const isLastParagraph = paragraphPath[paragraphPath.length - 1] === componentPropNode.children.length - 1;
        if (slate.Node.string(paragraphNode) === '' && isLastParagraph) {
          if (isLastProp) {
            slate.Transforms.moveNodes(editor, {
              at: paragraphPath,
              to: slate.Path.next(ancestorComponentBlock.componentBlock[1])
            });
          } else {
            slate.Transforms.move(editor, {
              distance: 1,
              unit: 'line'
            });
            slate.Transforms.removeNodes(editor, {
              at: paragraphPath
            });
          }
          return;
        }
      }
      if (componentPropNode.type === 'component-inline-prop') {
        slate.Editor.withoutNormalizing(editor, () => {
          const componentBlock = blockComponents[componentBlockNode.component];
          if (componentPropNode.propPath !== undefined && componentBlock !== undefined) {
            const rootSchema = {
              kind: 'object',
              fields: componentBlock.schema
            };
            const ancestorFields = getAncestorSchemas(rootSchema, componentPropNode.propPath, componentBlockNode.props);
            const idx = [...ancestorFields].reverse().findIndex(item => item.kind === 'array');
            if (idx !== -1) {
              const arrayFieldIdx = ancestorFields.length - 1 - idx;
              const arrayField = ancestorFields[arrayFieldIdx];
              emery.assert(arrayField.kind === 'array');
              const val = getValueAtPropPath(componentBlockNode.props, componentPropNode.propPath.slice(0, arrayFieldIdx));
              if (doesSchemaOnlyEverContainASingleChildField(arrayField.element)) {
                if (slate.Node.string(componentPropNode) === '' && val.length - 1 === componentPropNode.propPath[arrayFieldIdx]) {
                  slate.Transforms.removeNodes(editor, {
                    at: componentPropPath
                  });
                  if (isLastProp) {
                    slate.Transforms.insertNodes(editor, {
                      type: 'paragraph',
                      children: [{
                        text: ''
                      }]
                    }, {
                      at: slate.Path.next(componentBlockPath)
                    });
                    slate.Transforms.select(editor, slate.Path.next(componentBlockPath));
                  } else {
                    slate.Transforms.move(editor, {
                      distance: 1,
                      unit: 'line'
                    });
                  }
                } else {
                  insertBreak();
                }
                return;
              }
            }
          }
          slate.Transforms.splitNodes(editor, {
            always: true
          });
          const splitNodePath = slate.Path.next(componentPropPath);
          if (isLastProp) {
            slate.Transforms.moveNodes(editor, {
              at: splitNodePath,
              to: slate.Path.next(componentBlockPath)
            });
          } else {
            moveChildren(editor, splitNodePath, [...slate.Path.next(splitNodePath), 0]);
            slate.Transforms.removeNodes(editor, {
              at: splitNodePath
            });
          }
        });
        return;
      }
    }
    insertBreak();
  };
  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (node.type === 'component-inline-prop' && !node.propPath && (node.children.length !== 1 || !slate.Text.isText(node.children[0]) || node.children[0].text !== '')) {
      slate.Transforms.removeNodes(editor, {
        at: path
      });
      return;
    }
    if (node.type === 'component-block') {
      const componentBlock = blockComponents[node.component];
      if (componentBlock) {
        const rootSchema = {
          kind: 'object',
          fields: componentBlock.schema
        };
        const updatedProps = addMissingFields(node.props, rootSchema);
        if (updatedProps !== node.props) {
          slate.Transforms.setNodes(editor, {
            props: updatedProps
          }, {
            at: path
          });
          return;
        }
        for (const [propPath, arrayField] of findArrayFieldsWithSingleChildField(rootSchema, node.props)) {
          if (node.children.length === 1 && node.children[0].type === 'component-inline-prop' && node.children[0].propPath === undefined) {
            break;
          }
          const nodesWithin = [];
          for (const [idx, childNode] of node.children.entries()) {
            if ((childNode.type === 'component-block-prop' || childNode.type === 'component-inline-prop') && childNode.propPath !== undefined) {
              const subPath = childNode.propPath.concat();
              while (subPath.length) {
                if (typeof subPath.pop() === 'number') break;
              }
              if (areArraysEqual(propPath, subPath)) {
                nodesWithin.push([idx, childNode]);
              }
            }
          }
          const arrVal = getValueAtPropPath(node.props, propPath);
          const prevKeys = getKeysForArrayValue(arrVal);
          const prevKeysSet = new Set(prevKeys);
          const alreadyUsedIndicies = new Set();
          const newVal = [];
          const newKeys = [];
          const getNewKey = () => {
            let key = getNewArrayElementKey();
            while (prevKeysSet.has(key)) {
              key = getNewArrayElementKey();
            }
            return key;
          };
          for (const [, node] of nodesWithin) {
            const idxFromValue = node.propPath[propPath.length];
            emery.assert(typeof idxFromValue === 'number');
            if (arrVal.length <= idxFromValue || alreadyUsedIndicies.has(idxFromValue) && isEmptyChildFieldNode(node)) {
              newVal.push(getInitialPropsValue(arrayField.element));
              newKeys.push(getNewKey());
            } else {
              alreadyUsedIndicies.add(idxFromValue);
              newVal.push(arrVal[idxFromValue]);
              newKeys.push(alreadyUsedIndicies.has(idxFromValue) ? getNewKey() : prevKeys[idxFromValue]);
            }
          }
          setKeysForArrayValue(newVal, newKeys);
          if (!areArraysEqual(arrVal, newVal)) {
            const transformedProps = replaceValueAtPropPath(rootSchema, node.props, newVal, propPath);
            slate.Transforms.setNodes(editor, {
              props: transformedProps
            }, {
              at: path
            });
            for (const [idx, [idxInChildrenOfBlock, nodeWithin]] of nodesWithin.entries()) {
              const newPropPath = [...nodeWithin.propPath];
              newPropPath[propPath.length] = idx;
              slate.Transforms.setNodes(editor, {
                propPath: newPropPath
              }, {
                at: [...path, idxInChildrenOfBlock]
              });
            }
            return;
          }
        }
        const missingKeys = new Map(findChildPropPaths(node.props, componentBlock.schema).map(x => [JSON.stringify(x.path), x.options.kind]));
        node.children.forEach(node => {
          emery.assert(node.type === 'component-block-prop' || node.type === 'component-inline-prop');
          missingKeys.delete(JSON.stringify(node.propPath));
        });
        if (missingKeys.size) {
          slate.Transforms.insertNodes(editor, [...missingKeys].map(([prop, kind]) => ({
            type: `component-${kind}-prop`,
            propPath: prop ? JSON.parse(prop) : prop,
            children: [{
              text: ''
            }]
          })), {
            at: [...path, node.children.length]
          });
          return;
        }
        const foundProps = new Set();
        const stringifiedInlinePropPaths = {};
        findChildPropPaths(node.props, blockComponents[node.component].schema).forEach((x, index) => {
          stringifiedInlinePropPaths[JSON.stringify(x.path)] = {
            options: x.options,
            index
          };
        });
        for (const [index, childNode] of node.children.entries()) {
          if (
          // children that are not these will be handled by
          // the generic allowedChildren normalization
          childNode.type !== 'component-inline-prop' && childNode.type !== 'component-block-prop') {
            continue;
          }
          const childPath = [...path, index];
          const stringifiedPropPath = JSON.stringify(childNode.propPath);
          if (stringifiedInlinePropPaths[stringifiedPropPath] === undefined) {
            slate.Transforms.removeNodes(editor, {
              at: childPath
            });
            return;
          }
          if (foundProps.has(stringifiedPropPath)) {
            slate.Transforms.removeNodes(editor, {
              at: childPath
            });
            return;
          }
          foundProps.add(stringifiedPropPath);
          const propInfo = stringifiedInlinePropPaths[stringifiedPropPath];
          const expectedIndex = propInfo.index;
          if (index !== expectedIndex) {
            slate.Transforms.moveNodes(editor, {
              at: childPath,
              to: [...path, expectedIndex]
            });
            return;
          }
          const expectedChildNodeType = `component-${propInfo.options.kind}-prop`;
          if (childNode.type !== expectedChildNodeType) {
            slate.Transforms.setNodes(editor, {
              type: expectedChildNodeType
            }, {
              at: childPath
            });
            return;
          }
          const documentFeatures = memoizedGetDocumentFeaturesForChildField(propInfo.options);
          if (normalizeNodeWithinComponentProp([childNode, childPath], editor, documentFeatures)) {
            return;
          }
        }
      }
    }
    normalizeNode(entry);
  };
  return editor;
}

// the only thing that this will fix is a new field being added to an object field, nothing else.
function addMissingFields(value, schema) {
  if (schema.kind === 'child' || schema.kind === 'form') {
    return value;
  }
  if (schema.kind === 'conditional') {
    const conditionalValue = value;
    const updatedInnerValue = addMissingFields(conditionalValue.value, schema.values[conditionalValue.discriminant.toString()]);
    if (updatedInnerValue === conditionalValue.value) {
      return value;
    }
    return {
      discriminant: conditionalValue.discriminant,
      value: updatedInnerValue
    };
  }
  if (schema.kind === 'array') {
    const arrValue = value;
    const newArrValue = arrValue.map(x => addMissingFields(x, schema.element));
    if (areArraysEqual(arrValue, newArrValue)) {
      return value;
    }
    return newArrValue;
  }
  if (schema.kind === 'object') {
    const objectValue = value;
    let hasChanged = false;
    const newObjectValue = {};
    for (const [key, innerSchema] of Object.entries(schema.fields)) {
      const innerValue = objectValue[key];
      if (innerValue === undefined) {
        hasChanged = true;
        newObjectValue[key] = getInitialPropsValue(innerSchema);
        continue;
      }
      const newInnerValue = addMissingFields(innerValue, innerSchema);
      if (newInnerValue !== innerValue) {
        hasChanged = true;
      }
      newObjectValue[key] = newInnerValue;
    }
    if (hasChanged) {
      return newObjectValue;
    }
    return value;
  }
  emery.assertNever(schema);
}

const paragraphElement = () => ({
  type: 'paragraph',
  children: [{
    text: ''
  }]
});
function withParagraphs(editor) {
  const {
    normalizeNode
  } = editor;
  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (slate.Editor.isEditor(node)) {
      let lastNode = node.children[node.children.length - 1];
      if ((lastNode === null || lastNode === void 0 ? void 0 : lastNode.type) !== 'paragraph') {
        slate.Transforms.insertNodes(editor, paragraphElement(), {
          at: [...path, node.children.length]
        });
        return;
      }
    }
    normalizeNode(entry);
  };
  return editor;
}

function withLayouts(editor) {
  const {
    normalizeNode,
    deleteBackward
  } = editor;
  editor.deleteBackward = unit => {
    if (editor.selection && slate.Range.isCollapsed(editor.selection) &&
    // this is just an little optimisation
    // we're only doing things if we're at the start of a layout area
    // and the start of anything will always be offset 0
    // so we'll bailout if we're not at offset 0
    editor.selection.anchor.offset === 0) {
      const [aboveNode, abovePath] = slate.Editor.above(editor, {
        match: node => node.type === 'layout-area'
      }) || [editor, []];
      if (aboveNode.type === 'layout-area' && slate.Point.equals(slate.Editor.start(editor, abovePath), editor.selection.anchor)) {
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (slate.Element.isElement(node) && node.type === 'layout') {
      if (node.layout === undefined) {
        slate.Transforms.unwrapNodes(editor, {
          at: path
        });
        return;
      }
      if (node.children.length < node.layout.length) {
        slate.Transforms.insertNodes(editor, Array.from({
          length: node.layout.length - node.children.length
        }).map(() => ({
          type: 'layout-area',
          children: [paragraphElement()]
        })), {
          at: [...path, node.children.length]
        });
        return;
      }
      if (node.children.length > node.layout.length) {
        Array.from({
          length: node.children.length - node.layout.length
        }).map((_, i) => i).reverse().forEach(i => {
          const layoutAreaToRemovePath = [...path, i + node.layout.length];
          const child = node.children[i + node.layout.length];
          moveChildren(editor, layoutAreaToRemovePath, [...path, node.layout.length - 1, node.children[node.layout.length - 1].children.length], node => node.type !== 'paragraph' || slate.Node.string(child) !== '');
          slate.Transforms.removeNodes(editor, {
            at: layoutAreaToRemovePath
          });
        });
        return;
      }
    }
    normalizeNode(entry);
  };
  return editor;
}

const markdownLinkPattern = /(^|\s)\[(.+?)\]\((\S+)\)$/;
function withLink(editorDocumentFeatures, componentBlocks, editor) {
  const {
    insertText,
    isInline,
    normalizeNode
  } = editor;
  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element);
  };
  if (editorDocumentFeatures.links) {
    editor.insertText = text => {
      insertText(text);
      if (text !== ')' || !editor.selection) {
        return;
      }
      const startOfBlock = slate.Editor.start(editor, slate.Editor.above(editor, {
        match: isBlock
      })[1]);
      const startOfBlockToEndOfShortcutString = slate.Editor.string(editor, {
        anchor: editor.selection.anchor,
        focus: startOfBlock
      });
      const match = markdownLinkPattern.exec(startOfBlockToEndOfShortcutString);
      if (!match) {
        return;
      }
      const ancestorComponentChildFieldDocumentFeatures = getAncestorComponentChildFieldDocumentFeatures(editor, editorDocumentFeatures, componentBlocks);
      if ((ancestorComponentChildFieldDocumentFeatures === null || ancestorComponentChildFieldDocumentFeatures === void 0 ? void 0 : ancestorComponentChildFieldDocumentFeatures.documentFeatures.links) === false) {
        return;
      }
      const [, maybeWhitespace, linkText, href] = match;
      // by doing this, the insertText(')') above will happen in a different undo than the link replacement
      // so that means that when someone does an undo after this
      // it will undo to the state of "[content](link)" rather than "[content](link" (note the missing closing bracket)
      editor.history.undos.push({
        operations: [],
        selectionBefore: editor.selection
      });
      const startOfShortcut = match.index === 0 ? startOfBlock : EditorAfterButIgnoringingPointsWithNoContent(editor, startOfBlock, {
        distance: match.index
      });
      const startOfLinkText = EditorAfterButIgnoringingPointsWithNoContent(editor, startOfShortcut, {
        distance: maybeWhitespace === '' ? 1 : 2
      });
      const endOfLinkText = EditorAfterButIgnoringingPointsWithNoContent(editor, startOfLinkText, {
        distance: linkText.length
      });
      slate.Transforms.delete(editor, {
        at: {
          anchor: endOfLinkText,
          focus: editor.selection.anchor
        }
      });
      slate.Transforms.delete(editor, {
        at: {
          anchor: startOfShortcut,
          focus: startOfLinkText
        }
      });
      slate.Transforms.wrapNodes(editor, {
        type: 'link',
        href,
        children: []
      }, {
        at: {
          anchor: editor.selection.anchor,
          focus: startOfShortcut
        },
        split: true
      });
      const nextNode = slate.Editor.next(editor);
      if (nextNode) {
        slate.Transforms.select(editor, nextNode[1]);
      }
    };
  }
  editor.normalizeNode = ([node, path]) => {
    if (node.type === 'link') {
      if (slate.Node.string(node) === '') {
        slate.Transforms.unwrapNodes(editor, {
          at: path
        });
        return;
      }
      for (const [idx, child] of node.children.entries()) {
        if (child.type === 'link') {
          // links cannot contain links
          slate.Transforms.unwrapNodes(editor, {
            at: [...path, idx]
          });
          return;
        }
      }
    }
    if (isInlineContainer(node)) {
      let lastMergableLink = null;
      for (const [idx, child] of node.children.entries()) {
        var _lastMergableLink;
        if (child.type === 'link' && child.href === ((_lastMergableLink = lastMergableLink) === null || _lastMergableLink === void 0 ? void 0 : _lastMergableLink.node.href)) {
          const firstLinkPath = [...path, lastMergableLink.index];
          const secondLinkPath = [...path, idx];
          const to = [...firstLinkPath, lastMergableLink.node.children.length];
          // note this is going in reverse, js doesn't have double-ended iterators so it's a for(;;)
          for (let i = child.children.length - 1; i >= 0; i--) {
            const childPath = [...secondLinkPath, i];
            slate.Transforms.moveNodes(editor, {
              at: childPath,
              to
            });
          }
          slate.Transforms.removeNodes(editor, {
            at: secondLinkPath
          });
          return;
        }
        if (!slate.Text.isText(child) || child.text !== '') {
          lastMergableLink = null;
        }
        if (child.type === 'link') {
          lastMergableLink = {
            index: idx,
            node: child
          };
        }
      }
    }
    normalizeNode([node, path]);
  };
  return editor;
}

const isListType = type => type === 'ordered-list' || type === 'unordered-list';
const isListNode = node => isListType(node.type);
function getAncestorList(editor) {
  if (editor.selection) {
    const listItem = slate.Editor.above(editor, {
      match: nodeTypeMatcher('list-item')
    });
    const list = slate.Editor.above(editor, {
      match: isListNode
    });
    if (listItem && list) {
      return {
        isInside: true,
        listItem,
        list
      };
    }
  }
  return {
    isInside: false
  };
}
function withList(editor) {
  const {
    insertBreak,
    normalizeNode,
    deleteBackward
  } = editor;
  editor.deleteBackward = unit => {
    if (editor.selection) {
      const ancestorList = getAncestorList(editor);
      if (ancestorList.isInside && slate.Range.isCollapsed(editor.selection) && slate.Editor.isStart(editor, editor.selection.anchor, ancestorList.list[1])) {
        slate.Transforms.unwrapNodes(editor, {
          match: isListNode,
          split: true
        });
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.insertBreak = () => {
    const [listItem] = slate.Editor.nodes(editor, {
      match: node => node.type === 'list-item',
      mode: 'lowest'
    });
    if (listItem && slate.Node.string(listItem[0]) === '') {
      slate.Transforms.unwrapNodes(editor, {
        match: isListNode,
        split: true
      });
      return;
    }
    insertBreak();
  };
  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (slate.Element.isElement(node) || slate.Editor.isEditor(node)) {
      const isElementBeingNormalizedAList = isListNode(node);
      for (const [childNode, childPath] of slate.Node.children(editor, path)) {
        const index = childPath[childPath.length - 1];
        // merge sibling lists
        if (isListNode(childNode)) {
          var _node$children;
          if (((_node$children = node.children[childPath[childPath.length - 1] + 1]) === null || _node$children === void 0 ? void 0 : _node$children.type) === childNode.type) {
            const siblingNodePath = slate.Path.next(childPath);
            moveChildren(editor, siblingNodePath, [...childPath, childNode.children.length]);
            slate.Transforms.removeNodes(editor, {
              at: siblingNodePath
            });
            return;
          }
          if (isElementBeingNormalizedAList) {
            const previousChild = node.children[index - 1];
            if (slate.Element.isElement(previousChild)) {
              slate.Transforms.moveNodes(editor, {
                at: childPath,
                to: [...slate.Path.previous(childPath), previousChild.children.length - 1]
              });
            } else {
              slate.Transforms.unwrapNodes(editor, {
                at: childPath
              });
            }
            return;
          }
        }
        if (node.type === 'list-item' && childNode.type !== 'list-item-content' && index === 0 && isBlock(childNode)) {
          if (path[path.length - 1] !== 0) {
            const previousChild = slate.Node.get(editor, slate.Path.previous(path));
            if (slate.Element.isElement(previousChild)) {
              slate.Transforms.moveNodes(editor, {
                at: path,
                to: [...slate.Path.previous(path), previousChild.children.length]
              });
              return;
            }
          }
          slate.Transforms.unwrapNodes(editor, {
            at: childPath
          });
          return;
        }
        if (node.type === 'list-item' && childNode.type === 'list-item-content' && index !== 0) {
          slate.Transforms.splitNodes(editor, {
            at: childPath
          });
          return;
        }
      }
    }
    normalizeNode(entry);
  };
  return editor;
}

function order(a, b) {
  return {
    start: Math.min(a, b),
    end: Math.max(a, b)
  };
}
function getRelativeRowPath(hasHead, rowIndex) {
  return hasHead ? rowIndex === 0 ? [0, 0] : [1, rowIndex - 1] : [0, rowIndex];
}
function getSelectedTableArea(editor) {
  var _Editor$above, _editor$selection, _Editor$above2, _editor$selection2;
  const anchor = (_Editor$above = slate.Editor.above(editor, {
    match: nodeTypeMatcher('table-cell'),
    at: (_editor$selection = editor.selection) === null || _editor$selection === void 0 ? void 0 : _editor$selection.anchor.path
  })) === null || _Editor$above === void 0 ? void 0 : _Editor$above[1];
  const focus = (_Editor$above2 = slate.Editor.above(editor, {
    match: nodeTypeMatcher('table-cell'),
    at: (_editor$selection2 = editor.selection) === null || _editor$selection2 === void 0 ? void 0 : _editor$selection2.focus.path
  })) === null || _Editor$above2 === void 0 ? void 0 : _Editor$above2[1];
  const table = slate.Editor.above(editor, {
    match: nodeTypeMatcher('table')
  });
  if (editor.selection && table && slate.Element.isElement(table[0].children[0]) && anchor && focus && slate.Path.equals(anchor.slice(0, -3), focus.slice(0, -3))) {
    const [start, end] = slate.Editor.edges(editor, editor.selection);
    return {
      tablePath: table[1],
      table: table[0],
      singleCell: slate.Path.equals(anchor, focus) ? slate.Point.equals(slate.Editor.start(editor, anchor), start) && slate.Point.equals(slate.Editor.end(editor, anchor), end) && !slate.Point.equals(start, end) ? 'selected' : 'not-selected' : 'many',
      row: order(anchor[anchor.length - 2] + anchor[anchor.length - 3], focus[focus.length - 2] + focus[anchor.length - 3]),
      column: order(anchor[anchor.length - 1], focus[focus.length - 1])
    };
  }
}
const cell = header => ({
  type: 'table-cell',
  ...(header ? {
    header: true
  } : {}),
  children: [{
    type: 'paragraph',
    children: [{
      text: ''
    }]
  }]
});
function cloneDescendant(node) {
  if (slate.Text.isText(node)) return {
    ...node
  };
  return {
    ...node,
    children: node.children.map(cloneDescendant)
  };
}
function withTable(editor) {
  const {
    deleteFragment,
    normalizeNode,
    getFragment,
    insertFragment,
    deleteBackward
  } = editor;
  editor.insertFragment = fragment => {
    const selectedTableArea = getSelectedTableArea(editor);
    if (!selectedTableArea || fragment.length !== 1 || fragment[0].type !== 'table') {
      insertFragment(fragment);
      return;
    }
    const newRows = fragment[0].children.flatMap(child => child.type === 'table-head' || child.type === 'table-body' ? child.children : []);
    if (!newRows.every(nodeTypeMatcher('table-row'))) {
      insertFragment(fragment);
      return;
    }
    let {
      row,
      column,
      tablePath,
      table
    } = selectedTableArea;
    const existingBody = selectedTableArea.table.children[selectedTableArea.table.children.length === 1 ? 0 : 1];
    if (newRows[0].type !== 'table-row' || existingBody.type !== 'table-body' || existingBody.children[0].type !== 'table-row') {
      insertFragment(fragment);
      return;
    }
    const hasHead = table.children[0].type === 'table-head';
    if (selectedTableArea.singleCell !== 'many') {
      row = {
        start: row.start,
        end: Math.min(row.start + newRows.length - 1, existingBody.children.length - 1 + (hasHead ? 1 : 0))
      };
      column = {
        start: column.start,
        end: Math.min(column.start + newRows[0].children.length - 1, existingBody.children[0].children.length - 1)
      };
    }
    slate.Editor.withoutNormalizing(editor, () => {
      for (let rowIndex = row.start; rowIndex <= row.end; rowIndex++) {
        const newRow = newRows[(rowIndex - row.start) % newRows.length];
        for (let cellIndex = column.start; cellIndex <= column.end; cellIndex++) {
          const relativeCellPath = [...getRelativeRowPath(hasHead, rowIndex), cellIndex];
          const cell = slate.Node.get(table, relativeCellPath);
          const newCell = newRow.children[(cellIndex - column.start) % newRow.children.length];
          if (cell.type !== 'table-cell' || newCell.type !== 'table-cell') {
            continue;
          }
          const cellPath = [...tablePath, ...relativeCellPath];
          for (const childIdx of [...cell.children.keys()].reverse()) {
            slate.Transforms.removeNodes(editor, {
              at: [...cellPath, childIdx]
            });
          }
          slate.Transforms.insertNodes(editor, newCell.children.map(cloneDescendant), {
            at: [...cellPath, 0]
          });
        }
      }
      slate.Transforms.setSelection(editor, {
        anchor: slate.Editor.start(editor, [...tablePath, ...getRelativeRowPath(hasHead, row.start), column.start]),
        focus: slate.Editor.end(editor, [...tablePath, ...getRelativeRowPath(hasHead, row.end), column.end])
      });
    });
  };
  editor.deleteBackward = unit => {
    if (editor.selection && slate.Range.isCollapsed(editor.selection) && editor.selection.anchor.offset === 0) {
      const tableCell = slate.Editor.above(editor, {
        match: nodeTypeMatcher('table-cell')
      });
      if (tableCell && tableCell[0].children[0].type === 'paragraph' && tableCell[0].children[0].children[0].type === undefined && slate.Path.equals(editor.selection.anchor.path, [...tableCell[1], 0, 0])) {
        return;
      }
    }
    deleteBackward(unit);
  };
  editor.getFragment = () => {
    const selectedTableArea = getSelectedTableArea(editor);
    if (selectedTableArea && selectedTableArea.singleCell !== 'not-selected') {
      var _table$children$;
      const {
        table
      } = selectedTableArea;
      const first = table.children[0].type === 'table-head' || table.children[0].type === 'table-body' ? table.children[0] : undefined;
      if (!first) {
        return getFragment();
      }
      const second = ((_table$children$ = table.children[1]) === null || _table$children$ === void 0 ? void 0 : _table$children$.type) === 'table-body' ? table.children[1] : undefined;
      const body = second || first;
      const hasHead = first.type === 'table-head';
      const isSelectionInHead = selectedTableArea.row.start === 0 && !!second;
      const columnLength = selectedTableArea.column.end - selectedTableArea.column.start + 1;
      return [{
        type: 'table',
        children: [...(isSelectionInHead ? [{
          type: 'table-head',
          children: [{
            type: 'table-row',
            children: Array.from({
              length: columnLength
            }).map((_, columnIndex) => first.children[0].children[columnIndex + selectedTableArea.column.start])
          }]
        }] : []), {
          type: 'table-body',
          children: Array.from({
            length: selectedTableArea.row.end - selectedTableArea.row.start + (isSelectionInHead ? 0 : 1)
          }).map((_, rowIndex) => ({
            type: 'table-row',
            children: Array.from({
              length: columnLength
            }).map((_, columnIndex) => body.children[rowIndex + selectedTableArea.row.start - (hasHead && !isSelectionInHead ? 1 : 0)].children[columnIndex + selectedTableArea.column.start])
          }))
        }]
      }];
    }
    return getFragment();
  };
  editor.deleteFragment = direction => {
    if (!editor.selection || slate.Range.isCollapsed(editor.selection)) {
      deleteFragment(direction);
      return;
    }
    const selectedTableArea = getSelectedTableArea(editor);
    if (!selectedTableArea || selectedTableArea.singleCell === 'not-selected') {
      deleteFragment(direction);
      return;
    }
    const headOrBody = selectedTableArea.table.children[0];
    if (!slate.Element.isElement(headOrBody) || !slate.Element.isElement(headOrBody.children[0])) {
      deleteFragment(direction);
      return;
    }
    const maxRowIdx = selectedTableArea.table.children.reduce((sum, headOrBody) => sum + (headOrBody.type === 'table-head' || headOrBody.type === 'table-body' ? headOrBody.children.length : 0), 0) - 1;
    const {
      row,
      column,
      tablePath
    } = selectedTableArea;
    // note the fact that hasWholeColumnSelected uses row and hasWholeRowSelected uses column
    // is not a mistake. if a whole column has been selected, then the starting row is 0 and the end is the last row
    const hasWholeColumnSelected = row.start === 0 && row.end === maxRowIdx;
    const hasWholeRowSelected = column.start === 0 && column.end === headOrBody.children[0].children.length - 1;
    if (hasWholeColumnSelected && hasWholeRowSelected) {
      slate.Transforms.removeNodes(editor, {
        at: tablePath
      });
      return;
    }
    const hasHead = headOrBody.type === 'table-head';
    if (hasWholeRowSelected) {
      slate.Editor.withoutNormalizing(editor, () => {
        for (let i = row.end; i >= row.start; i--) {
          if (hasHead) {
            if (i === 0) {
              slate.Transforms.removeNodes(editor, {
                at: [...tablePath, 0]
              });
              continue;
            }
            slate.Transforms.removeNodes(editor, {
              at: [...tablePath, 1, i - 1]
            });
            continue;
          }
          slate.Transforms.removeNodes(editor, {
            at: [...tablePath, 0, i]
          });
        }
      });
      return;
    }
    if (hasWholeColumnSelected) {
      slate.Editor.withoutNormalizing(editor, () => {
        for (let i = column.end; i >= column.start; i--) {
          for (let rowIdx = 0; rowIdx <= maxRowIdx; rowIdx++) {
            slate.Transforms.removeNodes(editor, {
              at: [...tablePath, ...getRelativeRowPath(hasHead, rowIdx), i]
            });
          }
        }
        const selectionPath = [...tablePath, 0, 0, column.start];
        const point = slate.Editor.start(editor, column.start === 0 ? selectionPath : slate.Path.previous(selectionPath));
        slate.Transforms.select(editor, point);
      });
      return;
    }
    const selectionStart = slate.Editor.start(editor, editor.selection).path;
    slate.Editor.withoutNormalizing(editor, () => {
      for (let rowIndex = row.start; rowIndex <= row.end; rowIndex++) {
        for (let cellIndex = column.start; cellIndex <= column.end; cellIndex++) {
          const relativeCellPath = [...getRelativeRowPath(hasHead, rowIndex), cellIndex];
          const cell = slate.Node.get(selectedTableArea.table, relativeCellPath);
          if (!slate.Element.isElement(cell)) {
            continue;
          }
          const cellPath = [...tablePath, ...relativeCellPath];
          slate.Transforms.insertNodes(editor, {
            type: 'paragraph',
            children: [{
              text: ''
            }]
          }, {
            at: [...cellPath, 0]
          });
          for (const childIdx of [...cell.children.keys()].reverse()) {
            slate.Transforms.removeNodes(editor, {
              at: [...cellPath, childIdx + 1]
            });
          }
        }
      }
      slate.Transforms.select(editor, selectionStart);
    });
  };
  editor.normalizeNode = entry => {
    const [node, path] = entry;
    if (node.type === 'table-head' && node.children.length > 1) {
      moveChildren(editor, path, slate.Path.next(path), (_, i) => i !== 0);
      return;
    }
    let didUpdateThings = false;
    for (const parent of ['table-body', 'table-head']) {
      if (node.type === parent) {
        for (const [rowIdx, row] of node.children.entries()) {
          if (row.type === 'table-row') {
            for (const [cellIdx, cell] of row.children.entries()) {
              if (cell.type === 'table-cell') {
                const at = [...path, rowIdx, cellIdx];
                if (cell.header && parent === 'table-body') {
                  slate.Transforms.unsetNodes(editor, 'header', {
                    at
                  });
                  didUpdateThings = true;
                }
                if (!cell.header && parent === 'table-head') {
                  slate.Transforms.setNodes(editor, {
                    header: true
                  }, {
                    at
                  });
                  didUpdateThings = true;
                }
              }
            }
          }
        }
      }
    }
    if (didUpdateThings) {
      return;
    }
    if (node.type === 'table') {
      const maxRowCount = node.children.reduce((max, node) => node.type === 'table-head' || node.type === 'table-body' ? node.children.reduce((max, node) => node.type === 'table-row' ? Math.max(max, node.children.length) : max, max) : max, 0);
      let didInsert = false;
      for (const [idx, child] of node.children.entries()) {
        if (child.type === 'table-body' || child.type === 'table-head') {
          for (const [rowIdx, row] of child.children.entries()) {
            if (row.type === 'table-row' && row.children.length !== maxRowCount) {
              slate.Transforms.insertNodes(editor, Array.from({
                length: maxRowCount - row.children.length
              }, () => cell(child.type === 'table-head')), {
                at: [...path, idx, rowIdx, row.children.length]
              });
              didInsert = true;
            }
          }
        }
      }
      if (didInsert) {
        return;
      }
      if (node.children.length === 1 && node.children[0].type === 'table-head') {
        slate.Transforms.insertNodes(editor, {
          type: 'table-body',
          children: Array.from({
            length: node.children[0].children.length
          }, () => cell(false))
        }, {
          at: [...path, 1]
        });
        return;
      }
      if (node.children.length === 2 && node.children[1].type === 'table-head') {
        slate.Transforms.moveNodes(editor, {
          at: [...path, 1],
          to: [...path, 0]
        });
        return;
      }
      if (node.children.length > 2) {
        moveChildren(editor, path, slate.Path.next(path), (_, i) => i !== 0 && i !== 1);
        return;
      }
    }
    normalizeNode(entry);
  };
  return editor;
}

function createDocumentEditorForNormalization(documentFeatures, componentBlocks) {
  return _createDocumentEditor(slate.createEditor(), documentFeatures, componentBlocks);
}
function _createDocumentEditor(baseEditor, documentFeatures, componentBlocks) {
  return withBlocksSchema(withParagraphs(withLink(documentFeatures, componentBlocks, withList(withTable(withComponentBlocks(componentBlocks, documentFeatures, withVoidElements(withLayouts(withCodeBlock(documentFeatures, componentBlocks, withDocumentFeaturesNormalization(documentFeatures, baseEditor))))))))));
}
function withBlocksSchema(editor) {
  const {
    normalizeNode
  } = editor;
  editor.normalizeNode = ([node, path]) => {
    if (!slate.Text.isText(node) && node.type !== 'link') {
      const nodeType = slate.Editor.isEditor(node) ? 'editor' : node.type;
      if (typeof nodeType !== 'string' || editorSchema[nodeType] === undefined) {
        slate.Transforms.unwrapNodes(editor, {
          at: path
        });
        return;
      }
      const info = editorSchema[nodeType];
      if (info.kind === 'blocks' && node.children.length !== 0 && node.children.every(child => !isBlock(child))) {
        slate.Transforms.wrapNodes(editor, {
          type: info.blockToWrapInlinesIn,
          children: []
        }, {
          at: path,
          match: node => !isBlock(node)
        });
        return;
      }
      let didUpdate = false;
      for (const [index, childNode] of [...node.children.entries()].reverse()) {
        const childPath = [...path, index];
        if (info.kind === 'inlines') {
          if (!slate.Text.isText(childNode) && isBlock(childNode)) {
            handleNodeInInvalidPosition(editor, [childNode, childPath], path);
            didUpdate = true;
            continue;
          }
        } else {
          if (!isBlock(childNode)) {
            slate.Transforms.wrapNodes(editor, {
              type: info.blockToWrapInlinesIn,
              children: []
            }, {
              at: childPath
            });
            didUpdate = true;
            continue;
          }
          if (!info.allowedChildren.has(childNode.type)) {
            handleNodeInInvalidPosition(editor, [childNode, childPath], path);
            didUpdate = true;
            continue;
          }
        }
      }
      if (didUpdate) {
        return;
      }
    }
    normalizeNode([node, path]);
  };
  return editor;
}
function handleNodeInInvalidPosition(editor, [node, path], ancestorPath) {
  const nodeType = node.type;
  const childNodeInfo = editorSchema[nodeType];
  // the parent of a block will never be an inline so this casting is okay
  const ancestorNode = slate.Node.get(editor, ancestorPath);
  const parentNodeType = slate.Editor.isEditor(ancestorNode) ? 'editor' : ancestorNode.type;
  const parentNodeInfo = editorSchema[parentNodeType];
  if (!childNodeInfo || childNodeInfo.invalidPositionHandleMode === 'unwrap') {
    if (parentNodeInfo.kind === 'blocks' && parentNodeInfo.blockToWrapInlinesIn) {
      slate.Transforms.setNodes(editor, {
        type: parentNodeInfo.blockToWrapInlinesIn,
        ...Object.fromEntries(Object.keys(node).filter(key => key !== 'type' && key !== 'children').map(key => [key, null])) // the Slate types don't understand that null is allowed and it will unset properties with setNodes
      }, {
        at: path
      });
      return;
    }
    slate.Transforms.unwrapNodes(editor, {
      at: path
    });
    return;
  }
  const info = editorSchema[ancestorNode.type || 'editor'];
  if ((info === null || info === void 0 ? void 0 : info.kind) === 'blocks' && info.allowedChildren.has(nodeType)) {
    if (ancestorPath.length === 0) {
      slate.Transforms.moveNodes(editor, {
        at: path,
        to: [path[0] + 1]
      });
    } else {
      slate.Transforms.moveNodes(editor, {
        at: path,
        to: slate.Path.next(ancestorPath)
      });
    }
    return;
  }
  if (slate.Editor.isEditor(ancestorNode)) {
    slate.Transforms.moveNodes(editor, {
      at: path,
      to: [path[0] + 1]
    });
    slate.Transforms.unwrapNodes(editor, {
      at: [path[0] + 1]
    });
    return;
  }
  handleNodeInInvalidPosition(editor, [node, path], ancestorPath.slice(0, -1));
}
function withVoidElements(editor) {
  const {
    isVoid
  } = editor;
  editor.isVoid = node => {
    return node.type === 'divider' || node.type === 'image' || isVoid(node);
  };
  return editor;
}

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const defaultAltField = text({
  label: 'Alt text',
  description: 'This text will be used by screen readers and search engines.'
});
const emptyTitleField = basicFormFieldWithSimpleReaderParse({
  Input() {
    return null;
  },
  defaultValue() {
    return '';
  },
  parse(value) {
    if (value === undefined) return '';
    if (typeof value !== 'string') {
      throw new FieldDataError('Must be string');
    }
    return value;
  },
  validate(value) {
    return value;
  },
  serialize(value) {
    return {
      value
    };
  }
});
function normaliseDocumentFeatures(config) {
  var _config$formatting, _formatting$alignment, _formatting$alignment2, _formatting$blockType, _formatting$inlineMar, _formatting$inlineMar2, _formatting$inlineMar3, _formatting$inlineMar4, _formatting$inlineMar5, _formatting$inlineMar6, _formatting$inlineMar7, _formatting$inlineMar8, _formatting$listTypes, _formatting$listTypes2, _imagesConfig$schema$, _imagesConfig$schema, _imagesConfig$schema$2, _imagesConfig$schema2;
  const formatting = config.formatting === true ? {
    // alignment: true, // not supported natively in markdown
    blockTypes: true,
    headingLevels: true,
    inlineMarks: true,
    listTypes: true,
    softBreaks: true
  } : (_config$formatting = config.formatting) !== null && _config$formatting !== void 0 ? _config$formatting : {};
  const imagesConfig = config.images === true ? {} : config.images;
  return {
    formatting: {
      alignment: formatting.alignment === true ? {
        center: true,
        end: true
      } : {
        center: !!((_formatting$alignment = formatting.alignment) !== null && _formatting$alignment !== void 0 && _formatting$alignment.center),
        end: !!((_formatting$alignment2 = formatting.alignment) !== null && _formatting$alignment2 !== void 0 && _formatting$alignment2.end)
      },
      blockTypes: (formatting === null || formatting === void 0 ? void 0 : formatting.blockTypes) === true ? {
        blockquote: true,
        code: {
          schema: object({})
        }
      } : {
        blockquote: !!((_formatting$blockType = formatting.blockTypes) !== null && _formatting$blockType !== void 0 && _formatting$blockType.blockquote),
        code: (_formatting$blockType2 => {
          if (((_formatting$blockType2 = formatting.blockTypes) === null || _formatting$blockType2 === void 0 ? void 0 : _formatting$blockType2.code) === undefined) {
            return false;
          }
          if (formatting.blockTypes.code === true || !formatting.blockTypes.code.schema) {
            return {
              schema: object({})
            };
          }
          for (const key of ['type', 'children', 'language']) {
            if (key in formatting.blockTypes.code.schema) {
              throw new Error(`"${key}" cannot be a key in the schema for code blocks`);
            }
          }
          return {
            schema: object(formatting.blockTypes.code.schema)
          };
        })()
      },
      headings: (_obj$schema => {
        const opt = formatting === null || formatting === void 0 ? void 0 : formatting.headingLevels;
        const obj = typeof opt === 'object' && 'levels' in opt ? opt : {
          levels: opt,
          schema: undefined
        };
        if (obj.schema) {
          for (const key of ['type', 'children', 'level', 'textAlign']) {
            if (key in obj.schema) {
              throw new Error(`"${key}" cannot be a key in the schema for headings`);
            }
          }
        }
        return {
          levels: [...new Set(obj.levels === true ? [1, 2, 3, 4, 5, 6] : obj.levels)],
          schema: object((_obj$schema = obj.schema) !== null && _obj$schema !== void 0 ? _obj$schema : {})
        };
      })(),
      inlineMarks: formatting.inlineMarks === true ? {
        bold: true,
        code: true,
        italic: true,
        keyboard: false,
        // not supported natively in markdown
        strikethrough: true,
        subscript: false,
        // not supported natively in markdown
        superscript: false,
        // not supported natively in markdown
        underline: false // not supported natively in markdown
      } : {
        bold: !!((_formatting$inlineMar = formatting.inlineMarks) !== null && _formatting$inlineMar !== void 0 && _formatting$inlineMar.bold),
        code: !!((_formatting$inlineMar2 = formatting.inlineMarks) !== null && _formatting$inlineMar2 !== void 0 && _formatting$inlineMar2.code),
        italic: !!((_formatting$inlineMar3 = formatting.inlineMarks) !== null && _formatting$inlineMar3 !== void 0 && _formatting$inlineMar3.italic),
        strikethrough: !!((_formatting$inlineMar4 = formatting.inlineMarks) !== null && _formatting$inlineMar4 !== void 0 && _formatting$inlineMar4.strikethrough),
        underline: !!((_formatting$inlineMar5 = formatting.inlineMarks) !== null && _formatting$inlineMar5 !== void 0 && _formatting$inlineMar5.underline),
        keyboard: !!((_formatting$inlineMar6 = formatting.inlineMarks) !== null && _formatting$inlineMar6 !== void 0 && _formatting$inlineMar6.keyboard),
        subscript: !!((_formatting$inlineMar7 = formatting.inlineMarks) !== null && _formatting$inlineMar7 !== void 0 && _formatting$inlineMar7.subscript),
        superscript: !!((_formatting$inlineMar8 = formatting.inlineMarks) !== null && _formatting$inlineMar8 !== void 0 && _formatting$inlineMar8.superscript)
      },
      listTypes: formatting.listTypes === true ? {
        ordered: true,
        unordered: true
      } : {
        ordered: !!((_formatting$listTypes = formatting.listTypes) !== null && _formatting$listTypes !== void 0 && _formatting$listTypes.ordered),
        unordered: !!((_formatting$listTypes2 = formatting.listTypes) !== null && _formatting$listTypes2 !== void 0 && _formatting$listTypes2.unordered)
      },
      softBreaks: !!formatting.softBreaks
    },
    links: !!config.links,
    layouts: [...new Set((config.layouts || []).map(x => JSON.stringify(x)))].map(x => JSON.parse(x)),
    dividers: !!config.dividers,
    images: imagesConfig === undefined ? false : {
      ...imagesConfig,
      schema: {
        alt: (_imagesConfig$schema$ = (_imagesConfig$schema = imagesConfig.schema) === null || _imagesConfig$schema === void 0 ? void 0 : _imagesConfig$schema.alt) !== null && _imagesConfig$schema$ !== void 0 ? _imagesConfig$schema$ : defaultAltField,
        title: (_imagesConfig$schema$2 = (_imagesConfig$schema2 = imagesConfig.schema) === null || _imagesConfig$schema2 === void 0 ? void 0 : _imagesConfig$schema2.title) !== null && _imagesConfig$schema$2 !== void 0 ? _imagesConfig$schema$2 : emptyTitleField
      }
    },
    tables: !!config.tables
  };
}
function document$1({
  label,
  componentBlocks = {},
  description,
  ...documentFeaturesConfig
}) {
  const documentFeatures = normaliseDocumentFeatures(documentFeaturesConfig);
  const parse = mode => (_value, data) => {
    const markdoc = textDecoder.decode(data.content);
    const document = fromMarkdoc(Markdoc__default["default"].parse(markdoc), componentBlocks);
    const editor = createDocumentEditorForNormalization(documentFeatures, componentBlocks);
    editor.children = document;
    slate.Editor.normalize(editor, {
      force: true
    });
    return deserializeFiles(editor.children, componentBlocks, data.other, data.external || new Map(), mode, documentFeatures, data.slug);
  };
  return {
    kind: 'form',
    formKind: 'content',
    defaultValue() {
      return [{
        type: 'paragraph',
        children: [{
          text: ''
        }]
      }];
    },
    Input(props) {
      return /*#__PURE__*/jsxRuntime.jsx(emptyFieldUi.DocumentFieldInput, {
        componentBlocks: componentBlocks,
        description: description,
        label: label,
        documentFeatures: documentFeatures,
        ...props
      });
    },
    parse: parse('edit'),
    contentExtension: '.mdoc',
    validate(value) {
      return value;
    },
    directories: [...collectDirectoriesUsedInSchema(object(Object.fromEntries(Object.entries(componentBlocks).map(([name, block]) => [name, object(block.schema)])))), ...(typeof documentFeatures.images === 'object' && typeof documentFeatures.images.directory === 'string' ? [fixPath(documentFeatures.images.directory)] : [])],
    serialize(value, opts) {
      const {
        extraFiles,
        node
      } = toMarkdocDocument(value, {
        componentBlocks,
        documentFeatures,
        slug: opts.slug
      });
      const other = new Map();
      const external = new Map();
      for (const file of extraFiles) {
        if (file.parent === undefined) {
          other.set(file.path, file.contents);
          continue;
        }
        if (!external.has(file.parent)) {
          external.set(file.parent, new Map());
        }
        external.get(file.parent).set(file.path, file.contents);
      }
      return {
        content: textEncoder.encode(Markdoc__default["default"].format(Markdoc__default["default"].parse(Markdoc__default["default"].format(node)))),
        other,
        external,
        value: undefined
      };
    },
    reader: {
      parse: parse('read')
    }
  };
}

exports.EditorAfterButIgnoringingPointsWithNoContent = EditorAfterButIgnoringingPointsWithNoContent;
exports.FieldDataError = FieldDataError;
exports.KEYSTATIC_CLOUD_API_URL = KEYSTATIC_CLOUD_API_URL;
exports.KEYSTATIC_CLOUD_HEADERS = KEYSTATIC_CLOUD_HEADERS;
exports.Prism = Prism;
exports._createDocumentEditor = _createDocumentEditor;
exports.addMarkToChildren = addMarkToChildren;
exports.addMarksToChildren = addMarksToChildren;
exports.aliasesToCanonicalName = aliasesToCanonicalName;
exports.aliasesToLabel = aliasesToLabel;
exports.allMarks = allMarks;
exports.areArraysEqual = areArraysEqual;
exports.assertRequired = assertRequired;
exports.basicFormFieldWithSimpleReaderParse = basicFormFieldWithSimpleReaderParse;
exports.blobSha = blobSha;
exports.canonicalNameToLabel = canonicalNameToLabel;
exports.cell = cell;
exports.clearFormatting = clearFormatting;
exports.cloneDescendent = cloneDescendent;
exports.document = document$1;
exports.findChildPropPaths = findChildPropPaths;
exports.fixPath = fixPath;
exports.forceDisableMarkForChildren = forceDisableMarkForChildren;
exports.getAncestorComponentChildFieldDocumentFeatures = getAncestorComponentChildFieldDocumentFeatures;
exports.getBranchPrefix = getBranchPrefix;
exports.getCollectionFormat = getCollectionFormat;
exports.getCollectionItemPath = getCollectionItemPath;
exports.getCollectionPath = getCollectionPath;
exports.getDataFileExtension = getDataFileExtension;
exports.getDirectoriesForTreeKey = getDirectoriesForTreeKey;
exports.getEntriesInCollectionWithTreeKey = getEntriesInCollectionWithTreeKey;
exports.getEntryDataFilepath = getEntryDataFilepath;
exports.getInitialPropsValue = getInitialPropsValue;
exports.getInitialPropsValueFromInitializer = getInitialPropsValueFromInitializer;
exports.getInlineNodes = getInlineNodes;
exports.getKeysForArrayValue = getKeysForArrayValue;
exports.getPathPrefix = getPathPrefix;
exports.getPlaceholderTextForPropPath = getPlaceholderTextForPropPath;
exports.getRelativeRowPath = getRelativeRowPath;
exports.getRepoUrl = getRepoUrl;
exports.getSchemaAtPropPath = getSchemaAtPropPath;
exports.getSelectedTableArea = getSelectedTableArea;
exports.getSingletonFormat = getSingletonFormat;
exports.getSingletonPath = getSingletonPath;
exports.getSlugFromState = getSlugFromState;
exports.getSlugGlobForCollection = getSlugGlobForCollection;
exports.getSplitCloudProject = getSplitCloudProject;
exports.getSrcPrefix = getSrcPrefix;
exports.getTreeKey = getTreeKey;
exports.getTreeNodeAtPath = getTreeNodeAtPath;
exports.getValueAtPropPath = getValueAtPropPath;
exports.getWholeDocumentFeaturesForChildField = getWholeDocumentFeaturesForChildField;
exports.isBlock = isBlock;
exports.isCloudConfig = isCloudConfig;
exports.isElementActive = isElementActive;
exports.isGitHubConfig = isGitHubConfig;
exports.isListNode = isListNode;
exports.isLocalConfig = isLocalConfig;
exports.labelToCanonicalName = labelToCanonicalName;
exports.languagesWithAliases = languagesWithAliases;
exports.nodeTypeMatcher = nodeTypeMatcher;
exports.object = object;
exports.pluralize = pluralize;
exports.redirectToCloudAuth = redirectToCloudAuth;
exports.serializeProps = serializeProps;
exports.setKeysForArrayValue = setKeysForArrayValue;
exports.setLinkForChildren = setLinkForChildren;
exports.text = text;
exports.transformProps = transformProps;
exports.treeEntriesToTreeNodes = treeEntriesToTreeNodes;
exports.treeSha = treeSha;
exports.updateTreeWithChanges = updateTreeWithChanges;
exports.updateValue = updateValue;
exports.validateText = validateText;
