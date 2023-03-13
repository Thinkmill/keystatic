import cookie from 'cookie';
import Iron from '@hapi/iron';
import z from 'zod';
import fs from 'fs/promises';
import { randomBytes } from 'node:crypto';
import { GraphQLFormattedError } from 'graphql';
import { print } from 'graphql/language/printer';
import {
  BaseOperations,
  gql,
  OperationData,
  OperationVariables,
  TypedDocumentNode,
} from '@ts-gql/tag/no-transform';
import { Config } from '..';
import { getAllowedDirectories, readToDirEntries } from './read-local';
import { blobSha } from './trees-server-side';
import path from 'path';

export type APIRouteConfig = {
  /** @default process.env.KEYSTATIC_GITHUB_CLIENT_ID */
  clientId?: string;
  /** @default process.env.KEYSTATIC_GITHUB_CLIENT_SECRET */
  clientSecret?: string;
  /** @default process.env.KEYSTATIC_URL ?? process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : error */
  url?: string;
  /** @default process.env.KEYSTATIC_SECRET */
  secret?: string;
  localBaseDirectory?: string;
  config: Config<any, any>;
};

type InnerAPIRouteConfig = {
  clientId: string;
  clientSecret: string;
  url: string;
  secret: string;
  config: Config;
};

type KeystaticRequest = {
  headers: { get(name: string): string | null };
  method: string;
  url: string;
  json: () => Promise<any>;
};

type KeystaticResponse = ResponseInit & {
  body: Uint8Array | string | null;
};

const keystaticRouteRegex =
  /^branch\/[^]+(\/collection\/[^/]+(|\/(create|item\/[^/]+))|\/singleton\/[^/]+)?$/;

