import {
  defaultStringFormatter,
  KeystaticStringFormatter,
} from '../../../app/l10n/default-formatter';
import { isValidURL } from '../document/DocumentEditor/isValidURL';

export function validateUrl(
  validation: { isRequired?: boolean } | undefined,
  value: unknown,
  label: string,
  stringFormatter: KeystaticStringFormatter = defaultStringFormatter
) {
  if (value !== null && (typeof value !== 'string' || !isValidURL(value))) {
    return stringFormatter.format('fieldIsNotValidUrl', { label });
  }

  if (validation?.isRequired && value === null) {
    return stringFormatter.format('fieldIsRequired', { label });
  }
}
