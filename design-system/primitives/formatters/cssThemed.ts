import { format } from '@prettier/sync';
import StyleDictionary from 'style-dictionary';
import type { FormatterArguments } from 'style-dictionary/types/Format';
import type { LineFormatting } from 'style-dictionary/types/FormatHelpers';

import { SELECTOR_DEFAULT } from '../constants';

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
  const { descriptions, outputReferences, selector, selectorDark } = options;
  const formatting: LineFormatting = {
    commentStyle: descriptions ? 'long' : 'none',
  };
  // add file header
  const output = [fileHeader({ file })];

  let colorScheme = selector.includes('dark') ? 'dark' : 'light';

  // add single theme css
  output.push(`${selector || SELECTOR_DEFAULT} {
    color-scheme: ${colorScheme};

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
        color-scheme: dark;

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
