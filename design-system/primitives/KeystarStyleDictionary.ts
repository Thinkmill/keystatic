import StyleDictionary from 'style-dictionary';

import {
  cssThemed,
  cssVariables,
  javascriptTokenMap,
  jsonFigma,
} from './formatters';
import { w3cJsonParser } from './parsers';
import {
  colorToHex,
  colorToHexAlpha,
  figmaAttributes,
  fontCapsize,
  fontUnit,
  namePathToFigma,
  namePathToKebabCase,
  sizeShadow,
  sizeUnit,
} from './transformers';
import { dimensionToPixelUnitless } from './transformers/dimensionToPixelUnitless';
import { colorToRgbaFloat } from './transformers/colorToRgbaFloat';
import { fontWeightToNumber } from './transformers/fontWeightToNumber';

// Parsers
// -----------------------------------------------------------------------------

StyleDictionary.registerParser(w3cJsonParser);

// Formatters
// -----------------------------------------------------------------------------

StyleDictionary.registerFormat({
  name: 'css/themed',
  formatter: cssThemed,
});

StyleDictionary.registerFormat({
  name: 'css/variables',
  formatter: cssVariables,
});

StyleDictionary.registerFormat({
  name: 'javascript/token-map',
  formatter: javascriptTokenMap,
});

StyleDictionary.registerFormat({
  name: 'json/figma',
  formatter: jsonFigma,
});

// Transformers
// -----------------------------------------------------------------------------

StyleDictionary.registerTransform({
  name: 'color/hex',
  ...colorToHex,
});

StyleDictionary.registerTransform({
  name: 'color/hexAlpha',
  ...colorToHexAlpha,
});

StyleDictionary.registerTransform({
  name: 'color/rgbaFloat',
  ...colorToRgbaFloat,
});

StyleDictionary.registerTransform({
  name: 'dimension/pixelUnitless',
  ...dimensionToPixelUnitless,
});

StyleDictionary.registerTransform({
  name: 'figma/attributes',
  ...figmaAttributes,
});

StyleDictionary.registerTransform({
  name: 'fontWeight/number',
  ...fontWeightToNumber,
});

StyleDictionary.registerTransform({
  name: 'name/pathToFigma',
  ...namePathToFigma,
});

StyleDictionary.registerTransform({
  name: 'name/pathToKebabCase',
  ...namePathToKebabCase,
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
