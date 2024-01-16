import { getMockToken } from '../test-utilities';
import { describe, expect, it } from '@jest/globals';
import { isFromFile } from './isFromFile';

describe('Filter: isFromFile', () => {
  it('returns true if token.filePath is in provided array of file paths', () => {
    expect(
      isFromFile(getMockToken({ filePath: 'src/tokens.json' }), [
        'src/tokens.json',
      ])
    ).toStrictEqual(true);
  });

  it('returns false if token.filePath is NOT in provided array of file paths', () => {
    expect(
      isFromFile(getMockToken({ filePath: 'src/notTokens.json' }), [
        'src/tokens.json',
      ])
    ).toStrictEqual(false);
  });

  it('returns false if token.filePath is undefined', () => {
    expect(
      isFromFile(getMockToken({ filePath: undefined }), ['src/tokens.json'])
    ).toStrictEqual(false);
  });

  it('returns false if array of file paths is empty', () => {
    expect(
      isFromFile(getMockToken({ filePath: 'src/tokens.json' }), [])
    ).toStrictEqual(false);
  });

  it('returns false if token.filePath is undefined and array is empty', () => {
    expect(isFromFile(getMockToken({ filePath: undefined }), [])).toStrictEqual(
      false
    );
  });

  it('returns false if file path array is undefined', () => {
    // @ts-expect-error: path is missing
    expect(isFromFile(getMockToken({ path: 'src/tokens.json' }))).toStrictEqual(
      false
    );
  });

  it('returns false if token.filePath & file path array is undefined', () => {
    // @ts-expect-error: path is missing
    expect(isFromFile(getMockToken({ filePath: undefined }))).toStrictEqual(
      false
    );
  });
});
