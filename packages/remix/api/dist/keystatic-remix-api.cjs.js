'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var generic = require('@keystatic/core/api/generic');

async function handleLoader(_config, args) {
  const handler = generic.makeGenericAPIRouteHandler(_config);
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

exports.handleLoader = handleLoader;