function redirect(
  to: string,
  initialHeaders?: [string, string][]
): KeystaticResponse {
  return {
    body: null,
    status: 307,
    headers: [...(initialHeaders ?? []), ['Location', to]],
  };
}
export function makeGenericAPIRouteHandler(
  _config: APIRouteConfig,
  options?: { slugEnvName?: string }
) {
  const _config2: APIRouteConfig = {
    clientId: _config.clientId ?? process.env.KEYSTATIC_GITHUB_CLIENT_ID,
    clientSecret:
      _config.clientSecret ?? process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
    url:
      _config.url ??
      process.env.KEYSTATIC_URL ??
      (process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000'
        : undefined),
    secret: _config.secret ?? process.env.KEYSTATIC_SECRET,
    config: _config.config,
  };
  const baseDirectory = path.resolve(
    _config.localBaseDirectory ?? process.cwd()
  );

  const getParams = (req: KeystaticRequest) =>
    new URL(req.url, 'http://localhost').pathname
      .replace(/^\/api\/keystatic\/?/, '')
      .split('/')
      .map(x => decodeURIComponent(x))
      .filter(Boolean);

  if (
    !_config2.clientId ||
    !_config2.clientSecret ||
    !_config2.url ||
    !_config2.secret
  ) {
    return async function keystaticAPIRoute(
      req: KeystaticRequest
    ): Promise<KeystaticResponse> {
      const params = getParams(req);
      const joined = params.join('/');
      if (joined === 'github/created-app') {
        return createdGithubApp(req, options?.slugEnvName);
      }
      if (joined === 'github/login') {
        return redirect('/keystatic/setup');
      }
      if (_config2.config?.storage.kind === 'local') {
        if (req.method === 'GET' && joined === 'tree') {
          return tree(req, _config2.config, baseDirectory);
        }
        if (req.method === 'GET' && params[0] === 'blob') {
          return blob(req, _config2.config, params, baseDirectory);
        }
        if (req.method === 'POST' && joined === 'update') {
          return update(req, _config2.config, baseDirectory);
        }
      }
      return { status: 404, body: 'Not Found' };
    };
  }
  const config: InnerAPIRouteConfig = {
    clientId: _config2.clientId,
    clientSecret: _config2.clientSecret,
    url: _config2.url,
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
    if (joined === 'from-template-deploy') {
      return redirect(`${config.url}/keystatic/from-template-deploy`);
    }
    if (config.config?.storage.kind === 'local') {
      if (req.method === 'GET' && joined === 'tree') {
        return tree(req, config.config, baseDirectory);
      }
      if (req.method === 'GET' && params[0] === 'blob') {
        return blob(req, config.config, params, baseDirectory);
      }
      if (req.method === 'POST' && params[0] === 'update') {
        return update(req, config.config, baseDirectory);
      }
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
    return { status: 404, body: 'Not Found' };
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
  req: KeystaticRequest,
  config: InnerAPIRouteConfig
): Promise<KeystaticResponse> {
  const searchParams = new URL(req.url, 'http://localhost').searchParams;
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
  const tokenDataParseResult = tokenDataResultType.safeParse(_tokenData);
  if (!tokenDataParseResult.success) {
    return { status: 401, body: 'Authorization failed' };
  }

  if (cookies['ks-template']) {
    const [owner, repo] = cookies['ks-template'].split('/');

    const fetchGraphQL = async <
      TTypedDocumentNode extends TypedDocumentNode<BaseOperations>
    >(
      operation: TTypedDocumentNode,
      ...variables:
        | [OperationVariables<TTypedDocumentNode>]
        | ({} extends OperationVariables<TTypedDocumentNode> ? [] : never)
    ): Promise<{
      data: OperationData<TTypedDocumentNode>;
      errors?: GraphQLFormattedError[];
    }> => {
      const res = await fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenDataParseResult.data.access_token}`,
        },
        body: JSON.stringify({
          query: print(operation),
          variables: variables[0],
        }),
      });
      if (!res.ok) {
        console.error(res);
        throw new Error('Bad response from GitHub');
      }
      return res.json();
    };
    if (owner && repo) {
      const gqlRes = await fetchGraphQL(
        gql`
          query RepoForUpdating($owner: String!, $name: String!) {
            repository(owner: $owner, name: $name) {
              id
              defaultBranchRef {
                id
                name
                target {
                  id
                  oid
                  __typename
                  ... on Commit {
                    id
                    tree {
                      id
                      entries {
                        name
                        object {
                          id
                          __typename
                          ... on Blob {
                            text
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        ` as import('../../__generated__/ts-gql/RepoForUpdating').type,
        { name: repo, owner }
      );
      const { data, errors } = gqlRes;
      if (
        (errors && 'type' in errors[0] && errors[0].type === 'NOT_FOUND') ||
        data?.repository === null
      ) {
        return { status: 404, body: 'Not Found' };
      }
      if (errors?.length) {
        console.log(gqlRes);
        return {
          status: 500,
          body: 'An error occurred while fetching the repository',
        };
      }
      const defaultBranchName = data.repository.defaultBranchRef?.name;
      const defaultBranchSha = data.repository.defaultBranchRef?.target?.oid;
      const configFile =
        data.repository.defaultBranchRef?.target?.__typename === 'Commit'
          ? data.repository.defaultBranchRef.target.tree?.entries?.find(
              (
                x
              ): x is typeof x & {
                object: { __typename: 'Blob'; text: string };
              } =>
                (x.name === 'keystatic.ts' ||
                  x.name === 'keystatic.tsx' ||
                  x.name === 'keystatic.config.ts' ||
                  x.name === 'keystatic.config.tsx') &&
                x.object?.__typename === 'Blob' &&
                x.object.text !== null
            )
          : undefined;
      if (defaultBranchName && defaultBranchSha && configFile) {
        const configFileText = configFile.object.text
          .replace(
            'process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_OWNER!',
            `"${owner}"`
          )
          .replace(
            'process.env.NEXT_PUBLIC_VERCEL_GIT_REPO_SLUG!',
            `"${repo}"`
          );
        if (configFileText !== configFile.object.text) {
          await fetchGraphQL(
            gql`
              mutation CreateCommitToUpdateRepo(
                $input: CreateCommitOnBranchInput!
              ) {
                createCommitOnBranch(input: $input) {
                  __typename
                }
              }
            ` as import('../../__generated__/ts-gql/CreateCommitToUpdateRepo').type,
            {
              input: {
                branch: { id: data.repository.defaultBranchRef.id },
                expectedHeadOid: defaultBranchSha,
                message: { headline: 'Update Keystatic repo config' },
                fileChanges: {
                  additions: [
                    {
                      contents: Buffer.from(configFileText, 'utf-8').toString(
                        'base64'
                      ),
                      path: configFile.name,
                    },
                  ],
                },
              },
            }
          );
        }
      }
    }
  }

  const headers = await getTokenCookies(tokenDataParseResult.data, config);
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
  tokenData: z.infer<typeof tokenDataResultType>,
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
        await Iron.seal(tokenData.refresh_token, config.secret, {
          ...Iron.defaults,
          ttl: tokenData.refresh_token_expires_in * 1000,
        }),
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
    [
      'Set-Cookie',
      cookie.serialize('ks-template', '', {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0,
        expires: new Date(),
        path: '/',
      }),
    ],
  ];
  return headers;
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
    refreshToken = await Iron.unseal(
      refreshTokenCookie,
      config.secret,
      Iron.defaults
    );
  } catch {
    return;
  }
  if (typeof refreshToken !== 'string') return;
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
  const tokenDataParseResult = tokenDataResultType.safeParse(_tokenData);
  if (!tokenDataParseResult.success) {
    return;
  }
  return getTokenCookies(tokenDataParseResult.data, config);
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
  const rawFrom = new URL(req.url, 'http://localhost').searchParams.get('from');
  const from =
    typeof rawFrom === 'string' && keystaticRouteRegex.test(rawFrom)
      ? rawFrom
      : '/';

  const state = randomBytes(10).toString('hex');
  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', config.clientId);
  url.searchParams.set(
    'redirect_uri',
    `${config.url}/api/keystatic/github/oauth/callback`
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

const ghAppSchema = z.object({
  slug: z.string(),
  client_id: z.string(),
  client_secret: z.string(),
});

async function createdGithubApp(
  req: KeystaticRequest,
  slugEnvVarName: string | undefined
): Promise<KeystaticResponse> {
  if (process.env.NODE_ENV !== 'development') {
    return { status: 400, body: 'App setup only allowed in development' };
  }
  const searchParams = new URL(req.url, 'https://localhost').searchParams;
  const code = searchParams.get('code');
  if (typeof code !== 'string' || !/^[a-zA-Z0-9]+$/.test(code)) {
    return { status: 400, body: 'Bad Request' };
  }
  const ghAppRes = await fetch(
    `https://api.github.com/app-manifests/${code}/conversions`,
    {
      method: 'POST',
      headers: { Accept: 'application/json' },
    }
  );
  if (!ghAppRes.ok) {
    console.log(ghAppRes);
    return {
      status: 500,
      body: 'An error occurred while creating the GitHub App',
    };
  }
  const ghAppDataRaw = await ghAppRes.json();

  const ghAppDataResult = ghAppSchema.safeParse(ghAppDataRaw);

  if (!ghAppDataResult.success) {
    console.log(ghAppDataRaw);
    return {
      status: 500,
      body: 'An unexpected response was received from GitHub',
    };
  }
  const toAddToEnv = `# Keystatic
KEYSTATIC_GITHUB_CLIENT_ID=${ghAppDataResult.data.client_id}
KEYSTATIC_GITHUB_CLIENT_SECRET=${ghAppDataResult.data.client_secret}
KEYSTATIC_SECRET=${randomBytes(40).toString('hex')}
${slugEnvVarName ? `${slugEnvVarName}=${ghAppDataResult.data.slug}\n` : ''}`;

  let prevEnv: string | undefined;
  try {
    prevEnv = await fs.readFile('.env', 'utf-8');
  } catch (err) {
    if ((err as any).code !== 'ENOENT') throw err;
  }
  const newEnv = prevEnv ? `${prevEnv}\n\n${toAddToEnv}` : toAddToEnv;
  await fs.writeFile('.env', newEnv);
  await wait(200);
  return redirect(
    '/keystatic/created-github-app?slug=' + ghAppDataResult.data.slug
  );
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function tree(
  req: KeystaticRequest,
  config: Config,
  baseDirectory: string
): Promise<KeystaticResponse> {
  if (req.headers.get('no-cors') !== '1') {
    return { status: 400, body: 'Bad Request' };
  }
  return {
    status: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(await readToDirEntries(baseDirectory, config)),
  };
}

function getIsPathValid(config: Config) {
  const allowedDirectories = getAllowedDirectories(config);
  return (filepath: string) =>
    !filepath.includes('\\') &&
    filepath.split('/').every(x => x !== '.' && x !== '..') &&
    allowedDirectories.some(x => filepath.startsWith(x));
}

async function blob(
  req: KeystaticRequest,
  config: Config,
  params: string[],
  baseDirectory: string
): Promise<KeystaticResponse> {
  if (req.headers.get('no-cors') !== '1') {
    return { status: 400, body: 'Bad Request' };
  }

  const expectedSha = params[1];
  const filepath = params.slice(2).join('/');
  const isFilepathValid = getIsPathValid(config);
  if (!isFilepathValid(filepath)) {
    return { status: 400, body: 'Bad Request' };
  }

  let contents;
  try {
    contents = await fs.readFile(path.join(baseDirectory, filepath));
  } catch (err) {
    if ((err as any).code === 'ENOENT') {
      return { status: 404, body: 'Not Found' };
    }
    throw err;
  }
  const sha = await blobSha(contents);

  if (sha !== expectedSha) {
    return { status: 404, body: 'Not Found' };
  }
  return { status: 200, body: contents };
}

async function update(
  req: KeystaticRequest,
  config: Config,
  baseDirectory: string
): Promise<KeystaticResponse> {
  if (
    req.headers.get('no-cors') !== '1' ||
    req.headers.get('content-type') !== 'application/json'
  ) {
    return { status: 400, body: 'Bad Request' };
  }
  const isFilepathValid = getIsPathValid(config);

  const updates = z
    .object({
      additions: z.array(
        z.object({
          path: z.string().refine(isFilepathValid),
          contents: z.string().transform(x => Buffer.from(x, 'base64')),
        })
      ),
      deletions: z.array(
        z.object({ path: z.string().refine(isFilepathValid) })
      ),
    })
    .safeParse(await req.json());
  if (!updates.success) {
    return { status: 400, body: 'Bad data' };
  }
  for (const addition of updates.data.additions) {
    await fs.mkdir(path.dirname(path.join(baseDirectory, addition.path)), {
      recursive: true,
    });
    await fs.writeFile(
      path.join(baseDirectory, addition.path),
      addition.contents
    );
  }
  for (const deletion of updates.data.deletions) {
    await fs.rm(path.join(baseDirectory, deletion.path), { force: true });
  }
  return {
    status: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(await readToDirEntries(baseDirectory, config)),
  };
}
