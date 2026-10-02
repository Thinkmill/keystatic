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
    // The default 5s budget includes each file's own import/transform cost,
    // not just its test bodies — on a slower machine or a cold cache, the
    // first test in a heavier file (e.g. the markdoc editor suites) can miss
    // it even though every individual test runs in well under a second.
    testTimeout: 20_000,
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
