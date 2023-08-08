// credit: https://github.com/primer/primitives/blob/main/src/platforms/figma.ts
import type StyleDictionary from 'style-dictionary';

import { isSource } from '../filters';
import type { PlatformInitializer } from '../types';

const validFigmaToken = (token: StyleDictionary.TransformedToken) => {
  const validTypes = ['color', 'dimension'];
  // is a source token, not an included one
  if (!isSource(token)) {
    return false;
  }

  // has a collection attribute
  if (
    !('$extensions' in token) ||
    !('org.keystar.figma' in token.$extensions) ||
    !('collection' in token.$extensions['org.keystar.figma'])
  ) {
    return false;
  }

  // is a color or dimension type
  return validTypes.includes(token.$type);
};

export const figma: PlatformInitializer = (
  outputFile,
  prefix,
  buildPath,
  options
): StyleDictionary.Platform => ({
  prefix,
  buildPath,
  transforms: [
    'color/rgbaFloat',
    'name/pathToFigma',
    'figma/attributes',
    'dimension/pixelUnitless',
    'fontWeight/number',
  ],
  options: {
    basePxFontSize: 16,
    ...options,
  },
  files: [
    {
      destination: outputFile,
      filter: validFigmaToken,
      format: `json/figma`,
      options: {
        outputReferences: true,
      },
    },
  ],
});
