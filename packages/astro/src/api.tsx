import {
  APIRouteConfig,
  makeGenericAPIRouteHandler,
} from '@keystatic/core/api/generic';
import type { APIContext } from 'astro';

export function makeHandler(_config: APIRouteConfig) {
  return async function keystaticAPIRoute(context: APIContext) {
    const envVarsForCf = (context.locals as any)?.runtime?.env;
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
    return new Response(body, { status, headers });
  };
}

function tryOrUndefined<T>(fn: () => T): T | undefined {
  try {
    return fn();
  } catch {
    return undefined;
  }
}
