import { isValidURL } from '../document/DocumentEditor/isValidURL';

export function validateUrl(
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
