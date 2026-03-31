/**
 * Example: Workflow API Route (Next.js App Router)
 *
 * Place at: app/api/workflows/route.ts
 *
 * This route receives requests from @keystatic/workflows adapters
 * (useWorkflow/awaitWorkflow) and dispatches GitHub Actions workflows
 * via the workflow_dispatch API.
 *
 * Prerequisites:
 *   - A GitHub personal access token or app token with `actions:write` scope
 *   - The token stored as GITHUB_TOKEN env var
 *   - GitHub Actions workflow files in .github/workflows/
 *
 * For Keystatic GitHub storage, the token is already available from the
 * existing OAuth flow.
 */

import { NextResponse } from 'next/server';

const GITHUB_API = 'https://api.github.com';

// Configure these for your repo
const REPO_OWNER = process.env.KEYSTATIC_GITHUB_OWNER || '';
const REPO_NAME = process.env.KEYSTATIC_GITHUB_REPO || '';
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const DEFAULT_BRANCH = process.env.GITHUB_DEFAULT_BRANCH || 'main';

export async function POST(request: Request) {
  try {
    const { workflow, input, wait, timeout, pollInterval } = await request.json();

    if (!REPO_OWNER || !REPO_NAME || !GITHUB_TOKEN) {
      return NextResponse.json(
        { error: 'GitHub configuration missing. Set KEYSTATIC_GITHUB_OWNER, KEYSTATIC_GITHUB_REPO, and GITHUB_TOKEN.' },
        { status: 500 }
      );
    }

    // Dispatch the workflow
    const dispatchUrl = `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${workflow}/dispatches`;
    const dispatchRes = await fetch(dispatchUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ref: DEFAULT_BRANCH,
        inputs: input || {},
      }),
    });

    if (!dispatchRes.ok) {
      const text = await dispatchRes.text();
      return NextResponse.json(
        { error: `GitHub API error (${dispatchRes.status}): ${text}` },
        { status: dispatchRes.status }
      );
    }

    // Fire-and-forget mode — return immediately
    if (!wait) {
      return NextResponse.json({
        status: 'dispatched',
        message: `Workflow "${workflow}" dispatched`,
        workflow,
      });
    }

    // Wait mode — poll for the workflow run to complete
    const result = await pollForCompletion(workflow, timeout || 120000, pollInterval || 3000);
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('[workflows] error:', err);
    return NextResponse.json(
      { error: err.message || 'Workflow dispatch failed' },
      { status: 500 }
    );
  }
}

/**
 * Poll the GitHub Actions API until the most recent run of the given
 * workflow completes or the timeout is reached.
 */
async function pollForCompletion(
  workflowFile: string,
  timeoutMs: number,
  pollIntervalMs: number
): Promise<Record<string, unknown>> {
  const start = Date.now();

  // Brief initial delay — GitHub needs a moment to create the run
  await new Promise(r => setTimeout(r, 2000));

  while (Date.now() - start < timeoutMs) {
    const runsUrl = `${GITHUB_API}/repos/${REPO_OWNER}/${REPO_NAME}/actions/workflows/${workflowFile}/runs?per_page=1&branch=${DEFAULT_BRANCH}`;
    const runsRes = await fetch(runsUrl, {
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (runsRes.ok) {
      const { workflow_runs } = await runsRes.json();
      if (workflow_runs?.length > 0) {
        const run = workflow_runs[0];
        if (run.status === 'completed') {
          return {
            status: 'completed',
            conclusion: run.conclusion, // success, failure, cancelled
            html_url: run.html_url,
            run_id: run.id,
            workflow: workflowFile,
          };
        }
      }
    }

    await new Promise(r => setTimeout(r, pollIntervalMs));
  }

  return {
    status: 'timeout',
    message: `Workflow "${workflowFile}" did not complete within ${timeoutMs / 1000}s`,
    workflow: workflowFile,
  };
}
