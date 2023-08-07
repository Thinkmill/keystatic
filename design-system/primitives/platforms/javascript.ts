import StyleDictionary from 'style-dictionary';

import { TOKEN_PREFIX } from '../constants';
import { isSource } from '../filters';
import { PlatformInitializer } from '../types';

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
