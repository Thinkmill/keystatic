import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';
import plugin from 'tailwindcss/plugin';

const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: { extend: { maxWidth: { big: '96rem' } } },
  plugins: [
    typography,
    containerQueries,
    // Surface variants
    plugin(function ({ addVariant }) {
      addVariant('surface-white', '[data-surface="white"] &');
      addVariant('surface-off-white', '[data-surface="off-white"] &');
      addVariant('surface-black', '[data-surface="black"] &');
      addVariant('surface-off-black', '[data-surface="off-black"] &');
      addVariant('surface-splash', '[data-surface="splash"] &');

      // Normal/inverse color schemes
      addVariant('surface-inverse', [
        '&[data-inverse="true"],[data-inverse="true"] &',
      ]);
      addVariant('surface-normal', '[data-inverse="false"] &');
    }),
  ],
} satisfies Config;

export default config;
