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
      height: {
        124: '31rem',
        152: '38rem',
      },
      width: {
        168: '42rem',
        340: '85rem',
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
        bringToFront: {
          '0%': {
            zIndex: -1,
            left: '10%',
            top: '1%',
            transform: 'scale(0.9)',
          },
          '49%': {
            zIndex: -1,
            left: 0,
          },
          '50%': {
            zIndex: 3,
            left: 0,
            top: '1%',
          },
          '100%': {
            zIndex: 3,
            left: 0,
            transform: 'scale(1)',
          },
        },
        sendToBack: {
          '100%': {
            zIndex: -1,
            left: '10%',
            top: '1%',
            transform: 'scale(0.9)',
          },
          '50%': {
            zIndex: -1,
            left: 0,
          },
          '49%': {
            zIndex: 3,
            left: 0,
            top: '1%',
          },
          '0%': {
            zIndex: 3,
            left: '10%',
            top: '1%',
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
