import StyleDictionary from 'style-dictionary';

/** Only returns tokens of type `cubicBezier`. */
export const isCubicBezier = (
  token: StyleDictionary.TransformedToken
): boolean => {
  return token?.$type === 'cubicBezier';
};
