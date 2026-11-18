// File: packages/keystatic/src/config/collection-path-resolver.ts
// Target Issue: https://github.com/Thinkmill/keystatic/issues/340
// Author: Xuan Thinh (@thinhnx128) <thinhnx128@gmail.com>

export type CollectionPathConfig<TFields extends Record<string, any> = Record<string, any>> =
  | string
  | ((fields: TFields) => string);

export interface ResolveCollectionPathOptions<TFields extends Record<string, any>> {
  path?: CollectionPathConfig<TFields>;
  slug: string;
  entryValues: TFields;
}

/**
 * Validates that a static or resolved collection path contains the wildcard '*' or '.*' token
 * and normalizes leading/trailing slashes.
 */
export function validateCollectionPathPattern(pattern: string): string {
  const trimmed = pattern.trim().replace(/^\/+|\/+$/g, '');
  if (!trimmed.includes('*')) {
    throw new Error(
      `[Keystatic Collection Path] Invalid path pattern "${pattern}". Path must include a "*" wildcard for the entry slug.`
    );
  }
  return trimmed;
}

/**
 * Resolves a collection entry file path supporting both static string patterns ("src/content/blog/*")
 * and dynamic field callback functions (({ locale, publishDate }) => `src/content/blog/${locale}/${publishDate}-*`)
 * as proposed in Thinkmill/keystatic#340.
 */
export function resolveCollectionEntryPath<TFields extends Record<string, any>>(
  options: ResolveCollectionPathOptions<TFields>
): string {
  const { path = '*', slug, entryValues } = options;
  if (!slug || typeof slug !== 'string') {
    throw new Error('[Keystatic Collection Path] Entry slug must be a non-empty string.');
  }

  const rawPattern = typeof path === 'function' ? path(entryValues) : path;
  const validatedPattern = validateCollectionPathPattern(rawPattern);

  // Also support {fieldName} template placeholders in static strings
  const interpolated = validatedPattern.replace(/\{([a-zA-Z0-9_]+)\}/g, (_, key: string) => {
    const val = entryValues?.[key];
    if (val === undefined || val === null || val === '') {
      throw new Error(`[Keystatic Collection Path] Missing field value for placeholder "{${key}}" in path "${validatedPattern}".`);
    }
    return String(val).replace(/\/+$/g, '');
  });

  return interpolated.replace('*', slug);
}
