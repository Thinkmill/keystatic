/** @jest-environment node */
import { expect, test, jest } from '@jest/globals';
import { executeBeforeHooks, executeAfterHooks, resolveHooks } from '../executor';
import { HookContext, AfterHookContext, BeforeHook, AfterHook, HooksConfig } from '../types';

function makeContext(overrides: Partial<HookContext> = {}): HookContext {
  return {
    event: 'beforeSave',
    trigger: 'event',
    collection: 'posts',
    slug: 'hello-world',
    data: { title: 'Hello World' },
    storage: { kind: 'local' },
    ...overrides,
  };
}

function makeAfterContext(overrides: Partial<AfterHookContext> = {}): AfterHookContext {
  return {
    ...makeContext({ event: 'afterSave' }),
    update: jest.fn<AfterHookContext['update']>().mockResolvedValue(undefined),
    ...overrides,
  };
}

test('executeBeforeHooks: returns proceed with original data when no hooks', async () => {
  const ctx = makeContext();
  const result = await executeBeforeHooks([], ctx);
  expect(result).toEqual({ proceed: true, data: { title: 'Hello World' } });
});

test('executeBeforeHooks: passes through when hook returns void', async () => {
  const hook: BeforeHook = async () => {};
  const ctx = makeContext();
  const result = await executeBeforeHooks([hook], ctx);
  expect(result).toEqual({ proceed: true, data: { title: 'Hello World' } });
});

test('executeBeforeHooks: cancels when hook returns cancel', async () => {
  const hook: BeforeHook = async () => ({ cancel: true, reason: 'Not allowed' });
  const ctx = makeContext();
  const result = await executeBeforeHooks([hook], ctx);
  expect(result).toEqual({ proceed: false, reason: 'Not allowed' });
});

test('executeBeforeHooks: stops at first cancellation', async () => {
  const hook1: BeforeHook = async () => ({ cancel: true, reason: 'First' });
  const hook2 = jest.fn<BeforeHook>();
  const ctx = makeContext();
  await executeBeforeHooks([hook1, hook2], ctx);
  expect(hook2).not.toHaveBeenCalled();
});

test('executeBeforeHooks: passes modified data to next hook', async () => {
  const hook1: BeforeHook = async () => ({ data: { title: 'Modified' } });
  const hook2 = jest.fn<BeforeHook>().mockResolvedValue(undefined);
  const ctx = makeContext();
  const result = await executeBeforeHooks([hook1, hook2], ctx);
  expect(hook2).toHaveBeenCalledWith(
    expect.objectContaining({ data: { title: 'Modified' } })
  );
  expect(result).toEqual({ proceed: true, data: { title: 'Modified' } });
});

test('executeBeforeHooks: runs hooks sequentially', async () => {
  const order: number[] = [];
  const hook1: BeforeHook = async () => { order.push(1); };
  const hook2: BeforeHook = async () => { order.push(2); };
  await executeBeforeHooks([hook1, hook2], makeContext());
  expect(order).toEqual([1, 2]);
});

test('executeAfterHooks: runs all hooks in parallel', async () => {
  const started: number[] = [];
  const finished: number[] = [];
  const hook1: AfterHook = async () => {
    started.push(1);
    await new Promise(r => setTimeout(r, 10));
    finished.push(1);
  };
  const hook2: AfterHook = async () => {
    started.push(2);
    await new Promise(r => setTimeout(r, 10));
    finished.push(2);
  };
  await executeAfterHooks([hook1, hook2], makeAfterContext());
  expect(started).toEqual([1, 2]);
  expect(finished.length).toBe(2);
});

test('executeAfterHooks: does not throw if one hook fails', async () => {
  const hook1: AfterHook = async () => { throw new Error('boom'); };
  const hook2 = jest.fn<AfterHook>().mockResolvedValue(undefined);
  await executeAfterHooks([hook1, hook2], makeAfterContext());
  expect(hook2).toHaveBeenCalled();
});

test('resolveHooks: merges global and resource hooks in order', () => {
  const globalHook: BeforeHook = async () => {};
  const resourceHook: BeforeHook = async () => {};
  const globalHooks: HooksConfig = { beforeSave: [globalHook] };
  const resourceHooks: HooksConfig = { beforeSave: [resourceHook] };
  const result = resolveHooks(globalHooks, resourceHooks, 'beforeSave');
  expect(result).toEqual([globalHook, resourceHook]);
});

test('resolveHooks: returns empty array when no hooks defined', () => {
  const result = resolveHooks(undefined, undefined, 'afterSave');
  expect(result).toEqual([]);
});

test('resolveHooks: handles only global hooks', () => {
  const hook: BeforeHook = async () => {};
  const result = resolveHooks({ beforeSave: [hook] }, undefined, 'beforeSave');
  expect(result).toEqual([hook]);
});

test('resolveHooks: handles only resource hooks', () => {
  const hook: BeforeHook = async () => {};
  const result = resolveHooks(undefined, { beforeSave: [hook] }, 'beforeSave');
  expect(result).toEqual([hook]);
});
