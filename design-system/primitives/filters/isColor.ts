import type StyleDictionary from 'style-dictionary';

/**
 * @description Checks if token is of $type `color`
 * @param token [StyleDictionary.TransformedToken](https://github.com/amzn/style-dictionary/blob/main/types/TransformedToken.d.ts)
 * @returns boolean
 */
export const isColor = (token: StyleDictionary.TransformedToken): boolean => {
  return token.$type === 'color';
};
