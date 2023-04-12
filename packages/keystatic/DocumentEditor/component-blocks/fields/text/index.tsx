import { Glob } from '../../../../config';
import { FormFieldStoredValue } from '../../../../src';
import { SlugFormField } from '../../api';
import { FieldDataError } from '../error';
import { TextFieldInput } from './ui';

export function validateText(
  val: string,
  min: number,
  max: number,
  fieldLabel: string,
  slugInfo: { slugs: Set<string>; glob: Glob } | undefined
) {
  if (val.length < min) {
    if (min === 1) {
      return `${fieldLabel} must not be empty`;
    } else {
      return `${fieldLabel} must be at least ${min} characters long`;
    }
  }
  if (val.length > max) {
    return `${fieldLabel} must be no longer than ${max} characters`;
  }
  if (slugInfo) {
    if (val === '') {
      return `${fieldLabel} must not be empty`;
    }
    if (val === '..') {
      return `${fieldLabel} must not be ..`;
    }
    if (val === '.') {
      return `${fieldLabel} must not be .`;
    }
    if (slugInfo.glob === '**') {
      const split = val.split('/');
      if (split.some(s => s === '..')) {
        return `${fieldLabel} must not contain ..`;
      }
      if (split.some(s => s === '.')) {
        return `${fieldLabel} must not be .`;
      }
    }
    if ((slugInfo.glob === '*' ? /[\\/]/ : /[\\]/).test(val)) {
      return `${fieldLabel} must not contain slashes`;
    }
    if (slugInfo.slugs.has(val)) {
      return `${fieldLabel} must be unique`;
    }
  }
}

function parseAsNormalField(value: FormFieldStoredValue) {
  if (value === undefined) {
    return '';
  }
  if (typeof value !== 'string') {
    throw new FieldDataError('Must be a string');
  }
  return value;
}

const emptySet = new Set<string>();

export function text({
  label,
  defaultValue = '',
  validation: { length: { max = Infinity, min = 0 } = {} } = {},
  description,
  multiline = false,
}: {
  label: string;
  defaultValue?: string;
  description?: string;
  validation?: {
    length?: {
      min?: number;
      max?: number;
    };
  };
  multiline?: boolean;
}): SlugFormField<string, string, string, null> {
  function validate(
    value: string,
    slugField: { slugs: Set<string>; glob: Glob } | undefined
  ) {
    const message = validateText(value, min, max, label, slugField);
    if (message !== undefined) {
      throw new FieldDataError(message);
    }
    return value;
  }
  return {
    kind: 'form',
    formKind: 'slug',
    Input(props) {
      return (
        <TextFieldInput
          label={label}
          description={description}
          min={min}
          max={max}
          multiline={multiline}
          {...props}
        />
      );
    },
    defaultValue() {
      return defaultValue;
    },
    parse(value, args) {
      if (args?.slug !== undefined) {
        return args.slug;
      }
      return parseAsNormalField(value);
    },
    serialize(value) {
      return { value: value === '' ? undefined : value };
    },
    serializeWithSlug(value) {
      return { slug: value, value: undefined };
    },

    reader: {
      parse(value) {
        const parsed = parseAsNormalField(value);
        return validate(parsed, undefined);
      },
      parseWithSlug(_value, args) {
        validate(parseAsNormalField(args.slug), {
          glob: args.glob,
          slugs: emptySet,
        });
        return null;
      },
    },

    validate(value, args) {
      return validate(value, args?.slugField);
    },
  };
}
