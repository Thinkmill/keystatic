import {
  APIRouteConfig,
  makeGenericAPIRouteHandler,
} from '@keystatic/core/api/generic';
import type { APIContext } from 'astro';
import { getSecret } from 'astro:env/server';

export function makeHandler(_config: APIRouteConfig) {
  return async function keystaticAPIRoute(context: APIContext) {
    const handler = makeGenericAPIRouteHandler(
      {
        ..._config,
        clientId: _config.clientId ?? getSecret('KEYSTATIC_GITHUB_CLIENT_ID'),
        clientSecret:
          _config.clientSecret ?? getSecret('KEYSTATIC_GITHUB_CLIENT_SECRET'),
        secret: _config.secret ?? getSecret('KEYSTATIC_SECRET'),
      },
      {
        slugEnvName: 'PUBLIC_KEYSTATIC_GITHUB_APP_SLUG',
      }
    );
    const { body, headers, status } = await handler(context.request);
    return new Response(body, {
      status,
      headers,
    });
  };
}
