import type { NextApiRequest, NextApiResponse } from 'next';
import {
  APIRouteConfig,
  makeGenericAPIRouteHandler,
} from '@keystatic/core/api/generic';
import { createWatcher } from './watch';
import { getReaderKey, getResolvedDirectories } from './utils';

export function makeAPIRouteHandler(_config: APIRouteConfig) {
  const handler = makeGenericAPIRouteHandler(_config, {
    slugEnvName: 'NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG',
  });
  return async function keystaticAPIRoute(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    const host = req.headers['x-forwarded-host'] || req.headers['host'];
    const proto =
      req.headers['x-forwarded-proto'] ||
      ((req.socket as any).encrypted ? 'https' : 'http');
    const parsedUrl = new URL(`${proto}://${host}${req.url}`);
    if (
      parsedUrl.pathname.startsWith('/api/keystatic/reader-refresh/') &&
      process.env.NODE_ENV === 'development'
    ) {
      const key = parsedUrl.pathname.slice(
        '/api/keystatic/reader-refresh/'.length
      );
      if (process.env.NODE_ENV !== 'development') {
        return new Response(null, { status: 404 });
      }
      const directories = getResolvedDirectories(
        _config.config,
        _config.localBaseDirectory || ''
      );
      const readerKey = await getReaderKey(directories);
      if (key !== readerKey) {
        res.status(200).send(readerKey);
        return;
      }

      const a = require;

      const b = 'chokidar';

      const { watch } = a(b);

      const watcher = watch(directories, { ignored: [/node_modules/] });
      const waitForNextEvent = createWatcher(watcher);
      try {
        while (true) {
          await waitForNextEvent();
          const readerKey = await getReaderKey(directories);
          if (key !== readerKey) {
            res.status(200).send(readerKey);
            return;
          }
        }
      } catch {
        res.status(500).send(null);
        return;
      } finally {
        watcher.close();
      }
    }
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
      url: parsedUrl.toString(),
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
