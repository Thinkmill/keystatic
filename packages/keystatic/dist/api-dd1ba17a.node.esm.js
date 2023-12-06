import { aw as basicFormFieldWithSimpleReaderParse, ax as FieldDataError, ay as assertRequired } from './index-b6d17606.node.esm.js';
import { NumberField } from '@keystar/ui/number-field';
import { useReducer } from 'react';
import { jsx } from 'react/jsx-runtime';
import '@keystar/ui/checkbox';
import '@keystar/ui/typography';
import '@keystar/ui/text-field';
import 'emery';
import '@keystar/ui/button';
import '@keystar/ui/field';
import '@keystar/ui/layout';
import '@keystar/ui/style';
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
  const [blurred, onBlur] = useReducer(() => true, false);
  return /*#__PURE__*/jsx(NumberField, {
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
  return basicFormFieldWithSimpleReaderParse({
    Input(props) {
      return /*#__PURE__*/jsx(IntegerFieldInput, {
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
      throw new FieldDataError('Must be a number');
    },
    validate(value) {
      const message = validateInteger(validation, value, label);
      if (message !== undefined) {
        throw new FieldDataError(message);
      }
      assertRequired(value, validation, label);
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

export { component as c, integer as i };
