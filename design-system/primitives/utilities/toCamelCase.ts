import { upperCaseFirstCharacter } from './upperCaseFirstCharacter';

export const toCamelCase = (string: string | string[]) => {
  if (!Array.isArray(string)) {
    string = [string];
  }
  // match unsupported characters
  const regex = /[^a-zA-Z0-9]+/g;
  // replace any non-letter and non-number character and split into word array
  const stringArray = string
    .filter(part => part !== '@')
    .filter(Boolean)
    .join(' ')
    .replace(regex, ' ')
    .split(' ');
  return (
    stringArray
      // remove undefined if exists
      .filter((part: unknown): part is string => typeof part === 'string')
      // ucFirst all but first part
      .map((part: string, index: number) => {
        if (index > 0) {
          return upperCaseFirstCharacter(part);
        }
        return part;
      })
      .join('')
  );
};
