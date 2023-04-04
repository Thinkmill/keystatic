'use client';
import { tokenSchema } from '@voussoir/style';
import { TextField } from '@voussoir/text-field';
import { useReducer } from 'react';
import { FormFieldInputProps } from '../../api';
import { validateUrl } from '.';

export function UrlFieldInput(
  props: FormFieldInputProps<string | null> & {
    label: string;
    description: string | undefined;
    validation: { isRequired?: boolean } | undefined;
  }
) {
  const [blurred, onBlur] = useReducer(() => true, false);
  return (
    <TextField
      width="initial"
      maxWidth={`calc(${tokenSchema.size.alias.singleLineWidth} * 3)`}
      label={props.label}
      description={props.description}
      autoFocus={props.autoFocus}
      value={props.value === null ? '' : props.value}
      onChange={val => {
        props.onChange((val === '' ? null : val) as any);
      }}
      onBlur={onBlur}
      errorMessage={
        props.forceValidation || blurred
          ? validateUrl(props.validation, props.value, props.label)
          : undefined
      }
    />
  );
}
