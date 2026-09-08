import StyleDictionary from 'style-dictionary';

import { TOKEN_PREFIX } from '../constants.ts';
import { isSource } from '../filters/index.ts';
import type { PlatformInitializer } from '../types.ts';

export const javascript: PlatformInitializer = (
  outputFile,
  prefix = TOKEN_PREFIX,
  buildPath
): StyleDictionary.Platform => {
  return {
    buildPath,
    prefix,
    transforms: ['name/cti/kebab'],
    files: [
      {
        destination: outputFile,
        format: 'javascript/token-map',
        filter: isSource,
      },
    ],
  };
};
