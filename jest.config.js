/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  displayName: 'voussoir',
  testEnvironment: 'jsdom',
  clearMocks: true,
  verbose: true,
  collectCoverageFrom: [
    '**/packages/**/*.{ts,tsx}',
    '!**/dist/**',
    '!**/{*.stories.tsx,index.ts,types.ts}',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
};

module.exports = config;
