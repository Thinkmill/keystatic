import type {
  BeforeHook,
  AfterHook,
  HookContext,
  AfterHookContext,
  ActionContext,
  ActionResult,
  BeforeHookResult,
} from '@keystatic/core';

// -- Types -------------------------------------------------------------------

type WorkflowOptions = {
  /** Map the hook/action context to workflow_dispatch inputs */
  input?: (ctx: HookContext | ActionContext) => Record<string, string>;
  /** Custom formatter for the toast notification */
  formatResult?: (result: unknown) => ActionResult;
  /**
   * API endpoint that dispatches the GitHub Actions workflow.
   * Defaults to '/api/workflows'.
   */
  endpoint?: string;
};

type AwaitWorkflowOptions = WorkflowOptions & {
  /** Milliseconds to wait for the workflow run to complete. Default: 120000 (2 min) */
  timeout?: number;
  /** Polling interval in ms when waiting for completion. Default: 3000 */
  pollInterval?: number;
};

// -- Internal ----------------------------------------------------------------

async function callEndpoint(
  endpoint: string,
  workflowId: string,
  input: Record<string, string>,
  options?: { wait?: boolean; timeout?: number; pollInterval?: number }
): Promise<unknown> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      workflow: workflowId,
      input,
      wait: options?.wait ?? false,
      timeout: options?.timeout,
      pollInterval: options?.pollInterval,
    }),
  });

  if (!response.ok) {
    const text = await response.text().catch(() => 'Unknown error');
    throw new Error(`Workflow "${workflowId}" failed: ${text}`);
  }

  return response.json();
}

function defaultFormatResult(workflowId: string, result: unknown): ActionResult {
  if (result && typeof result === 'object') {
    const r = result as Record<string, unknown>;

    if ('html_url' in r && 'status' in r) {
      // GitHub Actions run response
      const status = r.conclusion ?? r.status;
      return { message: `Workflow "${workflowId}" ${status}` };
    }
    if ('message' in r) {
      return { message: r.message as string };
    }
    if ('run_url' in r) {
      return { message: `Workflow started — view run at GitHub` };
    }
  }

  return { message: `Workflow "${workflowId}" dispatched` };
}

// -- Public API --------------------------------------------------------------

/**
 * Dispatch a GitHub Actions workflow (fire-and-forget).
 *
 * Triggers the workflow via the API endpoint and returns immediately
 * with a confirmation toast. Does not wait for the run to complete.
 *
 * @param workflowId - The workflow filename (e.g. 'translate-post.yml')
 *   or workflow ID. Must match a .github/workflows/ file in the repo.
 * @param options - Input mapping, endpoint, and result formatting.
 */
export function useWorkflow(
  workflowId: string,
  options?: WorkflowOptions
): BeforeHook & AfterHook & ((ctx: ActionContext) => Promise<ActionResult | void>) {
  const endpoint = options?.endpoint ?? '/api/workflows';

  const handler = async (ctx: HookContext | AfterHookContext | ActionContext) => {
    const input = options?.input ? options.input(ctx) : {};

    try {
      const result = await callEndpoint(endpoint, workflowId, input);
      if (options?.formatResult) {
        return options.formatResult(result);
      }
      return defaultFormatResult(workflowId, result);
    } catch (err) {
      console.error('[keystatic/workflows] dispatch failed:', err);
      return { error: `Workflow failed: ${(err as Error).message}` } as ActionResult;
    }
  };
  return handler as any;
}

/**
 * Dispatch a GitHub Actions workflow and wait for it to complete.
 *
 * Triggers the workflow, then polls the GitHub API until the run finishes
 * or the timeout is reached. Use for before* hooks where the result
 * determines whether to proceed.
 *
 * Chain `.then()` to transform the result into a BeforeHookResult.
 *
 * @param workflowId - The workflow filename (e.g. 'content-audit.yml')
 * @param options - Input mapping, timeout, polling interval, endpoint.
 */
export function awaitWorkflow(
  workflowId: string,
  options?: AwaitWorkflowOptions
): ThenableHook {
  const endpoint = options?.endpoint ?? '/api/workflows';
  const timeoutMs = options?.timeout ?? 120_000;
  const pollInterval = options?.pollInterval ?? 3_000;

  const callWorkflow = async (ctx: HookContext) => {
    const input = options?.input ? options.input(ctx) : {};

    return Promise.race([
      callEndpoint(endpoint, workflowId, input, {
        wait: true,
        timeout: timeoutMs,
        pollInterval,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Workflow timed out')), timeoutMs + 5_000)
      ),
    ]);
  };

  const handler: BeforeHook = async (ctx: HookContext) => {
    const result = await callWorkflow(ctx);
    return result as BeforeHookResult | void;
  };

  (handler as ThenableHook).then = (
    onResult: (result: unknown) => BeforeHookResult | void
  ): BeforeHook => {
    return async (ctx: HookContext) => {
      const result = await callWorkflow(ctx);
      return onResult(result);
    };
  };

  return handler as ThenableHook;
}

/** A BeforeHook that also supports .then() for result transformation */
export type ThenableHook = BeforeHook & {
  then(onResult: (result: unknown) => BeforeHookResult | void): BeforeHook;
};
