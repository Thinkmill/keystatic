import {
  BeforeHook,
  AfterHook,
  HookContext,
  AfterHookContext,
  BeforeHookResult,
  HooksConfig,
  HookEvent,
} from './types';

type BeforeHooksResult =
  | { proceed: true; data: Record<string, unknown> }
  | { proceed: false; reason?: string };

export async function executeBeforeHooks(
  hooks: BeforeHook[],
  context: HookContext
): Promise<BeforeHooksResult> {
  let currentData = { ...context.data };

  for (const hook of hooks) {
    const result: BeforeHookResult | void = await hook({
      ...context,
      data: currentData,
    });

    if (result === undefined || result === null) {
      continue;
    }

    if ('cancel' in result && result.cancel) {
      return { proceed: false, reason: result.reason };
    }

    if ('data' in result) {
      currentData = { ...result.data };
    }
  }

  return { proceed: true, data: currentData };
}

export async function executeAfterHooks(
  hooks: AfterHook[],
  context: AfterHookContext
): Promise<void> {
  const results = hooks.map(hook =>
    hook(context).catch(err => {
      console.error('[keystatic] after hook failed:', err);
    })
  );
  await Promise.allSettled(results);
}

export function resolveHooks(
  globalHooks: HooksConfig | undefined,
  resourceHooks: HooksConfig | undefined,
  event: HookEvent
): BeforeHook[] | AfterHook[] {
  const global = globalHooks?.[event] ?? [];
  const resource = resourceHooks?.[event] ?? [];
  return [...global, ...resource];
}
