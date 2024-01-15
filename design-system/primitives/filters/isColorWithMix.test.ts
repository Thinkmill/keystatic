import { getMockToken } from '../test-utilities';
import { describe, expect, it } from '@jest/globals';
import { isColorWithMix } from './isColorWithMix';

describe('Filter: isColorWithMix', () => {
  it('returns true if $type property is `color` and valid `mix` property exists', () => {
    expect(
      isColorWithMix(
        getMockToken({ $type: 'color', mix: { color: '#000', weight: 0.5 } })
      )
    ).toStrictEqual(true);
  });

  it('returns false if $type property is not `color`', () => {
    expect(
      isColorWithMix(
        getMockToken({ $type: 'pumpkin', mix: { color: '#000', weight: 0.5 } })
      )
    ).toStrictEqual(false);
  });

  it('returns false if $type property is missing', () => {
    expect(isColorWithMix(getMockToken({ value: '#000' }))).toStrictEqual(
      false
    );
  });

  it('returns false if $type property is missing but mix is provided', () => {
    expect(
      isColorWithMix(getMockToken({ value: '#000', mix: null }))
    ).toStrictEqual(false);
  });

  it('returns false if $type `color` but mix is missing', () => {
    expect(isColorWithMix(getMockToken({ $type: 'color' }))).toStrictEqual(
      false
    );
  });

  it('throws error if $type `color` but mix is invalid', () => {
    expect(() =>
      isColorWithMix(getMockToken({ $type: 'color', mix: true }))
    ).toThrow();
    expect(() =>
      isColorWithMix(getMockToken({ $type: 'color', mix: '#000' }))
    ).toThrow();
  });

  it('throws error if $type `color` but mix has invalid properties', () => {
    // missing weight
    expect(() =>
      isColorWithMix(
        getMockToken({
          $type: 'color',
          mix: {
            color: '#000',
          },
        })
      )
    ).toThrow();
    // missing color
    expect(() =>
      isColorWithMix(
        getMockToken({
          $type: 'color',
          mix: {
            weight: 0.5,
          },
        })
      )
    ).toThrow();
    // color is number
    expect(() =>
      isColorWithMix(
        getMockToken({
          $type: 'color',
          mix: {
            color: 1,
            weight: 0.5,
          },
        })
      )
    ).toThrow();
    // color is undefined
    expect(() =>
      isColorWithMix(
        getMockToken({
          $type: 'color',
          mix: {
            color: undefined,
            weight: 0.5,
          },
        })
      )
    ).toThrow();
    // weight is undefined
    expect(() =>
      isColorWithMix(
        getMockToken({
          $type: 'color',
          mix: {
            color: '#000',
            weight: undefined,
          },
        })
      )
    ).toThrow();
    // weight is a string
    expect(() =>
      isColorWithMix(
        getMockToken({
          $type: 'color',
          mix: {
            color: '#000',
            weight: '0.7',
          },
        })
      )
    ).toThrow();
  });

  it('returns false if $type is falsy ', () => {
    expect(
      isColorWithMix(
        getMockToken({ $type: undefined, mix: { color: '#000', weight: 0.5 } })
      )
    ).toStrictEqual(false);
    expect(
      isColorWithMix(
        getMockToken({ $type: false, mix: { color: '#000', weight: 0.5 } })
      )
    ).toStrictEqual(false);
    expect(
      isColorWithMix(
        getMockToken({ $type: null, mix: { color: '#000', weight: 0.5 } })
      )
    ).toStrictEqual(false);
  });
});
