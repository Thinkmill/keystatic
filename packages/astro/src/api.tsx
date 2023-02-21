import {
  APIRouteConfig,
  makeGenericAPIRouteHandler,
} from '@keystatic/core/api/generic';
import type { APIContext } from 'astro';
import { parseString } from 'set-cookie-parser';

export function makeHandler(_config: APIRouteConfig) {
  const handler = makeGenericAPIRouteHandler(_config);
  return async function keystaticAPIRoute(context: APIContext) {
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
