import type StyleDictionary from 'style-dictionary';
import { isColor } from './isColor';

/**
 * @description Checks if token is color with an alpha value
 * @param arguments [StyleDictionary.TransformedToken](https://github.com/amzn/style-dictionary/blob/main/types/TransformedToken.d.ts)
 * @returns boolean
 */
export const isColorWithAlpha = (
  token: StyleDictionary.TransformedToken
): boolean => {
  return (
    isColor(token) &&
    token.alpha !== undefined &&
    typeof token.alpha === 'number'
  );
};
