import { renderHook, act } from '@testing-library/react';
import { webcrypto } from 'node:crypto';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { fields } from '../form/api';
import { Config } from '..';
import { treeEntriesToTreeNodes, TreeEntry } from './trees';
import { getTreeKey } from './tree-key';

// node only started setting the web crypto api globally in newer versions
if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as any;
}

const mocks = vi.hoisted(() => ({
  mutate: vi.fn(),
  remoteHeads: [] as { oid: string; entries: TreeEntry[] }[],
  fetchRef: vi.fn(),
  fetchTree: vi.fn(),
}));

vi.mock('urql', () => ({
  useMutation: () => [undefined, mocks.mutate],
}));

vi.mock('./provider', () => ({
  createUrqlClient: () => ({
    query: () => ({ toPromise: mocks.fetchRef }),
  }),
}));

vi.mock('./shell/data', () => ({
  useBaseCommit: () => 'opened-head',
  useCurrentBranch: () => 'main',
  useSetTreeSha: () => () => {},
  useRepoInfo: () => ({
    owner: 'owner',
    name: 'repo',
    hasWritePermission: true,
  }),
  useCurrentUnscopedTree: () => ({
    kind: 'loaded',
    data: { tree: treeEntriesToTreeNodes([]) },
  }),
  fetchGitHubTreeData: (...args: unknown[]) => mocks.fetchTree(...args),
  hydrateTreeCacheWithEntries: async (entries: TreeEntry[]) => ({
    entries: new Map(entries.map(e => [e.path, e])),
    tree: treeEntriesToTreeNodes(entries),
  }),
}));

vi.mock('./useItemData', () => ({
  hydrateBlobCache: async () => 'blob-sha',
}));

// imported after the mocks are registered
const { useUpsertItem } = await import('./updating');

const config: Config = {
  storage: { kind: 'github', repo: 'owner/repo' },
  collections: {
    posts: {
      label: 'Posts',
      slugField: 'title',
      path: 'posts/*',
      schema: { title: fields.slug({ name: { label: 'Title' } }) },
    },
  },
};

function entry(path: string, type: 'blob' | 'tree', sha: string): TreeEntry {
  return {
    path,
    type,
    sha,
    mode: type === 'tree' ? '040000' : '100644',
    size: 0,
    url: '',
  } as TreeEntry;
}

/** a remote tree containing the given post slugs (each one with a given sha) */
function remoteTree(posts: Record<string, string> = {}, extra: string[] = []) {
  const entries: TreeEntry[] = [entry('posts', 'tree', 'posts-dir')];
  for (const [slug, sha] of Object.entries(posts)) {
    entries.push(entry(`posts/${slug}`, 'tree', sha));
    entries.push(entry(`posts/${slug}/index.yaml`, 'blob', `${sha}-file`));
  }
  for (const path of extra) entries.push(entry(path, 'blob', `${path}-sha`));
  return entries;
}

function staleData() {
  return {
    error: {
      graphQLErrors: [{ originalError: { type: 'STALE_DATA' } }],
    },
  };
}

const success = {
  data: { createCommitOnBranch: { ref: { target: { oid: 'new-head' } } } },
};

function setRemoteHead(oid: string, entries: TreeEntry[]) {
  mocks.fetchRef.mockResolvedValueOnce({
    data: { repository: { ref: { target: { oid } } } },
  });
  mocks.fetchTree.mockImplementationOnce(async () => ({
    entries: new Map(entries.map(e => [e.path, e])),
    tree: treeEntriesToTreeNodes(entries),
  }));
}

function renderUpsert(
  currentLocalTreeKey: string | undefined,
  slug = 'new-post'
) {
  return renderHook(() =>
    useUpsertItem({
      state: { title: { name: 'New post', slug } },
      initialFiles: undefined,
      schema: config.collections!.posts.schema,
      config,
      format: { data: 'yaml', contentField: undefined, dataLocation: 'index' },
      currentLocalTreeKey,
      basePath: `posts/${slug}`,
      slug: { field: 'title', value: slug },
    })
  );
}

async function save(hook: ReturnType<typeof renderUpsert>) {
  let result: boolean | undefined;
  await act(async () => {
    result = await hook.result.current[1]();
  });
  return { saved: result, state: hook.result.current[0] };
}

beforeEach(() => {
  mocks.mutate.mockReset();
  mocks.fetchRef.mockReset();
  mocks.fetchTree.mockReset();
});

// CreateItemLocal and CreateItemCollab (create-item.tsx) both call
// useUpsertItem with `currentLocalTreeKey: undefined`, which is what is
// exercised in the "create" tests below.
describe('creating an entry (no local tree key)', () => {
  test('retries when an unrelated commit moved the branch head', async () => {
    mocks.mutate
      .mockResolvedValueOnce(staleData())
      .mockResolvedValueOnce(success);
    setRemoteHead('head-2', remoteTree({ other: 'other-sha' }, ['README.md']));

    const { saved, state } = await save(renderUpsert(undefined));

    expect(saved).toBe(true);
    expect(state).toEqual({ kind: 'updated' });
    expect(mocks.mutate).toHaveBeenCalledTimes(2);
    expect(mocks.mutate.mock.calls[0][0].input.expectedHeadOid).toBe(
      'opened-head'
    );
    expect(mocks.mutate.mock.calls[1][0].input.expectedHeadOid).toBe('head-2');
  });

  test('shows the new-branch dialog when the slug was created remotely', async () => {
    mocks.mutate.mockResolvedValueOnce(staleData());
    setRemoteHead('head-2', remoteTree({ 'new-post': 'created-elsewhere' }));

    const { saved, state } = await save(renderUpsert(undefined));

    expect(saved).toBe(false);
    expect(state.kind).toBe('needs-new-branch');
    expect(mocks.mutate).toHaveBeenCalledTimes(1);
  });

  test('errors instead of overwriting when the head moves again before the retry', async () => {
    mocks.mutate
      .mockResolvedValueOnce(staleData())
      .mockResolvedValueOnce(staleData());
    setRemoteHead('head-2', remoteTree({ other: 'other-sha' }));

    const { saved, state } = await save(renderUpsert(undefined));

    expect(saved).toBe(false);
    expect(state.kind).toBe('error');
    expect(mocks.mutate).toHaveBeenCalledTimes(2);
    // the retry is pinned to the head that was checked, not "latest"
    expect(mocks.mutate.mock.calls[1][0].input.expectedHeadOid).toBe('head-2');
  });
});

describe('editing an entry (local tree key)', () => {
  const localTree = treeEntriesToTreeNodes(remoteTree({ 'new-post': 'v1' }));
  const localKey = getTreeKey(['posts/new-post'], localTree);

  test('retries when the entry is unchanged remotely', async () => {
    mocks.mutate
      .mockResolvedValueOnce(staleData())
      .mockResolvedValueOnce(success);
    setRemoteHead('head-2', remoteTree({ 'new-post': 'v1', other: 'x' }));

    const { saved } = await save(renderUpsert(localKey));

    expect(saved).toBe(true);
    expect(mocks.mutate).toHaveBeenCalledTimes(2);
  });

  test('shows the new-branch dialog when the entry changed remotely', async () => {
    mocks.mutate.mockResolvedValueOnce(staleData());
    setRemoteHead('head-2', remoteTree({ 'new-post': 'v2' }));

    const { saved, state } = await save(renderUpsert(localKey));

    expect(saved).toBe(false);
    expect(state.kind).toBe('needs-new-branch');
    expect(mocks.mutate).toHaveBeenCalledTimes(1);
  });
});
