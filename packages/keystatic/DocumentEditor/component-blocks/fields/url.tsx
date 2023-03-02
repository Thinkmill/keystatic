import { tokenSchema } from '@voussoir/style';
import { TextField } from '@voussoir/text-field';
import { useState } from 'react';
import { isValidURL } from '../../isValidURL';
import { BasicFormField } from '../api';

export function url({
  label,
  defaultValue = '',
}: {
  label: string;
  defaultValue?: string;
}): BasicFormField<string, undefined> {
  const validate = (value: unknown) => {
    return typeof value === 'string' && (value === '' || isValidURL(value));
  };
  return {
    kind: 'form',
    Input({ value, onChange, autoFocus, forceValidation }) {
      const [blurred, setBlurred] = useState(false);
      const showValidation = forceValidation || (blurred && !validate(value));
      return (
        <TextField
          width="initial"
          maxWidth={`calc(${tokenSchema.size.alias.singleLineWidth} * 3)`}
          label={label}
          autoFocus={autoFocus}
          value={value}
          onChange={onChange}
          onBlur={() => {
            setBlurred(true);
          }}
          errorMessage={
            showValidation ? 'Please provide a valid URL' : undefined
          }
        />
      );
    },
    options: undefined,
    defaultValue,
    validate,
  };
}
