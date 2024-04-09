import { getMockToken } from '../test-utilities';
import { describe, expect, it } from '@jest/globals';
import { isColor } from './isColor';

describe('Filter: isColor', () => {
  it('returns true if $type property is `color`', () => {
    expect(isColor(getMockToken({ $type: 'color' }))).toStrictEqual(true);
  });

  it('returns false if $type property is not `color`', () => {
    expect(isColor(getMockToken({ $type: 'pumpkin' }))).toStrictEqual(false);
  });

  it('returns false if $type property is missing', () => {
    expect(isColor(getMockToken({ alpha: 0.4 }))).toStrictEqual(false);
  });

  it('returns false if $type property is falsy', () => {
    expect(isColor(getMockToken({ $type: false }))).toStrictEqual(false);
    expect(isColor(getMockToken({ $type: undefined }))).toStrictEqual(false);
    expect(isColor(getMockToken({ $type: null }))).toStrictEqual(false);
  });
});
