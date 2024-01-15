import { filterStyleProps } from '@keystar/ui/style';
import { expect, describe, it } from '@jest/globals';

describe('style/filterStyleProps', function () {
  it('should omit style props', function () {
    let result = filterStyleProps({
      position: 'absolute',
      opacity: 1,
      inset: 10,
      height: 100,
    });
    expect(result).toMatchObject({});
  });
  it('should omit special props', function () {
    let result = filterStyleProps({
      isHidden: { below: 'tablet' },
      UNSAFE_className: 'foo',
      UNSAFE_style: { color: 'red' },
    });
    expect(result).toMatchObject({});
  });
  it('should include consumer props', function () {
    let value = { foo: 'bar', baz: 123 };
    let result = filterStyleProps({ ...value, position: 'absolute' });
    expect(result).toMatchObject(value);
  });
});
