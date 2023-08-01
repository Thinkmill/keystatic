import type StyleDictionary from 'style-dictionary';

/**
 * @description Checks if token comes from a specific file
 * @param token [StyleDictionary.TransformedToken](https://github.com/amzn/style-dictionary/blob/main/types/TransformedToken.d.ts)
 * @param files - array of file paths
 * @returns boolean
 */
export const isFromFile = (
  token: StyleDictionary.TransformedToken,
  files: string[]
): boolean => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  return files?.includes(token.filePath) === true;
};
