import { getMockToken } from '../test-utilities';
import { describe, expect, it } from '@jest/globals';
import { dimensionToPixelUnitless } from './dimensionToPixelUnitless';

describe('Transformer: dimensionToPixelUnitless', () => {
  it('transforms pixel string tokens', () => {
    const input = [
      getMockToken({
        value: '16px',
      }),
    ];
    const expectedOutput = [16];
    expect(
      input.map(item => dimensionToPixelUnitless.transformer(item, {}))
    ).toStrictEqual(expectedOutput);
  });

  it('does not transforms number or number string', () => {
    const input = [
      getMockToken({
        value: '16',
      }),
      getMockToken({
        value: 16,
      }),
    ];
    const expectedOutput = ['16', 16];
    expect(
      input.map(item => dimensionToPixelUnitless.transformer(item, {}))
    ).toStrictEqual(expectedOutput);
  });

  it('transforms rem', () => {
    const input = [
      getMockToken({
        value: '1rem',
      }),
    ];
    const expectedOutput = [16];
    expect(
      input.map(item => dimensionToPixelUnitless.transformer(item, {}))
    ).toStrictEqual(expectedOutput);
  });

  it('transforms rem with custom basePxFontSize', () => {
    const input = [
      getMockToken({
        value: '2rem',
      }),
    ];
    const expectedOutput = [20];
    expect(
      input.map(item =>
        dimensionToPixelUnitless.transformer(item, { basePxFontSize: 10 })
      )
    ).toStrictEqual(expectedOutput);
  });

  it('does not transforms em', () => {
    const input = [
      getMockToken({
        value: '1em',
      }),
    ];
    const expectedOutput = ['1em'];
    expect(
      input.map(item => dimensionToPixelUnitless.transformer(item, {}))
    ).toStrictEqual(expectedOutput);
  });

  it('transforms 0 to 0', () => {
    const input = [
      getMockToken({
        value: '0rem',
      }),
      getMockToken({
        value: '0px',
      }),
      getMockToken({
        value: '0',
      }),
    ];
    const expectedOutput = [0, 0, 0];
    expect(
      input.map(item => dimensionToPixelUnitless.transformer(item, {}))
    ).toStrictEqual(expectedOutput);
  });

  it('throws on invalid tokens', () => {
    const input = [
      getMockToken({
        value: 'rem',
      }),
      getMockToken({
        value: '',
      }),
      getMockToken({
        value: undefined,
      }),
      getMockToken({
        value: null,
      }),
    ];
    expect(() =>
      input.map(item => dimensionToPixelUnitless.transformer(item, {}))
    ).toThrow();
  });
});
