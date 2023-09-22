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
      sand: {
        '1': '#fdfdfc',
        '2': '#f9f9f8',
        '3': '#f2f2f0',
        '4': '#ebebe9',
        '5': '#e4e4e2',
        '6': '#ddddda',
        '7': '#d3d2ce',
        '8': '#bcbbb5',
        '9': '#8d8d86',
        '10': '#80807a',
        '11': '#63635e',
        '12': '#21201c',
      },
      sandAlpha: {
        '1': '#58580503',
        '2': '#29290507',
        '3': '#2222010f',
        '4': '#19190216',
        '5': '#1212011d',
        '6': '#16160225',
        '7': '#1b160131',
        '8': '#1915014a',
        '9': '#0f0f0079',
        '10': '#0b0b0085',
        '11': '#080800a1',
        '12': '#060500e3',
      },
      yellow: {
        '1': '#fdfdf9',
        '2': '#fffbe0',
        '3': '#fff8c6',
        '4': '#fcf3af',
        '5': '#f7ea9b',
        '6': '#ecdd85',
        '7': '#dac56e',
        '8': '#c9aa45',
        '9': '#fbe32d',
        '10': '#f9da10',
        '11': '#775f28',
        '12': '#473b1f',
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
      pink: {
        '1': '#fffcfe',
        '2': '#fff7fc',
        '3': '#feeef8',
        '4': '#fce5f3',
        '5': '#f9d8ec',
        '6': '#f3c6e2',
        '7': '#ecadd4',
        '8': '#e38ec3',
        '9': '#d6409f',
        '10': '#cd3093',
        '11': '#c41c87',
        '12': '#651249',
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
      violet: {
        '1': '#fdfcfe',
        '2': '#fbfaff',
        '3': '#f5f2ff',
        '4': '#ede9fe',
        '5': '#e4defc',
        '6': '#d7cff9',
        '7': '#c4b8f3',
        '8': '#aa99ec',
        '9': '#6e56cf',
        '10': '#644fc1',
        '11': '#5746af',
        '12': '#2f265f',
      },
      iris: {
        '1': '#fdfdff',
        '2': '#fafaff',
        '3': '#f3f3ff',
        '4': '#ebebfe',
        '5': '#e0e0fd',
        '6': '#d0d0fa',
        '7': '#babbf5',
        '8': '#9b9ef0',
        '9': '#5b5bd6',
        '10': '#5353ce',
        '11': '#4747c2',
        '12': '#272962',
      },
      indigo: {
        '1': '#fdfdfe',
        '2': '#f8faff',
        '3': '#f0f4ff',
        '4': '#e6edfe',
        '5': '#d9e2fc',
        '6': '#c6d4f9',
        '7': '#aec0f5',
        '8': '#8da4ef',
        '9': '#3e63dd',
        '10': '#3a5ccc',
        '11': '#3451b2',
        '12': '#1f2d5c',
      },
      blue: {
        '1': '#fbfdff',
        '2': '#f5faff',
        '3': '#edf6ff',
        '4': '#e1f0ff',
        '5': '#cee7fe',
        '6': '#b7d9f8',
        '7': '#96c7f2',
        '8': '#5eb0ef',
        '9': '#0091ff',
        '10': '#0880ea',
        '11': '#0b68cb',
        '12': '#113264',
      },
      cyan: {
        '1': '#fafdfe',
        '2': '#f2fcfd',
        '3': '#e7f9fb',
        '4': '#d8f3f6',
        '5': '#c4eaef',
        '6': '#aadee6',
        '7': '#84cdda',
        '8': '#3db9cf',
        '9': '#05a2c2',
        '10': '#0894b3',
        '11': '#0c7792',
        '12': '#0d3c48',
      },
      grass: {
        '1': '#fbfefb',
        '2': '#f3fcf3',
        '3': '#ebf9eb',
        '4': '#dff3df',
        '5': '#ceebcf',
        '6': '#b7dfba',
        '7': '#97cf9c',
        '8': '#65ba75',
        '9': '#46a758',
        '10': '#3d9a50',
        '11': '#297c3b',
        '12': '#203c25',
      },
      whiteAlpha: {
        '1': '#00000000',
        '2': '#ffffff03',
        '3': '#ffffff12',
        '4': '#ffffff1b',
        '5': '#ffffff22',
        '6': '#ffffff2b',
        '7': '#ffffff37',
        '8': '#ffffff50',
        '9': '#ffffff5f',
        '10': '#ffffff74',
        '11': '#ffffffa9',
        '12': '#ffffffec',
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
      backgroundImage: {
        'pattern-texture': "url('../app/texture.png')",
        // Pattern texture. Used to apply texture over svg pattern artwork. Apply below classes to the svg's sibling element:
        // -
        // <svg…</svg>
        // <div className="absolute left-0 top-0 h-full w-full bg-pattern-texture opacity-80 mix-blend-overlay" />
        // -
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
