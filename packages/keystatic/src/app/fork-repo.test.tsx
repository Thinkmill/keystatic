import { act, render, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { GitHubConfig } from '../config';
import { ForkRepoDialog } from './fork-repo';

const mocks = vi.hoisted(() => ({
  fetch: vi.fn(),
  getAuth: vi.fn(),
  query: vi.fn(),
}));

vi.mock('./auth', () => ({ getAuth: mocks.getAuth }));

vi.mock('urql', () => ({
  useClient: () => ({ query: () => ({ toPromise: mocks.query }) }),
}));

vi.mock('./shell/data', () => ({ GitHubAppShellQuery: {} }));

vi.mock('react-aria/useLocalizedStringFormatter', () => ({
  useLocalizedStringFormatter: () => ({ format: (key: string) => key }),
}));

vi.mock('@keystar/ui/button', () => ({
  Button: (props: { children?: unknown }) => props.children,
  ButtonGroup: (props: { children?: unknown }) => props.children,
}));
vi.mock('@keystar/ui/dialog', () => ({
  Dialog: (props: { children?: unknown }) => props.children,
}));
vi.mock('@keystar/ui/slots', () => ({
  Content: (props: { children?: unknown }) => props.children,
}));
vi.mock('@keystar/ui/typography', () => ({
  Heading: (props: { children?: unknown }) => props.children,
  Text: (props: { children?: unknown }) => props.children,
}));
vi.mock('@keystar/ui/notice', () => ({
  Notice: (props: { children?: unknown }) => props.children,
}));
vi.mock('@keystar/ui/layout', () => ({
  Flex: (props: { children?: unknown }) => props.children,
}));
vi.mock('@keystar/ui/link', () => ({
  TextLink: (props: { children?: unknown }) => props.children,
}));

const config: GitHubConfig = {
  storage: { kind: 'github', repo: 'owner/repo' },
};

beforeEach(() => {
  vi.stubGlobal('fetch', mocks.fetch);
  mocks.getAuth.mockResolvedValue({ accessToken: 'token' });
  mocks.query.mockResolvedValue({
    data: {
      repository: { forks: { nodes: [{ viewerPermission: 'WRITE' }] } },
    },
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  mocks.fetch.mockReset();
  mocks.getAuth.mockReset();
  mocks.query.mockReset();
});

async function installAppInPopup() {
  const onCreate = vi.fn();
  const result = render(
    <ForkRepoDialog config={config} onDismiss={() => {}} onCreate={onCreate} />
  );
  await act(async () => {
    window.dispatchEvent(
      new StorageEvent('storage', {
        key: 'ks-refetch-installations',
        newValue: 'true',
      })
    );
  });
  await waitFor(() => expect(onCreate).toHaveBeenCalledTimes(1));
  return result;
}

test('refreshes the token before refetching after the install popup closes', async () => {
  mocks.fetch.mockResolvedValue({ ok: true, status: 200 });
  await installAppInPopup();
  expect(mocks.fetch).toHaveBeenCalledWith(
    '/api/keystatic/github/refresh-token',
    { method: 'POST' }
  );
  expect(mocks.fetch.mock.invocationCallOrder[0]).toBeLessThan(
    mocks.getAuth.mock.invocationCallOrder[0]
  );
  expect(mocks.query).toHaveBeenCalledTimes(1);
});

test('continues with the existing token when the refresh request fails', async () => {
  mocks.fetch.mockRejectedValue(new TypeError('Failed to fetch'));
  const { queryByText } = await installAppInPopup();
  expect(mocks.getAuth).toHaveBeenCalledTimes(1);
  expect(queryByText('Failed to fetch')).toBeNull();
});

test('continues with the existing token when there is no refresh token', async () => {
  mocks.fetch.mockResolvedValue({ ok: false, status: 401 });
  const { queryByText } = await installAppInPopup();
  expect(mocks.getAuth).toHaveBeenCalledTimes(1);
  expect(queryByText('Unauthorized')).toBeNull();
});
