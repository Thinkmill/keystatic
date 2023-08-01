import type StyleDictionary from 'style-dictionary';

/**
 * @description Checks if token is of $type `border`
 * @param arguments [StyleDictionary.TransformedToken](https://github.com/amzn/style-dictionary/blob/main/types/TransformedToken.d.ts)
 * @returns boolean
 */
export const isBorder = (token: StyleDictionary.TransformedToken): boolean => {
  return token.$type === 'border';
};
