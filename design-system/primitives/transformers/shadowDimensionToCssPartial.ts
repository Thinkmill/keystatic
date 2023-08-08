import StyleDictionary from 'style-dictionary';

import { isShadowDimension } from '../filters';
import { ShadowDimensionTokenValue } from '../types';
import { checkRequiredTokenProperties } from './utilities/checkRequiredTokenProperties';

/** temp until we consolidate shadows, which should contain a color value */
export const shadowDimensionToCssPartial: StyleDictionary.Transform = {
  type: `value`,
  transitive: true,
  matcher: (token: StyleDictionary.TransformedToken) =>
    isShadowDimension(token),
  transformer: ({ value }: { value: ShadowDimensionTokenValue }) => {
    checkRequiredTokenProperties(value, [
      'blur',
      'offsetX',
      'offsetY',
      'spread',
    ]);

    let { blur, offsetX, offsetY, spread } = value;
    return `${offsetX} ${offsetY} ${blur} ${spread}`;
  },
};
