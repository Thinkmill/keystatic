import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const fromRoot = (path: string) =>
  fileURLToPath(new URL(path, import.meta.url));

const testFiles = '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^#field-ui\/(.+)$/,
        replacement: fromRoot('packages/keystatic/src/form/fields/$1/ui.tsx'),
      },
    ],
  },
  oxc: { jsx: { runtime: 'automatic', development: false } },
  test: {
    reporters: ['verbose'],
    fakeTimers: {
      shouldAdvanceTime: true,
      toFake: [
        'setTimeout',
        'clearTimeout',
        'setInterval',
        'clearInterval',
        'setImmediate',
        'clearImmediate',
        'Date',
        'performance',
      ],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'keystar/ui',
          environment: 'jsdom',
          globals: true,
          clearMocks: true,
          setupFiles: ['./design-system/pkg/vitest-setup.ts'],
          include: [`design-system/${testFiles}`],
        },
      },
      {
        extends: true,
        test: {
          name: 'keystatic',
          environment: 'jsdom',
          globals: true,
          clearMocks: true,
          setupFiles: ['@testing-library/jest-dom/vitest'],
          include: [`packages/keystatic/${testFiles}`],
        },
      },
    ],
  },
});
