import { createRequire } from 'node:module';
import * as tailwindcssPlugin from 'prettier-plugin-tailwindcss';

const require = createRequire(import.meta.url);
const defaultPrettierConfig = require('../.prettierrc.json');

export default {
  ...defaultPrettierConfig,
  plugins: [...(defaultPrettierConfig.plugins || []), tailwindcssPlugin],
};
