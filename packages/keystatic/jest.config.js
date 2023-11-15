/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  displayName: 'keystatic',
  testEnvironment: 'jsdom',
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
  prettierPath: null,
};

module.exports = config;
