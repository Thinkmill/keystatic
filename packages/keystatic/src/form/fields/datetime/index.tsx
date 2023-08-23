import { BasicFormField } from '../../api';
import { FieldDataError } from '../error';
import {
  RequiredValidation,
  assertRequired,
  basicFormFieldWithSimpleReaderParse,
} from '../utils';
import { DatetimeFieldInput } from './ui';

export function validateDatetime(
  validation: { min?: string; max?: string; isRequired?: boolean } | undefined,
  value: string | null,
  label: string
) {
  if (value !== null && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return `${label} is not a valid datetime`;
  }

  if (validation?.isRequired && value === null) {
    return `${label} is required`;
  }
  if ((validation?.min || validation?.max) && value !== null) {
    const datetime = new Date(value);
    if (validation?.min !== undefined) {
      const min = new Date(validation.min);
      if (datetime < min) {
        return `${label} must be after ${min.toISOString()}`;
      }
    }
    if (validation?.max !== undefined) {
      const max = new Date(validation.max);
      if (datetime > max) {
        return `${label} must be no later than ${max.toISOString()}`;
      }
    }
  }
}

export function datetime<IsRequired extends boolean | undefined>({
  label,
  defaultValue,
  validation,
  description,
}: {
  label: string;
  defaultValue?: string | { kind: 'now' };
  validation?: { isRequired?: IsRequired; min?: string; max?: string };
  description?: string;
} & RequiredValidation<IsRequired>): BasicFormField<
  string | null,
  string | (IsRequired extends true ? never : null)
> {
  return basicFormFieldWithSimpleReaderParse({
    Input(props) {
      return (
        <DatetimeFieldInput
          validation={validation}
          label={label}
          description={description}
          {...props}
        />
      );
    },
    defaultValue() {
      if (defaultValue === undefined) {
        return null;
      }
      if (typeof defaultValue === 'string') {
        return defaultValue;
      }
      if (defaultValue.kind === 'now') {
        const now = new Date();
        return now.toISOString();
      }
      return null;
    },
    parse(value) {
      if (value === undefined) {
        return null;
      }
      if (typeof value !== 'string') {
        throw new FieldDataError('Must be a string');
      }
      return value;
    },
    serialize(value) {
      return { value: value === null ? undefined : value };
    },
    validate(value) {
      const message = validateDatetime(validation, value, label);
      if (message !== undefined) {
        throw new FieldDataError(message);
      }
      assertRequired(value, validation, label);
      return value;
    },
  });
}
