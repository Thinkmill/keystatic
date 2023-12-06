import { c as collectionReader, s as singletonReader, a as cache } from '../../../dist/generic-68283515.node.esm.js';
import { aH as fixPath, r as getTreeNodeAtPath, b4 as treeEntriesToTreeNodes } from '../../../dist/index-b6d17606.node.esm.js';
import '@keystar/ui/checkbox';
import '@keystar/ui/typography';
import 'react/jsx-runtime';
import '@keystar/ui/text-field';
import 'react';
import '@keystar/ui/button';
import '@keystar/ui/field';
import '@keystar/ui/layout';
import '@keystar/ui/style';
import '@keystar/ui/number-field';
import '@keystar/ui/combobox';
import 'minimatch';
import '@react-stately/collections';
import '@keystar/ui/picker';
import '@sindresorhus/slugify';
import '@braintree/sanitize-url';
import '@react-aria/i18n';
import '@keystar/ui/dialog';
import '@keystar/ui/slots';
import 'emery';
import '@keystar/ui/drag-and-drop';
import '@keystar/ui/icon';
import '@keystar/ui/icon/icons/trash2Icon';
import '@keystar/ui/list-view';
import '@keystar/ui/tooltip';
import 'slate';
import 'slate-react';
import '@keystar/ui/split-view';
import '@keystar/ui/icon/icons/panelLeftOpenIcon';
import '@keystar/ui/icon/icons/panelLeftCloseIcon';
import '@keystar/ui/icon/icons/panelRightOpenIcon';
import '@keystar/ui/icon/icons/panelRightCloseIcon';
import '@keystar/ui/menu';
import '@keystar/ui/link';
import '@keystar/ui/progress';
import '../../../dist/required-files-f12cd7f9.node.esm.js';
import 'js-yaml';
import '@markdoc/markdoc';
import 'emery/assertions';
import 'js-base64';
import 'crypto';
import 'is-hotkey';
import '@react-aria/utils';
import '@keystar/ui/icon/icons/editIcon';
import '@keystar/ui/icon/icons/externalLinkIcon';
import '@keystar/ui/icon/icons/linkIcon';
import '@keystar/ui/icon/icons/unlinkIcon';
import '@react-aria/overlays';
import '@react-stately/overlays';
import '@keystar/ui/overlays';
import '@keystar/ui/action-group';
import '@keystar/ui/icon/icons/boldIcon';
import '@keystar/ui/icon/icons/chevronDownIcon';
import '@keystar/ui/icon/icons/codeIcon';
import '@keystar/ui/icon/icons/italicIcon';
import '@keystar/ui/icon/icons/maximizeIcon';
import '@keystar/ui/icon/icons/minimizeIcon';
import '@keystar/ui/icon/icons/plusIcon';
import '@keystar/ui/icon/icons/removeFormattingIcon';
import '@keystar/ui/icon/icons/strikethroughIcon';
import '@keystar/ui/icon/icons/subscriptIcon';
import '@keystar/ui/icon/icons/superscriptIcon';
import '@keystar/ui/icon/icons/typeIcon';
import '@keystar/ui/icon/icons/underlineIcon';
import '@keystar/ui/icon/icons/alignLeftIcon';
import '@keystar/ui/icon/icons/alignRightIcon';
import '@keystar/ui/icon/icons/alignCenterIcon';
import '@keystar/ui/icon/icons/quoteIcon';
import 'match-sorter';
import '@keystar/ui/icon/icons/trashIcon';
import '@emotion/weak-memoize';
import '@keystar/ui/icon/icons/minusIcon';
import '@keystar/ui/icon/icons/columnsIcon';
import '@keystar/ui/icon/icons/listIcon';
import '@keystar/ui/icon/icons/listOrderedIcon';
import '@keystar/ui/icon/icons/fileUpIcon';
import '@keystar/ui/icon/icons/imageIcon';
import '@ts-gql/tag/no-transform';
import 'urql';
import 'lru-cache';
import 'cookie';
import 'zod';
import '@keystar/ui/icon/icons/link2Icon';
import '@keystar/ui/icon/icons/link2OffIcon';
import '@keystar/ui/icon/icons/pencilIcon';
import '@keystar/ui/icon/icons/undo2Icon';
import '@keystar/ui/utils';
import '@keystar/ui/icon/icons/sheetIcon';
import '@keystar/ui/icon/icons/tableIcon';
import 'scroll-into-view-if-needed';
import '@react-stately/list';
import '@keystar/ui/listbox';
import 'slate-history';
import 'mdast-util-from-markdown';
import 'mdast-util-gfm-autolink-literal/from-markdown';
import 'micromark-extension-gfm-autolink-literal';
import 'mdast-util-gfm-strikethrough/from-markdown';
import 'micromark-extension-gfm-strikethrough';
import '@keystar/ui/badge';
import '@keystar/ui/nav-list';
import '@keystar/ui/status-light';
import '@keystar/ui/core';
import '@keystar/ui/avatar';
import '@keystar/ui/icon/icons/logOutIcon';
import '@keystar/ui/icon/icons/gitPullRequestIcon';
import '@keystar/ui/icon/icons/gitBranchPlusIcon';
import '@keystar/ui/icon/icons/githubIcon';
import '@keystar/ui/icon/icons/gitForkIcon';
import '@keystar/ui/icon/icons/monitorIcon';
import '@keystar/ui/icon/icons/moonIcon';
import '@keystar/ui/icon/icons/sunIcon';
import '@keystar/ui/icon/icons/userIcon';
import '@keystar/ui/icon/icons/gitBranchIcon';
import '@keystar/ui/radio';

function createGitHubReader(config, opts) {
  var _opts$ref;
  const ref = (_opts$ref = opts.ref) !== null && _opts$ref !== void 0 ? _opts$ref : 'HEAD';
  const pathPrefix = opts.pathPrefix ? fixPath(opts.pathPrefix) + '/' : '';
  const getTree = cache(async function loadTree() {
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
      tree: treeEntriesToTreeNodes(tree),
      sha
    };
  });
  const fs = {
    async fileExists(path) {
      const {
        tree
      } = await getTree();
      const node = getTreeNodeAtPath(tree, fixPath(`${pathPrefix}${path}`));
      return (node === null || node === void 0 ? void 0 : node.entry.type) === 'blob';
    },
    async readdir(path) {
      const {
        tree
      } = await getTree();
      const node = getTreeNodeAtPath(tree, fixPath(`${pathPrefix}${path}`));
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
    collections: Object.fromEntries(Object.keys(config.collections || {}).map(key => [key, collectionReader(key, config, fs)])),
    singletons: Object.fromEntries(Object.keys(config.singletons || {}).map(key => [key, singletonReader(key, config, fs)])),
    config
  };
}

export { createGitHubReader };
