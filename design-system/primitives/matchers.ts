import StyleDictionary from 'style-dictionary';

// categories
export const isCategoryColor = (token: StyleDictionary.TransformedToken) =>
  token?.attributes?.category === 'color';
export const isCategoryFont = (token: StyleDictionary.TransformedToken) =>
  token?.attributes?.category === 'font';
export const isCategorySize = (token: StyleDictionary.TransformedToken) =>
  token?.attributes?.category === 'size';
