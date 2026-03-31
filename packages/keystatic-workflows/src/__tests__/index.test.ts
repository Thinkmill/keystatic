/** @jest-environment node */
import { expect, test, jest, beforeEach } from '@jest/globals';
import { useWorkflow, awaitWorkflow } from '../index';

type HookContext = {
  event: string;
  trigger: 'event' | 'manual';
  collection?: string;
  singleton?: string;
  slug?: string;
  data: Record<string, unknown>;
  previousData?: Record<string, unknown>;
  storage: { kind: 'local' | 'github' | 'cloud' };
};

function makeContext(overrides: Partial<HookContext> = {}): HookContext {
  return {
    event: 'beforeSave',
    trigger: 'event',
    collection: 'posts',
    slug: 'hello',
    data: { title: 'Hello' },
    storage: { kind: 'github' },
    ...overrides,
  } as HookContext;
}

// Mock fetch globally
const mockFetch = jest.fn<typeof fetch>();
beforeEach(() => {
  mockFetch.mockReset();
  (globalThis as any).fetch = mockFetch;
});

test('useWorkflow: dispatches workflow via API endpoint', async () => {
  mockFetch.mockResolvedValue(
    new Response(JSON.stringify({ run_url: 'https://github.com/...', status: 'queued' }), { status: 200 })
  );

  const hook = useWorkflow('translate-post.yml', {
    input: ctx => ({ slug: ctx.slug ?? '', language: 'es' }),
  });

  const result = await (hook as any)(makeContext());

  expect(mockFetch).toHaveBeenCalledWith('/api/workflows', expect.objectContaining({
    method: 'POST',
    body: JSON.stringify({
      workflow: 'translate-post.yml',
      input: { slug: 'hello', language: 'es' },
      wait: false,
      timeout: undefined,
      pollInterval: undefined,
    }),
  }));
  expect(result).toHaveProperty('message');
});

test('useWorkflow: returns error on API failure', async () => {
  mockFetch.mockResolvedValue(
    new Response('Internal Server Error', { status: 500 })
  );

  const hook = useWorkflow('bad-workflow.yml');
  const result = await (hook as any)(makeContext());

  expect(result).toHaveProperty('error');
  expect((result as any).error).toContain('Workflow failed');
});

test('useWorkflow: uses custom formatResult', async () => {
  mockFetch.mockResolvedValue(
    new Response(JSON.stringify({ custom: 'data' }), { status: 200 })
  );

  const hook = useWorkflow('my-workflow.yml', {
    formatResult: (r) => ({ message: `Got: ${(r as any).custom}` }),
  });

  const result = await (hook as any)(makeContext());
  expect(result).toEqual({ message: 'Got: data' });
});

test('awaitWorkflow: dispatches with wait=true', async () => {
  mockFetch.mockResolvedValue(
    new Response(JSON.stringify({ conclusion: 'success' }), { status: 200 })
  );

  const hook = awaitWorkflow('content-audit.yml', { timeout: 60000 });
  await (hook as any)(makeContext());

  const body = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);
  expect(body.wait).toBe(true);
  expect(body.timeout).toBe(60000);
});

test('awaitWorkflow.then: transforms result to cancel', async () => {
  mockFetch.mockResolvedValue(
    new Response(JSON.stringify({ passed: false, score: 40 }), { status: 200 })
  );

  const hook = awaitWorkflow('content-audit.yml').then(result => {
    if (!(result as any).passed) return { cancel: true as const, reason: 'Audit failed' };
  });

  const hookResult = await (hook as any)(makeContext());
  expect(hookResult).toEqual({ cancel: true, reason: 'Audit failed' });
});

test('awaitWorkflow.then: returns void when check passes', async () => {
  mockFetch.mockResolvedValue(
    new Response(JSON.stringify({ passed: true, score: 95 }), { status: 200 })
  );

  const hook = awaitWorkflow('content-audit.yml').then(result => {
    if (!(result as any).passed) return { cancel: true as const, reason: 'Audit failed' };
  });

  const hookResult = await (hook as any)(makeContext());
  expect(hookResult).toBeUndefined();
});

test('useWorkflow: sends empty input when no mapper provided', async () => {
  mockFetch.mockResolvedValue(
    new Response(JSON.stringify({}), { status: 200 })
  );

  const hook = useWorkflow('simple.yml');
  await (hook as any)(makeContext());

  const body = JSON.parse(mockFetch.mock.calls[0][1]?.body as string);
  expect(body.input).toEqual({});
});
