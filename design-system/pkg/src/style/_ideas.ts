export const tokenShape = {
  typography: {
    fontFamily: {},
    fontWeight: {},
    lineheight: {},
  },
  color: {
    scale: {}, // --ksv-color-scale-*

    background: {
      // CSS: background-color
      surface: '', // --ksv-color-background-surface
      accent: '',
    },
    border: {}, // CSS: border-color
    icon: {}, // CSS: fill, stroke
    text: {}, // CSS: background-color, border-color, color

    alias: {
      focusRing: '', // --ksv-alias-focus-ring-color
      textDisabled: 'ref', // --ksv-alias-text-disabled-color
    },
  },
  fontsize: {
    scale: {}, // --ksv-fontsize-scale-*

    text: {
      small: '',
      regular: '', // --ksv-fontsize-text-regular
      medium: '',
      large: '',
    },
    heading: {
      small: '',
      regular: '',
      medium: '',
      large: '',
    },

    alias: {
      body: 'ref', // --ksv-alias-body-fontsize
    },
  },
  size: {
    scale: {},

    border: {}, // CSS: border-width
    element: {}, // CSS: [min|max]height/width
    icon: {},
    radius: {}, // CSS: border-radius
    space: {}, // CSS: margin, padding, [row|column]gap

    alias: {
      focusRing: '', // --ksv-alias-focus-ring-size
      gridGutter: 'ref', // --ksv-alias-grid-gutter-size
    },
  },
};
