/** @vitest-environment node */
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, expect, test } from 'vitest';
import { Config } from '../config';
import { fields } from '../form/api';
import { localModeApiHandler } from './api-node';
import { KeystaticRequest } from './internal-utils';

const config: Config = {
  storage: { kind: 'local' },
  collections: {
    posts: {
      label: 'Posts',
      slugField: 'title',
      path: 'posts/*',
      schema: { title: fields.slug({ name: { label: 'Title' } }) },
    },
  },
  singletons: {
    settings: {
      label: 'Settings',
      path: 'settings',
      schema: { title: fields.text({ label: 'Title' }) },
    },
  },
};

let baseDirectory: string;
let handler: ReturnType<typeof localModeApiHandler>;

beforeAll(async () => {
  baseDirectory = await fs.mkdtemp(path.join(os.tmpdir(), 'keystatic-'));
  handler = localModeApiHandler(config, baseDirectory);
});

afterAll(async () => {
  await fs.rm(baseDirectory, { recursive: true, force: true });
});

function makeRequest(method: string, body?: unknown): KeystaticRequest {
  const headers: Record<string, string> = {
    'no-cors': '1',
    'content-type': 'application/json',
  };
  return {
    url: 'http://localhost:3000/api/keystatic',
    method,
    headers: { get: name => headers[name.toLowerCase()] ?? null },
    json: async () => body,
  };
}

test('blob allows paths inside an allowed directory', async () => {
  const res = await handler(makeRequest('GET'), [
    'blob',
    'sha',
    'posts',
    'a.yaml',
  ]);
  expect(res.status).toBe(404);
});

test('blob rejects paths in a sibling directory with the same prefix', async () => {
  const res = await handler(makeRequest('GET'), [
    'blob',
    'sha',
    'posts-evil',
    'a.yaml',
  ]);
  expect(res.status).toBe(400);
});

test('update rejects paths in a sibling directory with the same prefix', async () => {
  const res = await handler(
    makeRequest('POST', {
      additions: [{ path: 'posts-evil/a.yaml', contents: 'YQ' }],
      deletions: [],
    }),
    ['update']
  );
  expect(res.status).toBe(400);
  await expect(
    fs.access(path.join(baseDirectory, 'posts-evil'))
  ).rejects.toThrow();
});

test('update rejects a sibling file next to a singleton directory', async () => {
  const res = await handler(
    makeRequest('POST', {
      additions: [{ path: 'settings-evil.yaml', contents: 'YQ' }],
      deletions: [],
    }),
    ['update']
  );
  expect(res.status).toBe(400);
  await expect(
    fs.access(path.join(baseDirectory, 'settings-evil.yaml'))
  ).rejects.toThrow();
});
