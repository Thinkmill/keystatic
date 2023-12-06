'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var index$1 = require('./index-19d616b6.node.cjs.js');
var api = require('./api-2bd464f0.node.cjs.js');
var checkbox$1 = require('@keystar/ui/checkbox');
var typography = require('@keystar/ui/typography');
var jsxRuntime = require('react/jsx-runtime');
var textField = require('@keystar/ui/text-field');
var React = require('react');
var button = require('@keystar/ui/button');
var field = require('@keystar/ui/field');
var layout = require('@keystar/ui/layout');
var combobox = require('@keystar/ui/combobox');
var minimatch = require('minimatch');
var collections = require('@react-stately/collections');
var useSlugsInCollection = require('./useSlugsInCollection-35730e76.node.cjs.js');
var picker = require('@keystar/ui/picker');
var slugify = require('@sindresorhus/slugify');
require('emery');
require('@keystar/ui/style');
require('@keystar/ui/number-field');
require('@braintree/sanitize-url');
var i18n = require('@react-aria/i18n');
var dialog = require('@keystar/ui/dialog');
var slots = require('@keystar/ui/slots');
var menu = require('@keystar/ui/menu');
var link = require('@keystar/ui/link');
var progress = require('@keystar/ui/progress');
require('@markdoc/markdoc');
require('slate');
require('emery/assertions');
require('js-base64');
require('crypto');
require('@keystar/ui/split-view');
require('@keystar/ui/drag-and-drop');
require('@keystar/ui/icon');
require('@keystar/ui/icon/icons/trash2Icon');
require('@keystar/ui/list-view');
require('@keystar/ui/tooltip');
require('slate-react');
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
require('@keystar/ui/icon/icons/panelLeftOpenIcon');
require('@keystar/ui/icon/icons/panelLeftCloseIcon');
require('@keystar/ui/icon/icons/panelRightOpenIcon');
require('@keystar/ui/icon/icons/panelRightCloseIcon');
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

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var slugify__default = /*#__PURE__*/_interopDefault(slugify);

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

function CheckboxFieldInput(props) {
  return /*#__PURE__*/jsxRuntime.jsxs(checkbox$1.Checkbox, {
    isSelected: props.value,
    onChange: props.onChange,
    autoFocus: props.autoFocus,
    children: [/*#__PURE__*/jsxRuntime.jsx(typography.Text, {
      children: props.label
    }), props.description && /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
      slot: "description",
      children: props.description
    })]
  });
}

