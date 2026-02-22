import * as cookie from 'cookie';
import * as s from 'superstruct';
import { Config } from '..';
import { base64Decode, base64Encode } from '../base64';
import { createLfsPointer } from '../app/git-lfs';
import {
  KeystaticResponse,
  KeystaticRequest,
  redirect,
} from './internal-utils';
import { handleGitHubAppCreation, localModeApiHandler } from '#api-handler';
import { webcrypto } from '#webcrypto';
import { bytesToHex } from '../hex';
import { decryptValue, encryptValue } from './encryption';
import { parseRepoConfig } from '../app/repo-config';

export type APIRouteConfig = {
  /** @default process.env.KEYSTATIC_GITHUB_CLIENT_ID */
  clientId?: string;
  /** @default process.env.KEYSTATIC_GITHUB_CLIENT_SECRET */
  clientSecret?: string;
  /** @default process.env.KEYSTATIC_SECRET */
  secret?: string;
  localBaseDirectory?: string;
  config: Config<any, any>;
};

type InnerAPIRouteConfig = {
  clientId: string;
  clientSecret: string;
  secret: string;
  config: Config;
};

const keystaticRouteRegex =
  /^branch\/[^]+(\/collection\/[^/]+(|\/(create|item\/[^/]+))|\/singleton\/[^/]+)?$/;

const keyToEnvVar = {
  clientId: 'KEYSTATIC_GITHUB_CLIENT_ID',
  clientSecret: 'KEYSTATIC_GITHUB_CLIENT_SECRET',
  secret: 'KEYSTATIC_SECRET',
};

function tryOrUndefined<T>(fn: () => T) {
  try {
    return fn();
  } catch {
    return undefined;
  }
}

