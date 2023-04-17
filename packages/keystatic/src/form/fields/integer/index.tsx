import { BasicFormField } from '../../api';
import { FieldDataError } from '../error';
import {
  RequiredValidation,
  assertRequired,
  basicFormFieldWithSimpleReaderParse,
} from '../utils';
import { IntegerFieldInput } from './ui';

export function validateInteger(
  validation: { min?: number; max?: number; isRequired?: boolean } | undefined,
  value: unknown,
  label: string
) {
  if (
    value !== null &&
    (typeof value !== 'number' || !Number.isFinite(value))
  ) {
    return `${label} is not a valid whole number`;
  }

  if (validation?.isRequired && value === null) {
    return `${label} is required`;
  }
  if (value !== null) {
    if (validation?.min !== undefined && value < validation.min) {
      return `${label} must be at least ${validation.min}`;
    }
    if (validation?.max !== undefined && value > validation.max) {
      return `${label} must be at most ${validation.max}`;
    }
  }
}

export function integer<IsRequired extends boolean | undefined>({
  label,
  defaultValue,
  validation,
  description,
}: {
  label: string;
  defaultValue?: number;
  validation?: { isRequired?: IsRequired; min: number; max: number };
  description?: string;
} & RequiredValidation<IsRequired>): BasicFormField<
  number | null,
  number | (IsRequired extends true ? never : null)
> {
  return basicFormFieldWithSimpleReaderParse({
    Input(props) {
      return (
        <IntegerFieldInput
          label={label}
          description={description}
          validation={validation}
          {...props}
        />
      );
    },
    defaultValue() {
      return defaultValue ?? null;
    },
    parse(value) {
      if (value === undefined) {
        return null;
      }
      if (typeof value === 'number') {
        return value;
      }
      throw new FieldDataError('Must be a number');
    },
    validate(value) {
      const message = validateInteger(validation, value, label);
      if (message !== undefined) {
        throw new FieldDataError(message);
      }
      assertRequired(value, validation, label);
      return value;
    },
    serialize(value) {
      return { value: value === null ? undefined : value };
    },
  });
}
