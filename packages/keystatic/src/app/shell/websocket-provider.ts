import * as Y from 'yjs';
import * as bc from 'lib0/broadcastchannel';
import * as time from 'lib0/time';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import * as syncProtocol from 'y-protocols/sync';
import * as authProtocol from 'y-protocols/auth';
import * as awarenessProtocol from 'y-protocols/awareness';
import * as mutex from 'lib0/mutex';
import * as math from 'lib0/math';
import weakMemoize from '@emotion/weak-memoize';

const messageSync = 0;
const messageQueryAwareness = 3;
const messageAwareness = 1;
const messageAuth = 2;
const messageSubDocSync = 4;

const messageHandlers: Array<
  (
    encoder: encoding.Encoder,
    decoder: decoding.Decoder,
    provider: WebsocketProvider,
    emitSynced: boolean,
    messageType: number
  ) => void
> = [];

messageHandlers[messageSync] = (encoder, decoder, provider, emitSynced) => {
  encoding.writeVarUint(encoder, messageSync);
  const syncMessageType = syncProtocol.readSyncMessage(
    decoder,
    encoder,
    provider.doc,
    provider
  );
  if (
    emitSynced &&
    syncMessageType === syncProtocol.messageYjsSyncStep2 &&
    !provider.synced
  ) {
    provider.synced = true;
  }
};

messageHandlers[messageQueryAwareness] = (encoder, decoder, provider) => {
  encoding.writeVarUint(encoder, messageAwareness);
  encoding.writeVarUint8Array(
    encoder,
    awarenessProtocol.encodeAwarenessUpdate(
      provider.awareness,
      Array.from(provider.awareness.getStates().keys())
    )
  );
};

messageHandlers[messageAwareness] = (encoder, decoder, provider) => {
  awarenessProtocol.applyAwarenessUpdate(
    provider.awareness,
    decoding.readVarUint8Array(decoder),
    provider
  );
};

messageHandlers[messageAuth] = (encoder, decoder, provider) => {
  authProtocol.readAuthMessage(decoder, provider.doc, permissionDeniedHandler);
};

messageHandlers[messageSubDocSync] = (
  encoder,
  decoder,
  provider,
  emitSynced
) => {
  const subDocID = decoding.readVarString(decoder);
  encoding.writeVarUint(encoder, messageSync);
  const subDoc = provider.getSubDoc(subDocID);
  if (subDoc) {
    const syncMessageType = syncProtocol.readSyncMessage(
      decoder,
      encoder,
      subDoc,
      provider
    );
    if (emitSynced && syncMessageType === syncProtocol.messageYjsSyncStep2) {
      subDoc.emit('sync', [true]);
    }
  }
};

const reconnectTimeoutBase = 1200;
const maxReconnectTimeout = 2500;
// @todo - this should depend on awareness.outdatedTime
const messageReconnectTimeout = 30000;

const permissionDeniedHandler = (provider: WebsocketProvider, reason: string) =>
  console.warn(`Permission denied to access ${provider.url}.\n${reason}`);

const readMessage = (
  provider: WebsocketProvider,
  buf: Uint8Array,
  emitSynced: boolean
): encoding.Encoder => {
  const decoder = decoding.createDecoder(buf);
  const encoder = encoding.createEncoder();
  const messageType = decoding.readVarUint(decoder);
  const messageHandler = messageHandlers[messageType];
  if (messageHandler) {
    messageHandler(encoder, decoder, provider, emitSynced, messageType);
  } else {
    console.error('Unable to compute message');
  }
  return encoder;
};