function checkbox({
  label,
  defaultValue = false,
  description
}) {
  return index$1.basicFormFieldWithSimpleReaderParse({
    Input(props) {
      return /*#__PURE__*/jsxRuntime.jsx(CheckboxFieldInput, {
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
        throw new index$1.FieldDataError('Must be a boolean');
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

function DateFieldInput(props) {
  var _props$validation;
  const [blurred, onBlur] = React.useReducer(() => true, false);
  return /*#__PURE__*/jsxRuntime.jsx(textField.TextField, {
    label: props.label,
    description: props.description,
    type: "date",
    onChange: val => {
      props.onChange(val === '' ? null : val);
    },
    autoFocus: props.autoFocus,
    value: props.value === null ? '' : props.value,
    onBlur: onBlur,
    isRequired: (_props$validation = props.validation) === null || _props$validation === void 0 ? void 0 : _props$validation.isRequired,
    errorMessage: blurred || props.forceValidation ? validateDate(props.validation, props.value, props.label) : undefined
  });
}

function date({
  label,
  defaultValue,
  validation,
  description
}) {
  return index$1.basicFormFieldWithSimpleReaderParse({
    Input(props) {
      return /*#__PURE__*/jsxRuntime.jsx(DateFieldInput, {
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
        throw new index$1.FieldDataError('Must be a string');
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
        throw new index$1.FieldDataError(message);
      }
      index$1.assertRequired(value, validation, label);
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

//ui.tsx
function DatetimeFieldInput(props) {
  var _props$validation;
  const [blurred, onBlur] = React.useReducer(() => true, false);
  return /*#__PURE__*/jsxRuntime.jsx(textField.TextField, {
    label: props.label,
    description: props.description,
    type: "datetime-local",
    onChange: val => {
      props.onChange(val === '' ? null : val);
    },
    autoFocus: props.autoFocus,
    value: props.value === null ? '' : props.value,
    onBlur: onBlur,
    isRequired: (_props$validation = props.validation) === null || _props$validation === void 0 ? void 0 : _props$validation.isRequired,
    errorMessage: blurred || props.forceValidation ? validateDatetime(props.validation, props.value, props.label) : undefined
  });
}

function datetime({
  label,
  defaultValue,
  validation,
  description
}) {
  return index$1.basicFormFieldWithSimpleReaderParse({
    Input(props) {
      return /*#__PURE__*/jsxRuntime.jsx(DatetimeFieldInput, {
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
        throw new index$1.FieldDataError('Must be a string');
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
        throw new index$1.FieldDataError(message);
      }
      index$1.assertRequired(value, validation, label);
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
  return index$1.basicFormFieldWithSimpleReaderParse({
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
      return /*#__PURE__*/jsxRuntime.jsx(index$1.ImageFieldInput, {
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
        return value.slice(index$1.getSrcPrefix(publicPath, args.slug).length);
      }
      return undefined;
    },
    parse(value, args) {
      var _value$match$, _value$match;
      if (value === undefined) {
        return null;
      }
      if (typeof value !== 'string') {
        throw new index$1.FieldDataError('Must be a string');
      }
      if (args.asset === undefined) {
        return null;
      }
      return {
        data: args.asset,
        filename: value.slice(index$1.getSrcPrefix(publicPath, args.slug).length),
        extension: (_value$match$ = (_value$match = value.match(/\.([^.]+$)/)) === null || _value$match === void 0 ? void 0 : _value$match[1]) !== null && _value$match$ !== void 0 ? _value$match$ : ''
      };
    },
    validate(value) {
      index$1.assertRequired(value, validation, label);
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
        value: `${index$1.getSrcPrefix(publicPath, args.slug)}${filename}`,
        asset: {
          filename,
          content: value.data
        }
      };
    },
    directory: directory ? index$1.fixPath(directory) : undefined,
    reader: {
      parse(value) {
        if (typeof value !== 'string' && value !== undefined) {
          throw new index$1.FieldDataError('Must be a string');
        }
        const val = value === undefined ? null : value;
        index$1.assertRequired(val, validation, label);
        return val;
      }
    }
  };
}

function FileFieldInput(props) {
  var _props$validation, _props$validation2;
  const {
    value
  } = props;
  const [blurred, onBlur] = React.useReducer(() => true, false);
  const isInEditor = index$1.useIsInDocumentEditor();
  const objectUrl = index$1.useObjectURL(value === null ? null : value.data);
  const labelId = React.useId();
  const descriptionId = React.useId();
  return /*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
    "aria-describedby": props.description ? descriptionId : undefined,
    "aria-labelledby": labelId,
    direction: "column",
    gap: "medium",
    role: "group",
    children: [/*#__PURE__*/jsxRuntime.jsx(field.FieldLabel, {
      id: labelId,
      elementType: "span",
      isRequired: (_props$validation = props.validation) === null || _props$validation === void 0 ? void 0 : _props$validation.isRequired,
      children: props.label
    }), props.description && /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
      size: "small",
      color: "neutralSecondary",
      id: descriptionId,
      children: props.description
    }), /*#__PURE__*/jsxRuntime.jsxs(button.ButtonGroup, {
      children: [/*#__PURE__*/jsxRuntime.jsx(button.ActionButton, {
        onPress: async () => {
          const file = await index$1.getUploadedFile('');
          if (file) {
            var _file$filename$match$, _file$filename$match;
            props.onChange({
              data: file.content,
              filename: file.filename,
              extension: (_file$filename$match$ = (_file$filename$match = file.filename.match(/\.([^.]+$)/)) === null || _file$filename$match === void 0 ? void 0 : _file$filename$match[1]) !== null && _file$filename$match$ !== void 0 ? _file$filename$match$ : ''
            });
          }
        },
        children: "Choose file"
      }), value !== null && /*#__PURE__*/jsxRuntime.jsxs(jsxRuntime.Fragment, {
        children: [/*#__PURE__*/jsxRuntime.jsx(button.ActionButton, {
          prominence: "low",
          onPress: () => {
            props.onChange(null);
            onBlur();
          },
          children: "Remove"
        }), objectUrl && /*#__PURE__*/jsxRuntime.jsx(button.Button, {
          href: objectUrl,
          download: value.filename,
          prominence: "low",
          children: "Download"
        })]
      })]
    }), isInEditor && value !== null && /*#__PURE__*/jsxRuntime.jsx(textField.TextField, {
      label: "Filename",
      onChange: filename => {
        props.onChange({
          ...value,
          filename
        });
      },
      value: value.filename
    }), (props.forceValidation || blurred) && ((_props$validation2 = props.validation) === null || _props$validation2 === void 0 ? void 0 : _props$validation2.isRequired) && value === null && /*#__PURE__*/jsxRuntime.jsxs(field.FieldMessage, {
      children: [props.label, " is required"]
    })]
  });
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
      return /*#__PURE__*/jsxRuntime.jsx(FileFieldInput, {
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
        return value.slice(index$1.getSrcPrefix(publicPath, args.slug).length);
      }
      return undefined;
    },
    parse(value, args) {
      var _value$match$, _value$match;
      if (value === undefined) {
        return null;
      }
      if (typeof value !== 'string') {
        throw new index$1.FieldDataError('Must be a string');
      }
      if (args.asset === undefined) {
        return null;
      }
      return {
        data: args.asset,
        filename: value.slice(index$1.getSrcPrefix(publicPath, args.slug).length),
        extension: (_value$match$ = (_value$match = value.match(/\.([^.]+$)/)) === null || _value$match === void 0 ? void 0 : _value$match[1]) !== null && _value$match$ !== void 0 ? _value$match$ : ''
      };
    },
    validate(value) {
      index$1.assertRequired(value, validation, label);
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
        value: `${index$1.getSrcPrefix(publicPath, args.slug)}${filename}`,
        asset: {
          filename,
          content: value.data
        }
      };
    },
    directory: directory ? index$1.fixPath(directory) : undefined,
    reader: {
      parse(value) {
        if (typeof value !== 'string' && value !== undefined) {
          throw new index$1.FieldDataError('Must be a string');
        }
        const val = value === undefined ? null : value;
        index$1.assertRequired(val, validation, label);
        return val;
      }
    }
  };
}

function MultiselectFieldInput(props) {
  const labelId = React.useId();
  const descriptionId = React.useId();
  return /*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
    role: "group",
    "aria-labelledby": labelId,
    "aria-describedby": props.description ? descriptionId : undefined,
    direction: "column",
    gap: "medium",
    children: [/*#__PURE__*/jsxRuntime.jsx(field.FieldLabel, {
      elementType: "span",
      id: labelId,
      children: props.label
    }), props.description && /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
      id: descriptionId,
      size: "small",
      color: "neutralSecondary",
      children: props.description
    }), props.options.map(option => /*#__PURE__*/jsxRuntime.jsx(checkbox$1.Checkbox, {
      isSelected: props.value.includes(option.value),
      onChange: () => {
        if (props.value.includes(option.value)) {
          props.onChange(props.value.filter(x => x !== option.value));
        } else {
          props.onChange([...props.value, option.value]);
        }
      },
      children: option.label
    }, option.value))]
  });
}

function multiselect({
  label,
  options,
  defaultValue = [],
  description
}) {
  const valuesToOption = new Map(options.map(x => [x.value, x]));
  const field = index$1.basicFormFieldWithSimpleReaderParse({
    Input(props) {
      return /*#__PURE__*/jsxRuntime.jsx(MultiselectFieldInput, {
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
        throw new index$1.FieldDataError('Must be an array of options');
      }
      if (!value.every(x => typeof x === 'string' && valuesToOption.has(x))) {
        throw new index$1.FieldDataError(`Must be an array with one of ${options.map(x => x.value).join(', ')}`);
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

function PathReferenceInput(props) {
  var _props$validation, _props$validation2;
  const match = React.useMemo(() => props.pattern ? minimatch.filter(props.pattern) : () => true, [props.pattern]);
  const [blurred, onBlur] = React.useReducer(() => true, false);
  const tree = index$1.useTree().current;
  const options = React.useMemo(() => {
    const files = tree.kind === 'loaded' ? [...tree.data.entries.values()] : [];
    return files.filter(val => match(val.path));
  }, [tree, match]);
  const _errorMessage = (props.forceValidation || blurred) && (_props$validation = props.validation) !== null && _props$validation !== void 0 && _props$validation.isRequired && props.value === null ? `${props.label} is required` : undefined;
  // this state & effect shouldn't really exist
  // it's here because react-aria/stately calls onSelectionChange with null
  // after selecting an item if we immediately remove the error message
  // so we delay it with an effect
  const [errorMessage, setErrorMessage] = React.useState(_errorMessage);
  React.useEffect(() => {
    setErrorMessage(_errorMessage);
  }, [_errorMessage]);
  return /*#__PURE__*/jsxRuntime.jsx(combobox.Combobox, {
    label: props.label,
    description: props.description,
    selectedKey: props.value,
    onSelectionChange: key => {
      if (typeof key === 'string' || key === null) {
        props.onChange(key);
      }
    },
    onBlur: onBlur,
    isRequired: (_props$validation2 = props.validation) === null || _props$validation2 === void 0 ? void 0 : _props$validation2.isRequired,
    errorMessage: errorMessage,
    autoFocus: props.autoFocus,
    defaultItems: options,
    width: "auto",
    children: item => /*#__PURE__*/jsxRuntime.jsx(combobox.Item, {
      children: item.path
    }, item.path)
  });
}

function pathReference({
  label,
  pattern,
  validation,
  description
}) {
  return index$1.basicFormFieldWithSimpleReaderParse({
    Input(props) {
      return /*#__PURE__*/jsxRuntime.jsx(PathReferenceInput, {
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
        throw new index$1.FieldDataError('Must be a string');
      }
      return value;
    },
    validate(value) {
      index$1.assertRequired(value, validation, label);
      return value;
    },
    serialize(value) {
      return {
        value: value === null ? undefined : value
      };
    }
  });
}

function RelationshipInput(props) {
  var _props$validation, _props$validation2;
  const [blurred, onBlur] = React.useReducer(() => true, false);
  const slugs = useSlugsInCollection.useSlugsInCollection(props.collection);
  const options = React.useMemo(() => {
    return slugs.map(slug => ({
      slug
    }));
  }, [slugs]);
  const _errorMessage = (props.forceValidation || blurred) && (_props$validation = props.validation) !== null && _props$validation !== void 0 && _props$validation.isRequired && props.value === null ? `${props.label} is required` : undefined;
  // this state & effect shouldn't really exist
  // it's here because react-aria/stately calls onSelectionChange with null
  // after selecting an item if we immediately remove the error message
  // so we delay it with an effect
  const [errorMessage, setErrorMessage] = React.useState(_errorMessage);
  React.useEffect(() => {
    setErrorMessage(_errorMessage);
  }, [_errorMessage]);
  return /*#__PURE__*/jsxRuntime.jsx(combobox.Combobox, {
    label: props.label,
    description: props.description,
    selectedKey: props.value,
    onSelectionChange: key => {
      if (typeof key === 'string' || key === null) {
        props.onChange(key);
      }
    },
    onBlur: onBlur,
    autoFocus: props.autoFocus,
    defaultItems: options,
    isRequired: (_props$validation2 = props.validation) === null || _props$validation2 === void 0 ? void 0 : _props$validation2.isRequired,
    errorMessage: errorMessage,
    width: "auto",
    children: item => /*#__PURE__*/jsxRuntime.jsx(collections.Item, {
      children: item.slug
    }, item.slug)
  });
}

function relationship({
  label,
  collection,
  validation,
  description
}) {
  return index$1.basicFormFieldWithSimpleReaderParse({
    Input(props) {
      return /*#__PURE__*/jsxRuntime.jsx(RelationshipInput, {
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
        throw new index$1.FieldDataError('Must be a string');
      }
      return value;
    },
    validate(value) {
      index$1.assertRequired(value, validation, label);
      return value;
    },
    serialize(value) {
      return {
        value: value === null ? undefined : value
      };
    }
  });
}

function SelectFieldInput(props) {
  let fieldContext = index$1.useFieldContext();
  return /*#__PURE__*/jsxRuntime.jsx(picker.Picker, {
    label: props.label,
    description: props.description,
    items: props.options,
    selectedKey: props.value,
    onSelectionChange: key => {
      props.onChange(key);
    },
    autoFocus: props.autoFocus,
    width: {
      mobile: 'auto',
      tablet: fieldContext.span === 12 ? 'alias.singleLineWidth' : 'auto'
    },
    children: item => /*#__PURE__*/jsxRuntime.jsx(picker.Item, {
      children: item.label
    }, item.value)
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
  const field = index$1.basicFormFieldWithSimpleReaderParse({
    Input(props) {
      return /*#__PURE__*/jsxRuntime.jsx(SelectFieldInput, {
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
        throw new index$1.FieldDataError('Must be a string');
      }
      if (!optionValuesSet.has(value)) {
        throw new index$1.FieldDataError('Must be a valid option');
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

const emptySet = new Set();
function SlugFieldInput(props) {
  var _props$args$slug$vali, _props$args$slug, _props$args$slug$vali2, _props$args$slug2, _props$args$slug$labe, _props$args$slug3, _props$args$name$vali, _props$args$name$vali2, _props$args$name$vali3, _props$args$name$vali4, _props$args$slug$labe2, _props$args$slug4, _props$args$slug5;
  const slugContext = React.useContext(index$1.SlugFieldContext);
  const path = React.useContext(index$1.PathContext);
  const slugInfo = path.length === 1 && path[0] === (slugContext === null || slugContext === void 0 ? void 0 : slugContext.field) ? slugContext : {
    slugs: emptySet,
    glob: '*'
  };
  const [blurredName, setBlurredName] = React.useState(false);
  const [blurredSlug, setBlurredSlug] = React.useState(false);
  const [shouldGenerateSlug, setShouldGenerateSlug] = React.useState(props.value === props.defaultValue);
  const generateSlug = name => {
    const generated = props.naiveGenerateSlug(name);
    if (slugInfo.slugs.has(generated)) {
      let i = 1;
      while (slugInfo.slugs.has(`${generated}-${i}`)) {
        i++;
      }
      return `${generated}-${i}`;
    }
    return generated;
  };
  const slugErrorMessage = props.forceValidation || blurredSlug ? index$1.validateText(props.value.slug, (_props$args$slug$vali = (_props$args$slug = props.args.slug) === null || _props$args$slug === void 0 || (_props$args$slug = _props$args$slug.validation) === null || _props$args$slug === void 0 || (_props$args$slug = _props$args$slug.length) === null || _props$args$slug === void 0 ? void 0 : _props$args$slug.min) !== null && _props$args$slug$vali !== void 0 ? _props$args$slug$vali : 1, (_props$args$slug$vali2 = (_props$args$slug2 = props.args.slug) === null || _props$args$slug2 === void 0 || (_props$args$slug2 = _props$args$slug2.validation) === null || _props$args$slug2 === void 0 || (_props$args$slug2 = _props$args$slug2.length) === null || _props$args$slug2 === void 0 ? void 0 : _props$args$slug2.max) !== null && _props$args$slug$vali2 !== void 0 ? _props$args$slug$vali2 : Infinity, (_props$args$slug$labe = (_props$args$slug3 = props.args.slug) === null || _props$args$slug3 === void 0 ? void 0 : _props$args$slug3.label) !== null && _props$args$slug$labe !== void 0 ? _props$args$slug$labe : 'Slug', slugInfo) : undefined;
  return /*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
    gap: "xlarge",
    direction: "column",
    children: [/*#__PURE__*/jsxRuntime.jsx(textField.TextField, {
      label: props.args.name.label,
      description: props.args.name.description,
      autoFocus: props.autoFocus,
      value: props.value.name,
      onChange: name => {
        props.onChange({
          name,
          slug: shouldGenerateSlug ? generateSlug(name) : props.value.slug
        });
      },
      onBlur: () => setBlurredName(true),
      errorMessage: props.forceValidation || blurredName ? index$1.validateText(props.value.name, (_props$args$name$vali = (_props$args$name$vali2 = props.args.name.validation) === null || _props$args$name$vali2 === void 0 || (_props$args$name$vali2 = _props$args$name$vali2.length) === null || _props$args$name$vali2 === void 0 ? void 0 : _props$args$name$vali2.min) !== null && _props$args$name$vali !== void 0 ? _props$args$name$vali : 0, (_props$args$name$vali3 = (_props$args$name$vali4 = props.args.name.validation) === null || _props$args$name$vali4 === void 0 || (_props$args$name$vali4 = _props$args$name$vali4.length) === null || _props$args$name$vali4 === void 0 ? void 0 : _props$args$name$vali4.max) !== null && _props$args$name$vali3 !== void 0 ? _props$args$name$vali3 : Infinity, props.args.name.label, undefined) : undefined
    }), /*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
      gap: "regular",
      alignItems: "end",
      children: [/*#__PURE__*/jsxRuntime.jsx(textField.TextField, {
        flex: 1,
        label: (_props$args$slug$labe2 = (_props$args$slug4 = props.args.slug) === null || _props$args$slug4 === void 0 ? void 0 : _props$args$slug4.label) !== null && _props$args$slug$labe2 !== void 0 ? _props$args$slug$labe2 : 'Slug',
        description: (_props$args$slug5 = props.args.slug) === null || _props$args$slug5 === void 0 ? void 0 : _props$args$slug5.description,
        value: props.value.slug,
        onChange: slug => {
          setShouldGenerateSlug(false);
          props.onChange({
            name: props.value.name,
            slug
          });
        },
        onBlur: () => setBlurredSlug(true),
        errorMessage: slugErrorMessage,
        isRequired: true
      }), /*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
        gap: "regular",
        direction: "column",
        children: [/*#__PURE__*/jsxRuntime.jsx(button.ActionButton, {
          onPress: () => {
            props.onChange({
              name: props.value.name,
              slug: generateSlug(props.value.name)
            });
          },
          children: "Regenerate"
        }), slugErrorMessage !== undefined && /*#__PURE__*/jsxRuntime.jsx(layout.Box, {
          height: "element.xsmall"
        })]
      })]
    })]
  });
}

function parseSlugFieldAsNormalField(value) {
  if (value === undefined) {
    return {
      name: '',
      slug: ''
    };
  }
  if (typeof value !== 'object') {
    throw new index$1.FieldDataError('Must be an object');
  }
  if (Object.keys(value).length !== 2) {
    throw new index$1.FieldDataError('Unexpected keys');
  }
  if (!('name' in value) || !('slug' in value)) {
    throw new index$1.FieldDataError('Missing name or slug');
  }
  if (typeof value.name !== 'string') {
    throw new index$1.FieldDataError('name must be a string');
  }
  if (typeof value.slug !== 'string') {
    throw new index$1.FieldDataError('slug must be a string');
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
    throw new index$1.FieldDataError('Must be a string');
  }
  return {
    name: value,
    slug
  };
}
function slug(args) {
  var _args$slug, _args$name$defaultVal, _args$name$defaultVal2;
  const naiveGenerateSlug = ((_args$slug = args.slug) === null || _args$slug === void 0 ? void 0 : _args$slug.generate) || slugify__default["default"];
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
    const nameMessage = index$1.validateText(value.name, (_args$name$validation = (_args$name$validation2 = args.name.validation) === null || _args$name$validation2 === void 0 || (_args$name$validation2 = _args$name$validation2.length) === null || _args$name$validation2 === void 0 ? void 0 : _args$name$validation2.min) !== null && _args$name$validation !== void 0 ? _args$name$validation : 0, (_args$name$validation3 = (_args$name$validation4 = args.name.validation) === null || _args$name$validation4 === void 0 || (_args$name$validation4 = _args$name$validation4.length) === null || _args$name$validation4 === void 0 ? void 0 : _args$name$validation4.max) !== null && _args$name$validation3 !== void 0 ? _args$name$validation3 : Infinity, args.name.label, undefined);
    if (nameMessage !== undefined) {
      throw new index$1.FieldDataError(nameMessage);
    }
    const slugMessage = index$1.validateText(value.slug, (_args$slug$validation = (_args$slug2 = args.slug) === null || _args$slug2 === void 0 || (_args$slug2 = _args$slug2.validation) === null || _args$slug2 === void 0 || (_args$slug2 = _args$slug2.length) === null || _args$slug2 === void 0 ? void 0 : _args$slug2.min) !== null && _args$slug$validation !== void 0 ? _args$slug$validation : 1, (_args$slug$validation2 = (_args$slug3 = args.slug) === null || _args$slug3 === void 0 || (_args$slug3 = _args$slug3.validation) === null || _args$slug3 === void 0 || (_args$slug3 = _args$slug3.length) === null || _args$slug3 === void 0 ? void 0 : _args$slug3.max) !== null && _args$slug$validation2 !== void 0 ? _args$slug$validation2 : Infinity, (_args$slug$label = (_args$slug4 = args.slug) === null || _args$slug4 === void 0 ? void 0 : _args$slug4.label) !== null && _args$slug$label !== void 0 ? _args$slug$label : 'Slug', slugField ? slugField : {
      slugs: emptySet,
      glob: '*'
    });
    if (slugMessage !== undefined) {
      throw new index$1.FieldDataError(slugMessage);
    }
    return value;
  }
  const emptySet = new Set();
  return {
    kind: 'form',
    formKind: 'slug',
    Input(props) {
      return /*#__PURE__*/jsxRuntime.jsx(SlugFieldInput, {
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
  if (value !== null && (typeof value !== 'string' || !index$1.isValidURL(value))) {
    return `${label} is not a valid URL`;
  }
  if (validation !== null && validation !== void 0 && validation.isRequired && value === null) {
    return `${label} is required`;
  }
}

function UrlFieldInput(props) {
  var _props$validation;
  const [blurred, onBlur] = React.useReducer(() => true, false);
  return /*#__PURE__*/jsxRuntime.jsx(textField.TextField, {
    width: "auto",
    maxWidth: "scale.6000",
    label: props.label,
    description: props.description,
    autoFocus: props.autoFocus,
    value: props.value === null ? '' : props.value,
    onChange: val => {
      props.onChange(val === '' ? null : val);
    },
    onBlur: onBlur,
    isRequired: (_props$validation = props.validation) === null || _props$validation === void 0 ? void 0 : _props$validation.isRequired,
    errorMessage: props.forceValidation || blurred ? validateUrl(props.validation, props.value, props.label) : undefined
  });
}

function url({
  label,
  defaultValue,
  validation,
  description
}) {
  return index$1.basicFormFieldWithSimpleReaderParse({
    Input(props) {
      return /*#__PURE__*/jsxRuntime.jsx(UrlFieldInput, {
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
        throw new index$1.FieldDataError('Must be a string');
      }
      return value === '' ? null : value;
    },
    validate(value) {
      const message = validateUrl(validation, value, label);
      if (message !== undefined) {
        throw new index$1.FieldDataError(message);
      }
      index$1.assertRequired(value, validation, label);
      return value;
    },
    serialize(value) {
      return {
        value: value === null ? undefined : value
      };
    }
  });
}

function BlocksFieldInput(props) {
  const labelId = React.useId();
  const descriptionId = React.useId();
  const stringFormatter = i18n.useLocalizedStringFormatter(index$1.l10nMessages);
  const [modalState, setModalState] = React.useState({
    kind: 'closed'
  });
  const dismiss = () => {
    setModalState({
      kind: 'closed'
    });
  };
  const formId = React.useId();
  return /*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
    elementType: "section",
    gap: "medium",
    role: "group",
    "aria-labelledby": labelId,
    "aria-describedby": props.schema.description ? descriptionId : undefined,
    direction: "column",
    children: [/*#__PURE__*/jsxRuntime.jsx(field.FieldLabel, {
      elementType: "h3",
      id: labelId,
      children: props.schema.label
    }), props.schema.description && /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
      id: descriptionId,
      size: "small",
      color: "neutralSecondary",
      children: props.schema.description
    }), /*#__PURE__*/jsxRuntime.jsxs(menu.MenuTrigger, {
      children: [/*#__PURE__*/jsxRuntime.jsx(button.ActionButton, {
        alignSelf: "start",
        children: "Add"
      }), /*#__PURE__*/jsxRuntime.jsx(menu.Menu, {
        items: props.schema.element.discriminant.options,
        onAction: key => {
          if (typeof key !== 'string') return;
          const discriminant = key;
          setModalState({
            kind: 'new',
            initial: {
              discriminant,
              value: index$1.getInitialPropsValue(props.schema.element.values[`${discriminant}`])
            }
          });
        },
        children: item => /*#__PURE__*/jsxRuntime.jsx(collections.Item, {
          children: item.label
        }, item.value)
      })]
    }), /*#__PURE__*/jsxRuntime.jsx(index$1.ArrayFieldListView, {
      ...props,
      labelId: labelId,
      onOpenItem: idx => {
        setModalState({
          kind: 'edit',
          idx,
          initial: index$1.previewPropsToValue(props.elements[idx])
        });
      }
    }), /*#__PURE__*/jsxRuntime.jsx(index$1.ArrayFieldValidationMessages, {
      ...props
    }), /*#__PURE__*/jsxRuntime.jsx(dialog.DialogContainer, {
      onDismiss: dismiss,
      children: (_props$schema$element => {
        if (modalState.kind === 'closed') {
          return null;
        }
        const discriminant = modalState.initial.discriminant;
        return /*#__PURE__*/jsxRuntime.jsxs(dialog.Dialog, {
          children: [/*#__PURE__*/jsxRuntime.jsxs(typography.Heading, {
            children: [modalState.kind === 'edit' ? 'Edit' : 'Add', ' ', (_props$schema$element = props.schema.element.discriminant.options.find(x => x.value === discriminant)) === null || _props$schema$element === void 0 ? void 0 : _props$schema$element.label]
          }), /*#__PURE__*/jsxRuntime.jsx(slots.Content, {
            children: /*#__PURE__*/jsxRuntime.jsx(ItemForm, {
              id: formId,
              schema: props.schema.element.values[discriminant],
              initialValue: modalState.initial.value,
              onSubmit: val => {
                dismiss();
                if (modalState.kind === 'new') {
                  props.onChange([...props.elements.map(x => ({
                    key: x.key
                  })), {
                    key: undefined,
                    value: index$1.valueToUpdater({
                      value: val,
                      discriminant
                    }, props.schema.element)
                  }]);
                  return;
                }
                index$1.setValueToPreviewProps(val, props.elements[modalState.idx].value);
              }
            })
          }), /*#__PURE__*/jsxRuntime.jsxs(button.ButtonGroup, {
            children: [/*#__PURE__*/jsxRuntime.jsx(button.Button, {
              onPress: dismiss,
              children: stringFormatter.format('cancel')
            }), /*#__PURE__*/jsxRuntime.jsx(button.Button, {
              form: formId,
              prominence: "high",
              type: "submit",
              children: "Done"
            })]
          })]
        });
      })()
    })]
  });
}
function ItemForm(props) {
  const [value, setValue] = React.useState(props.initialValue);
  const [forceValidation, setForceValidation] = React.useState(false);
  const previewProps = React.useMemo(() => index$1.createGetPreviewProps(props.schema, setValue, () => undefined), [props.schema, setValue])(value);
  const {
    dismiss
  } = dialog.useDialogContainer();
  return /*#__PURE__*/jsxRuntime.jsx(layout.Flex, {
    id: props.id,
    elementType: "form",
    onSubmit: event => {
      if (event.target !== event.currentTarget) return;
      event.preventDefault();
      if (!index$1.clientSideValidateProp(props.schema, value, undefined)) {
        setForceValidation(true);
        return;
      }
      props.onSubmit(value);
      dismiss();
    },
    direction: "column",
    gap: "xxlarge",
    children: /*#__PURE__*/jsxRuntime.jsx(index$1.FormValueContentFromPreviewProps, {
      forceValidation: forceValidation,
      autoFocus: true,
      ...previewProps
    })
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

function ImageField(props) {
  const {
    image,
    onChange
  } = props;
  const [status, setStatus] = React.useState(image.src ? 'good' : '');
  const imageLibraryURL = index$1.useImageLibraryURL();
  const onPaste = event => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    const parsed = index$1.parseImageData(text);
    props.onChange(parsed);
  };
  const onLoad = index$1.useEventCallback(data => {
    onChange(data);
    setStatus('good');
  });
  const config = index$1.useConfig();
  const hasSetFields = !!(props.image.alt || props.image.width || props.image.height);
  React.useEffect(() => {
    if (!props.image.src) {
      setStatus('');
      return;
    }
    if (!index$1.isValidURL(props.image.src)) {
      return;
    }
    if (hasSetFields) {
      setStatus('good');
      return;
    }
    setStatus('loading');
    index$1.loadImageData(props.image.src, config).then(newData => {
      onLoad(newData);
    }).catch(() => {
      setStatus('error');
    });
  }, [config, hasSetFields, onLoad, props.image.src]);
  const [blurred, setBlurred] = React.useState(false);
  const errorMessage = (blurred || props.forceValidation) && props.isRequired && !image.src ? 'Image URL is required' : undefined;
  return /*#__PURE__*/jsxRuntime.jsxs(layout.VStack, {
    gap: "xlarge",
    children: [/*#__PURE__*/jsxRuntime.jsx(textField.TextField, {
      label: "Image URL",
      errorMessage: errorMessage,
      autoFocus: props.autoFocus,
      onPaste: onPaste,
      onKeyDown: e => {
        if (e.code === 'Backspace' || e.code === 'Delete') {
          props.onChange(index$1.emptyImageData);
        }
      },
      onBlur: () => setBlurred(true),
      value: image.src,
      description: /*#__PURE__*/jsxRuntime.jsxs(typography.Text, {
        children: ["Copy an image URL from the", ' ', /*#__PURE__*/jsxRuntime.jsx(link.TextLink, {
          prominence: "high",
          href: imageLibraryURL,
          target: "_blank",
          rel: "noreferrer",
          children: "Image Library"
        }), ' ', "and paste it into this field."]
      }),
      endElement: status === 'loading' ? /*#__PURE__*/jsxRuntime.jsx(layout.Flex, {
        height: "element.regular",
        width: "element.regular",
        alignItems: "center",
        justifyContent: "center",
        children: /*#__PURE__*/jsxRuntime.jsx(progress.ProgressCircle, {
          size: "small",
          "aria-label": "Checking\u2026",
          isIndeterminate: true
        })
      }) : image.src ? /*#__PURE__*/jsxRuntime.jsx(button.ClearButton, {
        onPress: () => {
          props.onChange(index$1.emptyImageData);
          setStatus('');
        },
        preventFocus: true
      }) : null
    }), status === 'good' ? /*#__PURE__*/jsxRuntime.jsxs(jsxRuntime.Fragment, {
      children: [/*#__PURE__*/jsxRuntime.jsx(layout.Box, {
        width: "scale.1600",
        height: "scale.1600",
        children: /*#__PURE__*/jsxRuntime.jsx("img", {
          alt: image.alt,
          src: image.src,
          style: {
            objectFit: 'contain',
            height: '100%',
            width: '100%'
          }
        })
      }), /*#__PURE__*/jsxRuntime.jsx(textField.TextArea, {
        label: "Alt text",
        value: image.alt,
        onChange: alt => props.onChange({
          ...image,
          alt
        })
      }), /*#__PURE__*/jsxRuntime.jsx(index$1.ImageDimensionsInput, {
        src: image.src,
        image: image,
        onChange: dimensions => {
          onChange({
            ...props.image,
            ...dimensions
          });
        }
      })]
    }) : null]
  });
}
function CloudImageFieldInput(props) {
  var _props$fields$width$v, _props$fields$height$;
  const labelId = React.useId();
  const descriptionId = React.useId();
  return /*#__PURE__*/jsxRuntime.jsxs(layout.Flex, {
    role: "group",
    gap: "medium",
    marginY: "large",
    "aria-labelledby": labelId,
    "aria-describedby": props.schema.description ? descriptionId : undefined,
    direction: "column",
    children: [/*#__PURE__*/jsxRuntime.jsx(typography.Text, {
      color: "neutral",
      size: "medium",
      weight: "medium",
      id: labelId,
      children: props.schema.label
    }), !!props.schema.description && /*#__PURE__*/jsxRuntime.jsx(typography.Text, {
      id: descriptionId,
      size: "regular",
      color: "neutralSecondary",
      children: props.schema.description
    }), /*#__PURE__*/jsxRuntime.jsx(ImageField, {
      image: {
        src: props.fields.src.value,
        alt: props.fields.alt.value,
        width: (_props$fields$width$v = props.fields.width.value) !== null && _props$fields$width$v !== void 0 ? _props$fields$width$v : undefined,
        height: (_props$fields$height$ = props.fields.height.value) !== null && _props$fields$height$ !== void 0 ? _props$fields$height$ : undefined
      },
      onChange: data => {
        var _data$width, _data$height;
        props.onChange({
          src: data.src,
          alt: data.alt,
          width: (_data$width = data.width) !== null && _data$width !== void 0 ? _data$width : null,
          height: (_data$height = data.height) !== null && _data$height !== void 0 ? _data$height : null
        });
      },
      autoFocus: props.autoFocus,
      isRequired: props.isRequired,
      forceValidation: props.forceValidation
    })]
  });
}

function cloudImage({
  label,
  description,
  validation
}) {
  return {
    ...index$1.object({
      src: index$1.text({
        label: 'URL',
        validation: {
          length: {
            min: validation !== null && validation !== void 0 && validation.isRequired ? 1 : 0
          }
        }
      }),
      alt: index$1.text({
        label: 'Alt text'
      }),
      height: api.integer({
        label: 'Height'
      }),
      width: api.integer({
        label: 'Width'
      })
    }, {
      label,
      description
    }),
    Input(props) {
      return /*#__PURE__*/jsxRuntime.jsx(CloudImageFieldInput, {
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
  document: index$1.document,
  emptyDocument: emptyDocument,
  empty: empty,
  image: image,
  file: file,
  integer: api.integer,
  multiselect: multiselect,
  object: index$1.object,
  pathReference: pathReference,
  relationship: relationship,
  select: select,
  slug: slug,
  text: index$1.text,
  url: url,
  blocks: blocks,
  cloudImage: cloudImage
});

exports.BlockWrapper = index$1.BlockWrapper;
exports.NotEditable = index$1.NotEditable;
exports.ToolbarSeparator = index$1.ToolbarSeparator;
exports.collection = index$1.collection;
exports.config = index$1.config;
exports.singleton = index$1.singleton;
exports.component = api.component;
exports.fields = index;
