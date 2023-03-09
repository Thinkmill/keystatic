import { TextField } from '@voussoir/text-field';
import { useReducer } from 'react';
import { BasicFormField } from '../api';
import { RequiredValidation } from './utils';

function validateDate(
  validation: { min?: string; max?: string; isRequired?: boolean } | undefined,
  value: unknown,
  label: string
) {
  if (
    value !== null &&
    (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value))
  ) {
    return `${label} is not a valid date`;
  }

  if (validation?.isRequired && value === null) {
    return `${label} is required`;
  }
  if ((validation?.min || validation?.max) && value !== null) {
    const date = new Date(value);
    if (validation?.min !== undefined) {
      const min = new Date(validation.min);
      if (date < min) {
        return `${label} must be after ${min.toLocaleDateString()}`;
      }
    }
    if (validation?.max !== undefined) {
      const max = new Date(validation.max);
      if (date > max) {
        return `${label} must be no later than ${max.toLocaleDateString()}`;
      }
    }
  }
}

export function date<IsRequired extends boolean | undefined>({
  label,
  defaultValue,
  validation,
  description,
}: {
  label: string;
  defaultValue?: string | { kind: 'today' };
  validation?: { isRequired?: IsRequired; min?: string; max?: string };
  description?: string;
} & RequiredValidation<IsRequired>): BasicFormField<
  string | (IsRequired extends true ? never : null),
  undefined
> {
  const field: BasicFormField<string | null, undefined> = {
    kind: 'form',
    Input({ value, onChange, autoFocus, forceValidation }) {
      const [blurred, onBlur] = useReducer(() => true, false);

      return (
        <TextField
          label={label}
          description={description}
          type="date"
          onChange={val => {
            onChange(val === '' ? null : val);
          }}
          autoFocus={autoFocus}
          value={value === null ? '' : value}
          onBlur={onBlur}
          errorMessage={
            blurred || forceValidation
              ? validateDate(validation, value, label)
              : undefined
          }
        />
      );
    },
    options: undefined,
    get defaultValue() {
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
    validate(value) {
      return validateDate(validation, value, label) === undefined;
    },
  };
  return field as any;
}
