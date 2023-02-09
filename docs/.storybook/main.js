module.exports = {
  stories: [
    '../../packages/*/stories/**/*.stories.@(js|jsx|ts|tsx)',
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

  framework: '@storybook/react',
  typescript: {
    reactDocgen: false,
  },
};
