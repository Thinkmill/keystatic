import StyleDictionary from 'style-dictionary';

import type { PlatformInitializer } from '../types';
import { TOKEN_PREFIX } from '../constants';
import { isSource } from '../filters';

const getCssSelectors = (
  outputFile: string
): { selector: string; selectorLight: string; selectorDark: string } => {
  // check for dark in the beginning of the output filename
  const lastSlash = outputFile.lastIndexOf('/');
  const outputBasename = outputFile.substring(
    lastSlash + 1,
    outputFile.indexOf('.')
  );
  const themeName = outputBasename.replace(/-/g, '_');
  const mode = outputBasename.substring(0, 4) === 'dark' ? 'dark' : 'light';

  return {
    selector: `[data-color-mode="${mode}"][data-${mode}-theme="${themeName}"]`,
    selectorLight: `[data-color-mode="auto"][data-light-theme="${themeName}"]`,
    selectorDark: `[data-color-mode="auto"][data-dark-theme="${themeName}"]`,
  };
};

// buildPath: `dist/css/`,

export const css: PlatformInitializer = (
  outputFile,
  prefix = TOKEN_PREFIX,
  buildPath,
  options
): StyleDictionary.Platform => {
  const { selector, selectorLight, selectorDark } = getCssSelectors(outputFile);
  return {
    prefix,
    buildPath,
    transforms: [
      // built-in
      'attribute/cti',
      'name/cti/kebab',
      // old
      'ks/font/capsize',
      'ks/size/unit',
      // new
      'color/hex',
      'color/hexAlpha',
      'cubicBezier/css',
    ],
    files: [
      {
        destination: `${outputFile}`,
        format: 'css/themed',
        filter: token => isSource(token) && options?.themed === true,
        options: {
          showFileHeader: false,
          outputReferences: false,
          descriptions: false,
          selector,
          selectorLight,
          selectorDark,
          ...options?.options,
        },
      },
      {
        destination: `${outputFile}`,
        format: 'css/variables',
        filter: token => isSource(token) && options?.themed !== true,
        options: {
          showFileHeader: false,
          descriptions: false,
          outputReferences: true,
          ...options?.options,
        },
      },
    ],
  };
};
