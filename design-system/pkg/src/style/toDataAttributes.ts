/** Converts an object to a set of data attributes. */
export function toDataAttributes<
  T extends {
    [key: string]: string | number | boolean | null | undefined;
  },
>(
  data: T,
  options: {
    /** Omit props with values of `false` or `""`. */
    omitFalsyValues?: boolean;
    /** Removes the `is*` prefix from keys.  */
    trimBooleanKeys?: boolean;
  } = {}
) {
  type Value = T[keyof T] | undefined;
  let dataAttributes: Record<string, Value> = {};

  for (let key in data) {
    let prop: string = key;
    let value: Value = data[key];

    // always bail if the value is nullish; it'll never make it to the DOM node
    // so there's no point doing any more work.
    // a value of `0` isn't really falsy in this case so it's not included in
    // the optional check.
    if (
      value == null ||
      (options.omitFalsyValues && (value === false || value === ''))
    ) {
      continue;
    }

    // lowercase the first letter of the remaining key so it isn't affected by
    // the kebab-case conversion later
    if (options.trimBooleanKeys && key.startsWith('is')) {
      prop = prop.charAt(2).toLowerCase() + prop.slice(3);
    }

    prop = prop.replace(/[A-Z]/g, char => `-${char.toLowerCase()}`);

    dataAttributes[`data-${prop}`] = value;
  }

  return dataAttributes;
}
