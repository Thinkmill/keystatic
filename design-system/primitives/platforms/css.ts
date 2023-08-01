import StyleDictionary from 'style-dictionary';

import { TOKEN_PREFIX } from '../constants';

export const css = (scale: string, scheme: string) => {
  return {
    prefix: TOKEN_PREFIX,
    transforms: [
      'attribute/cti',
      'name/cti/kebab',

      'ks/color/modify',
      'ks/font/capsize',
      'ks/size/unit',
    ],
    buildPath: `build/css/`,
    files: [
      {
        destination: `1-static.css`,
        format: 'css/variables',
        filter: (token: StyleDictionary.TransformedToken) => token.isStatic,
        options: {
          // outputReferences: true,
          selector: '.ksv-theme',
        },
      },
      {
        destination: `2-size-shared.css`,
        format: 'css/variables',
        filter: (token: StyleDictionary.TransformedToken) =>
          token.isShared &&
          ['fontsize', 'size'].includes(token.attributes?.category || '') &&
          // modfied tokens cannot be shared by reference
          !token.modify,
        options: {
          outputReferences: true,
          selector: scaleSelector('medium', 'large'),
        },
      },
      {
        destination: `3-color-shared.css`,
        format: 'css/variables',
        filter: (token: StyleDictionary.TransformedToken) =>
          token.isShared &&
          token.attributes?.category === 'color' &&
          // modfied tokens cannot be shared by reference
          !token.modify,
        options: {
          outputReferences: true,
          selector: schemeSelector('light', 'dark'),
        },
      },
      {
        destination: `4-size-${scale}.css`,
        filter: (token: StyleDictionary.TransformedToken) =>
          !token.isShared &&
          !token.isStatic &&
          ['fontsize', 'size'].includes(token?.attributes?.category || '') &&
          !isNaN(parseFloat(token.value)),
        format: 'css/variables',
        options: {
          outputReferences: true,
          selector: scaleSelector(scale),
        },
      },
      {
        destination: `5-color-${scheme}.css`,
        filter: (token: StyleDictionary.TransformedToken) =>
          !token.isShared &&
          !token.isStatic &&
          token.attributes?.category === 'color',
        format: 'css/variables',
        options: {
          outputReferences: true,
          selector: schemeSelector(scheme),
        },
      },
    ],
  };
};

const selector = (prefix = 'theme', ...args: string[]) => {
  return args.map(suffix => `.ksv-${prefix}` + '--' + suffix).join(', ');
};
const scaleSelector = (...args: string[]) => {
  return selector('scale', ...args);
};
const schemeSelector = (...args: string[]) => {
  return selector('scheme', ...args);
};
