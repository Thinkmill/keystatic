import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'keystatic',
    setupFiles: ['./test-setup.ts'],
    environment: 'jsdom',
    clearMocks: true,
  },
});
