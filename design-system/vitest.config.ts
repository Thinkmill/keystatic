import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: '@keystar/ui',
    setupFiles: ['./pkg/test-setup.ts'],
    environment: 'jsdom',
    clearMocks: true,
  },
});
