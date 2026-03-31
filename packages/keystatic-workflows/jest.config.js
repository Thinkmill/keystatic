/** @type {import('@jest/types').Config.InitialOptions} */
const config = {
  displayName: 'keystatic-workflows',
  testEnvironment: 'node',
  clearMocks: true,
  transform: {
    '^.+\\.[tj]sx?$': ['babel-jest', { rootMode: 'upward' }],
  },
};

module.exports = config;
