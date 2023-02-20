/**
 * Prefix an object's keys with "data-" for use as data attributes.
 */
export function toDataAttributes<T>(data: T, pick?: Set<keyof T>) {
  let dataAttributes: Record<string, T[keyof T]> = {};

  for (let key in data) {
    if (!pick || pick.has(key)) {
      dataAttributes[
        `data-${key.replace(/[A-Z]/g, char => `-${char.toLowerCase()}`)}`
      ] = data[key];
    }
  }

  return dataAttributes;
}
