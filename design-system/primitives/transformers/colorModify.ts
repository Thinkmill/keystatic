import StyleDictionary from 'style-dictionary';
import tinyColor from 'tinycolor2';

import { isCategoryColor } from '../matchers';

export const colorModify: StyleDictionary.Transform = {
  type: 'value',
  // only "transitive" transforms will be applied to tokens that
  // alias/reference other tokens
  transitive: true,
  matcher: isCategoryColor,
  transformer: function colorModify(token: StyleDictionary.TransformedToken) {
    let { modify = [], value } = token;
    let color = tinyColor(value);

    // iterate over the modify array and apply each modification in order
    modify.forEach((modifier: Record<string, number>) => {
      // @ts-expect-error
      const [type, fraction]: [keyof tinyColor.Instance, number] =
        Object.entries(modifier).flat();

      // normalise quirky API
      const amount = type === 'setAlpha' ? fraction : fraction * 100;

      // modifier must match a method in tinycolor
      // methods can be chained e.g. tinyColor(value).brighten(1).darken(1).hex();
      // https://bgrins.github.io/TinyColor/
      //
      // - setAlpha
      // - brighten
      // - darken
      // - desaturate
      // - lighten
      // - saturate
      // - spin
      // @ts-expect-error
      color = color[type](amount);
    });

    return color.toString();
  },
};
