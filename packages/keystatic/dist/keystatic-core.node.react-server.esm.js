import { i as isValidURL } from './isValidURL-5dbf1da3.node.react-server.esm.js';
export { a as collection, c as config, s as singleton } from './isValidURL-5dbf1da3.node.react-server.esm.js';
import { i as integer } from './api-6105212d.node.react-server.esm.js';
export { c as component } from './api-6105212d.node.react-server.esm.js';
import { C as CheckboxFieldInput, a as DateFieldInput, b as DatetimeFieldInput, I as ImageFieldInput, F as FileFieldInput, M as MultiselectFieldInput, P as PathReferenceInput, R as RelationshipInput, S as SelectFieldInput, c as SlugFieldInput, U as UrlFieldInput, B as BlocksFieldInput, d as CloudImageFieldInput } from './empty-field-ui-5b08ee07.node.react-server.esm.js';
import { ad as basicFormFieldWithSimpleReaderParse, ac as FieldDataError, ae as assertRequired, af as getSrcPrefix, ag as fixPath, ah as validateText, N as object, ai as text, aj as document } from './index-38c42f5e.node.react-server.esm.js';
import { jsx } from 'react/jsx-runtime';
import slugify from '@sindresorhus/slugify';
import 'emery';
import '@braintree/sanitize-url';
import '@markdoc/markdoc';
import 'slate';
import 'emery/assertions';
import 'js-base64';
import 'crypto';
import '@emotion/weak-memoize';

function array(element, opts) {
  var _opts$label;
  return {
    kind: 'array',
    element,
    label: (_opts$label = opts === null || opts === void 0 ? void 0 : opts.label) !== null && _opts$label !== void 0 ? _opts$label : 'Items',
    description: opts === null || opts === void 0 ? void 0 : opts.description,
    itemLabel: opts === null || opts === void 0 ? void 0 : opts.itemLabel,
    asChildTag: opts === null || opts === void 0 ? void 0 : opts.asChildTag,
    slugField: opts === null || opts === void 0 ? void 0 : opts.slugField,
    validation: opts === null || opts === void 0 ? void 0 : opts.validation
  };
}

function checkbox({
  label,
  defaultValue = false,
  description
}) {
  return basicFormFieldWithSimpleReaderParse({
    Input(props) {
      return /*#__PURE__*/jsx(CheckboxFieldInput, {
        ...props,
        label: label,
        description: description
      });
    },
    defaultValue() {
      return defaultValue;
    },
    parse(value) {
      if (value === undefined) return defaultValue;
      if (typeof value !== 'boolean') {
        throw new FieldDataError('Must be a boolean');
      }
      return value;
    },
    validate(value) {
      return value;
    },
    serialize(value) {
      return {
        value
      };
    }
  });
}

function child(options) {
  return {
    kind: 'child',
    options: options.kind === 'block' ? {
      ...options,
      dividers: options.dividers,
      formatting: options.formatting === 'inherit' ? {
        blockTypes: 'inherit',
        headingLevels: 'inherit',
        inlineMarks: 'inherit',
        listTypes: 'inherit',
        alignment: 'inherit',
        softBreaks: 'inherit'
      } : options.formatting,
      links: options.links,
      images: options.images,
      tables: options.tables,
      componentBlocks: options.componentBlocks
    } : {
      kind: 'inline',
      placeholder: options.placeholder,
      formatting: options.formatting === 'inherit' ? {
        inlineMarks: 'inherit',
        softBreaks: 'inherit'
      } : options.formatting,
      links: options.links
    }
  };
}

function conditional(discriminant, values) {
  return {
    kind: 'conditional',
    discriminant,
    values: values
  };
}

function validateDate(validation, value, label) {
  if (value !== null && !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return `${label} is not a valid date`;
  }
  if (validation !== null && validation !== void 0 && validation.isRequired && value === null) {
    return `${label} is required`;
  }
  if ((validation !== null && validation !== void 0 && validation.min || validation !== null && validation !== void 0 && validation.max) && value !== null) {
    const date = new Date(value);
    if ((validation === null || validation === void 0 ? void 0 : validation.min) !== undefined) {
      const min = new Date(validation.min);
      if (date < min) {
        return `${label} must be after ${min.toLocaleDateString()}`;
      }
    }
    if ((validation === null || validation === void 0 ? void 0 : validation.max) !== undefined) {
      const max = new Date(validation.max);
      if (date > max) {
        return `${label} must be no later than ${max.toLocaleDateString()}`;
      }
    }
  }
}

