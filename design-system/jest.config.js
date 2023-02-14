/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  displayName: 'voussoir',
  testEnvironment: 'jsdom',
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
};

module.exports = config;
