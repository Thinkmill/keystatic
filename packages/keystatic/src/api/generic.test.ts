/** @jest-environment node */
import { expect, test, describe, jest, beforeEach, afterEach } from '@jest/globals';
import { makeGenericAPIRouteHandler } from './generic';
import { Config } from '../config';
import { KeystaticRequest, KeystaticResponse } from './internal-utils';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Creates a minimal KeystaticRequest for testing route matching. */
function makeRequest(
  url: string,
  options?: { method?: string; headers?: Record<string, string> }
): KeystaticRequest {
  const headers = new Map(Object.entries(options?.headers ?? {}));
  return {
    url,
    method: options?.method ?? 'GET',
    headers: { get: (name: string) => headers.get(name.toLowerCase()) ?? null },
    json: async () => ({}),
  };
}

function makeGitHubConfig(basePath?: string): Config {
  return {
    storage: { kind: 'github', repo: 'owner/repo' },
    basePath,
  } as Config;
}

function makeLocalConfig(basePath?: string): Config {
  return {
    storage: { kind: 'local' },
    basePath,
  } as Config;
}

function makeCloudConfig(basePath?: string): Config {
  return {
    storage: { kind: 'cloud' },
    cloud: { project: 'team/project' },
    basePath,
  } as Config;
}

/** Extract Location header from a redirect response. */
function getLocation(res: KeystaticResponse): string | undefined {
  if (!Array.isArray(res.headers)) return undefined;
  const entry = (res.headers as [string, string][]).find(
    ([key]) => key === 'Location'
  );
  return entry?.[1];
}

// ---------------------------------------------------------------------------
// GitHub storage: route matching with basePath
// ---------------------------------------------------------------------------

describe('makeGenericAPIRouteHandler — GitHub storage route matching', () => {
  const secret = 'a'.repeat(40);

  function makeHandler(basePath?: string) {
    return makeGenericAPIRouteHandler({
      clientId: 'test-client-id',
      clientSecret: 'test-client-secret',
      secret,
      config: makeGitHubConfig(basePath),
    });
  }

  describe('without basePath (default paths)', () => {
    test('login route redirects to GitHub OAuth', async () => {
      const handler = makeHandler();
      const res = await handler(
        makeRequest('https://example.com/api/keystatic/github/login')
      );
      expect(res.status).toBe(307);
      const location = getLocation(res);
      expect(location).toContain('github.com/login/oauth/authorize');
    });

    test('login redirect_uri uses default /api/keystatic prefix', async () => {
      const handler = makeHandler();
      const res = await handler(
        makeRequest('https://example.com/api/keystatic/github/login')
      );
      const location = getLocation(res);
      expect(location).toContain(
        encodeURIComponent(
          'https://example.com/api/keystatic/github/oauth/callback'
        )
      );
    });

    test('unmatched route returns 404', async () => {
      const handler = makeHandler();
      const res = await handler(
        makeRequest('https://example.com/api/keystatic/nonexistent')
      );
      expect(res.status).toBe(404);
    });
  });

  describe('with basePath="/blog"', () => {
    test('login route matches under /blog/api/keystatic/', async () => {
      const handler = makeHandler('/blog');
      const res = await handler(
        makeRequest('https://example.com/blog/api/keystatic/github/login')
      );
      expect(res.status).toBe(307);
      const location = getLocation(res);
      expect(location).toContain('github.com/login/oauth/authorize');
    });

    test('login redirect_uri includes basePath', async () => {
      const handler = makeHandler('/blog');
      const res = await handler(
        makeRequest('https://example.com/blog/api/keystatic/github/login')
      );
      const location = getLocation(res);
      expect(location).toContain(
        encodeURIComponent(
          'https://example.com/blog/api/keystatic/github/oauth/callback'
        )
      );
    });

    test('unmatched route returns 404', async () => {
      const handler = makeHandler('/blog');
      const res = await handler(
        makeRequest('https://example.com/blog/api/keystatic/nonexistent')
      );
      expect(res.status).toBe(404);
    });
  });

  describe('with deeply nested basePath', () => {
    test('routes match under nested prefix', async () => {
      const handler = makeHandler('/app/sub');
      const res = await handler(
        makeRequest(
          'https://example.com/app/sub/api/keystatic/github/login'
        )
      );
      expect(res.status).toBe(307);
      const location = getLocation(res);
      expect(location).toContain('github.com/login/oauth/authorize');
    });

    test('redirect_uri includes nested basePath', async () => {
      const handler = makeHandler('/app/sub');
      const res = await handler(
        makeRequest(
          'https://example.com/app/sub/api/keystatic/github/login'
        )
      );
      const location = getLocation(res);
      expect(location).toContain(
        encodeURIComponent(
          'https://example.com/app/sub/api/keystatic/github/oauth/callback'
        )
      );
    });
  });
});

// ---------------------------------------------------------------------------
// GitHub storage: redirect paths use basePath
// ---------------------------------------------------------------------------

