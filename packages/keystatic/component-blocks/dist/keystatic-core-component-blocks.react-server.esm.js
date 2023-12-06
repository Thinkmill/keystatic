import { i as integer, c as component } from '../../dist/api-c4c94d3b.react-server.esm.js';
import { ai as text } from '../../dist/index-5160e4ae.react-server.esm.js';
import '../../dist/empty-field-ui-1936cae8.react-server.esm.js';
import 'react/jsx-runtime';
import 'emery';
import '@sindresorhus/slugify';
import '@braintree/sanitize-url';
import '@markdoc/markdoc';
import 'slate';
import 'emery/assertions';
import 'js-base64';
import '../../dist/hex-2b4d164f.react-server.esm.js';
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
