import { Glob } from '../../../config';
import { FormFieldStoredValue } from '../../..';
import { SlugFormField } from '../../api';
import { FieldDataError } from '../error';
import { TextFieldInput } from '#field-ui/text';
import { validateText } from './validateText';

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
  validation: {
    length: { max = Infinity, min = 0 } = {},
    pattern,
    isRequired,
  } = {},
  description,
  multiline = false,
}: {
  label: string;
  defaultValue?: string | (() => string);
  description?: string;
  validation?: {
    isRequired?: boolean;
    length?: {
      min?: number;
      max?: number;
    };
    pattern?: {
      regex: RegExp;
      message?: string;
    };
  };
  multiline?: boolean;
}): SlugFormField<string, string, string, null> {
  min = Math.max(isRequired ? 1 : 0, min);
  function validate(
    value: string,
    slugField: { slugs: Set<string>; glob: Glob } | undefined
  ) {
    const message = validateText(value, min, max, label, slugField, pattern);
    if (message !== undefined) {
      throw new FieldDataError(message);
    }
    return value;
  }
  return {
    kind: 'form',
    formKind: 'slug',
    label,
    Input(props) {
      return (
        <TextFieldInput
          label={label}
          description={description}
          min={min}
          max={max}
          multiline={multiline}
          pattern={pattern}
          {...props}
        />
      );
    },
    defaultValue() {
      return typeof defaultValue === 'string' ? defaultValue : defaultValue();
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
