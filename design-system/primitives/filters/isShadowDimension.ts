import type StyleDictionary from 'style-dictionary';

/** temp until we consolidate shadows, which should contain a color value */
export const isShadowDimension = (
  token: StyleDictionary.TransformedToken
): boolean => {
  return token.$type === 'shadow-dimension';
};
