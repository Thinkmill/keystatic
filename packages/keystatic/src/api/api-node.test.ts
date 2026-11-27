/** @vitest-environment node */
import fs from 'node:fs/promises';
import path from 'node:path';
import { webcrypto } from 'node:crypto';
import { describe, expect, test } from 'vitest';
import { Config, collection, singleton, fields } from '..';
import { localModeApiHandler } from './api-node';
import { KeystaticRequest } from './internal-utils';
import { TreeEntry } from '../app/trees';
import { testdir } from '../../test/test-utils';
import { base64Encode } from '#base64';

if (!globalThis.crypto) {
  globalThis.crypto = webcrypto as any;
}

const textEncoder = new TextEncoder();

function encodeText(text: string) {
  return base64Encode(textEncoder.encode(text));
}

function makeRequest(args: {
  method: 'GET' | 'POST';
  url?: string;
  headers?: Record<string, string>;
  body?: unknown;
}): KeystaticRequest {
  const headerMap = new Map(
    Object.entries(args.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v])
  );
  return {
    method: args.method,
    url: args.url ?? 'http://localhost/api/keystatic/update',
    headers: {
      get: name => headerMap.get(name.toLowerCase()) ?? null,
    },
    json: async () => args.body,
  };
}

async function getTree(
  handler: ReturnType<typeof localModeApiHandler>
): Promise<Map<string, TreeEntry>> {
  const res = await handler(
    makeRequest({
      method: 'GET',
      url: 'http://localhost/api/keystatic/tree',
      headers: { 'no-cors': '1' },
    }),
    ['tree']
  );
  expect(res.status).toBe(200);
  const entries: TreeEntry[] = JSON.parse(res.body as string);
  return new Map(entries.map(e => [e.path, e]));
}

async function postUpdate(
  handler: ReturnType<typeof localModeApiHandler>,
  body: unknown
) {
  return handler(
    makeRequest({
      method: 'POST',
      url: 'http://localhost/api/keystatic/update',
      headers: {
        'no-cors': '1',
        'content-type': 'application/json',
      },
      body,
    }),
    ['update']
  );
}

const testConfig: Config = {
  storage: { kind: 'local' },
  collections: {
    posts: collection({
      label: 'Posts',
      slugField: 'title',
      path: 'posts/*/',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        content: fields.markdoc({ label: 'Content' }),
      },
    }),
    notes: collection({
      label: 'Notes',
      slugField: 'title',
      path: 'notes/*',
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        body: fields.text({ label: 'Body' }),
      },
    }),
  },
  singletons: {
    settings: singleton({
      label: 'Settings',
      path: 'settings/',
      schema: {
        siteName: fields.text({ label: 'Site Name' }),
      },
    }),
  },
};

