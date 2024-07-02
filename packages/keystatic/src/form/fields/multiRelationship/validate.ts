import { pluralize } from '../../../app/pluralize';

export function validateMultiRelationshipLength(
  validation: { length?: { min?: number; max?: number } } | undefined,
  value: string[]
) {
  const minLength = validation?.length?.min ?? 0;
  if (value.length < minLength) {
    return `Must have at least ${pluralize(minLength, {
      singular: 'item',
    })}.`;
  }
  const maxLength = validation?.length?.max ?? Infinity;
  if (value.length > maxLength) {
    return `Must have at most ${pluralize(maxLength, {
      singular: 'item',
    })}.`;
  }
}
