import { getMockToken } from '../test-utilities';
import { describe, expect, it } from '@jest/globals';
import { isShadow } from './isShadow';

describe('Filter: isShadow', () => {
  it('returns true if $type property is `shadow`', () => {
    expect(isShadow(getMockToken({ $type: 'shadow' }))).toStrictEqual(true);
  });

  it('returns false if $type property is not `shadow`', () => {
    expect(isShadow(getMockToken({ $type: 'pumpkin' }))).toStrictEqual(false);
  });

  it('returns false if $type property is falsy', () => {
    expect(isShadow(getMockToken({ $type: false }))).toStrictEqual(false);
    expect(isShadow(getMockToken({ $type: undefined }))).toStrictEqual(false);
    expect(isShadow(getMockToken({ $type: null }))).toStrictEqual(false);
  });
});
