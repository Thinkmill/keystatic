const { MAIN_EL_MAX_WIDTH } = require('./src/constants');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        black: '#171717',
        keystatic: {
          gray: {
            DEFAULT: '#E8E8E8',
            light: '#F8F8F8',
            dark: '#2e2e2e',
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
      scale: {
        1: '1',
        '-1': '-1',
      },
      boxShadow: {
        card: '0px 16px 48px 0px rgba(0, 0, 0, 0.08)',
      },
      keyframes: {
        bringCodeEditorToFront: {
          '0%': {
            zIndex: 3,
            filter: 'brightness(80%)',
          },
          '100%': {
            zIndex: 3,
            filter: 'brightness(100%)',
          },
        },
        sendCodeEditorToBack: {
          '100%': {
            zIndex: -1,
            filter: 'brightness(80%)',
          },
          '0%': {
            zIndex: -1,
            filter: 'brightness(100%)',
          },
        },
        bringBrowserToFront: {
          '0%': {
            zIndex: 3,
            filter: 'brightness(95%)',
          },
          '100%': {
            zIndex: 3,
            filter: 'brightness(100%)',
          },
        },
        sendBrowserToBack: {
          '100%': {
            zIndex: -1,
            filter: 'brightness(95%)',
          },
          '0%': {
            zIndex: -1,
            filter: 'brightness(100%)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
