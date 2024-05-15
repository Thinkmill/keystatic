import { parse } from 'cookie';
import * as s from 'superstruct';
import { Config } from '../config';

const storedTokenSchema = s.object({
  token: s.string(),
  project: s.string(),
  validUntil: s.coerce(s.date(), s.number(), val => new Date(val)),
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
    tokenData = storedTokenSchema.create(JSON.parse(unparsedTokenData!));
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

let _refreshTokenPromise: Promise<{ accessToken: string } | null> | undefined;

export async function getAuth(config: Config) {
  const token = getSyncAuth(config);

  if (config.storage.kind === 'github' && !token) {
    if (!_refreshTokenPromise) {
      _refreshTokenPromise = (async () => {
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
        } catch {
        } finally {
          _refreshTokenPromise = undefined;
        }
        return null;
      })();
    }
    return _refreshTokenPromise;
  }
  return token;
}
