import StyleDictionary from 'style-dictionary';

import { isCubicBezier } from '../filters/isCubicBezier.ts';
import type { CubicBezierTokenValue } from '../types.ts';

export const cubicBezierToCss: StyleDictionary.Transform = {
  type: `value`,
  transitive: true,
  matcher: (token: StyleDictionary.TransformedToken) =>
    isCubicBezier(token) && Array.isArray(token.value),
  transformer: ({
    value: [x1, y1, x2, y2],
  }: {
    value: CubicBezierTokenValue;
  }) => `cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`,
};