export function makeGenericAPIRouteHandler(
  _config: APIRouteConfig,
  options?: { slugEnvName?: string }
) {
  const _config2: APIRouteConfig = {
    clientId:
      _config.clientId ??
      tryOrUndefined(() => process.env.KEYSTATIC_GITHUB_CLIENT_ID),
    clientSecret:
      _config.clientSecret ??
      tryOrUndefined(() => process.env.KEYSTATIC_GITHUB_CLIENT_SECRET),
    secret:
      _config.secret ?? tryOrUndefined(() => process.env.KEYSTATIC_SECRET),
    config: _config.config,
  };

  const getParams = (req: KeystaticRequest) => {
    let url;
    try {
      url = new URL(req.url);
    } catch (err) {
      throw new Error(
        `Found incomplete URL in Keystatic API route URL handler${
          options?.slugEnvName === 'NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG'
            ? ". Make sure you're using the latest version of @keystatic/next"
            : ''
        }`
      );
    }
    return url.pathname
      .replace(/^\/api\/keystatic\/?/, '')
      .split('/')
      .map(x => decodeURIComponent(x))
      .filter(Boolean);
  };

  if (_config2.config.storage.kind === 'local') {
    const handler = localModeApiHandler(
      _config2.config,
      _config.localBaseDirectory
    );
    return (req: KeystaticRequest) => {
      const params = getParams(req);
      return handler(req, params);
    };
  }
  if (_config2.config.storage.kind === 'cloud') {
    return async function keystaticAPIRoute(): Promise<KeystaticResponse> {
      return { status: 404, body: 'Not Found' };
    };
  }

  if (!_config2.clientId || !_config2.clientSecret || !_config2.secret) {
    if (process.env.NODE_ENV !== 'development') {
      const missingKeys = (
        ['clientId', 'clientSecret', 'secret'] as const
      ).filter(x => !_config2[x]);
      throw new Error(
        `Missing required config in Keystatic API setup when using the 'github' storage mode:\n${missingKeys
          .map(
            key => `- ${key} (can be provided via ${keyToEnvVar[key]} env var)`
          )
          .join(
            '\n'
          )}\n\nIf you've created your GitHub app locally, make sure to copy the environment variables from your local env file to your deployed environment`
      );
    }
    return async function keystaticAPIRoute(
      req: KeystaticRequest
    ): Promise<KeystaticResponse> {
      const params = getParams(req);
      const joined = params.join('/');
      if (joined === 'github/created-app') {
        return createdGithubApp(req, options?.slugEnvName);
      }
      if (
        joined === 'github/login' ||
        joined === 'github/repo-not-found' ||
        joined === 'github/logout'
      ) {
        return redirect('/keystatic/setup');
      }
      return { status: 404, body: 'Not Found' };
    };
  }
  const config: InnerAPIRouteConfig = {
    clientId: _config2.clientId,
    clientSecret: _config2.clientSecret,
    secret: _config2.secret,
    config: _config2.config,
  };

  return async function keystaticAPIRoute(
    req: KeystaticRequest
  ): Promise<KeystaticResponse> {
    const params = getParams(req);
    const joined = params.join('/');
    if (joined === 'github/oauth/callback') {
      return githubOauthCallback(req, config);
    }
    if (joined === 'github/login') {
      return githubLogin(req, config);
    }
    if (joined === 'github/refresh-token') {
      return githubRefreshToken(req, config);
    }
    if (joined === 'github/repo-not-found') {
      return githubRepoNotFound(req, config);
    }
    if (joined === 'github/lfs/upload') {
      return githubLfsUpload(req, config.config);
    }
    if (joined === 'github/lfs/download') {
      return githubLfsDownload(req, config.config);
    }
    if (joined === 'github/logout') {
      const access_token = getAccessToken(req);
      if (access_token) {
        await fetch(
          `https://api.github.com/applications/${config.clientId}/token`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Basic ${btoa(
                config.clientId + ':' + config.clientSecret
              )}`,
            },
            body: JSON.stringify({ access_token }),
          }
        );
      }
      return redirect('/keystatic', [
        ['Set-Cookie', immediatelyExpiringCookie('keystatic-gh-access-token')],
        ['Set-Cookie', immediatelyExpiringCookie('keystatic-gh-refresh-token')],
      ]);
    }
    if (joined === 'github/created-app') {
      return {
        status: 404,
        body: 'It looks like you just tried to create a GitHub App for Keystatic but there is already a GitHub App configured for Keystatic.\n\nYou may be here because you started creating a GitHub App but then started the process again elsewhere and completed it there. You should likely go back to Keystatic and sign in with GitHub to continue.',
      };
    }
    return { status: 404, body: 'Not Found' };
  };
}

const tokenDataResultType = s.type({
  access_token: s.string(),
  expires_in: s.number(),
  refresh_token: s.string(),
  refresh_token_expires_in: s.number(),
  scope: s.string(),
  token_type: s.literal('bearer'),
});

async function githubOauthCallback(
  req: KeystaticRequest,
  config: InnerAPIRouteConfig
): Promise<KeystaticResponse> {
  const searchParams = new URL(req.url, 'http://localhost').searchParams;
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  if (typeof errorDescription === 'string') {
    return {
      status: 400,
      body: `An error occurred when trying to authenticate with GitHub:\n${errorDescription}${
        error === 'redirect_uri_mismatch'
          ? `\n\nIf you were trying to sign in locally and recently upgraded Keystatic from @keystatic/core@0.0.69 or below, you need to add \`http://127.0.0.1/api/keystatic/github/oauth/callback\` as a callback URL in your GitHub app.`
          : ''
      }`,
    };
  }
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  if (typeof code !== 'string') {
    return { status: 400, body: 'Bad Request' };
  }
  const cookies = cookie.parse(req.headers.get('cookie') ?? '');
  const fromCookie = state ? cookies['ks-' + state] : undefined;
  const from =
    typeof fromCookie === 'string' && keystaticRouteRegex.test(fromCookie)
      ? fromCookie
      : undefined;
  const url = new URL('https://github.com/login/oauth/access_token');
  url.searchParams.set('client_id', config.clientId);
  url.searchParams.set('client_secret', config.clientSecret);
  url.searchParams.set('code', code);

  const tokenRes = await fetch(url, {
    method: 'POST',
    headers: { Accept: 'application/json' },
  });
  if (!tokenRes.ok) {
    return { status: 401, body: 'Authorization failed' };
  }
  const _tokenData = await tokenRes.json();
  let tokenData;
  try {
    tokenData = tokenDataResultType.create(_tokenData);
  } catch {
    return { status: 401, body: 'Authorization failed' };
  }

  const headers = await getTokenCookies(tokenData, config);
  if (state === 'close') {
    return {
      headers: [...headers, ['Content-Type', 'text/html']],
      body: "<script>localStorage.setItem('ks-refetch-installations', 'true');window.close();</script>",
      status: 200,
    };
  }
  return redirect(`/keystatic${from ? `/${from}` : ''}`, headers);
}

async function getTokenCookies(
  tokenData: s.Infer<typeof tokenDataResultType>,
  config: InnerAPIRouteConfig
) {
  const headers: [string, string][] = [
    [
      'Set-Cookie',
      cookie.serialize('keystatic-gh-access-token', tokenData.access_token, {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: tokenData.expires_in,
        expires: new Date(Date.now() + tokenData.expires_in * 1000),
        path: '/',
      }),
    ],
    [
      'Set-Cookie',
      cookie.serialize(
        'keystatic-gh-refresh-token',
        await encryptValue(tokenData.refresh_token, config.secret),
        {
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          httpOnly: true,
          maxAge: tokenData.refresh_token_expires_in,
          expires: new Date(
            Date.now() + tokenData.refresh_token_expires_in * 100
          ),
          path: '/',
        }
      ),
    ],
  ];
  return headers;
}

function getAccessToken(req: KeystaticRequest): string | undefined {
  const cookies = cookie.parse(req.headers.get('cookie') ?? '');
  return cookies['keystatic-gh-access-token'] || undefined;
}

async function getRefreshToken(
  req: KeystaticRequest,
  config: InnerAPIRouteConfig
) {
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  const refreshTokenCookie = cookies['keystatic-gh-refresh-token'];
  if (!refreshTokenCookie) return;
  let refreshToken;
  try {
    refreshToken = await decryptValue(refreshTokenCookie, config.secret);
  } catch {
    return;
  }
  return refreshToken;
}

async function githubRefreshToken(
  req: KeystaticRequest,
  config: InnerAPIRouteConfig
): Promise<KeystaticResponse> {
  const headers = await refreshGitHubAuth(req, config);
  if (!headers) {
    return { status: 401, body: 'Authorization failed' };
  }
  return { status: 200, headers, body: '' };
}

async function refreshGitHubAuth(
  req: KeystaticRequest,
  config: InnerAPIRouteConfig
) {
  const refreshToken = await getRefreshToken(req, config);
  if (!refreshToken) {
    return;
  }
  const url = new URL('https://github.com/login/oauth/access_token');
  url.searchParams.set('client_id', config.clientId);
  url.searchParams.set('client_secret', config.clientSecret);
  url.searchParams.set('grant_type', 'refresh_token');
  url.searchParams.set('refresh_token', refreshToken);
  const tokenRes = await fetch(url, {
    method: 'POST',
    headers: { Accept: 'application/json' },
  });

  if (!tokenRes.ok) {
    return;
  }
  const _tokenData = await tokenRes.json();
  let tokenData;
  try {
    tokenData = tokenDataResultType.create(_tokenData);
  } catch {
    return;
  }
  return getTokenCookies(tokenData, config);
}

async function githubRepoNotFound(
  req: KeystaticRequest,
  config: InnerAPIRouteConfig
): Promise<KeystaticResponse> {
  const headers = await refreshGitHubAuth(req, config);
  if (headers) {
    return redirect('/keystatic/repo-not-found', headers);
  }
  return githubLogin(req, config);
}

async function githubLogin(
  req: KeystaticRequest,
  config: InnerAPIRouteConfig
): Promise<KeystaticResponse> {
  const reqUrl = new URL(req.url);
  const rawFrom = reqUrl.searchParams.get('from');
  const from =
    typeof rawFrom === 'string' && keystaticRouteRegex.test(rawFrom)
      ? rawFrom
      : '/';
  const state = bytesToHex(webcrypto.getRandomValues(new Uint8Array(10)));
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', config.clientId);
  url.searchParams.set(
    'redirect_uri',
    `${reqUrl.origin}/api/keystatic/github/oauth/callback`
  );
  if (from === '/') {
    return redirect(url.toString());
  }
  url.searchParams.set('state', state);
  return redirect(url.toString(), [
    [
      'Set-Cookie',
      cookie.serialize('ks-' + state, from, {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        // 1 day
        maxAge: 60 * 60 * 24,
        expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
        path: '/',
        httpOnly: true,
      }),
    ],
  ]);
}

async function createdGithubApp(
  req: KeystaticRequest,
  slugEnvVarName: string | undefined
): Promise<KeystaticResponse> {
  if (process.env.NODE_ENV !== 'development') {
    return { status: 400, body: 'App setup only allowed in development' };
  }
  return handleGitHubAppCreation(req, slugEnvVarName);
}

function getLfsConfig(
  req: KeystaticRequest,
  config: Config
):
  | { error: KeystaticResponse }
  | { owner: string; repo: string; accessToken: string } {
  if (config.storage.kind !== 'github') {
    return {
      error: { status: 400, body: 'LFS is only supported with GitHub storage' },
    };
  }
  const accessToken = getAccessToken(req);
  if (!accessToken) {
    return { error: { status: 401, body: 'Unauthorized' } };
  }
  const { owner, name: repo } = parseRepoConfig(config.storage.repo);
  return { owner, repo, accessToken };
}

async function lfsBatchRequest(
  owner: string,
  repo: string,
  accessToken: string,
  operation: 'upload' | 'download',
  objects: Array<{ oid: string; size: number }>
) {
  const batchUrl = `https://github.com/${owner}/${repo}.git/info/lfs/objects/batch`;
  return fetch(batchUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.git-lfs+json',
      'Content-Type': 'application/vnd.git-lfs+json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      operation,
      transfers: ['basic'],
      objects,
    }),
  });
}

async function computeSha256(content: Uint8Array): Promise<string> {
  const hashBuffer = await webcrypto.subtle.digest(
    'SHA-256',
    content as unknown as ArrayBuffer
  );
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

type LfsBatchResponseObject = {
  oid: string;
  size: number;
  actions?: {
    upload?: { href: string; header?: Record<string, string> };
    download?: { href: string; header?: Record<string, string> };
    verify?: { href: string; header?: Record<string, string> };
  };
  error?: { code: number; message: string };
};

async function githubLfsUpload(
  req: KeystaticRequest,
  config: Config
): Promise<KeystaticResponse> {
  const lfs = getLfsConfig(req, config);
  if ('error' in lfs) return lfs.error;

  let payload: { objects: Array<{ content: string }> };
  try {
    payload = await req.json();
  } catch {
    return { status: 400, body: 'Invalid JSON body' };
  }

  const prepared = await Promise.all(
    payload.objects.map(async obj => {
      const bytes = base64Decode(obj.content);
      const oid = await computeSha256(bytes);
      return { oid, size: bytes.byteLength, bytes };
    })
  );

  const batchRes = await lfsBatchRequest(
    lfs.owner,
    lfs.repo,
    lfs.accessToken,
    'upload',
    prepared.map(p => ({ oid: p.oid, size: p.size }))
  );
  if (!batchRes.ok) {
    return {
      status: batchRes.status,
      body: `LFS batch API error: ${await batchRes.text()}`,
    };
  }

  const batch: { objects: LfsBatchResponseObject[] } = await batchRes.json();

  for (const obj of batch.objects) {
    if (obj.error) {
      return {
        status: 502,
        body: `LFS error for ${obj.oid}: ${obj.error.message} (${obj.error.code})`,
      };
    }

    const uploadAction = obj.actions?.upload;
    if (!uploadAction) continue;

    const item = prepared.find(p => p.oid === obj.oid);
    if (!item) {
      return { status: 500, body: `No content prepared for ${obj.oid}` };
    }

    const uploadRes = await fetch(uploadAction.href, {
      method: 'PUT',
      headers: uploadAction.header ?? {},
      body: item.bytes as unknown as BodyInit,
    });
    if (!uploadRes.ok) {
      return {
        status: 502,
        body: `LFS upload failed for ${obj.oid} (${uploadRes.status}): ${await uploadRes.text()}`,
      };
    }

    if (obj.actions?.verify) {
      const verifyRes = await fetch(obj.actions.verify.href, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.git-lfs+json',
          ...(obj.actions.verify.header ?? {}),
        },
        body: JSON.stringify({ oid: obj.oid, size: obj.size }),
      });
      if (!verifyRes.ok) {
        return {
          status: 502,
          body: `LFS verify failed for ${obj.oid} (${verifyRes.status}): ${await verifyRes.text()}`,
        };
      }
    }
  }

  const pointers = prepared.map(p =>
    base64Encode(
      new TextEncoder().encode(createLfsPointer(p.oid, p.size))
    )
  );

  return {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ objects: pointers.map(p => ({ pointer: p })) }),
  };
}