function date({
  label,
  defaultValue,
  validation,
  description
}) {
  return basicFormFieldWithSimpleReaderParse({
    Input(props) {
      return /*#__PURE__*/jsx(DateFieldInput, {
        validation: validation,
        label: label,
        description: description,
        ...props
      });
    },
    defaultValue() {
      if (defaultValue === undefined) {
        return null;
      }
      if (typeof defaultValue === 'string') {
        return defaultValue;
      }
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    parse(value) {
      if (value === undefined) {
        return null;
      }
      if (typeof value !== 'string') {
        throw new FieldDataError('Must be a string');
      }
      return value;
    },
    serialize(value) {
      return {
        value: value === null ? undefined : value
      };
    },
    validate(value) {
      const message = validateDate(validation, value, label);
      if (message !== undefined) {
        throw new FieldDataError(message);
      }
      assertRequired(value, validation, label);
      return value;
    }
  });
}

function validateDatetime(validation, value, label) {
  if (value !== null && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return `${label} is not a valid datetime`;
  }
  if (validation !== null && validation !== void 0 && validation.isRequired && value === null) {
    return `${label} is required`;
  }
  if ((validation !== null && validation !== void 0 && validation.min || validation !== null && validation !== void 0 && validation.max) && value !== null) {
    const datetime = new Date(value);
    if ((validation === null || validation === void 0 ? void 0 : validation.min) !== undefined) {
      const min = new Date(validation.min);
      if (datetime < min) {
        return `${label} must be after ${min.toISOString()}`;
      }
    }
    if ((validation === null || validation === void 0 ? void 0 : validation.max) !== undefined) {
      const max = new Date(validation.max);
      if (datetime > max) {
        return `${label} must be no later than ${max.toISOString()}`;
      }
    }
  }
}

function datetime({
  label,
  defaultValue,
  validation,
  description
}) {
  return basicFormFieldWithSimpleReaderParse({
    Input(props) {
      return /*#__PURE__*/jsx(DatetimeFieldInput, {
        validation: validation,
        label: label,
        description: description,
        ...props
      });
    },
    defaultValue() {
      if (defaultValue === undefined) {
        return null;
      }
      if (typeof defaultValue === 'string') {
        return defaultValue;
      }
      if (defaultValue.kind === 'now') {
        const now = new Date();
        return now.toISOString();
      }
      return null;
    },
    parse(value) {
      if (value === undefined) {
        return null;
      }
      if (typeof value !== 'string') {
        throw new FieldDataError('Must be a string');
      }
      return value;
    },
    serialize(value) {
      return {
        value: value === null ? undefined : value
      };
    },
    validate(value) {
      const message = validateDatetime(validation, value, label);
      if (message !== undefined) {
        throw new FieldDataError(message);
      }
      assertRequired(value, validation, label);
      return value;
    }
  });
}

function emptyDocument() {
  return {
    kind: 'form',
    formKind: 'content',
    Input() {
      return null;
    },
    defaultValue() {
      return null;
    },
    parse() {
      return null;
    },
    contentExtension: '.mdoc',
    serialize() {
      return {
        value: undefined,
        content: new Uint8Array(),
        external: new Map(),
        other: new Map()
      };
    },
    validate(value) {
      return value;
    },
    reader: {
      parse() {
        return null;
      }
    }
  };
}

function empty() {
  return basicFormFieldWithSimpleReaderParse({
    Input() {
      return null;
    },
    defaultValue() {
      return null;
    },
    parse() {
      return null;
    },
    serialize() {
      return {
        value: undefined
      };
    },
    validate(value) {
      return value;
    }
  });
}

function image({
  label,
  directory,
  validation,
  description,
  publicPath
}) {
  return {
    kind: 'form',
    formKind: 'asset',
    Input(props) {
      return /*#__PURE__*/jsx(ImageFieldInput, {
        label: label,
        description: description,
        validation: validation,
        ...props
      });
    },
    defaultValue() {
      return null;
    },
    filename(value, args) {
      if (typeof value === 'string') {
        return value.slice(getSrcPrefix(publicPath, args.slug).length);
      }
      return undefined;
    },
    parse(value, args) {
      var _value$match$, _value$match;
      if (value === undefined) {
        return null;
      }
      if (typeof value !== 'string') {
        throw new FieldDataError('Must be a string');
      }
      if (args.asset === undefined) {
        return null;
      }
      return {
        data: args.asset,
        filename: value.slice(getSrcPrefix(publicPath, args.slug).length),
        extension: (_value$match$ = (_value$match = value.match(/\.([^.]+$)/)) === null || _value$match === void 0 ? void 0 : _value$match[1]) !== null && _value$match$ !== void 0 ? _value$match$ : ''
      };
    },
    validate(value) {
      assertRequired(value, validation, label);
      return value;
    },
    serialize(value, args) {
      if (value === null) {
        return {
          value: undefined,
          asset: undefined
        };
      }
      const filename = args.suggestedFilenamePrefix ? args.suggestedFilenamePrefix + '.' + value.extension : value.filename;
      return {
        value: `${getSrcPrefix(publicPath, args.slug)}${filename}`,
        asset: {
          filename,
          content: value.data
        }
      };
    },
    directory: directory ? fixPath(directory) : undefined,
    reader: {
      parse(value) {
        if (typeof value !== 'string' && value !== undefined) {
          throw new FieldDataError('Must be a string');
        }
        const val = value === undefined ? null : value;
        assertRequired(val, validation, label);
        return val;
      }
    }
  };
}

function file({
  label,
  directory,
  validation,
  description,
  publicPath
}) {
  return {
    kind: 'form',
    formKind: 'asset',
    Input(props) {
      return /*#__PURE__*/jsx(FileFieldInput, {
        label: label,
        description: description,
        validation: validation,
        ...props
      });
    },
    defaultValue() {
      return null;
    },
    filename(value, args) {
      if (typeof value === 'string') {
        return value.slice(getSrcPrefix(publicPath, args.slug).length);
      }
      return undefined;
    },
    parse(value, args) {
      var _value$match$, _value$match;
      if (value === undefined) {
        return null;
      }
      if (typeof value !== 'string') {
        throw new FieldDataError('Must be a string');
      }
      if (args.asset === undefined) {
        return null;
      }
      return {
        data: args.asset,
        filename: value.slice(getSrcPrefix(publicPath, args.slug).length),
        extension: (_value$match$ = (_value$match = value.match(/\.([^.]+$)/)) === null || _value$match === void 0 ? void 0 : _value$match[1]) !== null && _value$match$ !== void 0 ? _value$match$ : ''
      };
    },
    validate(value) {
      assertRequired(value, validation, label);
      return value;
    },
    serialize(value, args) {
      if (value === null) {
        return {
          value: undefined,
          asset: undefined
        };
      }
      const filename = args.suggestedFilenamePrefix ? args.suggestedFilenamePrefix + '.' + value.extension : value.filename;
      return {
        value: `${getSrcPrefix(publicPath, args.slug)}${filename}`,
        asset: {
          filename,
          content: value.data
        }
      };
    },
    directory: directory ? fixPath(directory) : undefined,
    reader: {
      parse(value) {
        if (typeof value !== 'string' && value !== undefined) {
          throw new FieldDataError('Must be a string');
        }
        const val = value === undefined ? null : value;
        assertRequired(val, validation, label);
        return val;
      }
    }
  };
}

function multiselect({
  label,
  options,
  defaultValue = [],
  description
}) {
  const valuesToOption = new Map(options.map(x => [x.value, x]));
  const field = basicFormFieldWithSimpleReaderParse({
    Input(props) {
      return /*#__PURE__*/jsx(MultiselectFieldInput, {
        label: label,
        description: description,
        options: options,
        ...props
      });
    },
    defaultValue() {
      return defaultValue;
    },
    parse(value) {
      if (value === undefined) {
        return [];
      }
      if (!Array.isArray(value)) {
        throw new FieldDataError('Must be an array of options');
      }
      if (!value.every(x => typeof x === 'string' && valuesToOption.has(x))) {
        throw new FieldDataError(`Must be an array with one of ${options.map(x => x.value).join(', ')}`);
      }
      return value;
    },
    validate(value) {
      return value;
    },
    serialize(value) {
      return {
        value
      };
    }
  });
  return {
    ...field,
    options
  };
}

function pathReference({
  label,
  pattern,
  validation,
  description
}) {
  return basicFormFieldWithSimpleReaderParse({
    Input(props) {
      return /*#__PURE__*/jsx(PathReferenceInput, {
        label: label,
        pattern: pattern,
        description: description,
        validation: validation,
        ...props
      });
    },
    defaultValue() {
      return null;
    },
    parse(value) {
      if (value === undefined) {
        return null;
      }
      if (typeof value !== 'string') {
        throw new FieldDataError('Must be a string');
      }
      return value;
    },
    validate(value) {
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

function relationship({
  label,
  collection,
  validation,
  description
}) {
  return basicFormFieldWithSimpleReaderParse({
    Input(props) {
      return /*#__PURE__*/jsx(RelationshipInput, {
        label: label,
        collection: collection,
        description: description,
        validation: validation,
        ...props
      });
    },
    defaultValue() {
      return null;
    },
    parse(value) {
      if (value === undefined) {
        return null;
      }
      if (typeof value !== 'string') {
        throw new FieldDataError('Must be a string');
      }
      return value;
    },
    validate(value) {
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

function select({
  label,
  options,
  defaultValue,
  description
}) {
  const optionValuesSet = new Set(options.map(x => x.value));
  if (!optionValuesSet.has(defaultValue)) {
    throw new Error(`A defaultValue of ${defaultValue} was provided to a select field but it does not match the value of one of the options provided`);
  }
  const field = basicFormFieldWithSimpleReaderParse({
    Input(props) {
      return /*#__PURE__*/jsx(SelectFieldInput, {
        label: label,
        options: options,
        description: description,
        ...props
      });
    },
    defaultValue() {
      return defaultValue;
    },
    parse(value) {
      if (value === undefined) {
        return defaultValue;
      }
      if (typeof value !== 'string') {
        throw new FieldDataError('Must be a string');
      }
      if (!optionValuesSet.has(value)) {
        throw new FieldDataError('Must be a valid option');
      }
      return value;
    },
    validate(value) {
      return value;
    },
    serialize(value) {
      return {
        value
      };
    }
  });
  return {
    ...field,
    options
  };
}

function parseSlugFieldAsNormalField(value) {
  if (value === undefined) {
    return {
      name: '',
      slug: ''
    };
  }
  if (typeof value !== 'object') {
    throw new FieldDataError('Must be an object');
  }
  if (Object.keys(value).length !== 2) {
    throw new FieldDataError('Unexpected keys');
  }
  if (!('name' in value) || !('slug' in value)) {
    throw new FieldDataError('Missing name or slug');
  }
  if (typeof value.name !== 'string') {
    throw new FieldDataError('name must be a string');
  }
  if (typeof value.slug !== 'string') {
    throw new FieldDataError('slug must be a string');
  }
  return {
    name: value.name,
    slug: value.slug
  };
}
function parseAsSlugField(value, slug) {
  if (value === undefined) {
    return {
      name: '',
      slug
    };
  }
  if (typeof value !== 'string') {
    throw new FieldDataError('Must be a string');
  }
  return {
    name: value,
    slug
  };
}
function slug(args) {
  var _args$slug, _args$name$defaultVal, _args$name$defaultVal2;
  const naiveGenerateSlug = ((_args$slug = args.slug) === null || _args$slug === void 0 ? void 0 : _args$slug.generate) || slugify;
  const defaultValue = {
    name: (_args$name$defaultVal = args.name.defaultValue) !== null && _args$name$defaultVal !== void 0 ? _args$name$defaultVal : '',
    slug: naiveGenerateSlug((_args$name$defaultVal2 = args.name.defaultValue) !== null && _args$name$defaultVal2 !== void 0 ? _args$name$defaultVal2 : '')
  };
  function validate(value, {
    slugField
  } = {
    slugField: undefined
  }) {
    var _args$name$validation, _args$name$validation2, _args$name$validation3, _args$name$validation4, _args$slug$validation, _args$slug2, _args$slug$validation2, _args$slug3, _args$slug$label, _args$slug4;
    const nameMessage = validateText(value.name, (_args$name$validation = (_args$name$validation2 = args.name.validation) === null || _args$name$validation2 === void 0 || (_args$name$validation2 = _args$name$validation2.length) === null || _args$name$validation2 === void 0 ? void 0 : _args$name$validation2.min) !== null && _args$name$validation !== void 0 ? _args$name$validation : 0, (_args$name$validation3 = (_args$name$validation4 = args.name.validation) === null || _args$name$validation4 === void 0 || (_args$name$validation4 = _args$name$validation4.length) === null || _args$name$validation4 === void 0 ? void 0 : _args$name$validation4.max) !== null && _args$name$validation3 !== void 0 ? _args$name$validation3 : Infinity, args.name.label, undefined);
    if (nameMessage !== undefined) {
      throw new FieldDataError(nameMessage);
    }
    const slugMessage = validateText(value.slug, (_args$slug$validation = (_args$slug2 = args.slug) === null || _args$slug2 === void 0 || (_args$slug2 = _args$slug2.validation) === null || _args$slug2 === void 0 || (_args$slug2 = _args$slug2.length) === null || _args$slug2 === void 0 ? void 0 : _args$slug2.min) !== null && _args$slug$validation !== void 0 ? _args$slug$validation : 1, (_args$slug$validation2 = (_args$slug3 = args.slug) === null || _args$slug3 === void 0 || (_args$slug3 = _args$slug3.validation) === null || _args$slug3 === void 0 || (_args$slug3 = _args$slug3.length) === null || _args$slug3 === void 0 ? void 0 : _args$slug3.max) !== null && _args$slug$validation2 !== void 0 ? _args$slug$validation2 : Infinity, (_args$slug$label = (_args$slug4 = args.slug) === null || _args$slug4 === void 0 ? void 0 : _args$slug4.label) !== null && _args$slug$label !== void 0 ? _args$slug$label : 'Slug', slugField ? slugField : {
      slugs: emptySet,
      glob: '*'
    });
    if (slugMessage !== undefined) {
      throw new FieldDataError(slugMessage);
    }
    return value;
  }
  const emptySet = new Set();
  return {
    kind: 'form',
    formKind: 'slug',
    Input(props) {
      return /*#__PURE__*/jsx(SlugFieldInput, {
        args: args,
        naiveGenerateSlug: naiveGenerateSlug,
        defaultValue: defaultValue,
        ...props
      });
    },
    defaultValue() {
      return defaultValue;
    },
    parse(value, args) {
      if ((args === null || args === void 0 ? void 0 : args.slug) !== undefined) {
        return parseAsSlugField(value, args.slug);
      }
      return parseSlugFieldAsNormalField(value);
    },
    validate,
    serialize(value) {
      return {
        value
      };
    },
    serializeWithSlug(value) {
      return {
        value: value.name,
        slug: value.slug
      };
    },
    reader: {
      parse(value) {
        const parsed = parseSlugFieldAsNormalField(value);
        return validate(parsed);
      },
      parseWithSlug(value, args) {
        return validate(parseAsSlugField(value, args.slug), {
          slugField: {
            glob: args.glob,
            slugs: emptySet
          }
        }).name;
      }
    }
  };
}

function validateUrl(validation, value, label) {
  if (value !== null && (typeof value !== 'string' || !isValidURL(value))) {
    return `${label} is not a valid URL`;
  }
  if (validation !== null && validation !== void 0 && validation.isRequired && value === null) {
    return `${label} is required`;
  }
}

function url({
  label,
  defaultValue,
  validation,
  description
}) {
  return basicFormFieldWithSimpleReaderParse({
    Input(props) {
      return /*#__PURE__*/jsx(UrlFieldInput, {
        label: label,
        description: description,
        validation: validation,
        ...props
      });
    },
    defaultValue() {
      return defaultValue || null;
    },
    parse(value) {
      if (value === undefined) {
        return null;
      }
      if (typeof value !== 'string') {
        throw new FieldDataError('Must be a string');
      }
      return value === '' ? null : value;
    },
    validate(value) {
      const message = validateUrl(validation, value, label);
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

function blocks(blocks, opts) {
  const entries = Object.entries(blocks);
  if (!entries.length) {
    throw new Error('fields.blocks must have at least one entry');
  }
  const select$1 = select({
    label: 'Kind',
    defaultValue: entries[0][0],
    options: Object.entries(blocks).map(([key, {
      label
    }]) => ({
      label,
      value: key
    }))
  });
  const element = conditional(select$1, Object.fromEntries(entries.map(([key, {
    schema
  }]) => [key, schema])));
  return {
    ...array(element, {
      label: opts.label,
      description: opts.description,
      validation: opts.validation,
      itemLabel(props) {
        const kind = props.discriminant;
        const block = blocks[kind];
        if (!block.itemLabel) return block.label;
        return block.itemLabel(props.value);
      }
    }),
    Input: BlocksFieldInput
  };
}

function cloudImage({
  label,
  description,
  validation
}) {
  return {
    ...object({
      src: text({
        label: 'URL',
        validation: {
          length: {
            min: validation !== null && validation !== void 0 && validation.isRequired ? 1 : 0
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
    }, {
      label,
      description
    }),
    Input(props) {
      return /*#__PURE__*/jsx(CloudImageFieldInput, {
        ...props,
        isRequired: validation === null || validation === void 0 ? void 0 : validation.isRequired
      });
    }
  };
}

var index = /*#__PURE__*/Object.freeze({
  __proto__: null,
  array: array,
  checkbox: checkbox,
  child: child,
  conditional: conditional,
  date: date,
  datetime: datetime,
  document: document,
  emptyDocument: emptyDocument,
  empty: empty,
  image: image,
  file: file,
  integer: integer,
  multiselect: multiselect,
  object: object,
  pathReference: pathReference,
  relationship: relationship,
  select: select,
  slug: slug,
  text: text,
  url: url,
  blocks: blocks,
  cloudImage: cloudImage
});

function BlockWrapper() {}
function NotEditable() {}
function ToolbarSeparator() {}

export { BlockWrapper, NotEditable, ToolbarSeparator, index as fields };
