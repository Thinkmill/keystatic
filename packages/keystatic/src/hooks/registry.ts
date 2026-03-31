import type { Action, HooksConfig } from './types';

type ResourceKey = string; // "collection:posts" or "singleton:settings"

const actionsRegistry = new Map<ResourceKey, Action[]>();
const hooksRegistry = new Map<ResourceKey, HooksConfig>();
const globalHooks: { config?: HooksConfig } = {};

function resourceKey(
  collection?: string,
  singleton?: string
): ResourceKey | undefined {
  if (collection) return `collection:${collection}`;
  if (singleton) return `singleton:${singleton}`;
  return undefined;
}

export function registerActions(
  resource: { collection?: string; singleton?: string },
  actions: Action[]
) {
  const key = resourceKey(resource.collection, resource.singleton);
  if (key) actionsRegistry.set(key, actions);
}

export function registerHooks(
  resource: { collection?: string; singleton?: string },
  hooks: HooksConfig
) {
  const key = resourceKey(resource.collection, resource.singleton);
  if (key) hooksRegistry.set(key, hooks);
}

export function registerGlobalHooks(hooks: HooksConfig) {
  globalHooks.config = hooks;
}

export function getActions(
  collection?: string,
  singleton?: string
): Action[] {
  const key = resourceKey(collection, singleton);
  if (!key) return [];
  return actionsRegistry.get(key) ?? [];
}

export function getHooks(
  collection?: string,
  singleton?: string
): HooksConfig | undefined {
  const key = resourceKey(collection, singleton);
  if (!key) return undefined;
  return hooksRegistry.get(key);
}

export function getGlobalHooks(): HooksConfig | undefined {
  return globalHooks.config;
}
