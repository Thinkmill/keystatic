import StyleDictionary from 'style-dictionary';

/** Only returns tokens of type `capsize`. */
export const isCapsize = (token: StyleDictionary.TransformedToken): boolean => {
  return token?.$type === 'capsize';
};
