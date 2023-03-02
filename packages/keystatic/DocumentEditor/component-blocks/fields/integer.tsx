import { TextField } from '@voussoir/text-field';
import { useState } from 'react';
import { BasicFormField } from '../api';

export function integer({
  label,
  defaultValue = 0,
}: {
  label: string;
  defaultValue?: number;
}): BasicFormField<number, undefined> {
  const validate = (value: unknown) => {
    return typeof value === 'number' && Number.isFinite(value);
  };
  return {
    kind: 'form',
    Input({ value, onChange, autoFocus, forceValidation }) {
      const [blurred, setBlurred] = useState(false);
      const [inputValue, setInputValue] = useState(String(value));
      const showValidation = forceValidation || (blurred && !validate(value));

      return (
        <TextField
          label={label}
          errorMessage={
            showValidation ? 'Please specify an integer' : undefined
          }
          onBlur={() => setBlurred(true)}
          autoFocus={autoFocus}
          value={inputValue}
          onChange={raw => {
            setInputValue(raw);
            if (/^[+-]?\d+$/.test(raw)) {
              onChange(Number(raw));
            } else {
              onChange(NaN);
            }
          }}
        />
      );
    },
    options: undefined,
    defaultValue,
    validate,
  };
}
