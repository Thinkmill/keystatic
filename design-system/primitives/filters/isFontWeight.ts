import type StyleDictionary from 'style-dictionary';

/**
 * @description Checks if token is of $type `fontWeight`
 * @param arguments [StyleDictionary.TransformedToken](https://github.com/amzn/style-dictionary/blob/main/types/TransformedToken.d.ts)
 * @returns boolean
 */
export const isFontWeight = (
  token: StyleDictionary.TransformedToken
): boolean => {
  return token.$type === 'fontWeight';
};
