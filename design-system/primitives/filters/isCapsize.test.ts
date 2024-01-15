import { getMockToken } from '../test-utilities';
import { describe, expect, it } from '@jest/globals';
import { isCapsize } from './isCapsize';

describe('Filter: isCapsize', () => {
  it('returns true if $type property is `capsize`', () => {
    expect(isCapsize(getMockToken({ $type: 'capsize' }))).toStrictEqual(true);
  });

  it('returns false if $type property is not `capsize`', () => {
    expect(isCapsize(getMockToken({ $type: 'pumpkin' }))).toStrictEqual(false);
  });

  it('returns false if $type property is missing', () => {
    expect(isCapsize(getMockToken({ alpha: 0.4 }))).toStrictEqual(false);
  });
});
