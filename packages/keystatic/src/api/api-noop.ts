export const localModeApiHandler: typeof import('./api-node').localModeApiHandler =
  () => async () => ({
    status: 500,
    body: "The Keystatic API route is running in a non-Node.js environment which is not supported with `storage: { kind: 'local' }`",
  });

export const handleGitHubAppCreation: typeof import('./api-node').handleGitHubAppCreation =
  async () => ({
    status: 500,
    body: 'The Keystatic API route is running in a non-Node.js environment which does not support GitHub App creation',
  });
