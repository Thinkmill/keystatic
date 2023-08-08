import { toHex } from 'color2k';
import type StyleDictionary from 'style-dictionary';

import { isColorWithAlpha } from '../filters';
import { alpha } from './utilities/alpha';
import { getTokenValue } from './utilities/getTokenValue';

/**
 * @description replaces tokens value with `hex8` color using the tokens `alpha` property to specify the value used for alpha
 * @type value transformer — [StyleDictionary.ValueTransform](https://github.com/amzn/style-dictionary/blob/main/types/Transform.d.ts)
 * @matcher matches all tokens of $type `color` with an `alpha` property
 * @transformer returns `hex8` string
 */
export const colorToHexAlpha: StyleDictionary.Transform = {
  type: `value`,
  transitive: true,
  matcher: isColorWithAlpha,
  transformer: (token: StyleDictionary.TransformedToken) => {
    return toHex(alpha(getTokenValue(token), token.alpha, token));
  },
};
