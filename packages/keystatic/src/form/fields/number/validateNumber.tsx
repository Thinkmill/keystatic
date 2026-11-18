import {
  defaultStringFormatter,
  KeystaticStringFormatter,
} from '../../../app/l10n/default-formatter';

export function validateNumber(
  validation:
    | {
        min?: number;
        max?: number;
        isRequired?: boolean;
        validateStep?: boolean;
      }
    | undefined,
  value: unknown,
  step: number | undefined,
  label: string,
  stringFormatter: KeystaticStringFormatter = defaultStringFormatter
) {
  if (value !== null && typeof value !== 'number') {
    return stringFormatter.format('fieldMustBeNumber', { label });
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
    if (
      step !== undefined &&
      validation?.validateStep !== undefined &&
      !isAtStep(value, step)
    ) {
      return stringFormatter.format('fieldMustBeMultipleOf', { label, step });
    }
  }
}

function decimalPlaces(value: number) {
  const stringified = value.toString();
  const indexOfDecimal = stringified.indexOf('.');
  if (indexOfDecimal === -1) {
    const indexOfE = stringified.indexOf('e-');
    return indexOfE === -1 ? 0 : parseInt(stringified.slice(indexOfE + 2));
  }
  return stringified.length - indexOfDecimal - 1;
}

export function isAtStep(value: number, step: number) {
  const dc = Math.max(decimalPlaces(step), decimalPlaces(value));
  const base = Math.pow(10, dc);
  return (value * base) % (step * base) === 0;
}