describe('makeGenericAPIRouteHandler — redirect paths', () => {
  const secret = 'a'.repeat(40);

  describe('logout redirects to UI basePath', () => {
    test('without basePath, redirects to /keystatic', async () => {
      const handler = makeGenericAPIRouteHandler({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        secret,
        config: makeGitHubConfig(),
      });
      // Mock fetch so the DELETE to GitHub doesn't actually fire
      const originalFetch = globalThis.fetch;
      globalThis.fetch = jest.fn(() =>
        Promise.resolve(new Response(null, { status: 204 }))
      ) as any;
      try {
        const res = await handler(
          makeRequest('https://example.com/api/keystatic/github/logout', {
            headers: {
              cookie: 'keystatic-gh-access-token=fake-token',
            },
          })
        );
        expect(res.status).toBe(307);
        expect(getLocation(res)).toBe('/keystatic');
      } finally {
        globalThis.fetch = originalFetch;
      }
    });

    test('with basePath="/blog", redirects to /blog/keystatic', async () => {
      const handler = makeGenericAPIRouteHandler({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        secret,
        config: makeGitHubConfig('/blog'),
      });
      const originalFetch = globalThis.fetch;
      globalThis.fetch = jest.fn(() =>
        Promise.resolve(new Response(null, { status: 204 }))
      ) as any;
      try {
        const res = await handler(
          makeRequest(
            'https://example.com/blog/api/keystatic/github/logout',
            {
              headers: {
                cookie: 'keystatic-gh-access-token=fake-token',
              },
            }
          )
        );
        expect(res.status).toBe(307);
        expect(getLocation(res)).toBe('/blog/keystatic');
      } finally {
        globalThis.fetch = originalFetch;
      }
    });
  });
});

// ---------------------------------------------------------------------------
// GitHub storage (dev mode, missing credentials): redirect paths
// ---------------------------------------------------------------------------

describe('makeGenericAPIRouteHandler — dev mode (missing credentials)', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    process.env.NODE_ENV = 'development';
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  test('login redirects to /keystatic/setup without basePath', async () => {
    const handler = makeGenericAPIRouteHandler({
      config: makeGitHubConfig(),
    });
    const res = await handler(
      makeRequest('https://example.com/api/keystatic/github/login')
    );
    expect(res.status).toBe(307);
    expect(getLocation(res)).toBe('/keystatic/setup');
  });

  test('login redirects to /blog/keystatic/setup with basePath="/blog"', async () => {
    const handler = makeGenericAPIRouteHandler({
      config: makeGitHubConfig('/blog'),
    });
    const res = await handler(
      makeRequest('https://example.com/blog/api/keystatic/github/login')
    );
    expect(res.status).toBe(307);
    expect(getLocation(res)).toBe('/blog/keystatic/setup');
  });

  test('repo-not-found redirects to setup with basePath', async () => {
    const handler = makeGenericAPIRouteHandler({
      config: makeGitHubConfig('/blog'),
    });
    const res = await handler(
      makeRequest(
        'https://example.com/blog/api/keystatic/github/repo-not-found'
      )
    );
    expect(res.status).toBe(307);
    expect(getLocation(res)).toBe('/blog/keystatic/setup');
  });

  test('logout redirects to setup with basePath', async () => {
    const handler = makeGenericAPIRouteHandler({
      config: makeGitHubConfig('/blog'),
    });
    const res = await handler(
      makeRequest('https://example.com/blog/api/keystatic/github/logout')
    );
    expect(res.status).toBe(307);
    expect(getLocation(res)).toBe('/blog/keystatic/setup');
  });
});

// ---------------------------------------------------------------------------
// Cloud storage: always 404
// ---------------------------------------------------------------------------

describe('makeGenericAPIRouteHandler — cloud storage', () => {
  test('returns 404 regardless of basePath', async () => {
    const handler = makeGenericAPIRouteHandler({
      config: makeCloudConfig('/blog'),
    });
    const res = await handler(
      makeRequest('https://example.com/blog/api/keystatic/anything')
    );
    expect(res.status).toBe(404);
  });

  test('returns 404 without basePath', async () => {
    const handler = makeGenericAPIRouteHandler({
      config: makeCloudConfig(),
    });
    const res = await handler(
      makeRequest('https://example.com/api/keystatic/anything')
    );
    expect(res.status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// basePath normalization consistency between API and route matching
// ---------------------------------------------------------------------------

describe('basePath normalization in route handler', () => {
  const secret = 'a'.repeat(40);

  const variants = [
    { input: '/blog', label: 'with leading slash' },
    { input: 'blog', label: 'without leading slash' },
    { input: '/blog/', label: 'with trailing slash' },
    { input: 'blog/', label: 'with both issues' },
  ];

  for (const { input, label } of variants) {
    test(`basePath "${input}" (${label}) correctly matches routes`, async () => {
      const handler = makeGenericAPIRouteHandler({
        clientId: 'test-client-id',
        clientSecret: 'test-client-secret',
        secret,
        config: makeGitHubConfig(input),
      });
      // All variants should normalize to /blog, so the URL uses /blog/api/keystatic/
      const res = await handler(
        makeRequest('https://example.com/blog/api/keystatic/github/login')
      );
      expect(res.status).toBe(307);
      const location = getLocation(res);
      expect(location).toContain('github.com/login/oauth/authorize');
    });
  }
});
