import type { TokenBuildInput } from '../types';

// NOTE: order is important. scales must be first.
export const themes: TokenBuildInput[] = [
  {
    filename: 'light',
    source: [
      `tokens/color/light/scale.json5`,
      `tokens/color/light/primitives.json5`,
      `tokens/color/light/patterns.json5`,
    ],
    // include: [`tokens/base/color/light/light.json5`],
    include: [],
  },
  {
    filename: 'dark',
    source: [
      `tokens/color/dark/scale.json5`,
      `tokens/color/dark/primitives.json5`,
      `tokens/color/dark/patterns.json5`,
    ],
    // include: [`tokens/base/color/dark/dark.json5`],
    include: [],
  },
];
