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
import { readToDirEntries } from './read-local';
import { getCollectionPath, getSingletonPath } from '../../app/path-utils';
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
  method: string;
  jsonBody: () => Promise<unknown>;
  headers: Record<string, string>;
  cookies: Record<string, string>;
  query: Record<string, string>;
  params: string[];
};

type KeystaticResponse =
  | {
      kind: 'redirect';
      headers?: Record<string, string[] | string>;
      to: string;
    }
  | {
      kind: 'response';
      status: number;
      headers?: Record<string, string[] | string>;
      body: Uint8Array | string;
    };

const keystaticRouteRegex =
  /^branch\/[^]+(\/collection\/[^/]+(|\/(create|item\/[^/]+))|\/singleton\/[^/]+)?$/;
export function makeGenericAPIRouteHandler(_config: APIRouteConfig) {
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
  if (
    !_config2.clientId ||
    !_config2.clientSecret ||
    !_config2.url ||
    !_config2.secret
  ) {
    return async function keystaticAPIRoute(
      req: KeystaticRequest
    ): Promise<KeystaticResponse> {
      const { params } = req;
      const joined = params.join('/');
      if (joined === 'github/created-app') {
        return createdGithubApp(req);
      }
      if (joined === 'github/login') {
        return { kind: 'redirect', to: '/keystatic/setup' };
      }
      if (_config2.config?.storage.kind === 'local') {
        if (req.method === 'GET' && joined === 'tree') {
          return tree(req, _config2.config);
        }
        if (req.method === 'GET' && params[0] === 'blob') {
          return blob(req, _config2.config);
        }
        if (req.method === 'POST' && params[0] === 'update') {
          return update(req, _config2.config);
        }
      }
      return { kind: 'response', status: 404, body: 'Not Found' };
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
    const { params } = req;
    const joined = params.join('/');
    if (joined === 'github/oauth/callback') {
      return githubOauthCallback(req, config);
    }
    if (joined === 'from-template-deploy') {
      return {
        kind: 'redirect',
        to: `${config.url}/keystatic/from-template-deploy`,
      };
    }
    if (config.config?.storage.kind === 'local') {
      if (req.method === 'GET' && joined === 'tree') {
        return tree(req, config.config);
      }
      if (req.method === 'GET' && params[0] === 'blob') {
        return blob(req, config.config);
      }
      if (req.method === 'POST' && params[0] === 'update') {
        return update(req, config.config);
      }
    }

    if (joined === 'github/login') {
      const from =
        typeof req.query.from === 'string' &&
        keystaticRouteRegex.test(req.query.from)
          ? req.query.from
          : '/';

      const state = randomBytes(10).toString('hex');
      const url = new URL('https://github.com/login/oauth/authorize');
      url.searchParams.set('client_id', config.clientId);
      url.searchParams.set(
        'redirect_uri',
        `${config.url}/api/keystatic/github/oauth/callback`
      );
      url.searchParams.set('state', state);
      return {
        kind: 'redirect',
        headers: {
          'Set-Cookie': [
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
        },
        to: url.toString(),
      };
    }
    if (joined === 'github/refresh-token') {
      return githubRefreshToken(req, config);
    }
    return { kind: 'response', status: 404, body: 'Not Found' };
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
  if (typeof req.query.code !== 'string') {
    return { kind: 'response', status: 400, body: 'Bad Request' };
  }
  const fromCookie = req.cookies['ks-' + req.query.state];
  const from =
    typeof fromCookie === 'string' && keystaticRouteRegex.test(fromCookie)
      ? fromCookie
      : undefined;
  const url = new URL('https://github.com/login/oauth/access_token');
  url.searchParams.set('client_id', config.clientId);
  url.searchParams.set('client_secret', config.clientSecret);
  url.searchParams.set('code', req.query.code as string);

  const tokenRes = await fetch(url, {
    method: 'POST',
    headers: { Accept: 'application/json' },
  });
  if (!tokenRes.ok) {
    return { kind: 'response', status: 401, body: 'Authorization failed' };
  }
  const _tokenData = await tokenRes.json();
  const tokenDataParseResult = tokenDataResultType.safeParse(_tokenData);
  if (!tokenDataParseResult.success) {
    return { kind: 'response', status: 401, body: 'Authorization failed' };
  }

  if (req.cookies['ks-template']) {
    const [owner, repo] = req.cookies['ks-template'].split('/');

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
        return { kind: 'response', status: 404, body: 'Not Found' };
      }
      if (errors?.length) {
        console.log(gqlRes);
        return {
          kind: 'response',
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
                (x.name === 'keystatic.ts' || x.name === 'keystatic.tsx') &&
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
  return {
    kind: 'redirect',
    headers,
    to: `/keystatic${from ? `/${from}` : ''}`,
  };
}

async function getTokenCookies(
  tokenData: z.infer<typeof tokenDataResultType>,
  config: InnerAPIRouteConfig
) {
  return {
    'Set-Cookie': [
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
          expires: new Date(
            Date.now() + tokenData.refresh_token_expires_in * 100
          ),
          path: '/',
        }
      ),
      cookie.serialize('ks-template', '', {
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 0,
        expires: new Date(),
        path: '/',
      }),
    ],
  };
}

async function getRefreshToken(
  req: KeystaticRequest,
  config: InnerAPIRouteConfig
) {
  const refreshTokenCookie = req.cookies['keystatic-gh-refresh-token'];
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
  const refreshToken = await getRefreshToken(req, config);
  if (!refreshToken) {
    return { kind: 'response', status: 401, body: 'Authorization failed' };
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
    return { kind: 'response', status: 401, body: 'Authorization failed' };
  }
  const _tokenData = await tokenRes.json();
  const tokenDataParseResult = tokenDataResultType.safeParse(_tokenData);
  if (!tokenDataParseResult.success) {
    return { kind: 'response', status: 401, body: 'Authorization failed' };
  }
  const headers = await getTokenCookies(tokenDataParseResult.data, config);
  return {
    kind: 'response',
    status: 200,
    headers,
    body: '',
  };
}

const ghAppSchema = z.object({
  slug: z.string(),
  client_id: z.string(),
  client_secret: z.string(),
});

async function createdGithubApp(
  req: KeystaticRequest
): Promise<KeystaticResponse> {
  if (process.env.NODE_ENV !== 'development') {
    return {
      kind: 'response',
      status: 400,
      body: 'App setup only allowed in development',
    };
  }
  if (
    typeof req.query.code !== 'string' ||
    !/^[a-zA-Z0-9]+$/.test(req.query.code)
  ) {
    return { kind: 'response', status: 400, body: 'Bad Request' };
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
    return {
      kind: 'response',
      status: 500,
      body: 'An error occurred while creating the GitHub App',
    };
  }
  const ghAppDataRaw = await ghAppRes.json();

  const ghAppDataResult = ghAppSchema.safeParse(ghAppDataRaw);

  if (!ghAppDataResult.success) {
    console.log(ghAppDataRaw);
    return {
      kind: 'response',
      status: 500,
      body: 'An unexpected response was received from GitHub',
    };
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
  await wait(200);
  return {
    kind: 'redirect',
    to: '/keystatic/created-github-app?slug=' + ghAppDataResult.data.slug,
  };
}

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function tree(
  req: KeystaticRequest,
  config: Config
): Promise<KeystaticResponse> {
  if (req.headers['no-cors'] !== '1') {
    return { kind: 'response', status: 400, body: 'Bad Request' };
  }
  return {
    kind: 'response',
    status: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(await readToDirEntries(process.cwd(), config)),
  };
}

function getAllowedDirectories(config: Config) {
  const allowedDirectories: string[] = [];
  for (const collection of Object.keys(config.collections ?? {})) {
    allowedDirectories.push(getCollectionPath(config, collection));
  }
  for (const singleton of Object.keys(config.singletons ?? {})) {
    allowedDirectories.push(getSingletonPath(config, singleton));
  }
  return allowedDirectories;
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
  config: Config
): Promise<KeystaticResponse> {
  if (req.headers['no-cors'] !== '1') {
    return {
      kind: 'response',
      status: 400,
      body: 'Bad Request',
    };
  }
  const { params } = req;
  const expectedSha = params[1];
  const filepath = params.slice(2).join('/');
  const isFilepathValid = getIsPathValid(config);
  if (!isFilepathValid(filepath)) {
    return { kind: 'response', status: 400, body: 'Bad Request' };
  }

  let contents;
  try {
    contents = await fs.readFile(filepath);
  } catch (err) {
    if ((err as any).code === 'ENOENT') {
      return { kind: 'response', status: 404, body: 'Not Found' };
    }
    throw err;
  }
  const sha = await blobSha(contents);

  if (sha !== expectedSha) {
    return { kind: 'response', status: 404, body: 'Not Found' };
  }
  return { kind: 'response', status: 200, body: contents };
}

async function update(
  req: KeystaticRequest,
  config: Config
): Promise<KeystaticResponse> {
  if (
    req.headers['no-cors'] !== '1' ||
    req.headers['content-type'] !== 'application/json'
  ) {
    return { kind: 'response', status: 400, body: 'Bad Request' };
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
    .safeParse(await req.jsonBody());
  if (!updates.success) {
    return { kind: 'response', status: 400, body: 'Bad data' };
  }
  for (const addition of updates.data.additions) {
    await fs.mkdir(path.dirname(addition.path), { recursive: true });
    await fs.writeFile(addition.path, addition.contents);
  }
  for (const deletion of updates.data.deletions) {
    await fs.rm(deletion.path, { force: true });
  }
  return {
    kind: 'response',
    status: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(await readToDirEntries(process.cwd(), config)),
  };
}
