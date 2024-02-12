import { describe, expect, it } from '@jest/globals';
import { getMockToken } from '../test-utilities';
import { isDeprecated } from './isDeprecated';

describe('Filter: isDeprecated', () => {
  it('Returns true if depreacted property is true', () => {
    expect(isDeprecated(getMockToken({ deprecated: true }))).toStrictEqual(
      true
    );
  });

  it('Returns true if depreacted property is a string', () => {
    expect(isDeprecated(getMockToken({ deprecated: 'pumpkin' }))).toStrictEqual(
      true
    );
  });

  it('Returns false if deprecated is falsy', () => {
    expect(isDeprecated(getMockToken({ deprecated: false }))).toStrictEqual(
      false
    );
    expect(isDeprecated(getMockToken({ deprecated: null }))).toStrictEqual(
      false
    );
    expect(isDeprecated(getMockToken({ deprecated: undefined }))).toStrictEqual(
      false
    );
  });

  it('Returns false if no deprecated property exists', () => {
    expect(isDeprecated(getMockToken({ value: 'pumpkin' }))).toStrictEqual(
      false
    );
  });

  const inputArray = [
    getMockToken({
      deprecated: true,
    }),
    getMockToken({
      deprecated: '{scale.yellow}',
    }),
    getMockToken({
      deprecated: null,
    }),
    getMockToken({
      deprecated: false,
    }),
    getMockToken({
      deprecated: undefined,
    }),
    getMockToken({
      value: 'pumpkin',
    }),
  ];

  const expectedOutput = [
    getMockToken({
      deprecated: true,
    }),
    getMockToken({
      deprecated: '{scale.yellow}',
    }),
  ];

  it('Usage as a filter function', () => {
    expect(inputArray.filter(isDeprecated)).toStrictEqual(expectedOutput);
  });
});
