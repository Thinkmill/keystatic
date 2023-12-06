import { i as integer, c as component } from '../../dist/api-6105212d.node.react-server.esm.js';
import { ai as text } from '../../dist/index-38c42f5e.node.react-server.esm.js';
import '../../dist/empty-field-ui-5b08ee07.node.react-server.esm.js';
import 'react/jsx-runtime';
import 'emery';
import '@sindresorhus/slugify';
import '@braintree/sanitize-url';
import '@markdoc/markdoc';
import 'slate';
import 'emery/assertions';
import 'js-base64';
import 'crypto';
import '@emotion/weak-memoize';

function CloudImagePreview() {}
let cloudImageToolbarIcon = undefined;

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
