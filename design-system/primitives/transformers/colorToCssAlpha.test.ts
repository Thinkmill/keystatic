import { getMockToken } from '../test-utilities';
import { describe, expect, it } from '@jest/globals';
import { colorToCssAlpha } from './colorToCssAlpha';

describe('Transformer: colorToCssAlpha', () => {
  it('transforms values to css color-mix() strings', () => {
    const input = [
      getMockToken({ value: '#123', alpha: 0.2 }),
      getMockToken({ value: '#343434', alpha: 0.4 }),
      getMockToken({ value: 'rgb(100,200,255)', alpha: 0.6 }),
    ];
    const expectedOutput = [
      `color-mix(in srgb, transparent, #123 20%)`,
      `color-mix(in srgb, transparent, #343434 40%)`,
      `color-mix(in srgb, transparent, rgb(100,200,255) 60%)`,
    ];
    expect(
      input.map(item => colorToCssAlpha.transformer(item, {}))
    ).toStrictEqual(expectedOutput);
  });
});
