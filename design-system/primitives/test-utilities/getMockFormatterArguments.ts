import type { FormatterArguments } from 'style-dictionary/types/Format';

import { getMockDictionary } from './index.ts';

const defaultFormatterArguments: FormatterArguments = {
  dictionary: getMockDictionary(),
  file: {
    destination: 'tokens.ts',
    options: {
      showFileHeader: false,
    },
  },
  options: {},
  platform: {},
};

export const getMockFormatterArguments = (
  overrides?: Partial<FormatterArguments>
): FormatterArguments => {
  return {
    ...defaultFormatterArguments,
    ...(overrides || {}),
  };
};
