import StyleDictionary from 'style-dictionary';

export const sizeUnit: StyleDictionary.Transform = {
  type: 'value',
  transitive: true,
  matcher: (token: StyleDictionary.TransformedToken) => {
    const isScale =
      ['fontsize', 'size'].includes(token?.attributes?.category || '') &&
      token?.attributes?.type === 'scale';
    return isScale || 'unit' in token;
  },
  transformer: unitTransformer,
};

function unitTransformer(token: StyleDictionary.TransformedToken) {
  // TODO: inherit `unit` from the "original" token?
  let { unit = 'px', value } = token;
  let number = parseFloat(value);

  return number + unit;
}
