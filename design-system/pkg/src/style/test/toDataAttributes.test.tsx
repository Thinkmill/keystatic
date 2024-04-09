import { toDataAttributes } from '@keystar/ui/style';
import { expect, describe, it } from '@jest/globals';

describe('utils/toDataAttributes', () => {
  it('should prepend the key with "data-"', () => {
    expect(
      toDataAttributes({
        foo: 'bar',
        bar: true,
        baz: 123,
        qux: undefined,
        fred: false,
        thud: null,
      })
    ).toStrictEqual({
      'data-foo': 'bar',
      'data-bar': true,
      'data-baz': 123,
      'data-fred': false,
    });
  });

  describe('options', () => {
    it('omitFalsyValues: should omit props with falsy values, except `0`', () => {
      expect(
        toDataAttributes(
          {
            foo: false,
            bar: 123,
            baz: '',
            qux: 0,
          },
          { omitFalsyValues: true }
        )
      ).toStrictEqual({
        'data-bar': 123,
        'data-qux': 0,
      });
    });
    it('trimBooleanKeys: should remove the `is*` prefix from keys', () => {
      expect(
        toDataAttributes(
          { isFoo: true, isBar: false },
          { trimBooleanKeys: true }
        )
      ).toStrictEqual({
        'data-foo': true,
        'data-bar': false,
      });
    });
    it('should work with all options', () => {
      expect(
        toDataAttributes(
          {
            isFoo: true,
            isBar: false,
            baz: 123,
            qux: '',
          },
          {
            omitFalsyValues: true,
            trimBooleanKeys: true,
          }
        )
      ).toStrictEqual({
        'data-foo': true,
        'data-baz': 123,
      });
    });
  });
});
