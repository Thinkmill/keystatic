// File: packages/keystatic/src/config/__tests__/collection-path-resolver.test.ts
import { describe, it, expect } from 'vitest';
import { resolveCollectionEntryPath, validateCollectionPathPattern } from '../collection-path-resolver';

describe('resolveCollectionEntryPath (Thinkmill/keystatic#340)', () => {
  it('supports dynamic function paths using locale field', () => {
    const resolved = resolveCollectionEntryPath({
      path: ({ locale }) => `src/content/blog/${locale}/*`,
      slug: 'hello-world',
      entryValues: { locale: 'vi-VN' },
    });
    expect(resolved).toBe('src/content/blog/vi-VN/hello-world');
  });

  it('supports publishDate prefix interpolation with dot separator', () => {
    const resolved = resolveCollectionEntryPath({
      path: ({ publishDate }) => `src/content/blog/${publishDate}.*`,
      slug: 'release-notes',
      entryValues: { publishDate: '2026-10-30' },
    });
    expect(resolved).toBe('src/content/blog/2026-10-30.release-notes');
  });

  it('throws when wildcard * is missing from path pattern', () => {
    expect(() => validateCollectionPathPattern('src/content/blog/static')).toThrow(/must include a "\*"/);
  });
});
