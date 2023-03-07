import { tokenSchema } from '@voussoir/style';
import { TextField } from '@voussoir/text-field';
import { useReducer } from 'react';
import { isValidURL } from '../../isValidURL';
import { BasicFormField } from '../api';
import { RequiredValidation } from './utils';

function validateUrl(
  validation: { isRequired?: boolean } | undefined,
  value: unknown,
  label: string
) {
  if (value !== null && (typeof value !== 'string' || !isValidURL(value))) {
    return `${label} is not a valid URL`;
  }

  if (validation?.isRequired && value === null) {
    return `${label} is required`;
  }
}

export function url<IsRequired extends boolean | undefined>({
  label,
  defaultValue = '',
  validation,
}: {
  label: string;
  defaultValue?: string;
  validation?: { isRequired?: IsRequired };
} & RequiredValidation<IsRequired>): BasicFormField<
  string | (IsRequired extends true ? never : null),
  undefined
> {
  return {
    kind: 'form',
    Input({ value, onChange, autoFocus, forceValidation }) {
      const [blurred, onBlur] = useReducer(() => true, false);
      return (
        <TextField
          width="initial"
          maxWidth={`calc(${tokenSchema.size.alias.singleLineWidth} * 3)`}
          label={label}
          autoFocus={autoFocus}
          value={value === null ? '' : value}
          onChange={val => {
            onChange((val === '' ? null : val) as any);
          }}
          onBlur={onBlur}
          errorMessage={
            forceValidation || blurred
              ? validateUrl(validation, value, label)
              : undefined
          }
        />
      );
    },
    options: undefined,
    defaultValue,
    validate(val) {
      return validateUrl(validation, val, label) === undefined;
    },
  };
}
