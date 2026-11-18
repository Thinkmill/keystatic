import {
  defaultStringFormatter,
  KeystaticStringFormatter,
} from '../../../app/l10n/default-formatter';

export function validateDatetime(
  validation: { min?: string; max?: string; isRequired?: boolean } | undefined,
  value: string | null,
  label: string,
  stringFormatter: KeystaticStringFormatter = defaultStringFormatter
) {
  if (value !== null && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return stringFormatter.format('fieldIsNotValidDatetime', { label });
  }

  if (validation?.isRequired && value === null) {
    return stringFormatter.format('fieldIsRequired', { label });
  }
  if ((validation?.min || validation?.max) && value !== null) {
    const datetime = new Date(value);
    if (validation?.min !== undefined) {
      const min = new Date(validation.min);
      if (datetime < min) {
        return stringFormatter.format('fieldMustBeAfter', {
          label,
          min: min.toISOString(),
        });
      }
    }
    if (validation?.max !== undefined) {
      const max = new Date(validation.max);
      if (datetime > max) {
        return stringFormatter.format('fieldMustBeNoLaterThan', {
          label,
          max: max.toISOString(),
        });
      }
    }
  }
}
