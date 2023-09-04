import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';
import plugin from 'tailwindcss/plugin';

import { MAIN_EL_MAX_WIDTH } from './src/constants';

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    /*
      HEADS UP: We *intentionally* overwrite (instead of extending)
      the whole Tailwind colors to restrict the set of choices
      to the custom color palette with Keystar UI tokens.

      Worth noting that the naming convention for shades is slightly
      different from the typical Tailwind `-50` to `-950` scale.
      We use a `1` to `12` scale, where `1` is the lightest.
    */
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#1E1E1E',
      white: '#FFFFFF',
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
      amber: {
        '1': '#FEFDFB',
        '2': '#FFF9ED',
        '3': '#FFF4D5',
        '4': '#FFECBC',
        '5': '#FFE3A2',
        '6': '#FFD386',
        '7': '#F3BA63',
        '8': '#EE9D2B',
        '9': '#FFB224',
        '10': '#FFA01C',
        '11': '#AD5700',
        '12': '#4E2009',
      },
      green: {
        '1': '#FBFEFC',
        '2': '#F2FCF5',
        '3': '#E9F9EE',
        '4': '#DDF3E4',
        '5': '#CCEBD7',
        '6': '#B4DFC4',
        '7': '#92CEAC',
        '8': '#5BB98C',
        '9': '#30A46C',
        '10': '#299764',
        '11': '#18794E',
        '12': '#153226',
      },
      purple: {
        '1': '#FEFCFE',
        '2': '#FDFAFF',
        '3': '#F9F1FE',
        '4': '#F3E7FC',
        '5': '#EDDBF9',
        '6': '#E3CCF4',
        '7': '#D3B4ED',
        '8': '#BE93E4',
        '9': '#8E4EC6',
        '10': '#8445BC',
        '11': '#793AAF',
        '12': '#2B0E44',
      },
      keystatic: {
        highlight: '#F7DE5B',
        secondary: '#375CDC',
      },
      thinkmill: {
        red: '#ED0000',
      },
    },
    /*
      From here onwards, we extend default theme values
    */
    extend: {
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
