import { describe, expect, it } from '@jest/globals';
import StyleDictionary from 'style-dictionary';

import { isCubicBezier } from './isCubicBezier';

describe('Filter: isCubicBezier', () => {
  const items = [
    {
      value: [0, 0, 1, 1],
      $type: 'cubicBezier',
    },
    {
      value: '2rem',
      $type: 'dimension',
    },
    {
      value: [1, 1, 0, 0],
      $type: 'cubicBezier',
    },
    {
      value: 'string',
    },
  ] as StyleDictionary.TransformedToken[];
  it('filters cubicBezier tokens', () => {
    expect(items.filter(isCubicBezier)).toStrictEqual([items[0], items[2]]);
  });
});
