import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';

function makeRouteHandler(_config) {
  const handler = makeGenericAPIRouteHandler(_config, {
    slugEnvName: 'NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG'
  });
  async function wrappedHandler(request) {
    const url = new URL(request.url);
    // next replaces 127.0.0.1 with localhost in the url or something like that
    if (url.hostname === 'localhost') {
      url.hostname = '127.0.0.1';
      request = new Request(url.toString(), request);
    }
    const {
      body,
      headers,
      status
    } = await handler(request);
    return new Response(body, {
      status,
      headers
    });
  }
  return {
    GET: wrappedHandler,
    POST: wrappedHandler
  };
}

export { makeRouteHandler };
