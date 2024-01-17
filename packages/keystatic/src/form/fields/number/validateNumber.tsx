import Decimal from 'decimal.js';

export function validateNumber(
  validation: { min?: number; max?: number; isRequired?: boolean, validateStep?: boolean } | undefined,
  value: unknown,
  step: number | undefined,
  label: string
) {
  if (
    value !== null &&
    (typeof value !== 'number')
  ) {
    return `${label} must be a number`;
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
    if (step !== undefined && validation?.validateStep !== undefined && new Decimal(value).mod(new Decimal(step)).toNumber() !== 0) {
      return `${label} must be a multiple of ${step}`;
    }
  }
}
