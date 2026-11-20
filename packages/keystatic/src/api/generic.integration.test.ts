/** @vitest-environment node */
import http from 'node:http';
import { AddressInfo } from 'node:net';
import { afterAll, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import { config } from '../config';
import { makeGenericAPIRouteHandler } from './generic';

// runs the real login and callback handlers behind a node http server and
// points the GitHub token request at a local stub server

const realFetch = globalThis.fetch;

let tokenRequests: URL[] = [];
let githubOrigin: string;
let appOrigin: string;
const servers: http.Server[] = [];

function listen(server: http.Server) {
  servers.push(server);
  return new Promise<string>(resolve => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address() as AddressInfo;
      resolve(`http://127.0.0.1:${port}`);
    });
  });
}

beforeAll(async () => {
  githubOrigin = await listen(
    http.createServer((req, res) => {
      const url = new URL(req.url!, 'http://localhost');
      if (
        req.method === 'POST' &&
        url.pathname === '/login/oauth/access_token'
      ) {
        tokenRequests.push(url);
        res.setHeader('content-type', 'application/json');
        res.end(
          JSON.stringify({
            access_token: `access-${url.searchParams.get('code')}`,
            expires_in: 28800,
            refresh_token: 'refresh-token',
            refresh_token_expires_in: 15897600,
            scope: '',
            token_type: 'bearer',
          })
        );
        return;
      }
      res.statusCode = 404;
      res.end();
    })
  );

  const handler = makeGenericAPIRouteHandler({
    clientId: 'client-id',
    clientSecret: 'client-secret',
    secret: 'a'.repeat(32),
    config: config({ storage: { kind: 'github', repo: 'owner/repo' } }),
  });
  appOrigin = await listen(
    http.createServer(async (req, res) => {
      const result = await handler({
        url: new URL(req.url!, appOrigin).toString(),
        method: req.method!,
        headers: {
          get: name => {
            const val = req.headers[name.toLowerCase()];
            return (Array.isArray(val) ? val[0] : val) ?? null;
          },
        },
        json: async () => ({}),
      });
      const grouped = new Map<string, string[]>();
      for (const [key, value] of (result.headers ?? []) as [string, string][]) {
        grouped.set(key, [...(grouped.get(key) ?? []), value]);
      }
      for (const [key, value] of grouped) res.setHeader(key, value);
      res.statusCode = result.status ?? 200;
      res.end(result.body);
    })
  );

  vi.stubGlobal(
    'fetch',
    (input: string | URL | Request, init?: RequestInit) => {
      const url = new URL(input instanceof Request ? input.url : input);
      if (url.origin === 'https://github.com') {
        return realFetch(`${githubOrigin}${url.pathname}${url.search}`, init);
      }
      return realFetch(input, init);
    }
  );
});

afterAll(async () => {
  vi.unstubAllGlobals();
  await Promise.all(
    servers.map(server => new Promise(resolve => server.close(resolve)))
  );
});

beforeEach(() => {
  tokenRequests = [];
});

// a tiny cookie jar for one browser
function makeBrowser() {
  const jar = new Map<string, string>();
  return {
    jar,
    async get(path: string) {
      const res = await realFetch(`${appOrigin}${path}`, {
        redirect: 'manual',
        headers: {
          cookie: [...jar].map(([key, value]) => `${key}=${value}`).join('; '),
        },
      });
      const setCookies = res.headers.getSetCookie();
      for (const setCookie of setCookies) {
        const [pair] = setCookie.split(';');
        const index = pair.indexOf('=');
        const key = pair.slice(0, index);
        const value = pair.slice(index + 1);
        if (/max-age=0/i.test(setCookie)) jar.delete(key);
        else jar.set(key, value);
      }
      return { res, setCookies, location: res.headers.get('location') };
    },
  };
}

async function startLogin(browser: ReturnType<typeof makeBrowser>, query = '') {
  const { res, location } = await browser.get(
    `/api/keystatic/github/login${query}`
  );
  expect(res.status).toBe(307);
  const authorizeUrl = new URL(location!);
  expect(authorizeUrl.origin).toBe('https://github.com');
  const state = authorizeUrl.searchParams.get('state');
  expect(state).toBeTruthy();
  return state!;
}

test('normal login signs in and clears the state cookie', async () => {
  const browser = makeBrowser();
  const state = await startLogin(browser);
  expect(browser.jar.has(`ks-${state}`)).toBe(true);

  const { res, location } = await browser.get(
    `/api/keystatic/github/oauth/callback?code=good&state=${state}`
  );
  expect(res.status).toBe(307);
  expect(location).toBe('/keystatic');
  expect(tokenRequests.map(x => x.searchParams.get('code'))).toEqual(['good']);
  expect(browser.jar.get('keystatic-gh-access-token')).toBe('access-good');
  expect(browser.jar.has(`ks-${state}`)).toBe(false);
});

test('login with from redirects back to the deep link', async () => {
  const browser = makeBrowser();
  const from = 'branch/main/collection/posts';
  const state = await startLogin(browser, `?from=${encodeURIComponent(from)}`);

  const { res, location } = await browser.get(
    `/api/keystatic/github/oauth/callback?code=good&state=${state}`
  );
  expect(res.status).toBe(307);
  expect(location).toBe(`/keystatic/${from}`);
  expect(tokenRequests).toHaveLength(1);
});

test('a forged callback with the attacker state is rejected without a token request', async () => {
  // the attacker starts a login in their own browser and gets their own code
  const attacker = makeBrowser();
  const attackerState = await startLogin(attacker);

  // the victim is sent to the callback with the attacker's code and state
  const victim = makeBrowser();
  for (const query of [
    `code=attacker&state=${attackerState}`,
    'code=attacker',
  ]) {
    const { res, setCookies } = await victim.get(
      `/api/keystatic/github/oauth/callback?${query}`
    );
    expect(res.status).toBe(400);
    expect(setCookies).toEqual([]);
  }
  // also when the victim has a login of their own in progress
  await startLogin(victim);
  const { res } = await victim.get(
    `/api/keystatic/github/oauth/callback?code=attacker&state=${attackerState}`
  );
  expect(res.status).toBe(400);

  expect(tokenRequests).toEqual([]);
  expect(victim.jar.has('keystatic-gh-access-token')).toBe(false);
});

test('the GitHub App install popup closes without a token request or cookies', async () => {
  const browser = makeBrowser();
  const { res, setCookies } = await browser.get(
    '/api/keystatic/github/oauth/callback?code=install&state=close'
  );
  expect(res.status).toBe(200);
  expect(res.headers.get('content-type')).toBe('text/html');
  const body = await res.text();
  expect(body).toContain("localStorage.setItem('ks-refetch-installations'");
  expect(body).toContain('window.close()');
  expect(setCookies).toEqual([]);
  expect(tokenRequests).toEqual([]);
});
