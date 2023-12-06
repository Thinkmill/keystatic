import nodePath from 'node:path';
import nodeFs from 'node:fs/promises';
import { c as collectionReader, s as singletonReader } from '../../dist/generic-f01e8851.esm.js';
import '@keystar/ui/checkbox';
import '@keystar/ui/typography';
import 'react/jsx-runtime';
import '@keystar/ui/text-field';
import 'react';
import '../../dist/index-47692431.esm.js';
import '@markdoc/markdoc';
import 'slate';
import 'emery/assertions';
import 'emery';
import 'js-base64';
import '../../dist/hex-35fa8573.esm.js';
import '@keystar/ui/field';
import '@keystar/ui/layout';
import '@keystar/ui/split-view';
import '@keystar/ui/style';
import '@keystar/ui/button';
import '@keystar/ui/dialog';
import '@keystar/ui/drag-and-drop';
import '@keystar/ui/icon';
import '@keystar/ui/icon/icons/trash2Icon';
import '@keystar/ui/list-view';
import '@keystar/ui/slots';
import '@keystar/ui/tooltip';
import '@react-aria/i18n';
import 'slate-react';
import 'is-hotkey';
import '@react-aria/utils';
import '@keystar/ui/icon/icons/editIcon';
import '@keystar/ui/icon/icons/externalLinkIcon';
import '@keystar/ui/icon/icons/linkIcon';
import '@keystar/ui/icon/icons/unlinkIcon';
import '@react-aria/overlays';
import '@react-stately/overlays';
import '@keystar/ui/overlays';
import '@braintree/sanitize-url';
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
import '@keystar/ui/menu';
import '@keystar/ui/picker';
import '@keystar/ui/icon/icons/alignLeftIcon';
import '@keystar/ui/icon/icons/alignRightIcon';
import '@keystar/ui/icon/icons/alignCenterIcon';
import '@keystar/ui/icon/icons/quoteIcon';
import '@react-stately/collections';
import 'match-sorter';
import '@keystar/ui/combobox';
import '@keystar/ui/icon/icons/trashIcon';
import '@emotion/weak-memoize';
import '@keystar/ui/icon/icons/minusIcon';
import '@keystar/ui/icon/icons/columnsIcon';
import '@keystar/ui/icon/icons/listIcon';
import '@keystar/ui/icon/icons/listOrderedIcon';
import '@keystar/ui/icon/icons/fileUpIcon';
import '@keystar/ui/icon/icons/imageIcon';
import '@keystar/ui/number-field';
import 'minimatch';
import '@ts-gql/tag/no-transform';
import 'urql';
import 'lru-cache';
import 'cookie';
import 'zod';
import '@sindresorhus/slugify';
import '@keystar/ui/link';
import '@keystar/ui/progress';
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
import '@keystar/ui/icon/icons/panelLeftOpenIcon';
import '@keystar/ui/icon/icons/panelLeftCloseIcon';
import '@keystar/ui/icon/icons/panelRightOpenIcon';
import '@keystar/ui/icon/icons/panelRightCloseIcon';
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
import '../../dist/required-files-77a6642f.esm.js';
import 'js-yaml';

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
