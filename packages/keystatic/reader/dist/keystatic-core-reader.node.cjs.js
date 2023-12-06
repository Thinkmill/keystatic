'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('node:path');
var fs = require('node:fs/promises');
var generic = require('../../dist/generic-334dab1c.node.cjs.js');
require('@keystar/ui/checkbox');
require('@keystar/ui/typography');
require('react/jsx-runtime');
require('@keystar/ui/text-field');
require('react');
require('../../dist/index-19d616b6.node.cjs.js');
require('@markdoc/markdoc');
require('slate');
require('emery/assertions');
require('emery');
require('js-base64');
require('crypto');
require('@keystar/ui/field');
require('@keystar/ui/layout');
require('@keystar/ui/split-view');
require('@keystar/ui/style');
require('@keystar/ui/button');
require('@keystar/ui/dialog');
require('@keystar/ui/drag-and-drop');
require('@keystar/ui/icon');
require('@keystar/ui/icon/icons/trash2Icon');
require('@keystar/ui/list-view');
require('@keystar/ui/slots');
require('@keystar/ui/tooltip');
require('@react-aria/i18n');
require('slate-react');
require('is-hotkey');
require('@react-aria/utils');
require('@keystar/ui/icon/icons/editIcon');
require('@keystar/ui/icon/icons/externalLinkIcon');
require('@keystar/ui/icon/icons/linkIcon');
require('@keystar/ui/icon/icons/unlinkIcon');
require('@react-aria/overlays');
require('@react-stately/overlays');
require('@keystar/ui/overlays');
require('@braintree/sanitize-url');
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
require('@keystar/ui/menu');
require('@keystar/ui/picker');
require('@keystar/ui/icon/icons/alignLeftIcon');
require('@keystar/ui/icon/icons/alignRightIcon');
require('@keystar/ui/icon/icons/alignCenterIcon');
require('@keystar/ui/icon/icons/quoteIcon');
require('@react-stately/collections');
require('match-sorter');
require('@keystar/ui/combobox');
require('@keystar/ui/icon/icons/trashIcon');
require('@emotion/weak-memoize');
require('@keystar/ui/icon/icons/minusIcon');
require('@keystar/ui/icon/icons/columnsIcon');
require('@keystar/ui/icon/icons/listIcon');
require('@keystar/ui/icon/icons/listOrderedIcon');
require('@keystar/ui/icon/icons/fileUpIcon');
require('@keystar/ui/icon/icons/imageIcon');
require('@keystar/ui/number-field');
require('minimatch');
require('@ts-gql/tag/no-transform');
require('urql');
require('lru-cache');
require('cookie');
require('zod');
require('@sindresorhus/slugify');
require('@keystar/ui/link');
require('@keystar/ui/progress');
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
require('@keystar/ui/icon/icons/panelLeftOpenIcon');
require('@keystar/ui/icon/icons/panelLeftCloseIcon');
require('@keystar/ui/icon/icons/panelRightOpenIcon');
require('@keystar/ui/icon/icons/panelRightCloseIcon');
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
require('../../dist/required-files-714b48bf.node.cjs.js');
require('js-yaml');

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
