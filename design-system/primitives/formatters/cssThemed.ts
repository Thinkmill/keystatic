import StyleDictionary from 'style-dictionary';
import type { FormatterArguments } from 'style-dictionary/types/Format';
import { format } from 'prettier';
import type { LineFormatting } from 'style-dictionary/types/FormatHelpers';

const { fileHeader, formattedVariables } = StyleDictionary.formatHelpers;

/**
 * @description Converts `StyleDictionary.dictionary.tokens` to css with prefers dark and light section
 * @param arguments [FormatterArguments](https://github.com/amzn/style-dictionary/blob/main/types/Format.d.ts)
 * @param arguments.options outputReferences `boolean`, selector `string`, selectorLight `string`, selectorDark `string`
 * @returns formatted `string`
 */
export const cssThemed: StyleDictionary.Formatter = ({
  dictionary,
  options = {},
  file,
}: FormatterArguments) => {
  const { selector, selectorLight, selectorDark } = options;
  const { outputReferences, descriptions } = options;
  const formatting: LineFormatting = {
    commentStyle: descriptions ? 'long' : 'none',
  };
  // add file header
  const output = [fileHeader({ file })];
  // add single theme css
  output.push(`${selector || ':root'}${
    selectorLight ? `, ${selectorLight}` : ''
  }{
    ${formattedVariables({
      format: 'css',
      dictionary,
      outputReferences,
      formatting,
    })}
  }`);
  // add auto dark theme css
  if (selectorDark) {
    output.push(`@media (prefers-color-scheme: dark) {
      ${selectorDark} {
        ${formattedVariables({
          format: 'css',
          dictionary,
          outputReferences,
          formatting,
        })}
      }
    }`);
  }
  // return prettified
  return format(output.join('\n'), { parser: 'css', printWidth: 500 });
};
