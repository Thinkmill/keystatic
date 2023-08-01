import type StyleDictionary from 'style-dictionary';

const mockTokenDefaults = {
  name: 'tokenName',
  path: ['path'],
  original: {
    value: 'originalValue',
    attributes: {},
  },
  filePath: 'file.json',
  isSource: true,
  value: 'transformedValue',
  attributes: {},
};
/**
 *
 * @param valueOverrides partial StyleDictionary.TransformedToken
 * @returns StyleDictionary.TransformedToken - a merge of {@link mockTokenDefaults} and any valid properties provided in the valueOverrides param
 */
export const getMockToken = (valueOverrides: {
  [key: keyof StyleDictionary.TransformedToken]: unknown;
}): StyleDictionary.TransformedToken => ({
  ...mockTokenDefaults,
  ...valueOverrides,
});
