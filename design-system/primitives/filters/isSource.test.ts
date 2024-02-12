import type StyleDictionary from 'style-dictionary';

import { getMockToken } from '../test-utilities';
import { describe, expect, it } from '@jest/globals';
import { isSource } from './isSource';

describe('Filter: isSource', () => {
  it('Returns true if isSource property is true', () => {
    expect(isSource(getMockToken({ isSource: true }))).toStrictEqual(true);
  });

  it('Returns false if isSource property is falsy value', () => {
    expect(isSource(getMockToken({ isSource: false }))).toStrictEqual(false);
    expect(isSource(getMockToken({ isSource: null }))).toStrictEqual(false);
    expect(isSource(getMockToken({ isSource: undefined }))).toStrictEqual(
      false
    );
  });

  it('Returns false if isSource property is truthy non-boolean value', () => {
    expect(isSource(getMockToken({ isSource: 'pumpkin' }))).toStrictEqual(
      false
    );
    expect(isSource(getMockToken({ isSource: 1 }))).toStrictEqual(false);
  });

  it('Returns false if no isSource property exists', () => {
    expect(
      isSource({ value: 'pumpkin' } as StyleDictionary.TransformedToken)
    ).toStrictEqual(false);
  });

  it('Usage as a filter function', () => {
    const inputArray = [
      getMockToken({
        value: 'red is source',
        isSource: true,
      }),
      getMockToken({
        value: 'blue is not source',
        isSource: false,
      }),
      {
        value: 'yellow is not source',
      },
    ] as StyleDictionary.TransformedToken[];

    const expectedOutput = inputArray.filter(item => item.isSource === true);

    expect(inputArray.filter(isSource)).toStrictEqual(expectedOutput);
  });
});
