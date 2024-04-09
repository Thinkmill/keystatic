import { getMockToken } from '../test-utilities';
import { describe, expect, it } from '@jest/globals';
import { colorToHexAlpha } from './colorToHexAlpha';

describe('Transformer: colorToHexAlpha', () => {
  it('transforms hex3, hex6 `color` tokens with alpha value', () => {
    const input = [
      getMockToken({ value: '#123', alpha: 0.2 }),
      getMockToken({ value: '#343434', alpha: 0.4 }),
    ];
    const expectedOutput = ['#11223333', '#34343466'];
    expect(
      input.map(item => colorToHexAlpha.transformer(item, {}))
    ).toStrictEqual(expectedOutput);
  });

  it('transforms hex8 `color` tokens with alpha value, ignoring the initial alpha from the hex8', () => {
    const input = getMockToken({ value: '#34343466', alpha: 0.6 });
    expect(colorToHexAlpha.transformer(input, {})).toStrictEqual('#34343499');
  });

  it('transforms rgb `color` tokens with alpha value', () => {
    const input = getMockToken({ value: 'rgb(100,200,255)', alpha: 0.6 });
    expect(colorToHexAlpha.transformer(input, {})).toStrictEqual('#64c8ff99');
  });

  it('transforms rgba `color` tokens with alpha value, ignoring the initial alpha from the hex8', () => {
    const input = getMockToken({ value: 'rgba(100,200,255, 0.2)', alpha: 0.6 });
    expect(colorToHexAlpha.transformer(input, {})).toStrictEqual('#64c8ff99');
  });
});
