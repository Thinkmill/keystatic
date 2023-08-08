import type StyleDictionary from 'style-dictionary';

import { isDimension } from '../filters';

/**
 * @description base font size from options or 16
 * @param options
 * @returns number
 */
const getBasePxFontSize = (options?: StyleDictionary.Platform): number =>
  (options && options.basePxFontSize) || 16;

/**
 * @description checks if token value has a specific unit
 * @param value token value
 * @param unit unit string like px or value
 * @returns boolean
 */
const hasUnit = (value: string | number, unit: string): boolean => {
  if (typeof value === 'number') {
    return false;
  }

  return value.indexOf(unit) > -1;
};

/**
 * @description converts dimension tokens value to pixel value without unit, ignores `em` as they are relative to the font size of the parent element
 * @type value transformer — [StyleDictionary.ValueTransform](https://github.com/amzn/style-dictionary/blob/main/types/Transform.d.ts)
 * @matcher matches all tokens of $type `dimension`
 * @transformer returns a float number
 */
export const dimensionToPixelUnitless: StyleDictionary.Transform = {
  type: `value`,
  transitive: true,
  matcher: isDimension,
  transformer: (
    token: StyleDictionary.TransformedToken,
    options?: StyleDictionary.Platform
  ) => {
    const baseFont = getBasePxFontSize(options);
    const floatVal = parseFloat(token.value);

    if (isNaN(floatVal)) {
      throw new Error(
        `Invalid dimension token: '${token.name}: ${token.value}' is not valid and cannot be transform to 'float' \n`
      );
    }

    if (floatVal === 0) {
      return 0;
    }

    if (hasUnit(token.value, 'rem')) {
      return floatVal * baseFont;
    }

    if (hasUnit(token.value, 'px')) {
      return floatVal;
    }

    return token.value;
  },
};
