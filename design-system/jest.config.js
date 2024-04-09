/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  displayName: 'keystar/ui',
  testEnvironment: 'jsdom',
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/pkg/jest-setup.ts'],
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
};

module.exports = config;
