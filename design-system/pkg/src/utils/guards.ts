import { MaybeArray, ReactText } from '@keystar/ui/types';

/**
 * Checks if an unknown value is valid React text (string | number)?[]. This is
 * useful for conditionally wrapping some value when an element is required.
 */
export function isReactText(value: unknown): value is MaybeArray<ReactText> {
  if (Array.isArray(value)) {
    return value.every(isReactText);
  }

  return typeof value === 'string' || typeof value === 'number';
}
