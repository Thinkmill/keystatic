import path from 'node:path';
import { z } from 'zod';
import fs from 'node:fs/promises';
import { Config } from '../config';
import {
  KeystaticRequest,
  KeystaticResponse,
  redirect,
} from './internal-utils';
import { readToDirEntries, getAllowedDirectories } from './read-local';
import { blobSha } from '../app/trees';
import { randomBytes } from 'node:crypto';

// this should be trivially dead code eliminated
// it's just to ensure the types are exactly the same between this and local-noop.ts
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _typeTest() {
  const a: typeof import('./api-node') = undefined as any;
  const b: typeof import('./api-noop') = undefined as any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let _c: typeof a = b;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let _d: typeof b = a;
}

const ghAppSchema = z.object({
  slug: z.string(),
  client_id: z.string(),
  client_secret: z.string(),
});

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function handleGitHubAppCreation(
  req: KeystaticRequest,
  slugEnvVarName: string | undefined
): Promise<KeystaticResponse> {
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

export function localModeApiHandler(
  config: Config,
  localBaseDirectory: string | undefined
) {
  const baseDirectory = path.resolve(localBaseDirectory ?? process.cwd());
  return async (
    req: KeystaticRequest,
    params: string[]
  ): Promise<KeystaticResponse> => {
    const joined = params.join('/');
    if (req.method === 'GET' && joined === 'tree') {
      return tree(req, config, baseDirectory);
    }
    if (req.method === 'GET' && params[0] === 'blob') {
      return blob(req, config, params, baseDirectory);
    }
    if (req.method === 'POST' && joined === 'update') {
      return update(req, config, baseDirectory);
    }
    return { status: 404, body: 'Not Found' };
  };
}

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
    body: JSON.stringify(await readToDirEntries(baseDirectory)),
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
    body: JSON.stringify(await readToDirEntries(baseDirectory)),
  };
}
