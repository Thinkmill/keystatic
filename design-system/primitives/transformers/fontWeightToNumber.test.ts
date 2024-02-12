import { getMockToken } from '../test-utilities';
import { describe, expect, it } from '@jest/globals';
import { fontWeightToNumber } from './fontWeightToNumber';

describe('Transformer: fontWeightToNumbers', () => {
  it('keeps number if within range of 1-1000', () => {
    const input = [
      getMockToken({
        value: 100,
      }),
      getMockToken({
        value: 1000,
      }),
    ];
    const expectedOutput = [100, 1000];
    expect(
      input.map(item => fontWeightToNumber.transformer(item, {}))
    ).toStrictEqual(expectedOutput);
  });

  it('transforms string of number to number', () => {
    const input = getMockToken({
      value: '100',
    });
    const expectedOutput = 100;
    expect(fontWeightToNumber.transformer(input, {})).toStrictEqual(
      expectedOutput
    );
  });

  it('transforms font strings to number', () => {
    const testCases: [fontWeightNumber: number, fontWeightString: string][] = [
      [100, 'thin'],
      [100, 'hairline'],
      [200, 'extra-light'],
      [200, 'ultra-light'],
      [300, 'light'],
      [400, 'normal'],
      [400, 'regular'],
      [400, 'book'],
      [500, 'medium'],
      [600, 'semi-bold'],
      [600, 'demi-bold'],
      [700, 'bold'],
      [800, 'extra-bold'],
      [800, 'ultra-bold'],
      [900, 'black'],
      [900, 'heavy'],
      [950, 'extra-black'],
      [950, 'ultra-black'],
    ];

    for (const [fontWeightNumber, fontWeightString] of testCases) {
      const input = getMockToken({
        value: fontWeightString,
      });
      try {
        expect(fontWeightToNumber.transformer(input, {})).toStrictEqual(
          fontWeightNumber
        );
      } catch (e) {
        throw new Error(
          `❌ Expects ${fontWeightString} to be transformed to ${fontWeightNumber}`
        );
      }
    }
  });

  it('throws on invalid value', () => {
    expect(() =>
      fontWeightToNumber.transformer(
        getMockToken({
          value: 1001,
        }),
        {}
      )
    ).toThrow();

    expect(() =>
      fontWeightToNumber.transformer(
        getMockToken({
          value: 0,
        }),
        {}
      )
    ).toThrow();

    expect(() =>
      fontWeightToNumber.transformer(
        getMockToken({
          value: undefined,
        }),
        {}
      )
    ).toThrow();

    expect(() =>
      fontWeightToNumber.transformer(
        getMockToken({
          value: 'Roboto',
        }),
        {}
      )
    ).toThrow();

    expect(() =>
      fontWeightToNumber.transformer(
        getMockToken({
          value: ['Roboto'],
        }),
        {}
      )
    ).toThrow();

    expect(() =>
      fontWeightToNumber.transformer(
        getMockToken({
          value: {
            fontWeight: 300,
          },
        }),
        {}
      )
    ).toThrow();
  });
});