const setupWS = (provider: WebsocketProvider, WS: typeof WebSocket) => {
  if (provider.shouldConnect && provider.ws === null) {
    const websocket = new WS(provider.url);
    websocket.binaryType = 'arraybuffer';
    provider.ws = websocket;
    provider.wsconnecting = true;
    provider.wsconnected = false;
    provider.synced = false;

    let authState:
      | { kind: 'authed' }
      | { kind: 'authenticating'; queue: Uint8Array[] } = {
      kind: 'authenticating',
      queue: [],
    };

    websocket.onmessage = event => {
      provider.wsLastMessageReceived = time.getUnixTime();
      const bytes = new Uint8Array(event.data);
      if (authState.kind === 'authenticating') {
        const decoder = decoding.createDecoder(bytes);
        const messageType = decoding.readVarInt(decoder);
        if (messageType === messageAuth) {
          const authMessageType = decoding.readVarInt(decoder);
          if (authMessageType === 2) {
            const queue = authState.queue;
            authState = { kind: 'authed' };
            provider.onConnect(websocket);
            for (const queued of queue) {
              const encoder = readMessage(provider, queued, true);
              if (encoding.length(encoder) > 1) {
                websocket.send(encoding.toUint8Array(encoder));
              }
            }
            return;
          }
        }
        authState.queue.push(bytes);
      } else {
        const encoder = readMessage(provider, bytes, true);
        if (encoding.length(encoder) > 1) {
          websocket.send(encoding.toUint8Array(encoder));
        }
      }
    };
    websocket.onclose = () => {
      provider.ws = null;
      provider.wsconnecting = false;
      if (provider.wsconnected) {
        provider.wsconnected = false;
        provider.synced = false;
        // update awareness (all users except local left)
        awarenessProtocol.removeAwarenessStates(
          provider.awareness,
          Array.from(provider.awareness.getStates().keys()).filter(
            client => client !== provider.doc.clientID
          ),
          provider
        );
        provider.onStatus({ status: 'disconnected' });
      } else {
        provider.wsUnsuccessfulReconnects++;
      }
      // Start with no reconnect timeout and increase timeout by
      // log10(wsUnsuccessfulReconnects).
      // The idea is to increase reconnect timeout slowly and have no reconnect
      // timeout at the beginning (log(1) = 0)
      setTimeout(
        setupWS,
        math.min(
          math.log10(provider.wsUnsuccessfulReconnects + 1) *
            reconnectTimeoutBase,
          maxReconnectTimeout
        ),
        provider
      );
    };
    websocket.onopen = async () => {
      provider.wsLastMessageReceived = time.getUnixTime();
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageAuth);
      encoding.writeVarUint(encoder, 0);
      encoding.writeVarString(encoder, await provider.authToken());
      websocket.send(encoding.toUint8Array(encoder));
    };

    provider.onStatus({ status: 'connecting' });
  }
};

const broadcastMessage = (provider: WebsocketProvider, buf: ArrayBuffer) => {
  if (provider.ws && provider.wsconnected) {
    provider.ws?.send(buf);
  }
  if (provider.bcconnected) {
    provider.mux(() => {
      bc.publish(provider.bcChannel, buf);
    });
  }
};

