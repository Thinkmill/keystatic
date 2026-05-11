import path from 'node:path';
import * as s from 'superstruct';
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
import { base64UrlDecode } from '#base64';

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

const ghAppSchema = s.type({
  slug: s.string(),
  client_id: s.string(),
  client_secret: s.string(),
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
  let ghAppDataResult;
  try {
    ghAppDataResult = s.create(ghAppDataRaw, ghAppSchema);
  } catch {
    console.log(ghAppDataRaw);
    return {
      status: 500,
      body: 'An unexpected response was received from GitHub',
    };
  }
  const toAddToEnv = `# Keystatic
KEYSTATIC_GITHUB_CLIENT_ID=${ghAppDataResult.client_id}
KEYSTATIC_GITHUB_CLIENT_SECRET=${ghAppDataResult.client_secret}
KEYSTATIC_SECRET=${randomBytes(40).toString('hex')}
${
  slugEnvVarName
    ? `${slugEnvVarName}=${ghAppDataResult.slug} # https://github.com/apps/${ghAppDataResult.slug}\n`
    : ''
}`;

  let prevEnv: string | undefined;
  try {
    prevEnv = await fs.readFile('.env', 'utf-8');
  } catch (err) {
    if ((err as any).code !== 'ENOENT') throw err;
  }
  const newEnv = prevEnv ? `${prevEnv}\n\n${toAddToEnv}` : toAddToEnv;
  await fs.writeFile('.env', newEnv);
  await wait(200);
  return redirect('/keystatic/created-github-app?slug=' + ghAppDataResult.slug);
}

export function localModeApiHandler(
  config: Config,
  localBaseDirectory: string | undefined
) {
  // Use the base directory, and if pathPrefix is defined, resolve it relative to the base
  const baseDir = localBaseDirectory ?? process.cwd();
  const baseDirectory = config.storage.kind === 'local' && config.storage.pathPrefix
    ? path.resolve(baseDir, config.storage.pathPrefix)
    : path.resolve(baseDir);
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
  // Bypass strict path validation for local storage when pathPrefix is specified
  if (config.storage.kind === 'local' && (config.storage.pathPrefix)) {
    return (filepath: string) => !filepath.includes('\\');
  }
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

const base64Schema = s.coerce(s.instance(Uint8Array), s.string(), val =>
  base64UrlDecode(val)
);

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
  const filepath = s.refine(s.string(), 'filepath', isFilepathValid);
  let updates;

  try {
    updates = s.create(
      await req.json(),
      s.object({
        additions: s.array(
          s.object({
            path: filepath,
            contents: base64Schema,
          })
        ),
        deletions: s.array(s.object({ path: filepath })),
      })
    );
  } catch {
    return { status: 400, body: 'Bad data' };
  }
  // Handle file paths when pathPrefix is configured
  const pathPrefix = config.storage.kind === 'local' ? config.storage.pathPrefix : undefined;
  for (const addition of updates.additions) {
    // Construct file path based on whether we have a pathPrefix
    // If we have a pathPrefix, we need to strip it from the path to avoid duplication
    const effectivePath = pathPrefix && addition.path.startsWith(pathPrefix)
      ? addition.path.slice(pathPrefix.length + 1) // +1 for the slash
      : addition.path;
    const filePath = path.join(baseDirectory, effectivePath);
    await fs.mkdir(path.dirname(filePath), {
      recursive: true,
    });
    await fs.writeFile(
      filePath,
      addition.contents
    );
  }
  for (const deletion of updates.deletions) {
    // Apply the same path correction for deletions
    const effectivePath = pathPrefix && deletion.path.startsWith(pathPrefix)
      ? deletion.path.slice(pathPrefix.length + 1) // +1 for the slash
      : deletion.path;
    const filePath = path.join(baseDirectory, effectivePath);
    await fs.rm(filePath, { force: true });
  }
  return {
    status: 200,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(await readToDirEntries(baseDirectory)),
  };
}
