import StyleDictionary from 'style-dictionary';

export const sizeShadow: StyleDictionary.Transform = {
  type: 'value',
  // only "transitive" transforms will be applied to tokens that
  // alias/reference other tokens
  transitive: true,
  matcher: (token: StyleDictionary.TransformedToken) => {
    const oVal = token.original.value;
    return typeof oVal === 'object' && 'blur' in oVal && 'spread' in oVal;
  },
  transformer: function colorModify(token: StyleDictionary.TransformedToken) {
    const { x, y, blur, spread } = token.original.value;
    return `${x} ${y} ${blur} ${spread}`;
  },
};
