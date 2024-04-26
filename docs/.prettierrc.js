const defaultPrettierConfig = require('../.prettierrc.json');

module.exports = {
  ...defaultPrettierConfig,
  plugins: [
    ...(defaultPrettierConfig.plugins || []),
    'prettier-plugin-tailwindcss',
  ],
};
