import StyleDictionary from 'style-dictionary';

export const fontUnit: StyleDictionary.Transform = {
  type: 'value',
  transitive: true,
  matcher: (token: StyleDictionary.TransformedToken) =>
    token?.attributes?.category === 'fontsize' &&
    !isNaN(parseFloat(token.value)) &&
    !token.unitless,
  transformer: unitTransformer,
};

function unitTransformer(token: StyleDictionary.TransformedToken) {
  // TODO: inherit `unit` from the "original" token?
  let { unit = 'px', value } = token;
  let number = parseFloat(value);

  return number + unit;
}
