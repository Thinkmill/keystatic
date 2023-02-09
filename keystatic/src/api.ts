import type { NextApiRequest, NextApiResponse } from 'next';
import cookie from 'cookie';
import Iron from '@hapi/iron';
import z from 'zod';
import fs from 'fs/promises';
import { randomBytes } from 'node:crypto';

type APIRouteConfig = {
  /** @default process.env.KEYSTATIC_GITHUB_CLIENT_ID */
  clientId?: string;
  /** @default process.env.KEYSTATIC_GITHUB_CLIENT_SECRET */
  clientSecret?: string;
  /** @default process.env.KEYSTATIC_URL ?? process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : error */
  url?: string;
  /** @default process.env.KEYSTATIC_SECRET */
  secret?: string;
};

type InnerAPIRouteConfig = {
  clientId: string;
  clientSecret: string;
  url: string;
  secret: string;
};

const keystaticRouteRegex =
  /^branch\/[^]+(\/collection\/[^/]+(|\/(create|item\/[^/]+))|\/singleton\/[^/]+)?$/;

export default function createKeystaticAPIRoute(_config: APIRouteConfig) {
  const _config2: APIRouteConfig = {
    clientId: _config.clientId ?? process.env.KEYSTATIC_GITHUB_CLIENT_ID,
    clientSecret: _config.clientSecret ?? process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
    url:
      _config.url ??
      process.env.KEYSTATIC_URL ??
      (process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : undefined),
    secret: _config.secret ?? process.env.KEYSTATIC_SECRET,
  };
  if (!_config2.clientId || !_config2.clientSecret || !_config2.url || !_config2.secret) {
    return async function keystaticAPIRoute(req: NextApiRequest, res: NextApiResponse) {
      const { params = [] } = req.query as { params?: string[] };
      const joined = params.join('/');
      if (joined === 'github/created-app') {
        await createdGithubApp(req, res);
        return;
      }
      if (joined === 'github/login') {
        res.redirect('/keystatic/setup');
        return;
      }
      res.status(404).send('Not Found');
    };
  }
  const config: InnerAPIRouteConfig = {
    clientId: _config2.clientId,
    clientSecret: _config2.clientSecret,
    url: _config2.url,
    secret: _config2.secret,
  };

  return async function keystaticAPIRoute(req: NextApiRequest, res: NextApiResponse) {
    const { params = [] } = req.query as { params?: string[] };
    const joined = params.join('/');
    if (joined === 'github/oauth/callback') {
      await githubOauthCallback(req, res, config);
      return;
    }
    if (joined === 'github/login') {
      const from =
        typeof req.query.from === 'string' && keystaticRouteRegex.test(req.query.from)
          ? req.query.from
          : '/';

      const state = randomBytes(10).toString('hex');
      const url = new URL('https://github.com/login/oauth/authorize');
      url.searchParams.set('client_id', config.clientId);
      url.searchParams.set('redirect_uri', `${config.url}/api/keystatic/github/oauth/callback`);
      url.searchParams.set('state', state);
      res.setHeader('Set-Cookie', [
        cookie.serialize('ks-' + state, from, {
          sameSite: 'lax',
          secure: process.env.NODE_ENV === 'production',
          // 1 day
          maxAge: 60 * 60 * 24,
          expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
          path: '/',
          httpOnly: true,
        }),
      ]);
      res.redirect(url.toString());
      return;
    }
    if (joined === 'github/refresh-token') {
      await githubRefreshToken(req, res, config);
      return;
    }

    res.status(404).send('Not Found');
  };
}

const tokenDataResultType = z.object({
  access_token: z.string(),
  expires_in: z.number(),
  refresh_token: z.string(),
  refresh_token_expires_in: z.number(),
  scope: z.string(),
  token_type: z.literal('bearer'),
});

async function githubOauthCallback(
  req: NextApiRequest,
  res: NextApiResponse,
  config: InnerAPIRouteConfig
) {
  if (typeof req.query.code !== 'string') {
    res.status(400).send('Bad Request');
    return;
  }
  const fromCookie = req.cookies['ks-' + req.query.state];
  const from =
    typeof fromCookie === 'string' && keystaticRouteRegex.test(fromCookie) ? fromCookie : undefined;
  const url = new URL('https://github.com/login/oauth/access_token');
  url.searchParams.set('client_id', config.clientId);
  url.searchParams.set('client_secret', config.clientSecret);
  url.searchParams.set('code', req.query.code as string);

  const tokenRes = await fetch(url, { method: 'POST', headers: { Accept: 'application/json' } });
  if (!tokenRes.ok) {
    res.status(401).send('Authorization failed');
    return;
  }
  const _tokenData = await tokenRes.json();
  const tokenDataParseResult = tokenDataResultType.safeParse(_tokenData);
  if (!tokenDataParseResult.success) {
    res.status(401).send('Authorization failed');
    return;
  }

  await setTokenCookies(res, tokenDataParseResult.data, config);

  res.redirect(`/keystatic${from ? `/${from}` : ''}`);
}

