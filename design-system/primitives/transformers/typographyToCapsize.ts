import { getCapHeight, precomputeValues } from '@capsizecss/core';
import fontMetrics from '@capsizecss/metrics/inter';
import StyleDictionary from 'style-dictionary';

import { isCapsize } from '../filters';

export const typographyToCapsize: StyleDictionary.Transform = {
  type: 'value',
  transitive: true,
  matcher: isCapsize,
  transformer: function typographyToCapsize(
    token: StyleDictionary.TransformedToken
  ) {
    const fontSize = parseFloat(token.value.size);
    const lineHeight = token.value.lineheight;
    const prop = token.path.at(-1);

    const capheight = getCapHeight({
      fontSize,
      fontMetrics,
    });
    const computedValues = precomputeValues({
      fontSize,
      fontMetrics,
      leading: fontSize * lineHeight,
    });

    switch (prop) {
      case 'baselineTrim':
        return computedValues.baselineTrim;
      case 'capheightTrim':
        return computedValues.capHeightTrim;
      case 'capheight':
        return `${capheight}px`;
    }

    throw new Error(
      `Unexpected prop "${prop}" in typographyToCapsize transformer.`
    );
  },
};
