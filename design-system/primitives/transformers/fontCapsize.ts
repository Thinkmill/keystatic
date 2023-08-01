import { getCapHeight, precomputeValues } from '@capsizecss/core';
import fontMetrics from '@capsizecss/metrics/inter';
import StyleDictionary from 'style-dictionary';

export const fontCapsize: StyleDictionary.Transform = {
  type: 'value',
  // only "transitive" transforms will be applied to tokens that
  // alias/reference other tokens
  transitive: true,
  matcher: (token: StyleDictionary.TransformedToken) => token.capsize,
  transformer: function fontCapsize(token: StyleDictionary.TransformedToken) {
    const key = token.path[token.path.length - 1] as any as
      | 'capheight'
      | 'capheightTrim'
      | 'fontSize'
      | 'lineHeight'
      | 'capHeightTrim'
      | 'baselineTrim';

    if (key === 'capheight') {
      return getCapHeight({
        fontSize: parseFloat(token.value),
        fontMetrics,
      });
    }

    const computedValues = precomputeValues({
      fontSize: parseFloat(token.value),
      leading: parseFloat(token.value) * parseFloat(token.capsize.lineheight),
      fontMetrics,
    });
    const normalizedValues = {
      ...computedValues,
      capheightTrim: computedValues.capHeightTrim,
    };

    return normalizedValues[key];
  },
};
