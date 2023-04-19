'use client';
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Glob } from '../../../config';
import { ReadonlyPropPath } from '../document/DocumentEditor/component-blocks/utils';
import { FormFieldInputProps } from '../../api';
import { TextArea, TextField } from '@keystar-ui/text-field';
import { validateText } from '.';

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

export function TextFieldInput(
  props: FormFieldInputProps<string> & {
    multiline: boolean;
    label: string;
    description: string | undefined;
    min: number;
    max: number;
  }
) {
  const TextFieldComponent = props.multiline ? TextArea : TextField;
  const [blurred, setBlurred] = useState(false);
  const slugContext = useContext(SlugFieldContext);
  const path = useContext(PathContext);
  return (
    <TextFieldComponent
      label={props.label}
      description={props.description}
      autoFocus={props.autoFocus}
      value={props.value}
      onChange={props.onChange}
      onBlur={() => setBlurred(true)}
      errorMessage={
        props.forceValidation || blurred
          ? validateText(
              props.value,
              props.min,
              props.max,
              props.label,
              path.length === 1 && slugContext?.field === path[0]
                ? slugContext
                : undefined
            )
          : undefined
      }
    />
  );
}
