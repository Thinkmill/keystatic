import { expect, describe, it } from '@jest/globals';
import { isReactText } from '@keystar/ui/utils';

describe('utils/isReactText', () => {
  it('string', () => {
    expect(isReactText('test')).toEqual(true);
  });
  it('number', () => {
    expect(isReactText(123)).toEqual(true);
  });

  it('arrays', () => {
    expect(isReactText(['test', 'test'])).toEqual(true);
    expect(isReactText([123, 456])).toEqual(true);
    expect(isReactText(['test', 123])).toEqual(true);
  });

  it('invalid arguments', () => {
    expect(isReactText(<span>test</span>)).toEqual(false);
    expect(isReactText([<span>test</span>])).toEqual(false);
    expect(isReactText({ a: 1, b: 2 })).toEqual(false);
    expect(isReactText(undefined)).toEqual(false);
  });
});
