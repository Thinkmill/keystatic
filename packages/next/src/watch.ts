import type { FSWatcher } from 'chokidar';

type WatcherEvent =
  | { type: 'add' | 'unlink' | 'change'; path: string }
  | { type: 'ready' };

function createPromiseWithResolver<T>() {
  let resolve: undefined | ((value: T) => void);

  let promise = new Promise((r: (value: T) => void) => {
    resolve = r;
  });

  return { promise, resolve: resolve! };
}

export function createWatcher(watcher: FSWatcher) {
  let state: 'init' | 'started' | 'ready' = 'init';
  let eventQueue: WatcherEvent[] = [];
  let promiseWithResolver = createPromiseWithResolver<void>();
  let lastError: Error | null = null;
  function emitEvent(event: WatcherEvent) {
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
        emitEvent({ type: 'ready' });
      });

      for (const eventName of ['add', 'change', 'unlink'] as const) {
        watcher.on(eventName, path => {
          if (state !== 'ready') return;
          emitEvent({ type: eventName, path });
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
