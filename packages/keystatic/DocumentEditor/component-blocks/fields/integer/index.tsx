import { BasicFormField } from '../../api';
import { RequiredValidation } from '../utils';
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
  number | (IsRequired extends true ? never : null)
> {
  const validate = (value: unknown) => {
    return validateInteger(validation, value, label) === undefined;
  };
  return {
    kind: 'form',
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
    defaultValue: (defaultValue ?? null) as number,
    validate,
  };
}
