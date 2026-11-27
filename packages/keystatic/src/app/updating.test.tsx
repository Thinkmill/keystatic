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
  setTreeSha: vi.fn(),
  fetch: vi.fn(),
  unscopedTree: [] as TreeEntry[],
}));

vi.stubGlobal('fetch', mocks.fetch);

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
  useSetTreeSha: () => mocks.setTreeSha,
  useRepoInfo: () => ({
    owner: 'owner',
    name: 'repo',
    hasWritePermission: true,
  }),
  useCurrentUnscopedTree: () => ({
    kind: 'loaded',
    data: { tree: treeEntriesToTreeNodes(mocks.unscopedTree) },
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
const { useDeleteItem, useUpsertItem } = await import('./updating');

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
  mocks.setTreeSha.mockReset();
  mocks.fetch.mockReset();
  mocks.unscopedTree = [];
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

describe('local storage mode', () => {
  const localConfig: Config = {
    storage: { kind: 'local' },
    collections: {
      posts: {
        label: 'Posts',
        slugField: 'title',
        path: 'posts/*',
        schema: { title: fields.slug({ name: { label: 'Title' } }) },
      },
    },
  };

  function renderLocalUpsert(args: {
    initialFiles?: string[];
    currentLocalTreeKey?: string;
    slug?: string;
  }) {
    const slug = args.slug ?? 'my-post';
    return renderHook(() =>
      useUpsertItem({
        state: { title: { name: 'My post', slug } },
        initialFiles: args.initialFiles,
        schema: localConfig.collections!.posts.schema,
        config: localConfig,
        format: {
          data: 'yaml',
          contentField: undefined,
          dataLocation: 'index',
        },
        currentLocalTreeKey: args.currentLocalTreeKey,
        basePath: `posts/${slug}`,
        slug: { field: 'title', value: slug },
      })
    );
  }

  test('sends expectedShas and updates tree SHA on 200', async () => {
    mocks.unscopedTree = remoteTree({ 'my-post': 'v1' });
    mocks.fetch.mockResolvedValueOnce(
      new Response(JSON.stringify(remoteTree({ 'my-post': 'v2' })), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      })
    );

    const { saved, state } = await save(
      renderLocalUpsert({
        initialFiles: ['posts/my-post/index.yaml'],
        currentLocalTreeKey: 'v1',
      })
    );

    expect(saved).toBe(true);
    expect(state).toEqual({ kind: 'updated' });
    expect(mocks.setTreeSha).toHaveBeenCalledTimes(1);
    const reqBody = JSON.parse(mocks.fetch.mock.calls[0][1].body);
    expect(reqBody.expectedShas).toEqual([
      { path: 'posts/my-post', sha: 'v1' },
      { path: 'posts/my-post/index.yaml', sha: 'v1-file' },
    ]);
  });

  test('returns conflict state without updating tree SHA on 409 during edit', async () => {
    mocks.unscopedTree = remoteTree({ 'my-post': 'v1' });
    mocks.fetch.mockResolvedValueOnce(
      new Response(
        JSON.stringify({ code: 'CONFLICT', message: 'Changed on disk' }),
        { status: 409, headers: { 'content-type': 'application/json' } }
      )
    );

    const { saved, state } = await save(
      renderLocalUpsert({
        initialFiles: ['posts/my-post/index.yaml'],
        currentLocalTreeKey: 'v1',
      })
    );

    expect(saved).toBe(false);
    expect(state.kind).toBe('conflict');
    if (state.kind === 'conflict') {
      expect(state.reason).toContain('changed on disk');
    }
    expect(mocks.setTreeSha).not.toHaveBeenCalled();
  });

  test('sends null expectedShas when creating and surfaces slug conflict on 409', async () => {
    mocks.unscopedTree = remoteTree({ other: 'other-v1' });
    mocks.fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ code: 'CONFLICT', message: 'Conflict' }), {
        status: 409,
        headers: { 'content-type': 'application/json' },
      })
    );

    const { saved, state } = await save(renderLocalUpsert({}));

    expect(saved).toBe(false);
    expect(state.kind).toBe('conflict');
    if (state.kind === 'conflict') {
      expect(state.reason).toContain('slug already exists');
    }
    expect(mocks.setTreeSha).not.toHaveBeenCalled();
    const reqBody = JSON.parse(mocks.fetch.mock.calls[0][1].body);
    expect(reqBody.expectedShas).toEqual([
      { path: 'posts/my-post', sha: null },
      { path: 'posts/my-post/index.yaml', sha: null },
    ]);
  });

  test('sets error state on non-conflict HTTP failure', async () => {
    mocks.unscopedTree = remoteTree({ 'my-post': 'v1' });
    mocks.fetch.mockResolvedValueOnce(
      new Response('Internal Server Error', { status: 500 })
    );

    const { saved, state } = await save(
      renderLocalUpsert({
        initialFiles: ['posts/my-post/index.yaml'],
        currentLocalTreeKey: 'v1',
      })
    );

    expect(saved).toBe(false);
    expect(state.kind).toBe('error');
    if (state.kind === 'error') {
      expect(state.error.message).toBe('Internal Server Error');
    }
    expect(mocks.setTreeSha).not.toHaveBeenCalled();
  });

  test('useDeleteItem sends expectedShas and handles 409 conflict without updating tree SHA', async () => {
    mocks.unscopedTree = remoteTree({ 'my-post': 'v1' });
    mocks.fetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ code: 'CONFLICT', message: 'Conflict' }), {
        status: 409,
        headers: { 'content-type': 'application/json' },
      })
    );

    const hook = renderHook(() =>
      useDeleteItem({
        basePath: 'posts/my-post',
        initialFiles: ['posts/my-post/index.yaml'],
        storage: localConfig.storage,
      })
    );

    let deleted: boolean | undefined;
    await act(async () => {
      deleted = await hook.result.current[1]();
    });

    expect(deleted).toBe(false);
    expect(hook.result.current[0].kind).toBe('conflict');
    expect(mocks.setTreeSha).not.toHaveBeenCalled();
    const reqBody = JSON.parse(mocks.fetch.mock.calls[0][1].body);
    expect(reqBody.expectedShas).toEqual([
      { path: 'posts/my-post', sha: 'v1' },
      { path: 'posts/my-post/index.yaml', sha: 'v1-file' },
    ]);
  });
});