async function githubLfsDownload(
  req: KeystaticRequest,
  config: Config
): Promise<KeystaticResponse> {
  const lfs = getLfsConfig(req, config);
  if ('error' in lfs) return lfs.error;

  let payload: { oid: string; size: number };
  try {
    payload = await req.json();
  } catch {
    return { status: 400, body: 'Invalid JSON body' };
  }

  const batchRes = await lfsBatchRequest(
    lfs.owner,
    lfs.repo,
    lfs.accessToken,
    'download',
    [{ oid: payload.oid, size: payload.size }]
  );
  if (!batchRes.ok) {
    return {
      status: batchRes.status,
      body: `LFS batch API error: ${await batchRes.text()}`,
    };
  }

  const batch: { objects: LfsBatchResponseObject[] } = await batchRes.json();
  const obj = batch.objects[0];

  if (obj?.error) {
    return {
      status: 502,
      body: `LFS error for ${obj.oid}: ${obj.error.message} (${obj.error.code})`,
    };
  }

  const downloadAction = obj?.actions?.download;
  if (!downloadAction) {
    return { status: 404, body: 'LFS object not found' };
  }

  const res = await fetch(downloadAction.href, {
    headers: downloadAction.header ?? {},
  });
  if (!res.ok) {
    return {
      status: 502,
      body: `LFS download failed (${res.status}): ${await res.text()}`,
    };
  }

  return {
    status: 200,
    headers: { 'Content-Type': 'application/octet-stream' },
    body: new Uint8Array(await res.arrayBuffer()),
  };
}

function immediatelyExpiringCookie(name: string) {
  return cookie.serialize(name, '', {
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(),
  });
}
