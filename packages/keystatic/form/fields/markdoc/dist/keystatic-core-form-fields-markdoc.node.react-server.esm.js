import Markdoc from '@markdoc/markdoc';
import { g as getDefaultValue, D as DocumentFieldInput, p as parseToEditorState, s as serializeFromEditorState, f as createEditorSchema } from '../../../../dist/empty-field-ui-5b08ee07.node.react-server.esm.js';
import { jsx } from 'react/jsx-runtime';

const textDecoder = new TextDecoder();

/**
 * @deprecated This is experimental and buggy, use at your own risk.
 */
function __experimental_markdoc_field({
  label,
  description,
  config
}) {
  let schema;
  let getSchema = () => {
    if (!schema) {
      schema = createEditorSchema();
    }
    return schema;
  };
  return {
    kind: 'form',
    formKind: 'content',
    defaultValue() {
      return getDefaultValue(getSchema());
    },
    Input(props) {
      return /*#__PURE__*/jsx(DocumentFieldInput, {
        description: description,
        label: label,
        ...props
      });
    },
    parse: (_, {
      content,
      other
    }) => {
      return parseToEditorState(content, getSchema());
    },
    contentExtension: '.mdoc',
    validate(value) {
      return value;
    },
    serialize(value) {
      return {
        ...serializeFromEditorState(),
        external: new Map(),
        value: undefined
      };
    },
    reader: {
      parse: (_, {
        content
      }) => {
        const text = textDecoder.decode(content);
        return {
          ast: Markdoc.parse(text)
        };
      }
    }
  };
}

export { __experimental_markdoc_field };
