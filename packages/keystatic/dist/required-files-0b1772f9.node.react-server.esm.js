import { ac as FieldDataError, q as getInitialPropsValue } from './index-38c42f5e.node.react-server.esm.js';
import { assertNever, assert } from 'emery';
import { load } from 'js-yaml';

function validateArrayLength(schema, val, path) {
  var _schema$validation, _schema$validation2;
  if (((_schema$validation = schema.validation) === null || _schema$validation === void 0 || (_schema$validation = _schema$validation.length) === null || _schema$validation === void 0 ? void 0 : _schema$validation.min) !== undefined && val.length < schema.validation.length.min) {
    return new PropValidationError(new FieldDataError(`Must have at least ${schema.validation.length.min} element${schema.validation.length.min === 1 ? '' : 's'}`), path, schema);
  }
  if (((_schema$validation2 = schema.validation) === null || _schema$validation2 === void 0 || (_schema$validation2 = _schema$validation2.length) === null || _schema$validation2 === void 0 ? void 0 : _schema$validation2.max) !== undefined && val.length > schema.validation.length.max) {
    return new PropValidationError(new FieldDataError(`Must have at most ${schema.validation.length.max} element${schema.validation.length.max === 1 ? '' : 's'}}`), path, schema);
  }
}

class PropValidationError extends Error {
  constructor(cause, path, schema) {
    super(`field error at ${path.join('.')}`, {
      cause
    });
    this.path = path;
    this.schema = schema;
    this.cause = cause;
  }
}
function toFormFieldStoredValue(val) {
  if (val === null) {
    return undefined;
  }
  return val;
}
const isArray = Array.isArray;
function parseProps(schema, _value, path, pathWithArrayFieldSlugs, parseFormField, /** This should be true for the reader and false elsewhere */
validateArrayFieldLength) {
  let value = toFormFieldStoredValue(_value);
  if (schema.kind === 'form') {
    try {
      return parseFormField(schema, value, path, pathWithArrayFieldSlugs);
    } catch (err) {
      throw new PropValidationError(err, path, schema);
    }
  }
  if (schema.kind === 'child') {
    return null;
  }
  if (schema.kind === 'conditional') {
    if (value === undefined) {
      return getInitialPropsValue(schema);
    }
    try {
      if (typeof value !== 'object' || value === null || isArray(value)) {
        throw new FieldDataError('Must be an object');
      }
      for (const key of Object.keys(value)) {
        if (key !== 'discriminant' && key !== 'value') {
          throw new FieldDataError(`Must only contain keys "discriminant" and "value", not "${key}"`);
        }
      }
    } catch (err) {
      throw new PropValidationError(err, path, schema);
    }
    const parsedDiscriminant = parseProps(schema.discriminant, value.discriminant, path.concat('discriminant'), pathWithArrayFieldSlugs.concat('discriminant'), parseFormField, validateArrayFieldLength);
    return {
      discriminant: parsedDiscriminant,
      value: parseProps(schema.values[parsedDiscriminant], value.value, path.concat('value'), pathWithArrayFieldSlugs.concat('value'), parseFormField, validateArrayFieldLength)
    };
  }
  if (schema.kind === 'object') {
    if (value === undefined) {
      value = {};
    }
    try {
      if (typeof value !== 'object' || value === null || isArray(value)) {
        throw new FieldDataError('Must be an object');
      }
      const allowedKeysSet = new Set(Object.keys(schema.fields));
      for (const key of Object.keys(value)) {
        if (!allowedKeysSet.has(key)) {
          throw new FieldDataError(`Key on object value "${key}" is not allowed`);
        }
      }
    } catch (err) {
      throw new PropValidationError(err, path, schema);
    }
    const val = {};
    const errors = [];
    for (const key of Object.keys(schema.fields)) {
      let individualVal = value[key];
      try {
        const propVal = parseProps(schema.fields[key], individualVal, path.concat(key), pathWithArrayFieldSlugs.concat(key), parseFormField, validateArrayFieldLength);
        val[key] = propVal;
      } catch (err) {
        errors.push(err);
      }
    }
    if (errors.length) {
      throw new AggregateError(errors);
    }
    return val;
  }
  if (schema.kind === 'array') {
    if (value === undefined) {
      return [];
    }
    try {
      if (!isArray(value)) {
        throw new FieldDataError('Must be an array');
      }
    } catch (err) {
      throw new PropValidationError(err, path, schema);
    }
    const errors = [];
    try {
      if (validateArrayFieldLength) {
        const error = validateArrayLength(schema, value, path);
        if (error !== undefined) {
          errors.push(error);
        }
      }
      return value.map((innerVal, i) => {
        try {
          let slug = i.toString();
          if (schema.slugField && typeof innerVal === 'object' && innerVal !== null && !isArray(innerVal)) {
            if (schema.element.kind !== 'object') {
              throw new Error('slugField on array fields requires the an object field element');
            }
            const slugField = schema.element.fields[schema.slugField];
            if (!slugField) {
              throw new Error(`slugField "${schema.slugField}" does not exist on object field`);
            }
            if (slugField.kind !== 'form') {
              throw new Error(`slugField "${schema.slugField}" is not a form field`);
            }
            if (slugField.formKind !== 'slug') {
              throw new Error(`slugField "${schema.slugField}" is not a slug field`);
            }
            let parsedSlugFieldValue;
            try {
              parsedSlugFieldValue = slugField.parse(toFormFieldStoredValue(innerVal[schema.slugField]), undefined);
            } catch (err) {
              throw new AggregateError([err]);
            }
            slug = slugField.serializeWithSlug(parsedSlugFieldValue).slug;
          }
          return parseProps(schema.element, innerVal, path.concat(i), pathWithArrayFieldSlugs.concat(slug), parseFormField, validateArrayFieldLength);
        } catch (err) {
          errors.push(err);
        }
      });
    } finally {
      if (errors.length) {
        throw new AggregateError(errors);
      }
    }
  }
  assertNever(schema);
}

