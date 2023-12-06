'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var api = require('../../dist/api-abcf49dc.cjs.js');
var index = require('../../dist/index-acec34fd.cjs.js');
require('react/jsx-runtime');
require('@keystar/ui/style');
require('react');
require('@keystar/ui/layout');
require('@keystar/ui/number-field');
require('@keystar/ui/checkbox');
require('@keystar/ui/typography');
require('@keystar/ui/text-field');
require('emery');
require('@keystar/ui/button');
require('@keystar/ui/field');
require('@keystar/ui/combobox');
require('minimatch');
require('@react-stately/collections');
require('@keystar/ui/picker');
require('@sindresorhus/slugify');
require('@braintree/sanitize-url');
require('@react-aria/i18n');
require('@keystar/ui/dialog');
require('@keystar/ui/slots');
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
require('@markdoc/markdoc');
require('emery/assertions');
require('js-base64');
require('../../dist/hex-35fdf290.cjs.js');
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

const cloudImageSchema = {
  src: index.text({
    label: 'URL',
    validation: {
      length: {
        min: 1
      }
    }
  }),
  alt: index.text({
    label: 'Alt text'
  }),
  height: api.integer({
    label: 'Height'
  }),
  width: api.integer({
    label: 'Width'
  })
};

/** @deprecated Experimental */
function cloudImage(args) {
  return api.component({
    label: args.label,
    schema: cloudImageSchema,
    preview: index.CloudImagePreview,
    chromeless: true,
    toolbar: null,
    toolbarIcon: index.cloudImageToolbarIcon
  });
}

exports.cloudImage = cloudImage;
