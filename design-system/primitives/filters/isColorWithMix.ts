import type StyleDictionary from 'style-dictionary';
import { isColor } from './isColor';

const throwError = (token: StyleDictionary.TransformedToken) => {
  throw new Error(
    `Invalid mix property on token: ${token.name}. "mix.color": ${
      token.mix.color
    }, "mix.weight": ${
      typeof token.mix.weight === 'string'
        ? `"${token.mix.weight}" (string)`
        : token.mix.weight
    } must be a number between 0 and 1. In file: "${token.filePath}".`
  );
};

/**
 * @description Checks if token is color and has a mix property
 * @param arguments [StyleDictionary.TransformedToken](https://github.com/amzn/style-dictionary/blob/main/types/TransformedToken.d.ts)
 * @returns boolean
 */
export const isColorWithMix = (
  token: StyleDictionary.TransformedToken
): boolean => {
  // no color or no mix property
  if (!isColor(token) || token.mix === undefined || token.mix === null) {
    return false;
  }
  // invalid mix property
  if (
    typeof token.mix.color !== 'string' ||
    typeof token.mix.weight !== 'number' ||
    token.mix.weight < 0 ||
    token.mix.weight > 1
  ) {
    throwError(token);
  }
  // valid mix property
  return true;
};
