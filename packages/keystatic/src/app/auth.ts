import { parse } from 'cookie';
import { z } from 'zod';
import { Config } from '../config';

const storedTokenSchema = z.object({
  token: z.string(),
  project: z.string(),
  validUntil: z.number().transform(val => new Date(val)),
});

export function getSyncAuth(config: Config) {
  if (typeof document === 'undefined') {
    return null;
  }
  if (config.storage.kind === 'github') {
    const cookies = parse(document.cookie);
    const accessToken = cookies['keystatic-gh-access-token'];
    if (!accessToken) {
      return null;
    }
    return { accessToken };
  }
  if (config.storage.kind === 'cloud') {
    return getCloudAuth(config);
  }
  return null;
}

export function getCloudAuth(config: Config) {
  if (!config.cloud?.project) return null;
  const unparsedTokenData = localStorage.getItem(
    'keystatic-cloud-access-token'
  );
  let tokenData;
  try {
    tokenData = storedTokenSchema.parse(JSON.parse(unparsedTokenData!));
  } catch (err) {
    return null;
  }
  if (
    !tokenData ||
    tokenData.validUntil < new Date() ||
    tokenData.project !== config.cloud.project
  ) {
    return null;
  }
  return { accessToken: tokenData.token };
}

export async function getAuth(config: Config) {
  const token = getSyncAuth(config);

  if (config.storage.kind === 'github' && !token) {
    try {
      const res = await fetch('/api/keystatic/github/refresh-token', {
        method: 'POST',
      });
      if (res.status === 200) {
        const cookies = parse(document.cookie);
        const accessToken = cookies['keystatic-gh-access-token'];
        if (accessToken) {
          return { accessToken };
        }
      }
    } catch {}
    return null;
  }
  return token;
}
