'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Markdoc = require('@markdoc/markdoc');
var emptyFieldUi = require('../../../../dist/empty-field-ui-11e96e9f.node.react-server.cjs.js');
var jsxRuntime = require('react/jsx-runtime');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var Markdoc__default = /*#__PURE__*/_interopDefault(Markdoc);

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
      schema = emptyFieldUi.createEditorSchema();
    }
    return schema;
  };
  return {
    kind: 'form',
    formKind: 'content',
    defaultValue() {
      return emptyFieldUi.getDefaultValue(getSchema());
    },
    Input(props) {
      return /*#__PURE__*/jsxRuntime.jsx(emptyFieldUi.DocumentFieldInput, {
        description: description,
        label: label,
        ...props
      });
    },
    parse: (_, {
      content,
      other
    }) => {
      return emptyFieldUi.parseToEditorState(content, getSchema());
    },
    contentExtension: '.mdoc',
    validate(value) {
      return value;
    },
    serialize(value) {
      return {
        ...emptyFieldUi.serializeFromEditorState(),
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
          ast: Markdoc__default["default"].parse(text)
        };
      }
    }
  };
}

exports.__experimental_markdoc_field = __experimental_markdoc_field;
