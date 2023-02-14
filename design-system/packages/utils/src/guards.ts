type ReactText = string | number;
type MaybeArray<T> = T | T[];

export function isReactText(value: unknown): value is MaybeArray<ReactText> {
  if (Array.isArray(value)) {
    return value.every(isReactText);
  }

  return typeof value === 'string' || typeof value === 'number';
}
