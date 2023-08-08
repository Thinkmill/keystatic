import type StyleDictionary from 'style-dictionary';

import { isColorWithAlpha } from '../filters';

/**
 * @description replaces values with a `color-mix()` function using the token's `alpha` property.
 * @type value transformer — [StyleDictionary.ValueTransform](https://github.com/amzn/style-dictionary/blob/main/types/Transform.d.ts)
 * @matcher matches all tokens of $type `color` with an `alpha` property
 * @transformer returns a CSS compatible <color> string
 */
export const colorToCssAlpha: StyleDictionary.Transform = {
  type: `value`,
  transitive: true,
  matcher: isColorWithAlpha,
  transformer: (token: StyleDictionary.TransformedToken) => {
    // surprisingly good support: https://caniuse.com/?search=color-mix
    return `color-mix(in srgb, transparent, ${token.value} ${
      token.alpha * 100
    }%)`;
  },
};
