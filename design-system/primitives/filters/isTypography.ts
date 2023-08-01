import type StyleDictionary from 'style-dictionary';

/**
 * @description Checks if token is of $type `typography`
 * @param arguments [StyleDictionary.TransformedToken](https://github.com/amzn/style-dictionary/blob/main/types/TransformedToken.d.ts)
 * @returns boolean
 */
export const isTypography = (
  token: StyleDictionary.TransformedToken
): boolean => {
  return token.$type === 'typography';
};
