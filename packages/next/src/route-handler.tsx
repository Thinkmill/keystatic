import {
  APIRouteConfig,
  makeGenericAPIRouteHandler,
} from '@keystatic/core/api/generic';

export function makeRouteHandler(_config: APIRouteConfig) {
  const handler = makeGenericAPIRouteHandler(_config, {
    slugEnvName: 'NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG',
  });
  async function wrappedHandler(request: Request) {
    const url = new URL(request.url);
    // next replaces 127.0.0.1 with localhost in the url or something like that
    if (url.hostname === 'localhost') {
      url.hostname = '127.0.0.1';
      request = new Request(url.toString(), request);
    }
    const { body, headers, status } = await handler(request);
    return new Response(body, { status, headers });
  }
  return { GET: wrappedHandler, POST: wrappedHandler };
}
