import { makeGenericAPIRouteHandler } from '@keystatic/core/api/generic';

async function handleLoader(_config, args) {
  const handler = makeGenericAPIRouteHandler(_config);
  const {
    body,
    headers,
    status
  } = await handler(args.request);
  return new Response(body, {
    headers,
    status
  });
}

export { handleLoader };
