import { ad as basicFormFieldWithSimpleReaderParse, ac as FieldDataError, ae as assertRequired } from './index-38c42f5e.node.react-server.esm.js';
import { e as IntegerFieldInput } from './empty-field-ui-5b08ee07.node.react-server.esm.js';
import { jsx } from 'react/jsx-runtime';
import 'emery';
import '@sindresorhus/slugify';
import '@braintree/sanitize-url';

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
