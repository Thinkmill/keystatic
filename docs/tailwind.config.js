const { MAIN_EL_MAX_WIDTH } = require('./src/constants');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        keystatic: {
          gray: {
            DEFAULT: '#F0EDEB',
            light: '#F9F8F7',
            dark: '#4D4D4D',
          },
          highlight: '#F7DE5B',
          secondary: '#375CDC',
        },
        thinkmill: {
          red: '#ED0000',
        },
      },
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      maxWidth: {
        '7xl': MAIN_EL_MAX_WIDTH,
      },
      screens: {
        '2lg': '68.75rem',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
