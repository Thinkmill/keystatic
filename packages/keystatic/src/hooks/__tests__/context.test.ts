/** @jest-environment node */
import { expect, test, jest } from '@jest/globals';
import { buildHookContext, buildAfterHookContext, buildActionContext } from '../context';

test('buildHookContext: creates context for collection save', () => {
  const ctx = buildHookContext({
    event: 'afterSave',
    collection: 'posts',
    slug: 'hello',
    data: { title: 'Hello' },
    storage: { kind: 'local' },
  });
  expect(ctx.event).toBe('afterSave');
  expect(ctx.trigger).toBe('event');
  expect(ctx.collection).toBe('posts');
  expect(ctx.slug).toBe('hello');
  expect(ctx.data).toEqual({ title: 'Hello' });
  expect(ctx.storage).toEqual({ kind: 'local' });
  expect(ctx.singleton).toBeUndefined();
});

test('buildHookContext: creates context for singleton save', () => {
  const ctx = buildHookContext({
    event: 'beforeSave',
    singleton: 'settings',
    data: { siteName: 'My Site' },
    storage: { kind: 'github' },
  });
  expect(ctx.singleton).toBe('settings');
  expect(ctx.collection).toBeUndefined();
  expect(ctx.slug).toBeUndefined();
});

test('buildHookContext: includes previousData when provided', () => {
  const ctx = buildHookContext({
    event: 'beforeSave',
    collection: 'posts',
    slug: 'hello',
    data: { title: 'Updated' },
    previousData: { title: 'Original' },
    storage: { kind: 'local' },
  });
  expect(ctx.previousData).toEqual({ title: 'Original' });
});

test('buildAfterHookContext: includes update function', () => {
  const updateFn = jest.fn<(data: Partial<Record<string, unknown>>) => Promise<void>>();
  const ctx = buildAfterHookContext({
    event: 'afterSave',
    collection: 'posts',
    slug: 'hello',
    data: { title: 'Hello' },
    storage: { kind: 'local' },
    update: updateFn,
  });
  expect(ctx.update).toBe(updateFn);
  expect(ctx.trigger).toBe('event');
});

test('buildActionContext: creates manual trigger context with update fn', () => {
  const updateFn = jest.fn<(data: Partial<Record<string, unknown>>) => Promise<void>>();
  const ctx = buildActionContext({
    collection: 'posts',
    slug: 'hello',
    data: { title: 'Hello' },
    storage: { kind: 'local' },
    update: updateFn,
  });
  expect(ctx.trigger).toBe('manual');
  expect(ctx.collection).toBe('posts');
  expect(ctx.update).toBe(updateFn);
});
