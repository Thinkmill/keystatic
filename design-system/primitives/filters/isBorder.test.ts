import { getMockToken } from '../test-utilities';
import { describe, expect, it } from '@jest/globals';
import { isBorder } from './isBorder';

describe('Filter: isBorder', () => {
  it('returns true if $type property is `border`', () => {
    expect(isBorder(getMockToken({ $type: 'border' }))).toStrictEqual(true);
  });

  it('returns false if $type property is not `border`', () => {
    expect(isBorder(getMockToken({ $type: 'pumpkin' }))).toStrictEqual(false);
  });

  it('returns false if $type property is falsy', () => {
    expect(isBorder(getMockToken({ $type: false }))).toStrictEqual(false);
    expect(isBorder(getMockToken({ $type: undefined }))).toStrictEqual(false);
    expect(isBorder(getMockToken({ $type: null }))).toStrictEqual(false);
  });
});
