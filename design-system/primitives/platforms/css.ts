import StyleDictionary from 'style-dictionary';

import type { PlatformInitializer } from '../types';
import {
  SELECTOR_AUTO,
  SELECTOR_DARK,
  SELECTOR_LIGHT,
  TOKEN_PREFIX,
} from '../constants';
import { isSource } from '../filters';
import { filenameFromPath } from '../utilities';

const getCssSelectors = (
  outputFile: string
): { selector: string; selectorDark?: string } => {
  const mode = filenameFromPath(outputFile);

  if (mode === 'dark') {
    return {
      selector: SELECTOR_DARK,
      selectorDark: SELECTOR_AUTO,
    };
  }

  return {
    selector: `${SELECTOR_AUTO}, ${SELECTOR_LIGHT}`,
  };
};

export const css: PlatformInitializer = (
  outputFile,
  prefix = TOKEN_PREFIX,
  buildPath,
  options
): StyleDictionary.Platform => {
  const { selector, selectorDark } = getCssSelectors(outputFile);
  return {
    prefix,
    buildPath,
    transforms: [
      // built-in
      'name/cti/kebab',
      // new
      // 'name/pathToKebabCase',
      'color/hex',
      // 'color/hexAlpha',
      'color/cssAlpha',
      'cubicBezier/css',
      'dimension/shadowToCssPartial',
      'typography/capsize',
    ],
    files: [
      {
        destination: `${outputFile}`,
        format: 'css/themed',
        filter: token => isSource(token) && options?.themed === true,
        options: {
          showFileHeader: false,
          outputReferences: true,
          descriptions: false,
          selector,
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
