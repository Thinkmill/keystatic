import type { NextApiRequest, NextApiResponse } from 'next';
import { APIRouteConfig, createGenericApiRouteHandler } from './api/generic';

export default function createKeystaticAPIRoute(_config: APIRouteConfig) {
  const handler = createGenericApiRouteHandler(_config);
  return async function keystaticAPIRoute(req: NextApiRequest, res: NextApiResponse) {
    const keystaticRes = await handler({
      cookies: Object.fromEntries(
        Object.entries(req.cookies).filter((x): x is [string, string] => typeof x[1] === 'string')
      ),
      headers: Object.fromEntries(
        Object.entries(req.headers).filter((x): x is [string, string] => typeof x[1] === 'string')
      ),
      jsonBody: async () => req.body,
      method: req.method!,
      params: Array.isArray(req.query.params) ? req.query.params : [],
      query: Object.fromEntries(
        Object.entries(req.query).filter((x): x is [string, string] => typeof x[1] === 'string')
      ),
    });
    if (keystaticRes.headers) {
      for (const [key, value] of Object.entries(keystaticRes.headers)) {
        res.setHeader(key, value);
      }
    }
    if (keystaticRes.kind === 'redirect') {
      res.redirect(keystaticRes.to);
      return;
    }
    res.status(keystaticRes.status).send(keystaticRes.body);
  };
}
