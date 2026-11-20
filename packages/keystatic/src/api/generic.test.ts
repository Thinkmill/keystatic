/** @vitest-environment node */
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { config } from '../config';
import { makeGenericAPIRouteHandler } from './generic';
import { KeystaticRequest } from './internal-utils';

const origin = 'http://localhost:3000';

const handler = makeGenericAPIRouteHandler({
  clientId: 'client-id',
  clientSecret: 'client-secret',
  secret: 'a'.repeat(32),
  config: config({ storage: { kind: 'github', repo: 'owner/repo' } }),
});

function makeRequest(path: string, cookieHeader?: string): KeystaticRequest {
  return {
    url: `${origin}${path}`,
    method: 'GET',
    headers: {
      get: name =>
        name.toLowerCase() === 'cookie' ? cookieHeader ?? null : null,
    },
    json: async () => ({}),
  };
}

function getHeaders(res: { headers?: unknown }) {
  return (res.headers ?? []) as [string, string][];
}

function getSetCookies(res: { headers?: unknown }) {
  return getHeaders(res)
    .filter(([key]) => key === 'Set-Cookie')
    .map(([, value]) => value);
}

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockResolvedValue({
    ok: true,
    json: async () => ({
      access_token: 'access-token',
      expires_in: 28800,
      refresh_token: 'refresh-token',
      refresh_token_expires_in: 15897600,
      scope: '',
      token_type: 'bearer',
    }),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test('callback without state is rejected without calling GitHub', async () => {
  const res = await handler(
    makeRequest('/api/keystatic/github/oauth/callback?code=abc')
  );
  expect(res.status).toBe(400);
  expect(getSetCookies(res)).toEqual([]);
  expect(fetchMock).not.toHaveBeenCalled();
});

test('callback with state but no state cookie is rejected', async () => {
  const res = await handler(
    makeRequest('/api/keystatic/github/oauth/callback?code=abc&state=1234')
  );
  expect(res.status).toBe(400);
  expect(fetchMock).not.toHaveBeenCalled();
});

test('callback with a state cookie for a different state is rejected', async () => {
  const res = await handler(
    makeRequest(
      '/api/keystatic/github/oauth/callback?code=abc&state=1234',
      'ks-5678=%2F'
    )
  );
  expect(res.status).toBe(400);
  expect(fetchMock).not.toHaveBeenCalled();
});

test('callback with a matching state cookie signs in and clears the state cookie', async () => {
  const res = await handler(
    makeRequest(
      '/api/keystatic/github/oauth/callback?code=abc&state=1234',
      'ks-1234=branch%2Fmain'
    )
  );
  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(res.status).toBe(307);
  expect(getHeaders(res)).toContainEqual([
    'Location',
    '/keystatic/branch/main',
  ]);
  const setCookies = getSetCookies(res);
  expect(setCookies.some(x => x.startsWith('keystatic-gh-access-token='))).toBe(
    true
  );
  expect(
    setCookies.some(x => x.startsWith('keystatic-gh-refresh-token='))
  ).toBe(true);
  const stateCookie = setCookies.find(x => x.startsWith('ks-1234='));
  expect(stateCookie).toMatch(/^ks-1234=;/);
  expect(stateCookie).toContain('Max-Age=0');
  expect(stateCookie).toContain('Path=/api/keystatic/github/oauth/callback');
});

test('callback for the GitHub App install popup does not exchange the code', async () => {
  const res = await handler(
    makeRequest('/api/keystatic/github/oauth/callback?code=abc&state=close')
  );
  expect(res.status).toBe(200);
  expect(getSetCookies(res)).toEqual([]);
  expect(fetchMock).not.toHaveBeenCalled();
});

test('login without from still sets a state cookie', async () => {
  const res = await handler(makeRequest('/api/keystatic/github/login'));
  expect(res.status).toBe(307);
  const location = getHeaders(res).find(([key]) => key === 'Location')?.[1];
  const state = new URL(location!).searchParams.get('state');
  expect(state).toMatch(/^[0-9a-f]{20}$/);
  const setCookies = getSetCookies(res);
  expect(setCookies).toHaveLength(1);
  expect(setCookies[0]).toMatch(new RegExp(`^ks-${state}=`));
  expect(setCookies[0]).toContain('HttpOnly');
  expect(setCookies[0]).toContain('SameSite=Lax');
  expect(setCookies[0]).toContain('Max-Age=600');
  expect(setCookies[0]).toContain('Path=/api/keystatic/github/oauth/callback');
});
