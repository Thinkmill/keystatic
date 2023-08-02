import type StyleDictionary from 'style-dictionary';

import { isFontWeight } from '../filters';
import { getTokenValue } from './utilities/getTokenValue';

const fontWeightMatrix: Record<string, string[]> = {
  '100': ['thin', 'hairline'],
  '200': ['extra-light', 'ultra-light'],
  '300': ['light'],
  '400': ['normal', 'regular', 'book'],
  '500': ['medium'],
  '600': ['semi-bold', 'demi-bold'],
  '700': ['bold'],
  '800': ['extra-bold', 'ultra-bold'],
  '900': ['black', 'heavy'],
  '950': ['extra-black', 'ultra-black'],
};

export const parseFontWeight = (value: unknown): number => {
  // throw on anything but string and number
  if (typeof value !== 'string' && typeof value !== 'number') {
    throw new Error(
      `Invalid value ${value}, should be a number or fontWeight string`
    );
  }
  // valid string
  if (typeof value === 'string') {
    const key = Object.keys(fontWeightMatrix).find((k: string) =>
      fontWeightMatrix[k].includes(value as string)
    );
    if (key !== undefined) {
      return parseInt(key);
    }
  }
  // if number as string
  if (
    typeof value === 'string' &&
    typeof parseInt(value) === 'number' &&
    !isNaN(parseInt(value))
  ) {
    value = parseInt(value);
  }
  // return if valid numver
  if (typeof value === 'number' && value > 0 && value <= 1000) {
    return value;
  }
  // invalid value
  throw new Error(
    `Invalid value ${value}, should be a number or fontWeight string`
  );
};

/**
 * @description converts fontWeight tokens value to numeric value
 * @type value transformer — [StyleDictionary.ValueTransform](https://github.com/amzn/style-dictionary/blob/main/types/Transform.d.ts)
 * @matcher matches all tokens of $type `fontWeight`
 * @transformer returns a number
 */
export const fontWeightToNumber: StyleDictionary.Transform = {
  type: `value`,
  transitive: true,
  matcher: isFontWeight,
  transformer: (token: StyleDictionary.TransformedToken): number =>
    parseFontWeight(getTokenValue(token)),
};