function flattenErrors(error) {
  if (error instanceof AggregateError) {
    return error.errors.flatMap(flattenErrors);
  }
  return [error];
}
function formatFormDataError(error) {
  const flatErrors = flattenErrors(error);
  return flatErrors.map(error => {
    if (error instanceof PropValidationError) {
      const path = error.path.join('.');
      return `${path}: ${error.cause instanceof FieldDataError ? error.cause.message : `Unexpected error: ${error.cause}`}`;
    }
    return `Unexpected error: ${error}`;
  }).join('\n');
}
function toFormattedFormDataError(error) {
  const formatted = formatFormDataError(error);
  return new Error(`Field validation failed:\n` + formatted);
}

const textDecoder = new TextDecoder();
const textEncoder = new TextEncoder();
function splitFrontmatter(data) {
  const str = textDecoder.decode(data);
  const match = str.match(/^---(?:\r?\n([^]*?))?\r?\n---\r?\n?/);
  if (match) {
    var _match$;
    const encoded = textEncoder.encode(match[0]);
    return {
      frontmatter: (_match$ = match[1]) !== null && _match$ !== void 0 ? _match$ : '',
      content: data.slice(encoded.byteLength)
    };
  }
  return null;
}
function loadDataFile(data, formatInfo) {
  const parse = formatInfo.data === 'json' ? JSON.parse : load;
  if (!formatInfo.contentField) {
    const dataFile = textDecoder.decode(data);
    return {
      loaded: parse(dataFile)
    };
  }
  const res = splitFrontmatter(data);
  assert(res !== null, 'frontmatter not found');
  return {
    loaded: parse(res.frontmatter),
    extraFakeFile: {
      path: `${formatInfo.contentField.key}${formatInfo.contentField.config.contentExtension}`,
      contents: res.content
    }
  };
}

export { PropValidationError as P, formatFormDataError as f, loadDataFile as l, parseProps as p, toFormattedFormDataError as t, validateArrayLength as v };
