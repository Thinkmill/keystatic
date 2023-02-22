import type { NextApiRequest, NextApiResponse } from 'next';
import {
  APIRouteConfig,
  makeGenericAPIRouteHandler,
} from '@keystatic/core/api/generic';

export function makeAPIRouteHandler(_config: APIRouteConfig) {
  const handler = makeGenericAPIRouteHandler(_config, {
    slugEnvName: 'NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG',
  });
  return async function keystaticAPIRoute(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const { body, headers, status } = await handler({
      headers: {
        get(name: string) {
          const val = req.headers[name];
          if (Array.isArray(val)) {
            return val[0];
          }
          return val ?? null;
        },
      },
      json: async () => req.body,
      method: req.method!,
      url: req.url!,
    });

    if (headers) {
      if (Array.isArray(headers)) {
        const headersInADifferentStructure = new Map<string, string[]>();
        for (const [key, value] of headers) {
          if (!headersInADifferentStructure.has(key)) {
            headersInADifferentStructure.set(key, []);
          }
          headersInADifferentStructure.get(key)!.push(value);
        }
        for (const [key, value] of headersInADifferentStructure) {
          res.setHeader(key, value);
        }
      } else if (typeof headers.entries === 'function') {
        for (const [key, value] of headers.entries()) {
          res.setHeader(key, value);
        }
      } else {
        for (const [key, value] of Object.entries(headers)) {
          res.setHeader(key, value);
        }
      }
    }
    res.status(status ?? 200).send(body);
  };
}
