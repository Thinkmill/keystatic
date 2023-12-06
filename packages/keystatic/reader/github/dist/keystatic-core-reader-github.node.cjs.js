'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var generic = require('../../../dist/generic-334dab1c.node.cjs.js');
var index = require('../../../dist/index-19d616b6.node.cjs.js');
require('@keystar/ui/checkbox');
require('@keystar/ui/typography');
require('react/jsx-runtime');
require('@keystar/ui/text-field');
require('react');
require('@keystar/ui/button');
require('@keystar/ui/field');
require('@keystar/ui/layout');
require('@keystar/ui/style');
require('@keystar/ui/number-field');
require('@keystar/ui/combobox');
require('minimatch');
require('@react-stately/collections');
require('@keystar/ui/picker');
require('@sindresorhus/slugify');
require('@braintree/sanitize-url');
require('@react-aria/i18n');
require('@keystar/ui/dialog');
require('@keystar/ui/slots');
require('emery');
require('@keystar/ui/drag-and-drop');
require('@keystar/ui/icon');
require('@keystar/ui/icon/icons/trash2Icon');
require('@keystar/ui/list-view');
require('@keystar/ui/tooltip');
require('slate');
require('slate-react');
require('@keystar/ui/split-view');
require('@keystar/ui/icon/icons/panelLeftOpenIcon');
require('@keystar/ui/icon/icons/panelLeftCloseIcon');
require('@keystar/ui/icon/icons/panelRightOpenIcon');
require('@keystar/ui/icon/icons/panelRightCloseIcon');
require('@keystar/ui/menu');
require('@keystar/ui/link');
require('@keystar/ui/progress');
require('../../../dist/required-files-714b48bf.node.cjs.js');
require('js-yaml');
require('@markdoc/markdoc');
require('emery/assertions');
require('js-base64');
require('crypto');
require('is-hotkey');
require('@react-aria/utils');
require('@keystar/ui/icon/icons/editIcon');
require('@keystar/ui/icon/icons/externalLinkIcon');
require('@keystar/ui/icon/icons/linkIcon');
require('@keystar/ui/icon/icons/unlinkIcon');
require('@react-aria/overlays');
require('@react-stately/overlays');
require('@keystar/ui/overlays');
require('@keystar/ui/action-group');
require('@keystar/ui/icon/icons/boldIcon');
require('@keystar/ui/icon/icons/chevronDownIcon');
require('@keystar/ui/icon/icons/codeIcon');
require('@keystar/ui/icon/icons/italicIcon');
require('@keystar/ui/icon/icons/maximizeIcon');
require('@keystar/ui/icon/icons/minimizeIcon');
require('@keystar/ui/icon/icons/plusIcon');
require('@keystar/ui/icon/icons/removeFormattingIcon');
require('@keystar/ui/icon/icons/strikethroughIcon');
require('@keystar/ui/icon/icons/subscriptIcon');
require('@keystar/ui/icon/icons/superscriptIcon');
require('@keystar/ui/icon/icons/typeIcon');
require('@keystar/ui/icon/icons/underlineIcon');
require('@keystar/ui/icon/icons/alignLeftIcon');
require('@keystar/ui/icon/icons/alignRightIcon');
require('@keystar/ui/icon/icons/alignCenterIcon');
require('@keystar/ui/icon/icons/quoteIcon');
require('match-sorter');
require('@keystar/ui/icon/icons/trashIcon');
require('@emotion/weak-memoize');
require('@keystar/ui/icon/icons/minusIcon');
require('@keystar/ui/icon/icons/columnsIcon');
require('@keystar/ui/icon/icons/listIcon');
require('@keystar/ui/icon/icons/listOrderedIcon');
require('@keystar/ui/icon/icons/fileUpIcon');
require('@keystar/ui/icon/icons/imageIcon');
require('@ts-gql/tag/no-transform');
require('urql');
require('lru-cache');
require('cookie');
require('zod');
require('@keystar/ui/icon/icons/link2Icon');
require('@keystar/ui/icon/icons/link2OffIcon');
require('@keystar/ui/icon/icons/pencilIcon');
require('@keystar/ui/icon/icons/undo2Icon');
require('@keystar/ui/utils');
require('@keystar/ui/icon/icons/sheetIcon');
require('@keystar/ui/icon/icons/tableIcon');
require('scroll-into-view-if-needed');
require('@react-stately/list');
require('@keystar/ui/listbox');
require('slate-history');
require('mdast-util-from-markdown');
require('mdast-util-gfm-autolink-literal/from-markdown');
require('micromark-extension-gfm-autolink-literal');
require('mdast-util-gfm-strikethrough/from-markdown');
require('micromark-extension-gfm-strikethrough');
require('@keystar/ui/badge');
require('@keystar/ui/nav-list');
require('@keystar/ui/status-light');
require('@keystar/ui/core');
require('@keystar/ui/avatar');
require('@keystar/ui/icon/icons/logOutIcon');
require('@keystar/ui/icon/icons/gitPullRequestIcon');
require('@keystar/ui/icon/icons/gitBranchPlusIcon');
require('@keystar/ui/icon/icons/githubIcon');
require('@keystar/ui/icon/icons/gitForkIcon');
require('@keystar/ui/icon/icons/monitorIcon');
require('@keystar/ui/icon/icons/moonIcon');
require('@keystar/ui/icon/icons/sunIcon');
require('@keystar/ui/icon/icons/userIcon');
require('@keystar/ui/icon/icons/gitBranchIcon');
require('@keystar/ui/radio');

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
