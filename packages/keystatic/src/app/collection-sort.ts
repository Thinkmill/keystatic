// the collator enables language-sensitive string comparison
const collator = new Intl.Collator(undefined, { sensitivity: 'base' });

/**
 * Creates a comparison function that should be provided to the `sort()` method
 * of your data array.
 */
export function sortBy(
  direction: 'ascending' | 'descending',
  valueA: unknown,
  valueB: unknown
) {
  const modifier = direction === 'ascending' ? 1 : -1;

  // always push `null` and `undefined` to the bottom
  if (valueA == null) return 1;
  if (valueB == null) return -1;

  // the collator is only appropriate for strings, it fails in subtle
  // ways for floats, dates, etc.
  if (typeof valueA === 'string' && typeof valueB === 'string') {
    return collator.compare(valueA, valueB) * modifier;
  }

  return compare(valueA, valueB) * modifier;
}

/** Default comparison for non-string values */
function compare(a: any, b: any) {
  if (a < b) return -1;
  if (a > b) return 1;

  return 0;
}
