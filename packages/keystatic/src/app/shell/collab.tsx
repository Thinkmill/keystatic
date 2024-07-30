import {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from 'react';
import { Awareness } from 'y-protocols/awareness';
import * as Y from 'yjs';
import {
  createIndexedDBProvider,
  IndexedDBProvider,
} from '@toeverything/y-indexeddb';

import { WebsocketProvider } from './websocket-provider';
import { getAuth } from '../auth';
import { useRouter } from '../router';
import { useCloudInfo, useCurrentBranch } from './data';
import { Config } from '../..';
import ReconnectingWebSocket from 'partysocket/ws';
import * as decoding from 'lib0/decoding';
import { PKG_VERSION } from '../utils';
import { createEncoder, toUint8Array, writeVarUint } from 'lib0/encoding.js';

const YjsContext = createContext<
  | {
      doc: Y.Doc;
      data: Y.Map<Y.Doc>;
      awareness: Awareness;
      provider: WebsocketProvider;
      idb: IndexedDBProvider;
    }
  | 'loading'
  | null
>(null);

const messageSync = 0;
const messageAwareness = 1;
const messageAuth = 2;
const messageSyncSubdoc = 4;
const messageChunkStart = 5;

function decodeSentMessage(message: Uint8Array) {
  const decoder = decoding.createDecoder(message);
  const messageType = decoding.readVarUint(decoder);
  switch (messageType) {
    case messageSync: {
      return { kind: 'sync' as const };
    }
    case messageSyncSubdoc: {
      return { kind: 'sync-subdoc' as const };
    }
    case messageAwareness: {
      const awarenessUpdate = decoding.readVarUint8Array(decoder);
      const states = [];
      {
        const decoder = decoding.createDecoder(awarenessUpdate);
        const len = decoding.readVarUint(decoder);
        for (let i = 0; i < len; i++) {
          const clientID = decoding.readVarUint(decoder);
          let clock = decoding.readVarUint(decoder);
          const state = JSON.parse(decoding.readVarString(decoder));
          states.push({ clientID, clock, state });
        }
      }
      return { kind: 'awareness' as const, states };
    }
    case messageAuth: {
      return { kind: 'auth' as const };
    }
  }
}

function decodeMessage(message: Uint8Array) {
  const decoder = decoding.createDecoder(message);
  const messageType = decoding.readVarUint(decoder);
  switch (messageType) {
    case messageSync: {
      return { kind: 'sync' as const };
    }
    case messageSyncSubdoc: {
      return { kind: 'sync-subdoc' as const };
    }
    case messageAwareness: {
      const awarenessUpdate = decoding.readVarUint8Array(decoder);
      const states = [];
      {
        const decoder = decoding.createDecoder(awarenessUpdate);
        const len = decoding.readVarUint(decoder);
        for (let i = 0; i < len; i++) {
          const clientID = decoding.readVarUint(decoder);
          let clock = decoding.readVarUint(decoder);
          const state = JSON.parse(decoding.readVarString(decoder));
          states.push({ clientID, clock, state });
        }
      }
      return { kind: 'awareness' as const, states };
    }
    case messageAuth: {
      return { kind: 'auth' as const };
    }
  }
}

export function useYjs() {
  const yjs = useContext(YjsContext);
  if (!yjs) {
    throw new Error('CollabProvider not found');
  }
  if (yjs === 'loading') {
    throw new Error('CollabProvider is loading');
  }
  return yjs;
}

export function useYjsIfAvailable() {
  return useContext(YjsContext);
}

const enableMessageLogging = false;

const emptyMap = new Map();
const AwarenessContext =
  createContext<Map<number, Record<string, any>>>(emptyMap);

export function useAwarenessStates() {
  return useContext(AwarenessContext);
}

const currentAwarenesses = new WeakMap<
  Awareness,
  Map<number, Record<string, any>>
>();

export function CollabProvider(props: { children: ReactNode; config: Config }) {
  const router = useRouter();
  const cloudInfo = useCloudInfo();
  const project = props.config.cloud?.project;
  const key = `ks-multiplayer-${project}`;
  const isMultiplayerEnabled =
    cloudInfo === null
      ? localStorage.getItem(key) === 'true'
      : cloudInfo.team.multiplayer;
  const yJsInfo = useMemo(() => {
    // we'll optimistically connect to the websocket if multiplayer was enabled last time

    if (!isMultiplayerEnabled) {
      return;
    }

    const doc = new Y.Doc();
    const data = doc.getMap<Y.Doc>('data');
    const awareness = new Awareness(doc);
    const idb = createIndexedDBProvider(doc, `keystatic-2-${project}`);
    const provider = new WebsocketProvider({
      doc,
      url: `wss://live.keystatic.cloud/${project}?v=${PKG_VERSION}`,
      WebSocketPolyfill: class extends ReconnectingWebSocket {
        constructor(url: string) {
          super(url);

          this.addEventListener('message', event => {
            if (event.data instanceof ArrayBuffer && enableMessageLogging) {
              console.log('recv', decodeMessage(new Uint8Array(event.data)));
            }
          });
        }
        send(data: string | ArrayBuffer | Blob | ArrayBufferView) {
          if (data instanceof Uint8Array && enableMessageLogging) {
            console.log('send', decodeSentMessage(data));
          }
          const CHUNK_MAX_SIZE = 1_000_000;

          if (data instanceof Uint8Array && data.byteLength > CHUNK_MAX_SIZE) {
            const chunks = Math.ceil(data.byteLength / CHUNK_MAX_SIZE);
            const encoder = createEncoder();
            writeVarUint(encoder, messageChunkStart);
            writeVarUint(encoder, chunks);
            super.send(toUint8Array(encoder));
            for (let i = 0; i < chunks; i++) {
              const start = i * CHUNK_MAX_SIZE;
              const end = Math.min((i + 1) * CHUNK_MAX_SIZE, data.byteLength);
              super.send(data.slice(start, end));
            }
            return;
          }

          super.send(data);
        }
      } as any,
      awareness,
      authToken: async () =>
        getAuth(props.config).then(auth => auth?.accessToken ?? ''),
    });
    return { doc, awareness, provider, data, idb };
  }, [isMultiplayerEnabled, project, props.config]);

  const currentBranch = useCurrentBranch();

  useEffect(() => {
    yJsInfo?.awareness.setLocalStateField('branch', currentBranch);
    yJsInfo?.awareness.setLocalStateField(
      'location',
      router.params.slice(2).join('/')
    );
  }, [currentBranch, router.params, yJsInfo?.awareness]);

  const hasRepo = !!currentBranch;
  useEffect(() => {
    if (hasRepo && yJsInfo) {
      yJsInfo.idb.connect();
      let didConnectToWS = false;
      const remove = yJsInfo.idb.subscribeStatusChange(() => {
        if (
          yJsInfo.idb.status.type === 'synced' ||
          yJsInfo.idb.status.type === 'error'
        ) {
          remove();
          yJsInfo.provider.connect();
          didConnectToWS = true;
        }
      });
      return () => {
        yJsInfo.idb.disconnect();
        if (didConnectToWS) {
          yJsInfo.provider.disconnect();
        } else {
          remove();
        }
      };
    }
  }, [yJsInfo, hasRepo]);

  useEffect(() => {
    if (cloudInfo === null) return;
    const key = `ks-multiplayer-${project}`;
    if (cloudInfo.team.multiplayer) {
      localStorage.setItem(key, 'true');
    } else {
      localStorage.removeItem(key);
    }
  }, [cloudInfo, project]);

  const awarenessStates = useSyncExternalStore(
    useCallback(
      onStoreChange => {
        const awareness = yJsInfo?.awareness;
        if (!awareness) return () => {};
        const fn = () => {
          currentAwarenesses.set(awareness, new Map(awareness.getStates()));
          onStoreChange();
        };
        awareness.on('change', fn);
        return () => {
          currentAwarenesses.set(awareness, new Map(awareness.getStates()));
          awareness.off('change', fn);
        };
      },
      [yJsInfo]
    ),
    () => {
      if (!yJsInfo?.awareness) return emptyMap;
      return currentAwarenesses.get(yJsInfo.awareness) ?? emptyMap;
    }
  );

  return (
    <AwarenessContext.Provider value={awarenessStates ?? emptyMap}>
      <YjsContext.Provider
        value={
          yJsInfo === undefined
            ? cloudInfo === undefined
              ? 'loading'
              : null
            : yJsInfo
        }
      >
        {props.children}
      </YjsContext.Provider>
    </AwarenessContext.Provider>
  );
}
