/** @jest-environment node */
import { expect, test, describe } from '@jest/globals';
import {
  getConfigBasePath,
  getKeystaticBasePath,
  getKeystaticApiBasePath,
} from './utils';
import { Config } from '../config';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Minimal Config object for testing basePath utilities. */
function makeConfig(basePath?: string): Config {
  return {
    storage: { kind: 'local' },
    basePath,
  } as Config;
}

// ---------------------------------------------------------------------------
// getConfigBasePath
// ---------------------------------------------------------------------------

describe('getConfigBasePath', () => {
  test('returns empty string when basePath is undefined', () => {
    expect(getConfigBasePath(makeConfig())).toBe('');
  });

  test('returns empty string when basePath is empty string', () => {
    expect(getConfigBasePath(makeConfig(''))).toBe('');
  });

  test('preserves leading slash', () => {
    expect(getConfigBasePath(makeConfig('/blog'))).toBe('/blog');
  });

  test('adds leading slash when missing', () => {
    expect(getConfigBasePath(makeConfig('blog'))).toBe('/blog');
  });

  test('strips trailing slash', () => {
    expect(getConfigBasePath(makeConfig('/blog/'))).toBe('/blog');
  });

  test('handles both missing leading and extra trailing slash', () => {
    expect(getConfigBasePath(makeConfig('blog/'))).toBe('/blog');
  });

  test('handles deeply nested paths', () => {
    expect(getConfigBasePath(makeConfig('/app/sub/path'))).toBe(
      '/app/sub/path'
    );
  });

  test('handles deeply nested paths without leading slash', () => {
    expect(getConfigBasePath(makeConfig('app/sub/path/'))).toBe(
      '/app/sub/path'
    );
  });

  test('handles single slash', () => {
    // A basePath of '/' means "root" — same as no prefix
    expect(getConfigBasePath(makeConfig('/'))).toBe('');
  });
});

// ---------------------------------------------------------------------------
// getKeystaticBasePath
// ---------------------------------------------------------------------------

describe('getKeystaticBasePath', () => {
  test('defaults to /keystatic with no basePath', () => {
    expect(getKeystaticBasePath(makeConfig())).toBe('/keystatic');
  });

  test('prefixes with basePath', () => {
    expect(getKeystaticBasePath(makeConfig('/blog'))).toBe('/blog/keystatic');
  });

  test('normalizes basePath before prefixing', () => {
    expect(getKeystaticBasePath(makeConfig('blog/'))).toBe('/blog/keystatic');
  });

  test('works with nested basePath', () => {
    expect(getKeystaticBasePath(makeConfig('/app/docs'))).toBe(
      '/app/docs/keystatic'
    );
  });
});

// ---------------------------------------------------------------------------
// getKeystaticApiBasePath
// ---------------------------------------------------------------------------

describe('getKeystaticApiBasePath', () => {
  test('defaults to /api/keystatic with no basePath', () => {
    expect(getKeystaticApiBasePath(makeConfig())).toBe('/api/keystatic');
  });

  test('prefixes with basePath', () => {
    expect(getKeystaticApiBasePath(makeConfig('/blog'))).toBe(
      '/blog/api/keystatic'
    );
  });

  test('normalizes basePath before prefixing', () => {
    expect(getKeystaticApiBasePath(makeConfig('blog/'))).toBe(
      '/blog/api/keystatic'
    );
  });

  test('works with nested basePath', () => {
    expect(getKeystaticApiBasePath(makeConfig('/app/docs'))).toBe(
      '/app/docs/api/keystatic'
    );
  });
});

// ---------------------------------------------------------------------------
// Backwards compatibility: no basePath produces original hardcoded paths
// ---------------------------------------------------------------------------

describe('backwards compatibility', () => {
  const storageKinds: Array<Config['storage']> = [
    { kind: 'local' },
    { kind: 'github', repo: 'owner/repo' },
    { kind: 'cloud' },
  ];

  for (const storage of storageKinds) {
    const label = storage.kind;

    test(`${label}: no basePath → /keystatic`, () => {
      const config = { storage } as Config;
      expect(getKeystaticBasePath(config)).toBe('/keystatic');
    });

    test(`${label}: no basePath → /api/keystatic`, () => {
      const config = { storage } as Config;
      expect(getKeystaticApiBasePath(config)).toBe('/api/keystatic');
    });

    test(`${label}: basePath='/blog' → /blog/keystatic`, () => {
      const config = { storage, basePath: '/blog' } as Config;
      expect(getKeystaticBasePath(config)).toBe('/blog/keystatic');
    });

    test(`${label}: basePath='/blog' → /blog/api/keystatic`, () => {
      const config = { storage, basePath: '/blog' } as Config;
      expect(getKeystaticApiBasePath(config)).toBe('/blog/api/keystatic');
    });
  }
});

// ---------------------------------------------------------------------------
// Edge cases: special characters in basePath
// ---------------------------------------------------------------------------

describe('special characters in basePath', () => {
  test('path with hyphen', () => {
    expect(getKeystaticBasePath(makeConfig('/my-blog'))).toBe(
      '/my-blog/keystatic'
    );
  });

  test('path with underscore', () => {
    expect(getKeystaticBasePath(makeConfig('/my_blog'))).toBe(
      '/my_blog/keystatic'
    );
  });

  test('path with dots', () => {
    expect(getKeystaticBasePath(makeConfig('/v1.0'))).toBe('/v1.0/keystatic');
  });
});