export class WebsocketProvider {
  bcChannel: string;
  url: string;
  doc: Y.Doc;
  #WS: typeof WebSocket;
  awareness: awarenessProtocol.Awareness;
  wsconnected: boolean;
  wsconnecting: boolean;
  bcconnected: boolean;
  wsUnsuccessfulReconnects: number;
  mux: mutex.mutex;
  #synced: boolean;
  ws: WebSocket | null;
  wsLastMessageReceived: number;
  shouldConnect: boolean;
  subdocs: Map<string, Y.Doc>;
  #resyncInterval: ReturnType<typeof setInterval> | null;
  #checkInterval: ReturnType<typeof setInterval>;
  onStatus: (status: {
    status: 'connected' | 'connecting' | 'disconnected';
  }) => void;
  authToken: () => Promise<string>;
  onSynced: (synced: boolean) => void;
  constructor(opts: {
    url: string;
    doc: Y.Doc;
    awareness: awarenessProtocol.Awareness;
    resyncInterval?: number;
    WebSocketPolyfill?: typeof WebSocket;
    authToken: () => Promise<string>;
    onStatus?(status: {
      status: 'connected' | 'connecting' | 'disconnected';
    }): void;
    onSynced?(synced: boolean): void;
  }) {
    this.bcChannel = opts.url;
    this.url = opts.url;
    this.doc = opts.doc;
    this.#WS = opts.WebSocketPolyfill ?? WebSocket;
    this.awareness = opts.awareness;
    this.wsconnected = false;
    this.wsconnecting = false;
    this.bcconnected = false;
    this.wsUnsuccessfulReconnects = 0;
    this.mux = mutex.createMutex();
    this.#synced = false;
    this.authToken = opts.authToken;
    this.ws = null;
    this.wsLastMessageReceived = 0;

    this.onStatus = opts.onStatus ?? (() => {});
    this.onSynced = opts.onSynced ?? (() => {});
    this.shouldConnect = false;

    this.subdocs = new Map();

    this.#resyncInterval = null;
    if (opts.resyncInterval !== undefined && opts.resyncInterval > 0) {
      this.#resyncInterval = setInterval(() => {
        if (this.ws) {
          // resend sync step 1
          const encoder = encoding.createEncoder();
          encoding.writeVarUint(encoder, messageSync);
          syncProtocol.writeSyncStep1(encoder, opts.doc);
          this.ws.send(encoding.toUint8Array(encoder));
        }
      }, opts.resyncInterval);
    }

    this.doc.on(
      'subdocs',
      ({
        added,
        removed,
        loaded,
      }: {
        added: Y.Doc[];
        removed: Y.Doc[];
        loaded: Y.Doc[];
      }) => {
        added.forEach(subdoc => {
          this.subdocs.set(subdoc.guid, subdoc);
        });
        removed.forEach(subdoc => {
          subdoc.off('update', this.#getSubDocUpdateHandler(subdoc));
          this.subdocs.delete(subdoc.guid);
        });
        loaded.forEach(subdoc => {
          this.waitForConnection(() => {
            // always send sync step 1 when connected
            const encoder = encoding.createEncoder();
            encoding.writeVarUint(encoder, messageSubDocSync);
            encoding.writeVarString(encoder, subdoc.guid);
            syncProtocol.writeSyncStep1(encoder, subdoc);
            this.send(encoding.toUint8Array(encoder), () => {
              subdoc.on('update', this.#getSubDocUpdateHandler(subdoc));
            });
          }, 1000);
        });
      }
    );

    this.doc.on('update', this.#updateHandler);

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', this.#beforeUnloadHandler);
    }
    opts.awareness.on('update', this.#awarenessUpdateHandler);
    this.#checkInterval = setInterval(() => {
      if (
        this.wsconnected &&
        messageReconnectTimeout <
          time.getUnixTime() - this.wsLastMessageReceived
      ) {
        // no message received in a long time - not even your own awareness
        // updates (which are updated every 15 seconds)
        this.ws?.close();
      }
    }, messageReconnectTimeout / 10);
  }

  onConnect(ws: WebSocket) {
    this.wsconnecting = false;
    this.wsconnected = true;
    this.wsUnsuccessfulReconnects = 0;
    this.onStatus({ status: 'connected' });
    // always send sync step 1 when connected
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    syncProtocol.writeSyncStep1(encoder, this.doc);
    ws.send(encoding.toUint8Array(encoder));
    // broadcast local awareness state
    if (this.awareness.getLocalState() !== null) {
      const encoderAwarenessState = encoding.createEncoder();
      encoding.writeVarUint(encoderAwarenessState, messageAwareness);
      encoding.writeVarUint8Array(
        encoderAwarenessState,
        awarenessProtocol.encodeAwarenessUpdate(this.awareness, [
          this.doc.clientID,
        ])
      );
      ws.send(encoding.toUint8Array(encoderAwarenessState));
    }
  }

  #bcSubscriber = (data: ArrayBuffer) => {
    this.mux(() => {
      const encoder = readMessage(this, new Uint8Array(data), false);
      if (encoding.length(encoder) > 1) {
        bc.publish(this.bcChannel, encoding.toUint8Array(encoder));
      }
    });
  };

  #beforeUnloadHandler = () => {
    awarenessProtocol.removeAwarenessStates(
      this.awareness,
      [this.doc.clientID],
      'window unload'
    );
  };

  waitForConnection = (callback: (ws: WebSocket) => void, interval: number) => {
    const ws = this.ws;
    if (ws?.readyState === 1) {
      callback(ws);
    } else {
      setTimeout(() => {
        this.waitForConnection(callback, interval);
      }, interval);
    }
  };

  #awarenessUpdateHandler = ({
    added,
    updated,
    removed,
  }: {
    added: number[];
    updated: number[];
    removed: number[];
  }) => {
    const changedClients = added.concat(updated).concat(removed);
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageAwareness);
    encoding.writeVarUint8Array(
      encoder,
      awarenessProtocol.encodeAwarenessUpdate(this.awareness, changedClients)
    );
    broadcastMessage(this, encoding.toUint8Array(encoder));
  };

  send = (message: ArrayBuffer | ArrayBufferView, callback?: () => void) => {
    this.waitForConnection(ws => {
      ws.send(message);
      if (typeof callback !== 'undefined') {
        callback();
      }
    }, 1000);
  };

  get synced() {
    return this.#synced;
  }

  getSubDoc(id: string) {
    return this.subdocs.get(id);
  }

  set synced(state) {
    if (this.#synced !== state) {
      this.#synced = state;
      this.onSynced(state);
      this.doc.emit('sync', [state]);
    }
  }

  #getSubDocUpdateHandler = weakMemoize(
    (subDoc: Y.Doc) => (update: Uint8Array) => {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageSubDocSync);
      encoding.writeVarString(encoder, subDoc.guid);
      syncProtocol.writeUpdate(encoder, update);
      broadcastMessage(this, encoding.toUint8Array(encoder));
    }
  );

  #updateHandler = (update: Uint8Array, origin: any) => {
    if (origin !== this) {
      const encoder = encoding.createEncoder();
      encoding.writeVarUint(encoder, messageSync);
      syncProtocol.writeUpdate(encoder, update);
      broadcastMessage(this, encoding.toUint8Array(encoder));
    }
  };

  destroy() {
    if (this.#resyncInterval !== null) {
      clearInterval(this.#resyncInterval);
    }
    clearInterval(this.#checkInterval);
    this.disconnect();
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', this.#beforeUnloadHandler);
    }
    this.awareness.off('update', this.#awarenessUpdateHandler);
    this.doc.off('update', this.#updateHandler);
  }

  connectBc() {
    if (!this.bcconnected) {
      bc.subscribe(this.bcChannel, this.#bcSubscriber);
      this.bcconnected = true;
    }
    // send sync step1 to bc
    this.mux(() => {
      // write sync step 1
      const encoderSync = encoding.createEncoder();
      encoding.writeVarUint(encoderSync, messageSync);
      syncProtocol.writeSyncStep1(encoderSync, this.doc);
      bc.publish(this.bcChannel, encoding.toUint8Array(encoderSync));
      // broadcast local state
      const encoderState = encoding.createEncoder();
      encoding.writeVarUint(encoderState, messageSync);
      syncProtocol.writeSyncStep2(encoderState, this.doc);
      bc.publish(this.bcChannel, encoding.toUint8Array(encoderState));
      // write queryAwareness
      const encoderAwarenessQuery = encoding.createEncoder();
      encoding.writeVarUint(encoderAwarenessQuery, messageQueryAwareness);
      bc.publish(this.bcChannel, encoding.toUint8Array(encoderAwarenessQuery));
      // broadcast local awareness state
      const encoderAwarenessState = encoding.createEncoder();
      encoding.writeVarUint(encoderAwarenessState, messageAwareness);
      encoding.writeVarUint8Array(
        encoderAwarenessState,
        awarenessProtocol.encodeAwarenessUpdate(this.awareness, [
          this.doc.clientID,
        ])
      );
      bc.publish(this.bcChannel, encoding.toUint8Array(encoderAwarenessState));
    });
  }

  disconnectBc() {
    // broadcast message with local awareness state set to null (indicating disconnect)
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageAwareness);
    encoding.writeVarUint8Array(
      encoder,
      awarenessProtocol.encodeAwarenessUpdate(
        this.awareness,
        [this.doc.clientID],
        new Map()
      )
    );
    broadcastMessage(this, encoding.toUint8Array(encoder));
    if (this.bcconnected) {
      bc.unsubscribe(this.bcChannel, this.#bcSubscriber);
      this.bcconnected = false;
    }
  }

  disconnect() {
    this.shouldConnect = false;
    this.disconnectBc();
    if (this.ws !== null) {
      this.ws.close();
    }
  }

  connect() {
    this.shouldConnect = true;
    if (!this.wsconnected && this.ws === null) {
      setupWS(this, this.#WS);
      this.connectBc();
    }
  }
}
