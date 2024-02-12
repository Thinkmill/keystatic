import StyleDictionary from 'style-dictionary';
import { expect, it, describe } from '@jest/globals';

import { cubicBezierToCss } from './cubicBezierToCss';

describe('Transformer: cubicBezierToCss', () => {
  const items = [
    {
      value: '',
      $type: 'color',
    },
    {
      value: ['0', '0', '0.5', '1'],
      $type: 'cubicBezier',
    },
    {
      value: [0.5, 0, 1, 1],
      $type: 'cubicBezier',
    },
    {
      value: '',
    },
  ] as StyleDictionary.TransformedToken[];

  it('matches `cubicBezier` tokens with an array as a value', () => {
    expect(
      items.filter(cubicBezierToCss.matcher as StyleDictionary.Matcher)
    ).toStrictEqual([items[1], items[2]]);
  });

  it('transforms `cubicBezier` array tokens', () => {
    expect(
      items
        .filter(cubicBezierToCss.matcher as StyleDictionary.Matcher)
        .map(item => cubicBezierToCss.transformer(item, {}))
    ).toStrictEqual([
      'cubic-bezier(0, 0, 0.5, 1)',
      'cubic-bezier(0.5, 0, 1, 1)',
    ]);
  });
});
