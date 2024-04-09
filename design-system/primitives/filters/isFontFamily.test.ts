import { getMockToken } from '../test-utilities';
import { describe, expect, it } from '@jest/globals';
import { isFontFamily } from './isFontFamily';

describe('Filter: isFontFamily', () => {
  it('returns true if $type property is `fontFamily`', () => {
    expect(isFontFamily(getMockToken({ $type: 'fontFamily' }))).toStrictEqual(
      true
    );
  });

  it('returns false if $type property is not `fontFamily`', () => {
    expect(isFontFamily(getMockToken({ $type: 'pumpkin' }))).toStrictEqual(
      false
    );
  });

  it('returns false if $type property is missing', () => {
    expect(isFontFamily(getMockToken({ alpha: 0.4 }))).toStrictEqual(false);
  });

  it('returns false if $type property is falsy', () => {
    expect(isFontFamily(getMockToken({ $type: false }))).toStrictEqual(false);
    expect(isFontFamily(getMockToken({ $type: undefined }))).toStrictEqual(
      false
    );
    expect(isFontFamily(getMockToken({ $type: null }))).toStrictEqual(false);
  });
});
