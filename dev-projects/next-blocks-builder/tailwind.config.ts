import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import plugin from 'tailwindcss/plugin';

const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {},
  plugins: [
    typography,
    // Surface variants
    plugin(function ({ addVariant }) {
      addVariant('surface-light', '[data-surface="light"] &');
      addVariant('surface-light-subtle', '[data-surface="light-subtle"] &');
      addVariant('surface-dark', '[data-surface="dark"] &');
      addVariant('surface-dark-subtle', '[data-surface="dark-subtle"] &');
      addVariant('surface-splash', '[data-surface="splash"] &');

      // normal/inverse color schemes
      addVariant('surface-inverse', [
        '&[data-inverse="true"],[data-inverse="true"] &',
      ]);
      addVariant('surface-normal', '[data-inverse="false"] &');
    }),
  ],
} satisfies Config;

export default config;
