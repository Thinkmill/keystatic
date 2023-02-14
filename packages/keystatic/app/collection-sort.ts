import { assert } from 'emery';

import { SortDescriptor } from '@voussoir/table';

interface DataRecord extends Record<string, any> {}

// the collator enables language-sensitive string comparison
const collator = new Intl.Collator(undefined, { sensitivity: 'base' });

/**
 * Creates a comparison function that should be provided to the `sort()` method
 * of your data array.
 */
export function sortByDescriptor(sortDescriptor: SortDescriptor) {
  const key = sortDescriptor.column;
  assert(key != null, '`sortDescriptor.column` is required');

  return (a: DataRecord, b: DataRecord) => {
    const valueA = a[key];
    const valueB = b[key];
    const modifier = sortDescriptor.direction === 'ascending' ? 1 : -1;

    // always push `null` and `undefined` to the bottom
    if (valueA == null) return 1;
    if (valueB == null) return -1;

    // the collator is only appropriate for strings, it fails in subtle
    // ways for floats, dates, etc.
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return collator.compare(valueA, valueB) * modifier;
    }

    return compare(valueA, valueB) * modifier;
  };
}

/** Default comparison for non-string values */
function compare(a: any, b: any) {
  if (a < b) return -1;
  if (a > b) return 1;

  return 0;
}
