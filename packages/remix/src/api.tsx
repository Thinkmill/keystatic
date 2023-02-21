import {
  APIRouteConfig,
  makeGenericAPIRouteHandler,
} from '@keystatic/core/api/generic';

export async function handleLoader(
  _config: APIRouteConfig,
  args: {
    request: Request;
    params: {
      readonly [key: string]: string | undefined;
    };
    context: Record<string, unknown>;
  }
) {
  const handler = makeGenericAPIRouteHandler(_config);
  const { body, headers, status } = await handler(args.request);

  return new Response(body, { headers, status });
}
