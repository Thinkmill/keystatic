import type StyleDictionary from 'style-dictionary';

/**
 * @description Checks if token is source token
 * @param arguments [StyleDictionary.TransformedToken](https://github.com/amzn/style-dictionary/blob/main/types/TransformedToken.d.ts)
 * @returns boolean
 */
export const isSource = (token: StyleDictionary.TransformedToken): boolean => {
  return token.isSource === true;
};
