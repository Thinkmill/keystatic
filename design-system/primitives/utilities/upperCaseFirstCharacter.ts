/**
 * upperCaseFirstCharacter
 * @scope custom implementation should only be used within `name path to ...` transformer
 * @description changes first letter to uppercase but keeps the rest of the word as is
 * @param string
 * @returns string
 */
export const upperCaseFirstCharacter = ([
  firstLetter,
  ...restOfWord
]: string): string => {
  return firstLetter.toUpperCase() + restOfWord.join('');
};
