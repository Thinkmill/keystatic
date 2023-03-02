import { TextArea, TextField } from '@voussoir/text-field';
import { useState, useMemo, useContext, createContext, ReactNode } from 'react';
import { useSlugsInCollection } from '../../../app/useSlugsInCollection';
import { SlugFormField } from '../api';
import { ReadonlyPropPath } from '../utils';

export const SlugFieldContext = createContext<
  | { slugField: string; collection: string; currentSlug: string | undefined }
  | undefined
>(undefined);

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
  slugs?: Set<string>
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
  if (slugs) {
    if (val === '..') {
      return `${fieldLabel} must not be ..`;
    }
    if (val === '.') {
      return `${fieldLabel} must not be .`;
    }
    if (/[\\/]/.test(val)) {
      return `${fieldLabel} must not contain slashes`;
    }
    if (slugs.has(val)) {
      return `${fieldLabel} must be unique`;
    }
  }
}

export function isValidSlug(val: string, slugs: Set<string>) {
  return val !== '..' && val !== '.' && !/[\\/]/.test(val) && !slugs.has(val);
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
  function SlugTextField(props: {
    value: string;
    onChange: (value: string) => void;
    autoFocus?: boolean;
    forceValidation?: boolean;
    collection: string;
    currentSlug: string | undefined;
  }) {
    const [blurred, setBlurred] = useState(false);

    const items = useSlugsInCollection(props.collection);
    const slugs = useMemo(() => {
      const otherSlugs = new Set(items);
      if (props.currentSlug !== undefined) {
        otherSlugs.delete(props.currentSlug);
      }
      return otherSlugs;
    }, [items, props.currentSlug]);

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
            ? validateText(props.value, Math.max(min, 1), max, label, slugs)
            : undefined
        }
      />
    );
  }
  return {
    kind: 'form',
    Input(props) {
      const [blurred, setBlurred] = useState(false);
      const slugContext = useContext(SlugFieldContext);
      const path = useContext(PathContext);
      if (path.length === 1 && slugContext?.slugField === path[0]) {
        return (
          <SlugTextField
            collection={slugContext.collection}
            currentSlug={slugContext.currentSlug}
            {...props}
          />
        );
      }
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
              ? validateText(props.value, min, max, label)
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
        const slugs = new Set(slugInfo.slugs);
        if (slugInfo.currentSlug !== undefined) {
          slugs.delete(slugInfo.currentSlug);
        }
        return isValidSlug(value, slugs);
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
