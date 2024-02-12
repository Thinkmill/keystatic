import { getMockToken } from '../test-utilities';
import { describe, expect, it } from '@jest/globals';
import { isColorWithAlpha } from './isColorWithAlpha';

describe('Filter: isColorWithAlpha', () => {
  it('returns true if $type property is `color` and `alpha` is number', () => {
    expect(
      isColorWithAlpha(getMockToken({ $type: 'color', alpha: 0.4 }))
    ).toStrictEqual(true);
  });

  it('returns false if $type property is not `color`', () => {
    expect(
      isColorWithAlpha(getMockToken({ $type: 'pumpkin', alpha: 0.4 }))
    ).toStrictEqual(false);
  });

  it('returns false if $type property is missing', () => {
    expect(isColorWithAlpha(getMockToken({ alpha: 0.4 }))).toStrictEqual(false);
  });

  it('returns false if $type `color` but alpha is missing', () => {
    expect(isColorWithAlpha(getMockToken({ $type: 'color' }))).toStrictEqual(
      false
    );
  });

  it('returns false if $type `color` but alpha is not a number', () => {
    expect(
      isColorWithAlpha(getMockToken({ $type: 'color', alpha: true }))
    ).toStrictEqual(false);
    expect(
      isColorWithAlpha(getMockToken({ $type: 'color', alpha: '0.4' }))
    ).toStrictEqual(false);
    expect(
      isColorWithAlpha(getMockToken({ $type: 'color', alpha: false }))
    ).toStrictEqual(false);
    expect(
      isColorWithAlpha(getMockToken({ $type: 'color', alpha: undefined }))
    ).toStrictEqual(false);
    expect(
      isColorWithAlpha(getMockToken({ $type: 'color', alpha: null }))
    ).toStrictEqual(false);
  });

  it('returns false if $type is falsy ', () => {
    expect(
      isColorWithAlpha(getMockToken({ $type: undefined, alpha: 0.2 }))
    ).toStrictEqual(false);
    expect(
      isColorWithAlpha(getMockToken({ $type: false, alpha: 0.2 }))
    ).toStrictEqual(false);
    expect(
      isColorWithAlpha(getMockToken({ $type: null, alpha: 0.2 }))
    ).toStrictEqual(false);
  });
});
