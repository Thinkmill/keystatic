import {
  defaultStringFormatter,
  KeystaticStringFormatter,
} from '../../../app/l10n/default-formatter';

export function validateMultiRelationshipLength(
  validation: { length?: { min?: number; max?: number } } | undefined,
  value: string[],
  stringFormatter: KeystaticStringFormatter = defaultStringFormatter
) {
  const minLength = validation?.length?.min ?? 0;
  if (value.length < minLength) {
    return stringFormatter.format('mustHaveAtLeastItems', { count: minLength });
  }
  const maxLength = validation?.length?.max ?? Infinity;
  if (value.length > maxLength) {
    return stringFormatter.format('mustHaveAtMostItems', { count: maxLength });
  }
}
