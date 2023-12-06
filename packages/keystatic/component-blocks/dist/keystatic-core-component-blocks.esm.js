import { i as integer, c as component } from '../../dist/api-b09297e2.esm.js';
import { a$ as text, b4 as CloudImagePreview, b5 as cloudImageToolbarIcon } from '../../dist/index-47692431.esm.js';
import 'react/jsx-runtime';
import '@keystar/ui/style';
import 'react';
import '@keystar/ui/layout';
import '@keystar/ui/number-field';
import '@keystar/ui/checkbox';
import '@keystar/ui/typography';
import '@keystar/ui/text-field';
import 'emery';
import '@keystar/ui/button';
import '@keystar/ui/field';
import '@keystar/ui/combobox';
import 'minimatch';
import '@react-stately/collections';
import '@keystar/ui/picker';
import '@sindresorhus/slugify';
import '@braintree/sanitize-url';
import '@react-aria/i18n';
import '@keystar/ui/dialog';
import '@keystar/ui/slots';
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
import '@markdoc/markdoc';
import 'emery/assertions';
import 'js-base64';
import '../../dist/hex-35fa8573.esm.js';
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

const cloudImageSchema = {
  src: text({
    label: 'URL',
    validation: {
      length: {
        min: 1
      }
    }
  }),
  alt: text({
    label: 'Alt text'
  }),
  height: integer({
    label: 'Height'
  }),
  width: integer({
    label: 'Width'
  })
};

/** @deprecated Experimental */
function cloudImage(args) {
  return component({
    label: args.label,
    schema: cloudImageSchema,
    preview: CloudImagePreview,
    chromeless: true,
    toolbar: null,
    toolbarIcon: cloudImageToolbarIcon
  });
}

export { cloudImage };
