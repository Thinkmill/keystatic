import { useCallback } from 'react';
import { useConfig } from './shell/context';
import { toastQueue } from '@keystar/ui/toast';
import {
  executeBeforeHooks,
  executeAfterHooks,
  resolveHooks,
  buildHookContext,
  buildAfterHookContext,
  getHooks,
  getGlobalHooks,
} from '../hooks';
import type { HookEvent, BeforeHook, AfterHook, StorageInfo } from '../hooks';

type ExecuteHooksParams = {
  event: HookEvent;
  collection?: string;
  singleton?: string;
  slug?: string;
  data: Record<string, unknown>;
  previousData?: Record<string, unknown>;
  update?: (data: Partial<Record<string, unknown>>) => Promise<void>;
};

const eventLabels: Record<HookEvent, string> = {
  beforeCreate: 'Before create',
  afterCreate: 'After create',
  beforeSave: 'Before save',
  afterSave: 'After save',
  beforeDelete: 'Before delete',
  afterDelete: 'After delete',
};

export function useHookExecutor() {
  const config = useConfig();
  const storageInfo: StorageInfo = { kind: config.storage.kind };

  const executeBefore = useCallback(
    async (params: ExecuteHooksParams) => {
      const resourceHooks = getHooks(params.collection, params.singleton);
      const globalHooks = getGlobalHooks();
      const hooks = resolveHooks(globalHooks, resourceHooks, params.event) as BeforeHook[];
      if (hooks.length === 0) return { proceed: true as const, data: params.data };

      const ctx = buildHookContext({
        event: params.event,
        collection: params.collection,
        singleton: params.singleton,
        slug: params.slug,
        data: params.data,
        previousData: params.previousData,
        storage: storageInfo,
      });

      const result = await executeBeforeHooks(hooks, ctx);

      if (!result.proceed && result.reason) {
        toastQueue.critical(result.reason, { timeout: 5000 });
      }

      return result;
    },
    [storageInfo]
  );

  const executeAfter = useCallback(
    async (params: ExecuteHooksParams) => {
      const resourceHooks = getHooks(params.collection, params.singleton);
      const globalHooks = getGlobalHooks();
      const hooks = resolveHooks(globalHooks, resourceHooks, params.event) as AfterHook[];
      if (hooks.length === 0) return;

      const label = eventLabels[params.event];
      toastQueue.info(`${label} hooks running…`, { timeout: 3000 });

      const noopUpdate = async () => {};
      const ctx = buildAfterHookContext({
        event: params.event,
        collection: params.collection,
        singleton: params.singleton,
        slug: params.slug,
        data: params.data,
        previousData: params.previousData,
        storage: storageInfo,
        update: params.update ?? noopUpdate,
      });

      await executeAfterHooks(hooks, ctx);
    },
    [storageInfo]
  );

  return { executeBefore, executeAfter };
}
