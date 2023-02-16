/** @type {import('jest').Config} */
const config = {
  projects: ['<rootDir>/design-system', '<rootDir>/packages/keystatic'],
  collectCoverageFrom: [
    '**/packages/**/*.{ts,tsx}',
    '!**/dist/**',
    '!**/{*.stories.tsx,index.ts,types.ts}',
  ],
  verbose: true,
};

module.exports = config;
