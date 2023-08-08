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
export const cssVariables: StyleDictionary.Formatter = ({
  dictionary,
  options = {},
  file,
}: FormatterArguments) => {
  const selector = options.selector ? options.selector : SELECTOR_DEFAULT;
  const { outputReferences, descriptions } = options;
  const formatting: LineFormatting = {
    commentStyle: descriptions ? 'long' : 'none',
  };

  return `${fileHeader({ file })}${selector} {\n${formattedVariables({
    format: 'css',
    dictionary,
    outputReferences,
    formatting,
  })}\n}\n`;
};
