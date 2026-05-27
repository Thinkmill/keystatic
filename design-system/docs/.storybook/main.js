const fs = require('fs');
const path = require('path');
module.exports = {
  stories: [
    '../../pkg/src/**/*.stories.tsx',
    '../stories/*.stories.@(js|jsx|ts|tsx)',
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-actions',
    '@storybook/addon-controls',
    '@storybook/addon-links',
    'storybook-dark-mode',
    './addons/provider/register',
    './addons/theme/register',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  webpackFinal: async config => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias ?? {}),
        '@storybook/react-dom-shim': '@storybook/react-dom-shim/dist/react-18',
      },
    },
  }),
  typescript: {
    reactDocgen: false,
  },
};