async function setTokenCookies(
  res: NextApiResponse,
  tokenData: z.infer<typeof tokenDataResultType>,
  config: InnerAPIRouteConfig
) {
  res.setHeader('Set-Cookie', [
    cookie.serialize('keystatic-gh-access-token', tokenData.access_token, {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokenData.expires_in,
      expires: new Date(Date.now() + tokenData.expires_in * 1000),
      path: '/',
    }),
    cookie.serialize(
      'keystatic-gh-refresh-token',
      await Iron.seal(tokenData.refresh_token, config.secret, {
        ...Iron.defaults,
        ttl: tokenData.refresh_token_expires_in * 1000,
      }),
      {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: tokenData.refresh_token_expires_in,
        expires: new Date(Date.now() + tokenData.refresh_token_expires_in * 100),
        path: '/',
      }
    ),
  ]);
}

async function getRefreshToken(req: NextApiRequest, config: InnerAPIRouteConfig) {
  const refreshTokenCookie = req.cookies['keystatic-gh-refresh-token'];
  if (!refreshTokenCookie) return;
  let refreshToken;
  try {
    refreshToken = await Iron.unseal(refreshTokenCookie, config.secret, Iron.defaults);
  } catch {
    return;
  }
  if (typeof refreshToken !== 'string') return;
  return refreshToken;
}

async function githubRefreshToken(
  req: NextApiRequest,
  res: NextApiResponse,
  config: InnerAPIRouteConfig
) {
  const refreshToken = await getRefreshToken(req, config);
  if (!refreshToken) {
    res.status(401).send('Authorization failed');
    return;
  }
  const url = new URL('https://github.com/login/oauth/access_token');
  url.searchParams.set('client_id', config.clientId);
  url.searchParams.set('client_secret', config.clientSecret);
  url.searchParams.set('grant_type', 'refresh_token');
  url.searchParams.set('refresh_token', refreshToken);
  const tokenRes = await fetch(url, { method: 'POST', headers: { Accept: 'application/json' } });

  if (!tokenRes.ok) {
    res.status(401).send('Authorization failed');
    return;
  }
  const _tokenData = await tokenRes.json();
  const tokenDataParseResult = tokenDataResultType.safeParse(_tokenData);
  if (!tokenDataParseResult.success) {
    res.status(401).send('Authorization failed');
    return;
  }
  await setTokenCookies(res, tokenDataParseResult.data, config);
  res.status(200).send('');
}

const ghAppSchema = z.object({
  slug: z.string(),
  client_id: z.string(),
  client_secret: z.string(),
});

async function createdGithubApp(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV !== 'development') {
    res.status(400).send('App setup only allowed in development');
    return;
  }
  if (typeof req.query.code !== 'string' || !/^[a-zA-Z0-9]+$/.test(req.query.code)) {
    res.status(400).send('Bad Request');
    return;
  }
  const ghAppRes = await fetch(
    `https://api.github.com/app-manifests/${req.query.code}/conversions`,
    {
      method: 'POST',
      headers: { Accept: 'application/json' },
    }
  );
  if (!ghAppRes.ok) {
    console.log(ghAppRes);
    res.status(500).send('An error occurred while creating the GitHub App');
    return;
  }
  const ghAppDataRaw = await ghAppRes.json();

  const ghAppDataResult = ghAppSchema.safeParse(ghAppDataRaw);

  if (!ghAppDataResult.success) {
    console.log(ghAppDataRaw);
    res.status(500).send('An unexpected response was received from GitHub');
    return;
  }
  const toAddToEnv = `# Keystatic
KEYSTATIC_GITHUB_CLIENT_ID=${ghAppDataResult.data.client_id}
KEYSTATIC_GITHUB_CLIENT_SECRET=${ghAppDataResult.data.client_secret}
KEYSTATIC_SECRET=${randomBytes(40).toString('hex')}
NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG=${ghAppDataResult.data.slug}
`;

  let prevEnv: string | undefined;
  try {
    prevEnv = await fs.readFile('.env', 'utf-8');
  } catch (err) {
    if ((err as any).code !== 'ENOENT') throw err;
  }
  const newEnv = prevEnv ? `${prevEnv}\n\n${toAddToEnv}` : toAddToEnv;
  await fs.writeFile('.env', newEnv);
  res.redirect('/keystatic');
}
