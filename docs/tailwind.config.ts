import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

import { MAIN_EL_MAX_WIDTH } from './src/constants';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#1E1E1E',
        // Replace the Slate color palette with a custom one
        slate: {
          '1': 'white',
          '2': '#FAFAFA',
          '3': '#F5F5F5',
          '4': '#EAEAEA',
          '5': '#E1E1E1',
          '6': '#CACACA',
          '7': '#B3B3B3',
          '8': '#8E8E8E',
          '9': '#6E6E6E',
          '10': '#4B4B4B',
          '11': '#2C2C2C',
          '12': '#1E1E1E',
        },
        keystatic: {
          highlight: '#F7DE5B',
          secondary: '#375CDC',
        },
        thinkmill: {
          red: '#ED0000',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...defaultTheme.fontFamily.sans],
      },
      maxWidth: {
        '7xl': MAIN_EL_MAX_WIDTH,
      },
      screens: {
        '2lg': '68.75rem',
      },
      scale: {
        1: '1',
        '-1': '-1',
      },
      boxShadow: {
        card: '0px 16px 48px 0px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('peer-adjacent', ':merge(.peer) + &'); // adds custom support for adjacent sibling combinator
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms')({
      strategy: 'class', // only generate classes (to not globally override Voussiour input styles)
    }),
    require('@tailwindcss/container-queries'),
  ],
} satisfies Config;
