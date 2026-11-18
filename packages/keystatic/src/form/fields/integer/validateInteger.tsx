import {
  defaultStringFormatter,
  KeystaticStringFormatter,
} from '../../../app/l10n/default-formatter';

export function validateInteger(
  validation: { min?: number; max?: number; isRequired?: boolean } | undefined,
  value: unknown,
  label: string,
  stringFormatter: KeystaticStringFormatter = defaultStringFormatter
) {
  if (
    value !== null &&
    (typeof value !== 'number' || !Number.isInteger(value))
  ) {
    return stringFormatter.format('fieldMustBeWholeNumber', { label });
  }

  if (validation?.isRequired && value === null) {
    return stringFormatter.format('fieldIsRequired', { label });
  }
  if (value !== null) {
    if (validation?.min !== undefined && value < validation.min) {
      return stringFormatter.format('fieldMustBeAtLeast', {
        label,
        min: validation.min,
      });
    }
    if (validation?.max !== undefined && value > validation.max) {
      return stringFormatter.format('fieldMustBeAtMost', {
        label,
        max: validation.max,
      });
    }
  }
}