describe('localModeApiHandler update conflict checks', () => {
  test('succeeds when expectedShas match current disk state and rejects subsequent stale update with 409', async () => {
    const dir = await testdir({
      'posts/hello/index.mdoc': '---\ntitle: Original\n---\nHello world\n',
      'posts/hello/extra.txt': 'unchanged\n',
    });
    const handler = localModeApiHandler(testConfig, dir);
    const initialTree = await getTree(handler);

    // Tab B saves a newer version first.
    const tabBRes = await postUpdate(handler, {
      additions: [
        {
          path: 'posts/hello/index.mdoc',
          contents: encodeText(
            '---\ntitle: Updated by B\n---\nTab B content\n'
          ),
        },
      ],
      deletions: [],
      expectedShas: [
        { path: 'posts/hello', sha: initialTree.get('posts/hello')!.sha },
        {
          path: 'posts/hello/index.mdoc',
          sha: initialTree.get('posts/hello/index.mdoc')!.sha,
        },
      ],
    });
    expect(tabBRes.status).toBe(200);

    // Tab A still holds initialTree SHAs and tries to overwrite index.mdoc and write a new asset.
    const tabARes = await postUpdate(handler, {
      additions: [
        {
          path: 'posts/hello/index.mdoc',
          contents: encodeText('---\ntitle: Stale A\n---\nStale content\n'),
        },
        {
          path: 'posts/hello/new-asset.txt',
          contents: encodeText('should not be written'),
        },
      ],
      deletions: [{ path: 'posts/hello/extra.txt' }],
      expectedShas: [
        { path: 'posts/hello', sha: initialTree.get('posts/hello')!.sha },
        {
          path: 'posts/hello/index.mdoc',
          sha: initialTree.get('posts/hello/index.mdoc')!.sha,
        },
      ],
    });

    expect(tabARes.status).toBe(409);
    const conflictBody = JSON.parse(tabARes.body as string);
    expect(conflictBody.code).toBe('CONFLICT');
    expect(conflictBody.conflicts.length).toBeGreaterThan(0);

    // Disk must remain untouched: Tab B's content intact, no partial writes or deletions.
    expect(
      await fs.readFile(path.join(dir, 'posts/hello/index.mdoc'), 'utf8')
    ).toBe('---\ntitle: Updated by B\n---\nTab B content\n');
    expect(
      await fs.readFile(path.join(dir, 'posts/hello/extra.txt'), 'utf8')
    ).toBe('unchanged\n');
    await expect(
      fs.access(path.join(dir, 'posts/hello/new-asset.txt'))
    ).rejects.toThrow();
  });

  test('detects conflict when another file in the entry directory changed even if additions do not touch that file', async () => {
    const dir = await testdir({
      'posts/hello/index.mdoc': '---\ntitle: Hello\n---\nBody v1\n',
      'posts/hello/cover.txt': 'cover-v1',
    });
    const handler = localModeApiHandler(testConfig, dir);
    const initialTree = await getTree(handler);

    // Tab B modifies index.mdoc while Tab A only changes cover.txt.
    const tabBRes = await postUpdate(handler, {
      additions: [
        {
          path: 'posts/hello/index.mdoc',
          contents: encodeText('---\ntitle: Hello B\n---\nBody v2\n'),
        },
      ],
      deletions: [],
      expectedShas: [
        { path: 'posts/hello', sha: initialTree.get('posts/hello')!.sha },
      ],
    });
    expect(tabBRes.status).toBe(200);

    const tabARes = await postUpdate(handler, {
      additions: [
        {
          path: 'posts/hello/cover.txt',
          contents: encodeText('cover-v2-by-A'),
        },
      ],
      deletions: [],
      expectedShas: [
        { path: 'posts/hello', sha: initialTree.get('posts/hello')!.sha },
        {
          path: 'posts/hello/cover.txt',
          sha: initialTree.get('posts/hello/cover.txt')!.sha,
        },
      ],
    });
    expect(tabARes.status).toBe(409);
    expect(
      await fs.readFile(path.join(dir, 'posts/hello/cover.txt'), 'utf8')
    ).toBe('cover-v1');
  });

  test('blocks concurrent creation of the same slug when expectedSha is null', async () => {
    const dir = await testdir({
      'notes/existing.yaml': 'title: Existing\nbody: Keep\n',
    });
    const handler = localModeApiHandler(testConfig, dir);

    // Tab B creates notes/new-note first.
    const tabBRes = await postUpdate(handler, {
      additions: [
        {
          path: 'notes/new-note.yaml',
          contents: encodeText('title: New Note B\nbody: Created by B\n'),
        },
      ],
      deletions: [],
      expectedShas: [
        { path: 'notes/new-note', sha: null },
        { path: 'notes/new-note.yaml', sha: null },
      ],
    });
    expect(tabBRes.status).toBe(200);

    // Stale Tab A tries to create the same slug expecting null.
    const tabARes = await postUpdate(handler, {
      additions: [
        {
          path: 'notes/new-note.yaml',
          contents: encodeText('title: New Note A\nbody: Overwrite attempt\n'),
        },
      ],
      deletions: [],
      expectedShas: [
        { path: 'notes/new-note', sha: null },
        { path: 'notes/new-note.yaml', sha: null },
      ],
    });
    expect(tabARes.status).toBe(409);
    expect(
      await fs.readFile(path.join(dir, 'notes/new-note.yaml'), 'utf8')
    ).toBe('title: New Note B\nbody: Created by B\n');
  });

  test('blocks stale delete when entry was concurrently modified or deleted', async () => {
    const dir = await testdir({
      'notes/target.yaml': 'title: Target\nbody: v1\n',
    });
    const handler = localModeApiHandler(testConfig, dir);
    const initialTree = await getTree(handler);

    // Tab B updates notes/target.yaml.
    const editRes = await postUpdate(handler, {
      additions: [
        {
          path: 'notes/target.yaml',
          contents: encodeText('title: Target\nbody: v2\n'),
        },
      ],
      deletions: [],
      expectedShas: [
        { path: 'notes/target', sha: null },
        {
          path: 'notes/target.yaml',
          sha: initialTree.get('notes/target.yaml')!.sha,
        },
      ],
    });
    expect(editRes.status).toBe(200);

    // Stale Tab A tries to delete notes/target.yaml.
    const deleteRes = await postUpdate(handler, {
      additions: [],
      deletions: [{ path: 'notes/target.yaml' }],
      expectedShas: [
        { path: 'notes/target', sha: null },
        {
          path: 'notes/target.yaml',
          sha: initialTree.get('notes/target.yaml')!.sha,
        },
      ],
    });
    expect(deleteRes.status).toBe(409);
    expect(await fs.readFile(path.join(dir, 'notes/target.yaml'), 'utf8')).toBe(
      'title: Target\nbody: v2\n'
    );
  });

  test('allows saving when an unrelated entry changed concurrently and supports consecutive saves', async () => {
    const dir = await testdir({
      'notes/first.yaml': 'title: First\nbody: v1\n',
      'notes/second.yaml': 'title: Second\nbody: v1\n',
    });
    const handler = localModeApiHandler(testConfig, dir);
    const initialTree = await getTree(handler);

    // Tab B modifies notes/second.yaml.
    const tabBRes = await postUpdate(handler, {
      additions: [
        {
          path: 'notes/second.yaml',
          contents: encodeText('title: Second\nbody: v2\n'),
        },
      ],
      deletions: [],
      expectedShas: [
        { path: 'notes/second', sha: null },
        {
          path: 'notes/second.yaml',
          sha: initialTree.get('notes/second.yaml')!.sha,
        },
      ],
    });
    expect(tabBRes.status).toBe(200);

    // Tab A still has initialTree for notes/first.yaml and saves cleanly.
    const tabARes1 = await postUpdate(handler, {
      additions: [
        {
          path: 'notes/first.yaml',
          contents: encodeText('title: First\nbody: v2\n'),
        },
      ],
      deletions: [],
      expectedShas: [
        { path: 'notes/first', sha: null },
        {
          path: 'notes/first.yaml',
          sha: initialTree.get('notes/first.yaml')!.sha,
        },
      ],
    });
    expect(tabARes1.status).toBe(200);

    const updatedEntries: TreeEntry[] = JSON.parse(tabARes1.body as string);
    const updatedTree = new Map(updatedEntries.map(e => [e.path, e]));

    // Tab A performs a consecutive save using SHAs from the previous 200 response.
    const tabARes2 = await postUpdate(handler, {
      additions: [
        {
          path: 'notes/first.yaml',
          contents: encodeText('title: First\nbody: v3\n'),
        },
      ],
      deletions: [],
      expectedShas: [
        { path: 'notes/first', sha: null },
        {
          path: 'notes/first.yaml',
          sha: updatedTree.get('notes/first.yaml')!.sha,
        },
      ],
    });
    expect(tabARes2.status).toBe(200);
    expect(await fs.readFile(path.join(dir, 'notes/first.yaml'), 'utf8')).toBe(
      'title: First\nbody: v3\n'
    );
  });

  test('serializes concurrent updates on the same directory so the second sees 409', async () => {
    const dir = await testdir({
      'settings/index.yaml': 'siteName: Initial\n',
    });
    const handler = localModeApiHandler(testConfig, dir);
    const initialTree = await getTree(handler);
    const expectedShas = [
      { path: 'settings', sha: initialTree.get('settings')!.sha },
      {
        path: 'settings/index.yaml',
        sha: initialTree.get('settings/index.yaml')!.sha,
      },
    ];

    const [res1, res2] = await Promise.all([
      postUpdate(handler, {
        additions: [
          {
            path: 'settings/index.yaml',
            contents: encodeText('siteName: First\n'),
          },
        ],
        deletions: [],
        expectedShas,
      }),
      postUpdate(handler, {
        additions: [
          {
            path: 'settings/index.yaml',
            contents: encodeText('siteName: Second\n'),
          },
        ],
        deletions: [],
        expectedShas,
      }),
    ]);

    expect([res1.status, res2.status]).toEqual([200, 409]);
    expect(
      await fs.readFile(path.join(dir, 'settings/index.yaml'), 'utf8')
    ).toBe('siteName: First\n');
  });

  test('rejects invalid or disallowed paths in expectedShas', async () => {
    const dir = await testdir({
      'notes/first.yaml': 'title: First\nbody: v1\n',
    });
    const handler = localModeApiHandler(testConfig, dir);

    const res = await postUpdate(handler, {
      additions: [],
      deletions: [],
      expectedShas: [{ path: '../secret.txt', sha: null }],
    });
    expect(res.status).toBe(400);
  });
});
