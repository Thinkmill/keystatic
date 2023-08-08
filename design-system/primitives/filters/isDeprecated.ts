import type StyleDictionary from 'style-dictionary';

/**
 * @description Checks if token has a valid `deprecated` property
 * @param arguments [StyleDictionary.TransformedToken](https://github.com/amzn/style-dictionary/blob/main/types/TransformedToken.d.ts)
 * @returns boolean
 */
export const isDeprecated = (
  token: StyleDictionary.TransformedToken
): boolean => {
  return token.deprecated === true || typeof token.deprecated === 'string';
};
