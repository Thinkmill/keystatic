const fs = require('fs');
const path = require('path');

module.exports = {
  stories: [
    ...fs
      .readdirSync(path.join(__dirname, '../../packages'))
      .filter(dir =>
        fs.existsSync(path.join(__dirname, `../../packages/${dir}/stories`))
      )
      .map(f => `../../packages/${f}/stories/**/*.stories.tsx`),
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
