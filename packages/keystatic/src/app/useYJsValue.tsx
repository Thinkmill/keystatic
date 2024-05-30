import { useMemo, useSyncExternalStore } from 'react';
import { ComponentSchema } from '../form/api';
import * as Y from 'yjs';
import { useYjs } from './shell/collab';
import { yjsToVal } from '../form/yjs-props-value';

export function useYJsValue(
  schema: ComponentSchema,
  type: Y.AbstractType<any>
): unknown {
  const yjsInfo = useYjs();
  const thing = useMemo(() => {
    let lastVal = yjsToVal(schema, yjsInfo.awareness, type);
    return {
      getSnapshot: () => lastVal,
      subscribe: (cb: () => void) => {
        const handler = () => {
          lastVal = yjsToVal(schema, yjsInfo.awareness, type);
          cb();
        };
        type.observeDeep(handler);
        return () => {
          type.unobserveDeep(handler);
        };
      },
    };
  }, [schema, type, yjsInfo.awareness]);
  return useSyncExternalStore(
    thing.subscribe,
    thing.getSnapshot,
    thing.getSnapshot
  );
}
