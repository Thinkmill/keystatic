const defaultPrettierConfig = require('../.prettierrc.js');

module.exports = {
  ...defaultPrettierConfig,
  plugins: [
    ...(defaultPrettierConfig.plugins || []),
    'prettier-plugin-tailwindcss',
  ],
};
