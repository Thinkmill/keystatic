'use strict';

var index = require('./index-acec34fd.cjs.js');
var numberField = require('@keystar/ui/number-field');
var React = require('react');
var jsxRuntime = require('react/jsx-runtime');
require('@keystar/ui/checkbox');
require('@keystar/ui/typography');
require('@keystar/ui/text-field');
require('emery');
require('@keystar/ui/button');
require('@keystar/ui/field');
require('@keystar/ui/layout');
require('@keystar/ui/style');
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

function validateInteger(validation, value, label) {
  if (value !== null && (typeof value !== 'number' || !Number.isFinite(value))) {
    return `${label} is not a valid whole number`;
  }
  if (validation !== null && validation !== void 0 && validation.isRequired && value === null) {
    return `${label} is required`;
  }
  if (value !== null) {
    if ((validation === null || validation === void 0 ? void 0 : validation.min) !== undefined && value < validation.min) {
      return `${label} must be at least ${validation.min}`;
    }
    if ((validation === null || validation === void 0 ? void 0 : validation.max) !== undefined && value > validation.max) {
      return `${label} must be at most ${validation.max}`;
    }
  }
}

function IntegerFieldInput(props) {
  var _props$validation;
  const [blurred, onBlur] = React.useReducer(() => true, false);
  return /*#__PURE__*/jsxRuntime.jsx(numberField.NumberField, {
    label: props.label,
    description: props.description,
    isRequired: (_props$validation = props.validation) === null || _props$validation === void 0 ? void 0 : _props$validation.isRequired,
    errorMessage: props.forceValidation || blurred ? validateInteger(props.validation, props.value, props.label) : undefined,
    onBlur: onBlur,
    autoFocus: props.autoFocus,
    value: props.value === null ? undefined : props.value,
    onChange: val => {
      props.onChange(val === undefined ? null : val);
    }
  });
}

function integer({
  label,
  defaultValue,
  validation,
  description
}) {
  return index.basicFormFieldWithSimpleReaderParse({
    Input(props) {
      return /*#__PURE__*/jsxRuntime.jsx(IntegerFieldInput, {
        label: label,
        description: description,
        validation: validation,
        ...props
      });
    },
    defaultValue() {
      return defaultValue !== null && defaultValue !== void 0 ? defaultValue : null;
    },
    parse(value) {
      if (value === undefined) {
        return null;
      }
      if (typeof value === 'number') {
        return value;
      }
      throw new index.FieldDataError('Must be a number');
    },
    validate(value) {
      const message = validateInteger(validation, value, label);
      if (message !== undefined) {
        throw new index.FieldDataError(message);
      }
      index.assertRequired(value, validation, label);
      return value;
    },
    serialize(value) {
      return {
        value: value === null ? undefined : value
      };
    }
  });
}

// this is written like this rather than ArrayField<ComponentSchema> to avoid TypeScript erroring about circularity
function component(options) {
  return options;
}

exports.component = component;
exports.integer = integer;
