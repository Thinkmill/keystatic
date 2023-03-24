import { TextArea, TextField } from '@voussoir/text-field';
import { useState, useMemo, useContext, createContext, ReactNode } from 'react';
import { Glob } from '../../../config';
import { SlugFormField } from '../api';
import { ReadonlyPropPath } from '../utils';

export type SlugFieldInfo = {
  field: string;
  slugs: Set<string>;
  glob: Glob;
};

export const SlugFieldContext = createContext<SlugFieldInfo | undefined>(
  undefined
);

export const SlugFieldProvider = SlugFieldContext.Provider;

export const PathContext = createContext<ReadonlyPropPath>([]);

export const PathContextProvider = PathContext.Provider;

export function AddToPathProvider(props: {
  part: string | number;
  children: ReactNode;
}) {
  const path = useContext(PathContext);
  return (
    <PathContext.Provider
      value={useMemo(() => path.concat(props.part), [path, props.part])}
    >
      {props.children}
    </PathContext.Provider>
  );
}

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
    if (val === '..') {
      return `${fieldLabel} must not be ..`;
    }
    if (val === '.') {
      return `${fieldLabel} must not be .`;
    }
    if (badSlashForGlobPattern(slugInfo.glob).test(val)) {
      return `${fieldLabel} must not contain slashes`;
    }
    if (slugInfo.slugs.has(val)) {
      return `${fieldLabel} must be unique`;
    }
  }
}

const badSlashForGlobPattern = (glob: Glob) =>
  glob === '*' ? /[\\/]/ : /[\\]/;

export function isValidSlug(
  val: string,
  slugInfo: { slugs: Set<string>; glob: Glob }
) {
  return (
    val !== '..' &&
    val !== '.' &&
    !badSlashForGlobPattern(slugInfo.glob).test(val) &&
    !slugInfo.slugs.has(val)
  );
}

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
}): SlugFormField<string, undefined, undefined> {
  const TextFieldComponent = multiline ? TextArea : TextField;
  return {
    kind: 'form',
    Input(props) {
      const [blurred, setBlurred] = useState(false);
      const slugContext = useContext(SlugFieldContext);
      const path = useContext(PathContext);
      return (
        <TextFieldComponent
          label={label}
          description={description}
          autoFocus={props.autoFocus}
          value={props.value}
          onChange={props.onChange}
          onBlur={() => setBlurred(true)}
          errorMessage={
            props.forceValidation || blurred
              ? validateText(
                  props.value,
                  min,
                  max,
                  label,
                  path.length === 1 && slugContext?.field === path[0]
                    ? slugContext
                    : undefined
                )
              : undefined
          }
        />
      );
    },
    options: undefined,
    defaultValue,
    validate(value, slugInfo) {
      if (
        !(
          typeof value === 'string' &&
          value.length >= Math.max(min, slugInfo ? 1 : 0) &&
          value.length <= max
        )
      ) {
        return false;
      }
      if (slugInfo) {
        return isValidSlug(value, slugInfo);
      }
      return true;
    },
    slug: {
      parse(data) {
        return data.slug;
      },
      serialize(value) {
        return { slug: value, value: undefined };
      },
    },
  };
}
