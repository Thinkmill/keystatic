/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  displayName: 'keystar/ui',
  testEnvironment: 'jsdom',
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  injectGlobals: false,
};

module.exports = config;
