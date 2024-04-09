import { getMockToken } from '../test-utilities';
import { describe, expect, it } from '@jest/globals';
import { colorToHex } from './colorToHex';

describe('Transformer: colorToHex', () => {
  it('transforms `hex3`, `hex6`, and `hex8` tokens to hex value', () => {
    const input = [
      getMockToken({ value: '#123' }),
      getMockToken({ value: '#343434' }),
      getMockToken({ value: '#34343466' }),
    ];
    const expectedOutput = ['#112233', '#343434', '#34343466'];
    expect(input.map(item => colorToHex.transformer(item, {}))).toStrictEqual(
      expectedOutput
    );
  });

  it('transforms `rgb` and `rgba` to hex value', () => {
    const input = [
      getMockToken({ value: 'rgb(100,200,255)' }),
      getMockToken({ value: 'rgba(100,200,255, .4)' }),
    ];
    const expectedOutput = ['#64c8ff', '#64c8ff66'];
    expect(input.map(item => colorToHex.transformer(item, {}))).toStrictEqual(
      expectedOutput
    );
  });

  it('transforms `color` tokens and ignores alpha value', () => {
    expect(
      [
        getMockToken({ value: '#343434', alpha: 0.4 }),
        getMockToken({ value: '#34343466', alpha: 0.9 }),
        getMockToken({ value: 'rgb(100,200,255)', alpha: 0.4 }),
        getMockToken({ value: 'rgba(100,200,255,0.8)', alpha: 0.4 }),
      ].map(item => colorToHex.transformer(item, {}))
    ).toStrictEqual(['#343434', '#34343466', '#64c8ff', '#64c8ffcc']);
  });
});
