/** @vitest-environment jsdom */
import { act, renderHook } from '@testing-library/react';
import { StrictMode } from 'react';
import { beforeEach, expect, test, vi } from 'vitest';

const staleToasts: { savedAt: Date; onRestore: () => void }[] = [];

vi.mock('./persistence', () => ({
  showDraftRestoredToast: vi.fn(),
  showStaleDraftToast: (savedAt: Date, onRestore: () => void) => {
    staleToasts.push({ savedAt, onRestore });
  },
}));

const { getAutomaticallyRestorableDraft, useStaleDraft } = await import(
  './utils'
);

beforeEach(() => {
  staleToasts.length = 0;
});

const draft = {
  state: { title: 'draft' },
  savedAt: new Date('2026-01-01'),
  treeKey: 'tree-a',
};

test('a draft saved against the current tree is restored automatically', () => {
  expect(getAutomaticallyRestorableDraft(draft, 'tree-a')).toBe(draft);
});

test('a draft saved against an older tree is not restored automatically', () => {
  expect(getAutomaticallyRestorableDraft(draft, 'tree-b')).toBeUndefined();
});

test('no draft means nothing to restore or keep', () => {
  const { result } = renderHook(() =>
    useStaleDraft(undefined, 'tree-a', false, () => {})
  );
  expect(result.current).toBe(false);
  expect(staleToasts).toHaveLength(0);
});

test('a current draft is not treated as stale', () => {
  const { result } = renderHook(() =>
    useStaleDraft(draft, 'tree-a', false, () => {})
  );
  expect(result.current).toBe(false);
  expect(staleToasts).toHaveLength(0);
});

test('a stale draft is kept and offered for restoring', () => {
  const restore = vi.fn();
  const { result } = renderHook(() =>
    useStaleDraft(draft, 'tree-b', false, restore)
  );
  expect(result.current).toBe(true);
  expect(staleToasts).toHaveLength(1);
  expect(staleToasts[0].savedAt).toBe(draft.savedAt);

  act(() => staleToasts[0].onRestore());
  expect(restore).toHaveBeenCalledWith(draft.state);
  expect(result.current).toBe(false);
});

test('a stale draft stops being kept once the user makes changes', () => {
  const { result, rerender } = renderHook(
    ({ hasChanged }) => useStaleDraft(draft, 'tree-b', hasChanged, () => {}),
    { initialProps: { hasChanged: false } }
  );
  expect(result.current).toBe(true);
  rerender({ hasChanged: true });
  expect(result.current).toBe(false);
  rerender({ hasChanged: false });
  expect(result.current).toBe(false);
});

test('a stale draft toast is only shown once in strict mode', () => {
  renderHook(() => useStaleDraft(draft, 'tree-b', false, () => {}), {
    wrapper: StrictMode,
  });
  expect(staleToasts).toHaveLength(1);
});
