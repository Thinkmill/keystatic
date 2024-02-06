import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { Awareness } from 'y-protocols/awareness';
import * as Y from 'yjs';

import { WebsocketProvider } from './websocket-provider';
import { getAuth } from '../auth';
import { useRouter } from '../router';
import { useBranchInfo, useCloudInfo } from './data';
import { Config } from '../..';
import ReconnectingWebSocket from 'partysocket/ws';
import * as decoding from 'lib0/decoding';

const YjsContext = createContext<
  | {
      doc: Y.Doc;
      data: Y.Map<Y.Doc>;
      awareness: Awareness;
      provider: WebsocketProvider;
    }
  | 'loading'
  | null
>(null);

const messageSync = 0;
const messageAwareness = 1;
const messageAuth = 2;
const messageSyncSubdoc = 4;

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

export function CollabProvider(props: { children: ReactNode; config: Config }) {
  const branchInfo = useBranchInfo();
  const router = useRouter();
  const cloudInfo = useCloudInfo();
  const yJsInfo = useMemo(() => {
    if (!cloudInfo?.team.multiplayer) return;
    const doc = new Y.Doc();
    const data = doc.getMap<Y.Doc>('data');
    const awareness = new Awareness(doc);
    const provider = new WebsocketProvider({
      doc,
      url: true
        ? `wss://live.keystatic.cloud/${props.config.cloud?.project}`
        : `ws://localhost:8787/${props.config.cloud?.project}`,
      WebSocketPolyfill: class extends ReconnectingWebSocket {
        constructor(url: string) {
          super(url);

          this.addEventListener('message', event => {
            if (event.data instanceof ArrayBuffer) {
              console.log('recv', decodeMessage(new Uint8Array(event.data)));
            }
          });
        }
        send(data: string | ArrayBuffer | Blob | ArrayBufferView) {
          if (data instanceof Uint8Array) {
            console.log('send', decodeSentMessage(data));
          }
          super.send(data);
        }
      } as any,
      awareness,
      authToken: async () =>
        getAuth(props.config).then(auth => auth?.accessToken ?? ''),
    });
    return { doc, awareness, provider, data };
  }, [cloudInfo?.team.multiplayer, props.config]);

  useEffect(() => {
    yJsInfo?.awareness.setLocalStateField('branch', branchInfo.currentBranch);
    yJsInfo?.awareness.setLocalStateField(
      'location',
      router.params.slice(2).join('/')
    );
  }, [branchInfo.currentBranch, router.params, yJsInfo?.awareness]);

  const hasRepo = branchInfo.currentBranch;
  useEffect(() => {
    if (hasRepo && yJsInfo) {
      yJsInfo.provider.connect();
      return () => {
        yJsInfo.provider.disconnect();
      };
    }
  }, [yJsInfo, hasRepo]);

  return (
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
  );
}
