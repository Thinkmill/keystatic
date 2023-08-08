import StyleDictionary from 'style-dictionary';

/** Only returns tokens of type `duration`. */
export const isDuration = (
  token: StyleDictionary.TransformedToken
): boolean => {
  return token?.$type === 'duration';
};
