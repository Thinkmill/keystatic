import { aw as basicFormFieldWithSimpleReaderParse, ax as FieldDataError, ay as assertRequired, aF as ImageFieldInput, aG as getSrcPrefix, aH as fixPath, aI as useIsInDocumentEditor, aJ as useObjectURL, aK as getUploadedFile, b as useTree, aL as useFieldContext, aM as SlugFieldContext, aN as PathContext, aO as validateText, aP as isValidURL, l as l10nMessages, a7 as getInitialPropsValue, aQ as ArrayFieldListView, aR as previewPropsToValue, aS as ArrayFieldValidationMessages, aT as valueToUpdater, aU as setValueToPreviewProps, Z as createGetPreviewProps, a1 as clientSideValidateProp, aV as FormValueContentFromPreviewProps, aW as useImageLibraryURL, _ as useEventCallback, S as useConfig, aX as loadImageData, aY as emptyImageData, aZ as ImageDimensionsInput, a_ as parseImageData, o as object, a$ as text, b0 as document } from './index-47692431.esm.js';
export { aC as BlockWrapper, aD as NotEditable, aE as ToolbarSeparator, aA as collection, az as config, aB as singleton } from './index-47692431.esm.js';
import { i as integer } from './api-b09297e2.esm.js';
export { c as component } from './api-b09297e2.esm.js';
import { Checkbox } from '@keystar/ui/checkbox';
import { Text, Heading } from '@keystar/ui/typography';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { TextField, TextArea } from '@keystar/ui/text-field';
import { useReducer, useId, useMemo, useState, useEffect, useContext } from 'react';
import { ButtonGroup, ActionButton, Button, ClearButton } from '@keystar/ui/button';
import { FieldLabel, FieldMessage } from '@keystar/ui/field';
import { Flex, Box, VStack } from '@keystar/ui/layout';
import { Combobox, Item } from '@keystar/ui/combobox';
import { filter } from 'minimatch';
import { Item as Item$1 } from '@react-stately/collections';
import { u as useSlugsInCollection } from './useSlugsInCollection-fdbc7ce8.esm.js';
import { Picker, Item as Item$2 } from '@keystar/ui/picker';
import slugify from '@sindresorhus/slugify';
import 'emery';
import '@keystar/ui/style';
import '@keystar/ui/number-field';
import '@braintree/sanitize-url';
import { useLocalizedStringFormatter } from '@react-aria/i18n';
import { DialogContainer, Dialog, useDialogContainer } from '@keystar/ui/dialog';
import { Content } from '@keystar/ui/slots';
import { MenuTrigger, Menu } from '@keystar/ui/menu';
import { TextLink } from '@keystar/ui/link';
import { ProgressCircle } from '@keystar/ui/progress';
import '@markdoc/markdoc';
import 'slate';
import 'emery/assertions';
import 'js-base64';
import './hex-35fa8573.esm.js';
import '@keystar/ui/split-view';
import '@keystar/ui/drag-and-drop';
import '@keystar/ui/icon';
import '@keystar/ui/icon/icons/trash2Icon';
import '@keystar/ui/list-view';
import '@keystar/ui/tooltip';
import 'slate-react';
import 'is-hotkey';
import '@react-aria/utils';
import '@keystar/ui/icon/icons/editIcon';
import '@keystar/ui/icon/icons/externalLinkIcon';
import '@keystar/ui/icon/icons/linkIcon';
import '@keystar/ui/icon/icons/unlinkIcon';
import '@react-aria/overlays';
import '@react-stately/overlays';
import '@keystar/ui/overlays';
import '@keystar/ui/action-group';
import '@keystar/ui/icon/icons/boldIcon';
import '@keystar/ui/icon/icons/chevronDownIcon';
import '@keystar/ui/icon/icons/codeIcon';
import '@keystar/ui/icon/icons/italicIcon';
import '@keystar/ui/icon/icons/maximizeIcon';
import '@keystar/ui/icon/icons/minimizeIcon';
import '@keystar/ui/icon/icons/plusIcon';
import '@keystar/ui/icon/icons/removeFormattingIcon';
import '@keystar/ui/icon/icons/strikethroughIcon';
import '@keystar/ui/icon/icons/subscriptIcon';
import '@keystar/ui/icon/icons/superscriptIcon';
import '@keystar/ui/icon/icons/typeIcon';
import '@keystar/ui/icon/icons/underlineIcon';
import '@keystar/ui/icon/icons/alignLeftIcon';
import '@keystar/ui/icon/icons/alignRightIcon';
import '@keystar/ui/icon/icons/alignCenterIcon';
import '@keystar/ui/icon/icons/quoteIcon';
import 'match-sorter';
import '@keystar/ui/icon/icons/trashIcon';
import '@emotion/weak-memoize';
import '@keystar/ui/icon/icons/minusIcon';
import '@keystar/ui/icon/icons/columnsIcon';
import '@keystar/ui/icon/icons/listIcon';
import '@keystar/ui/icon/icons/listOrderedIcon';
import '@keystar/ui/icon/icons/fileUpIcon';
import '@keystar/ui/icon/icons/imageIcon';
import '@ts-gql/tag/no-transform';
import 'urql';
import 'lru-cache';
import 'cookie';
import 'zod';
import '@keystar/ui/icon/icons/link2Icon';
import '@keystar/ui/icon/icons/link2OffIcon';
import '@keystar/ui/icon/icons/pencilIcon';
import '@keystar/ui/icon/icons/undo2Icon';
import '@keystar/ui/utils';
import '@keystar/ui/icon/icons/sheetIcon';
import '@keystar/ui/icon/icons/tableIcon';
import 'scroll-into-view-if-needed';
import '@react-stately/list';
import '@keystar/ui/listbox';
import 'slate-history';
import 'mdast-util-from-markdown';
import 'mdast-util-gfm-autolink-literal/from-markdown';
import 'micromark-extension-gfm-autolink-literal';
import 'mdast-util-gfm-strikethrough/from-markdown';
import 'micromark-extension-gfm-strikethrough';
import '@keystar/ui/icon/icons/panelLeftOpenIcon';
import '@keystar/ui/icon/icons/panelLeftCloseIcon';
import '@keystar/ui/icon/icons/panelRightOpenIcon';
import '@keystar/ui/icon/icons/panelRightCloseIcon';
import '@keystar/ui/badge';
import '@keystar/ui/nav-list';
import '@keystar/ui/status-light';
import '@keystar/ui/core';
import '@keystar/ui/avatar';
import '@keystar/ui/icon/icons/logOutIcon';
import '@keystar/ui/icon/icons/gitPullRequestIcon';
import '@keystar/ui/icon/icons/gitBranchPlusIcon';
import '@keystar/ui/icon/icons/githubIcon';
import '@keystar/ui/icon/icons/gitForkIcon';
import '@keystar/ui/icon/icons/monitorIcon';
import '@keystar/ui/icon/icons/moonIcon';
import '@keystar/ui/icon/icons/sunIcon';
import '@keystar/ui/icon/icons/userIcon';
import '@keystar/ui/icon/icons/gitBranchIcon';
import '@keystar/ui/radio';

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
  return /*#__PURE__*/jsxs(Checkbox, {
    isSelected: props.value,
    onChange: props.onChange,
    autoFocus: props.autoFocus,
    children: [/*#__PURE__*/jsx(Text, {
      children: props.label
    }), props.description && /*#__PURE__*/jsx(Text, {
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

function DateFieldInput(props) {
  var _props$validation;
  const [blurred, onBlur] = useReducer(() => true, false);
  return /*#__PURE__*/jsx(TextField, {
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

//ui.tsx
function DatetimeFieldInput(props) {
  var _props$validation;
  const [blurred, onBlur] = useReducer(() => true, false);
  return /*#__PURE__*/jsx(TextField, {
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

function FileFieldInput(props) {
  var _props$validation, _props$validation2;
  const {
    value
  } = props;
  const [blurred, onBlur] = useReducer(() => true, false);
  const isInEditor = useIsInDocumentEditor();
  const objectUrl = useObjectURL(value === null ? null : value.data);
  const labelId = useId();
  const descriptionId = useId();
  return /*#__PURE__*/jsxs(Flex, {
    "aria-describedby": props.description ? descriptionId : undefined,
    "aria-labelledby": labelId,
    direction: "column",
    gap: "medium",
    role: "group",
    children: [/*#__PURE__*/jsx(FieldLabel, {
      id: labelId,
      elementType: "span",
      isRequired: (_props$validation = props.validation) === null || _props$validation === void 0 ? void 0 : _props$validation.isRequired,
      children: props.label
    }), props.description && /*#__PURE__*/jsx(Text, {
      size: "small",
      color: "neutralSecondary",
      id: descriptionId,
      children: props.description
    }), /*#__PURE__*/jsxs(ButtonGroup, {
      children: [/*#__PURE__*/jsx(ActionButton, {
        onPress: async () => {
          const file = await getUploadedFile('');
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
      }), value !== null && /*#__PURE__*/jsxs(Fragment, {
        children: [/*#__PURE__*/jsx(ActionButton, {
          prominence: "low",
          onPress: () => {
            props.onChange(null);
            onBlur();
          },
          children: "Remove"
        }), objectUrl && /*#__PURE__*/jsx(Button, {
          href: objectUrl,
          download: value.filename,
          prominence: "low",
          children: "Download"
        })]
      })]
    }), isInEditor && value !== null && /*#__PURE__*/jsx(TextField, {
      label: "Filename",
      onChange: filename => {
        props.onChange({
          ...value,
          filename
        });
      },
      value: value.filename
    }), (props.forceValidation || blurred) && ((_props$validation2 = props.validation) === null || _props$validation2 === void 0 ? void 0 : _props$validation2.isRequired) && value === null && /*#__PURE__*/jsxs(FieldMessage, {
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

function MultiselectFieldInput(props) {
  const labelId = useId();
  const descriptionId = useId();
  return /*#__PURE__*/jsxs(Flex, {
    role: "group",
    "aria-labelledby": labelId,
    "aria-describedby": props.description ? descriptionId : undefined,
    direction: "column",
    gap: "medium",
    children: [/*#__PURE__*/jsx(FieldLabel, {
      elementType: "span",
      id: labelId,
      children: props.label
    }), props.description && /*#__PURE__*/jsx(Text, {
      id: descriptionId,
      size: "small",
      color: "neutralSecondary",
      children: props.description
    }), props.options.map(option => /*#__PURE__*/jsx(Checkbox, {
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

function PathReferenceInput(props) {
  var _props$validation, _props$validation2;
  const match = useMemo(() => props.pattern ? filter(props.pattern) : () => true, [props.pattern]);
  const [blurred, onBlur] = useReducer(() => true, false);
  const tree = useTree().current;
  const options = useMemo(() => {
    const files = tree.kind === 'loaded' ? [...tree.data.entries.values()] : [];
    return files.filter(val => match(val.path));
  }, [tree, match]);
  const _errorMessage = (props.forceValidation || blurred) && (_props$validation = props.validation) !== null && _props$validation !== void 0 && _props$validation.isRequired && props.value === null ? `${props.label} is required` : undefined;
  // this state & effect shouldn't really exist
  // it's here because react-aria/stately calls onSelectionChange with null
  // after selecting an item if we immediately remove the error message
  // so we delay it with an effect
  const [errorMessage, setErrorMessage] = useState(_errorMessage);
  useEffect(() => {
    setErrorMessage(_errorMessage);
  }, [_errorMessage]);
  return /*#__PURE__*/jsx(Combobox, {
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
    children: item => /*#__PURE__*/jsx(Item, {
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

function RelationshipInput(props) {
  var _props$validation, _props$validation2;
  const [blurred, onBlur] = useReducer(() => true, false);
  const slugs = useSlugsInCollection(props.collection);
  const options = useMemo(() => {
    return slugs.map(slug => ({
      slug
    }));
  }, [slugs]);
  const _errorMessage = (props.forceValidation || blurred) && (_props$validation = props.validation) !== null && _props$validation !== void 0 && _props$validation.isRequired && props.value === null ? `${props.label} is required` : undefined;
  // this state & effect shouldn't really exist
  // it's here because react-aria/stately calls onSelectionChange with null
  // after selecting an item if we immediately remove the error message
  // so we delay it with an effect
  const [errorMessage, setErrorMessage] = useState(_errorMessage);
  useEffect(() => {
    setErrorMessage(_errorMessage);
  }, [_errorMessage]);
  return /*#__PURE__*/jsx(Combobox, {
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
    children: item => /*#__PURE__*/jsx(Item$1, {
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

function SelectFieldInput(props) {
  let fieldContext = useFieldContext();
  return /*#__PURE__*/jsx(Picker, {
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
    children: item => /*#__PURE__*/jsx(Item$2, {
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

const emptySet = new Set();
function SlugFieldInput(props) {
  var _props$args$slug$vali, _props$args$slug, _props$args$slug$vali2, _props$args$slug2, _props$args$slug$labe, _props$args$slug3, _props$args$name$vali, _props$args$name$vali2, _props$args$name$vali3, _props$args$name$vali4, _props$args$slug$labe2, _props$args$slug4, _props$args$slug5;
  const slugContext = useContext(SlugFieldContext);
  const path = useContext(PathContext);
  const slugInfo = path.length === 1 && path[0] === (slugContext === null || slugContext === void 0 ? void 0 : slugContext.field) ? slugContext : {
    slugs: emptySet,
    glob: '*'
  };
  const [blurredName, setBlurredName] = useState(false);
  const [blurredSlug, setBlurredSlug] = useState(false);
  const [shouldGenerateSlug, setShouldGenerateSlug] = useState(props.value === props.defaultValue);
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
  const slugErrorMessage = props.forceValidation || blurredSlug ? validateText(props.value.slug, (_props$args$slug$vali = (_props$args$slug = props.args.slug) === null || _props$args$slug === void 0 || (_props$args$slug = _props$args$slug.validation) === null || _props$args$slug === void 0 || (_props$args$slug = _props$args$slug.length) === null || _props$args$slug === void 0 ? void 0 : _props$args$slug.min) !== null && _props$args$slug$vali !== void 0 ? _props$args$slug$vali : 1, (_props$args$slug$vali2 = (_props$args$slug2 = props.args.slug) === null || _props$args$slug2 === void 0 || (_props$args$slug2 = _props$args$slug2.validation) === null || _props$args$slug2 === void 0 || (_props$args$slug2 = _props$args$slug2.length) === null || _props$args$slug2 === void 0 ? void 0 : _props$args$slug2.max) !== null && _props$args$slug$vali2 !== void 0 ? _props$args$slug$vali2 : Infinity, (_props$args$slug$labe = (_props$args$slug3 = props.args.slug) === null || _props$args$slug3 === void 0 ? void 0 : _props$args$slug3.label) !== null && _props$args$slug$labe !== void 0 ? _props$args$slug$labe : 'Slug', slugInfo) : undefined;
  return /*#__PURE__*/jsxs(Flex, {
    gap: "xlarge",
    direction: "column",
    children: [/*#__PURE__*/jsx(TextField, {
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
      errorMessage: props.forceValidation || blurredName ? validateText(props.value.name, (_props$args$name$vali = (_props$args$name$vali2 = props.args.name.validation) === null || _props$args$name$vali2 === void 0 || (_props$args$name$vali2 = _props$args$name$vali2.length) === null || _props$args$name$vali2 === void 0 ? void 0 : _props$args$name$vali2.min) !== null && _props$args$name$vali !== void 0 ? _props$args$name$vali : 0, (_props$args$name$vali3 = (_props$args$name$vali4 = props.args.name.validation) === null || _props$args$name$vali4 === void 0 || (_props$args$name$vali4 = _props$args$name$vali4.length) === null || _props$args$name$vali4 === void 0 ? void 0 : _props$args$name$vali4.max) !== null && _props$args$name$vali3 !== void 0 ? _props$args$name$vali3 : Infinity, props.args.name.label, undefined) : undefined
    }), /*#__PURE__*/jsxs(Flex, {
      gap: "regular",
      alignItems: "end",
      children: [/*#__PURE__*/jsx(TextField, {
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
      }), /*#__PURE__*/jsxs(Flex, {
        gap: "regular",
        direction: "column",
        children: [/*#__PURE__*/jsx(ActionButton, {
          onPress: () => {
            props.onChange({
              name: props.value.name,
              slug: generateSlug(props.value.name)
            });
          },
          children: "Regenerate"
        }), slugErrorMessage !== undefined && /*#__PURE__*/jsx(Box, {
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

function UrlFieldInput(props) {
  var _props$validation;
  const [blurred, onBlur] = useReducer(() => true, false);
  return /*#__PURE__*/jsx(TextField, {
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

function BlocksFieldInput(props) {
  const labelId = useId();
  const descriptionId = useId();
  const stringFormatter = useLocalizedStringFormatter(l10nMessages);
  const [modalState, setModalState] = useState({
    kind: 'closed'
  });
  const dismiss = () => {
    setModalState({
      kind: 'closed'
    });
  };
  const formId = useId();
  return /*#__PURE__*/jsxs(Flex, {
    elementType: "section",
    gap: "medium",
    role: "group",
    "aria-labelledby": labelId,
    "aria-describedby": props.schema.description ? descriptionId : undefined,
    direction: "column",
    children: [/*#__PURE__*/jsx(FieldLabel, {
      elementType: "h3",
      id: labelId,
      children: props.schema.label
    }), props.schema.description && /*#__PURE__*/jsx(Text, {
      id: descriptionId,
      size: "small",
      color: "neutralSecondary",
      children: props.schema.description
    }), /*#__PURE__*/jsxs(MenuTrigger, {
      children: [/*#__PURE__*/jsx(ActionButton, {
        alignSelf: "start",
        children: "Add"
      }), /*#__PURE__*/jsx(Menu, {
        items: props.schema.element.discriminant.options,
        onAction: key => {
          if (typeof key !== 'string') return;
          const discriminant = key;
          setModalState({
            kind: 'new',
            initial: {
              discriminant,
              value: getInitialPropsValue(props.schema.element.values[`${discriminant}`])
            }
          });
        },
        children: item => /*#__PURE__*/jsx(Item$1, {
          children: item.label
        }, item.value)
      })]
    }), /*#__PURE__*/jsx(ArrayFieldListView, {
      ...props,
      labelId: labelId,
      onOpenItem: idx => {
        setModalState({
          kind: 'edit',
          idx,
          initial: previewPropsToValue(props.elements[idx])
        });
      }
    }), /*#__PURE__*/jsx(ArrayFieldValidationMessages, {
      ...props
    }), /*#__PURE__*/jsx(DialogContainer, {
      onDismiss: dismiss,
      children: (_props$schema$element => {
        if (modalState.kind === 'closed') {
          return null;
        }
        const discriminant = modalState.initial.discriminant;
        return /*#__PURE__*/jsxs(Dialog, {
          children: [/*#__PURE__*/jsxs(Heading, {
            children: [modalState.kind === 'edit' ? 'Edit' : 'Add', ' ', (_props$schema$element = props.schema.element.discriminant.options.find(x => x.value === discriminant)) === null || _props$schema$element === void 0 ? void 0 : _props$schema$element.label]
          }), /*#__PURE__*/jsx(Content, {
            children: /*#__PURE__*/jsx(ItemForm, {
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
                    value: valueToUpdater({
                      value: val,
                      discriminant
                    }, props.schema.element)
                  }]);
                  return;
                }
                setValueToPreviewProps(val, props.elements[modalState.idx].value);
              }
            })
          }), /*#__PURE__*/jsxs(ButtonGroup, {
            children: [/*#__PURE__*/jsx(Button, {
              onPress: dismiss,
              children: stringFormatter.format('cancel')
            }), /*#__PURE__*/jsx(Button, {
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
  const [value, setValue] = useState(props.initialValue);
  const [forceValidation, setForceValidation] = useState(false);
  const previewProps = useMemo(() => createGetPreviewProps(props.schema, setValue, () => undefined), [props.schema, setValue])(value);
  const {
    dismiss
  } = useDialogContainer();
  return /*#__PURE__*/jsx(Flex, {
    id: props.id,
    elementType: "form",
    onSubmit: event => {
      if (event.target !== event.currentTarget) return;
      event.preventDefault();
      if (!clientSideValidateProp(props.schema, value, undefined)) {
        setForceValidation(true);
        return;
      }
      props.onSubmit(value);
      dismiss();
    },
    direction: "column",
    gap: "xxlarge",
    children: /*#__PURE__*/jsx(FormValueContentFromPreviewProps, {
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
  const [status, setStatus] = useState(image.src ? 'good' : '');
  const imageLibraryURL = useImageLibraryURL();
  const onPaste = event => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    const parsed = parseImageData(text);
    props.onChange(parsed);
  };
  const onLoad = useEventCallback(data => {
    onChange(data);
    setStatus('good');
  });
  const config = useConfig();
  const hasSetFields = !!(props.image.alt || props.image.width || props.image.height);
  useEffect(() => {
    if (!props.image.src) {
      setStatus('');
      return;
    }
    if (!isValidURL(props.image.src)) {
      return;
    }
    if (hasSetFields) {
      setStatus('good');
      return;
    }
    setStatus('loading');
    loadImageData(props.image.src, config).then(newData => {
      onLoad(newData);
    }).catch(() => {
      setStatus('error');
    });
  }, [config, hasSetFields, onLoad, props.image.src]);
  const [blurred, setBlurred] = useState(false);
  const errorMessage = (blurred || props.forceValidation) && props.isRequired && !image.src ? 'Image URL is required' : undefined;
  return /*#__PURE__*/jsxs(VStack, {
    gap: "xlarge",
    children: [/*#__PURE__*/jsx(TextField, {
      label: "Image URL",
      errorMessage: errorMessage,
      autoFocus: props.autoFocus,
      onPaste: onPaste,
      onKeyDown: e => {
        if (e.code === 'Backspace' || e.code === 'Delete') {
          props.onChange(emptyImageData);
        }
      },
      onBlur: () => setBlurred(true),
      value: image.src,
      description: /*#__PURE__*/jsxs(Text, {
        children: ["Copy an image URL from the", ' ', /*#__PURE__*/jsx(TextLink, {
          prominence: "high",
          href: imageLibraryURL,
          target: "_blank",
          rel: "noreferrer",
          children: "Image Library"
        }), ' ', "and paste it into this field."]
      }),
      endElement: status === 'loading' ? /*#__PURE__*/jsx(Flex, {
        height: "element.regular",
        width: "element.regular",
        alignItems: "center",
        justifyContent: "center",
        children: /*#__PURE__*/jsx(ProgressCircle, {
          size: "small",
          "aria-label": "Checking\u2026",
          isIndeterminate: true
        })
      }) : image.src ? /*#__PURE__*/jsx(ClearButton, {
        onPress: () => {
          props.onChange(emptyImageData);
          setStatus('');
        },
        preventFocus: true
      }) : null
    }), status === 'good' ? /*#__PURE__*/jsxs(Fragment, {
      children: [/*#__PURE__*/jsx(Box, {
        width: "scale.1600",
        height: "scale.1600",
        children: /*#__PURE__*/jsx("img", {
          alt: image.alt,
          src: image.src,
          style: {
            objectFit: 'contain',
            height: '100%',
            width: '100%'
          }
        })
      }), /*#__PURE__*/jsx(TextArea, {
        label: "Alt text",
        value: image.alt,
        onChange: alt => props.onChange({
          ...image,
          alt
        })
      }), /*#__PURE__*/jsx(ImageDimensionsInput, {
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
  const labelId = useId();
  const descriptionId = useId();
  return /*#__PURE__*/jsxs(Flex, {
    role: "group",
    gap: "medium",
    marginY: "large",
    "aria-labelledby": labelId,
    "aria-describedby": props.schema.description ? descriptionId : undefined,
    direction: "column",
    children: [/*#__PURE__*/jsx(Text, {
      color: "neutral",
      size: "medium",
      weight: "medium",
      id: labelId,
      children: props.schema.label
    }), !!props.schema.description && /*#__PURE__*/jsx(Text, {
      id: descriptionId,
      size: "regular",
      color: "neutralSecondary",
      children: props.schema.description
    }), /*#__PURE__*/jsx(ImageField, {
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

export { index as fields };
