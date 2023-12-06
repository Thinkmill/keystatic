'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var generic = require('@keystatic/core/api/generic');
var utils = require('../../dist/utils-646f1413.cjs.js');
require('@keystatic/core/api/utils');
require('path');
require('fs/promises');
require('crypto');

function createPromiseWithResolver() {
  let resolve;
  let promise = new Promise(r => {
    resolve = r;
  });
  return {
    promise,
    resolve: resolve
  };
}
function createWatcher(watcher) {
  let state = 'init';
  let eventQueue = [];
  let promiseWithResolver = createPromiseWithResolver();
  let lastError = null;
  function emitEvent(event) {
    eventQueue.push(event);
    if (eventQueue.length === 1) {
      promiseWithResolver.resolve();
    }
  }
  return async () => {
    if (lastError) {
      let err = lastError;
      lastError = null;
      throw err;
    }
    if (state === 'init') {
      state = 'started';
      watcher.on('ready', () => {
        state = 'ready';
        emitEvent({
          type: 'ready'
        });
      });
      for (const eventName of ['add', 'change', 'unlink']) {
        watcher.on(eventName, path => {
          if (state !== 'ready') return;
          emitEvent({
            type: eventName,
            path
          });
        });
      }
      watcher.on('error', err => {
        lastError = err;
      });
    }
    if (eventQueue.length === 0) {
      await promiseWithResolver.promise;
    }
    const currentEventQueue = eventQueue;
    eventQueue = [];
    promiseWithResolver = createPromiseWithResolver();
    return currentEventQueue;
  };
}

function makeAPIRouteHandler(_config) {
  const handler = generic.makeGenericAPIRouteHandler(_config, {
    slugEnvName: 'NEXT_PUBLIC_KEYSTATIC_GITHUB_APP_SLUG'
  });
  return async function keystaticAPIRoute(req, res) {
    const host = req.headers['x-forwarded-host'] || req.headers['host'];
    const proto = req.headers['x-forwarded-proto'] || (req.socket.encrypted ? 'https' : 'http');
    const parsedUrl = new URL(`${proto}://${host}${req.url}`);
    if (parsedUrl.pathname.startsWith('/api/keystatic/reader-refresh/') && process.env.NODE_ENV === 'development') {
      const key = parsedUrl.pathname.slice('/api/keystatic/reader-refresh/'.length);
      if (process.env.NODE_ENV !== 'development') {
        return new Response(null, {
          status: 404
        });
      }
      const directories = utils.getResolvedDirectories(_config.config, _config.localBaseDirectory || '');
      const readerKey = await utils.getReaderKey(directories);
      if (key !== readerKey) {
        res.status(200).send(readerKey);
        return;
      }
      const a = require;
      const b = 'chokidar';
      const {
        watch
      } = a(b);
      const watcher = watch(directories, {
        ignored: [/node_modules/]
      });
      const waitForNextEvent = createWatcher(watcher);
      try {
        while (true) {
          await waitForNextEvent();
          const readerKey = await utils.getReaderKey(directories);
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
    const {
      body,
      headers,
      status
    } = await handler({
      headers: {
        get(name) {
          const val = req.headers[name];
          if (Array.isArray(val)) {
            return val[0];
          }
          return val !== null && val !== void 0 ? val : null;
        }
      },
      json: async () => req.body,
      method: req.method,
      url: parsedUrl.toString()
    });
    if (headers) {
      if (Array.isArray(headers)) {
        const headersInADifferentStructure = new Map();
        for (const [key, value] of headers) {
          if (!headersInADifferentStructure.has(key)) {
            headersInADifferentStructure.set(key, []);
          }
          headersInADifferentStructure.get(key).push(value);
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
    res.status(status !== null && status !== void 0 ? status : 200).send(body);
  };
}

exports.makeAPIRouteHandler = makeAPIRouteHandler;
