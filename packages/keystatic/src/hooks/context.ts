import {
  HookContext,
  AfterHookContext,
  ActionContext,
  HookEvent,
  StorageInfo,
} from './types';

export function buildHookContext(params: {
  event: HookEvent;
  collection?: string;
  singleton?: string;
  slug?: string;
  data: Record<string, unknown>;
  previousData?: Record<string, unknown>;
  storage: StorageInfo;
}): HookContext {
  return {
    event: params.event,
    trigger: 'event',
    collection: params.collection,
    singleton: params.singleton,
    slug: params.slug,
    data: params.data,
    previousData: params.previousData,
    storage: params.storage,
  };
}

export function buildAfterHookContext(
  params: Parameters<typeof buildHookContext>[0] & {
    update: (data: Partial<Record<string, unknown>>) => Promise<void>;
  }
): AfterHookContext {
  return {
    ...buildHookContext(params),
    update: params.update,
  };
}

export function buildActionContext(params: {
  collection?: string;
  singleton?: string;
  slug?: string;
  data: Record<string, unknown>;
  storage: StorageInfo;
  update: (data: Partial<Record<string, unknown>>) => Promise<void>;
}): ActionContext {
  return {
    trigger: 'manual',
    collection: params.collection,
    singleton: params.singleton,
    slug: params.slug,
    data: params.data,
    storage: params.storage,
    update: params.update,
  };
}
