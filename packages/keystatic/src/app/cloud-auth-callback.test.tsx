import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { Config } from '..';

const mocks = vi.hoisted(() => ({
  push: vi.fn(),
}));

// RouterProvider builds a new router object on every render, mirror that here
vi.mock('./router', () => ({
  useRouter: () => ({
    push: mocks.push,
    replace: vi.fn(),
    href: '/keystatic/cloud/oauth/callback',
    params: ['cloud', 'oauth', 'callback'],
    pathname: '/keystatic/cloud/oauth/callback',
    search: '',
  }),
}));

// imported after the mocks are registered
const { KeystaticCloudAuthCallback } = await import('./cloud-auth-callback');

const config: Config = {
  storage: { kind: 'cloud' },
  cloud: { project: 'team/project' },
};

const fetchMock = vi.fn();

beforeEach(() => {
  window.history.replaceState(
    null,
    '',
    '/keystatic/cloud/oauth/callback?code=the-code&state=the-state'
  );
  localStorage.setItem(
    'keystatic-cloud-state',
    JSON.stringify({
      state: 'the-state',
      from: 'collection/posts',
      code_verifier: 'verifier',
    })
  );
  let calls = 0;
  fetchMock.mockImplementation(async () => {
    calls++;
    if (calls > 1) {
      return new Response(
        JSON.stringify({
          error: 'invalid_grant',
          error_description: 'Invalid code',
        }),
        { status: 400 }
      );
    }
    return new Response(
      JSON.stringify({
        access_token: 'token',
        token_type: 'bearer',
        expires_in: 3600,
      }),
      { status: 200 }
    );
  });
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  localStorage.clear();
});

test('exchanges the authorization code only once when the router changes', async () => {
  const { rerender } = render(<KeystaticCloudAuthCallback config={config} />);
  rerender(<KeystaticCloudAuthCallback config={config} />);
  rerender(<KeystaticCloudAuthCallback config={config} />);

  await waitFor(() => {
    expect(mocks.push).toHaveBeenCalledWith('/keystatic/collection/posts');
  });

  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(screen.queryByText(/invalid_grant/)).not.toBeInTheDocument();
  expect(
    JSON.parse(localStorage.getItem('keystatic-cloud-access-token')!).token
  ).toBe('token');
});
