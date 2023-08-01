import type StyleDictionary from 'style-dictionary';

import { getMockToken } from './getMockToken';

const mockDictionaryDefault = {
  tokens: {
    subgroup: {
      red: getMockToken({
        name: 'red',
        path: ['tokens', 'subgroup', 'red'],
      }),
    },
  },
};

export const getMockDictionary = (
  tokens?: StyleDictionary.TransformedTokens
): StyleDictionary.Dictionary => ({
  allTokens: Object.values((tokens || mockDictionaryDefault).tokens.subgroup),
  tokens: tokens || mockDictionaryDefault,
  allProperties: Object.values(
    (tokens || mockDictionaryDefault).tokens.subgroup
  ),
  properties: tokens || mockDictionaryDefault,
  usesReference: _value => false,
  getReferences: _value => [],
});
