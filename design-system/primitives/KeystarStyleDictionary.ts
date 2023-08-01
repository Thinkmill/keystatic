import StyleDictionary from 'style-dictionary';

import { javascriptTokenMap } from './formatters';
import { w3cJsonParser } from './parsers';
import {
  colorModify,
  fontCapsize,
  fontUnit,
  namePathToKebabCase,
  sizeShadow,
  sizeUnit,
} from './transformers';

// Parsers
// -----------------------------------------------------------------------------

StyleDictionary.registerParser(w3cJsonParser);

// Formatters
// -----------------------------------------------------------------------------

StyleDictionary.registerFormat({
  name: 'javascript/css-token-map',
  formatter: javascriptTokenMap,
});

// Transformers
// -----------------------------------------------------------------------------

StyleDictionary.registerTransform({
  name: 'name/pathToKebabCase',
  ...namePathToKebabCase,
});

StyleDictionary.registerTransform({
  name: 'ks/color/modify',
  ...colorModify,
});

StyleDictionary.registerTransform({
  name: 'ks/font/capsize',
  ...fontCapsize,
});

StyleDictionary.registerTransform({
  name: 'ks/font/unit',
  ...fontUnit,
});

StyleDictionary.registerTransform({
  name: 'ks/size/shadow',
  ...sizeShadow,
});

StyleDictionary.registerTransform({
  name: 'ks/size/unit',
  ...sizeUnit,
});

/**
 * @name {@link KeystarStyleDictionary}
 * @description Returns style dictionary object with Keystar preset parsers, formatters and transformers.
 */
export const KeystarStyleDictionary: StyleDictionary.Core = StyleDictionary;
