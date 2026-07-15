import {
  APIRouteConfig,
  makeGenericAPIRouteHandler,
} from '@keystatic/core/api/generic';
import type { APIContext } from 'astro';
import { parseString } from 'set-cookie-parser';

// `Astro.locals.runtime.env` was removed in Astro v6+; the platform now
// recommends reading Cloudflare's runtime env via a dynamic
// `cloudflare:workers` import instead. Falls back to the old
// `context.locals.runtime.env` shape (still used by some other adapters/
// older Astro versions) and finally to `undefined` so this stays adapter-
// agnostic - this file isn't Cloudflare-specific.
async function getCloudflareEnvVars(
  context: APIContext
): Promise<Record<string, string | undefined> | undefined> {
  try {
    // @ts-expect-error - 'cloudflare:workers' is only a valid specifier
    // under the Cloudflare adapter; no ambient type for it here since this
    // package isn't Cloudflare-specific.
    const cf: any = await import(/* @vite-ignore */ 'cloudflare:workers');
    if (cf?.env) return cf.env;
  } catch {
    // not running under a Cloudflare adapter that supports this import
  }
  try {
    // Older Astro versions / other adapters may still expose this shape.
    // On Astro v6+, `locals.runtime` throws when accessed if it's not
    // actually present, so this has to be its own try/catch too.
    return (context.locals as any)?.runtime?.env;
  } catch {
    return undefined;
  }
}

export function makeHandler(_config: APIRouteConfig) {
  return async function keystaticAPIRoute(context: APIContext) {
    const envVarsForCf = await getCloudflareEnvVars(context);
    const handler = makeGenericAPIRouteHandler(
      {
        ..._config,
        clientId:
          _config.clientId ??
          envVarsForCf?.KEYSTATIC_GITHUB_CLIENT_ID ??
          tryOrUndefined(() => {
            return import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID;
          }),
        clientSecret:
          _config.clientSecret ??
          envVarsForCf?.KEYSTATIC_GITHUB_CLIENT_SECRET ??
          tryOrUndefined(() => {
            return import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET;
          }),
        secret:
          _config.secret ??
          envVarsForCf?.KEYSTATIC_SECRET ??
          tryOrUndefined(() => {
            return import.meta.env.KEYSTATIC_SECRET;
          }),
      },
      {
        slugEnvName: 'PUBLIC_KEYSTATIC_GITHUB_APP_SLUG',
      }
    );
    const { body, headers, status } = await handler(context.request);
    // all this stuff should be able to go away when astro is using a version of undici with getSetCookie
    let headersInADifferentStructure = new Map<string, string[]>();
    if (headers) {
      if (Array.isArray(headers)) {
        for (const [key, value] of headers) {
          if (!headersInADifferentStructure.has(key.toLowerCase())) {
            headersInADifferentStructure.set(key.toLowerCase(), []);
          }
          headersInADifferentStructure.get(key.toLowerCase())!.push(value);
        }
      } else if (typeof headers.entries === 'function') {
        for (const [key, value] of headers.entries()) {
          headersInADifferentStructure.set(key.toLowerCase(), [value]);
        }
        if (
          'getSetCookie' in headers &&
          typeof headers.getSetCookie === 'function'
        ) {
          const setCookieHeaders = (headers as any).getSetCookie();
          if (setCookieHeaders?.length) {
            headersInADifferentStructure.set('set-cookie', setCookieHeaders);
          }
        }
      } else {
        for (const [key, value] of Object.entries(headers)) {
          headersInADifferentStructure.set(key.toLowerCase(), [value]);
        }
      }
    }

    const setCookieHeaders = headersInADifferentStructure.get('set-cookie');
    headersInADifferentStructure.delete('set-cookie');
    if (setCookieHeaders) {
      for (const setCookieValue of setCookieHeaders) {
        const { name, value, ...options } = parseString(setCookieValue);
        const sameSite = options.sameSite?.toLowerCase();
        context.cookies.set(name, value, {
          domain: options.domain,
          expires: options.expires,
          httpOnly: options.httpOnly,
          maxAge: options.maxAge,
          path: options.path,
          sameSite:
            sameSite === 'lax' || sameSite === 'strict' || sameSite === 'none'
              ? sameSite
              : undefined,
        });
      }
    }

    return new Response(body, {
      status,
      headers: [...headersInADifferentStructure.entries()].flatMap(
        ([key, val]) => val.map((x): [string, string] => [key, x])
      ),
    });
  };
}

function tryOrUndefined<T>(fn: () => T): T | undefined {
  try {
    return fn();
  } catch {
    return undefined;
  }
}
