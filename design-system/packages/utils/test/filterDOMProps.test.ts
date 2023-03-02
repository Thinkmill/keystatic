import { filterDOMProps } from '../';

const junk = { a: 1, b: 2, c: 3 };
const labellable = {
  'aria-label': 'foo',
  'aria-labelledby': 'bar',
  'aria-describedby': 'baz',
  'aria-details': 'qux',
};

describe('utils/filterDOMProps', function () {
  it('should omit junk', function () {
    let result = filterDOMProps(junk);
    expect(result).toMatchObject({});
  });
  it('should support "labellable" option', function () {
    let result = filterDOMProps(
      { ...junk, ...labellable },
      { labellable: true }
    );
    expect(result).toMatchObject(labellable);
  });
  it('should support "pick" option', function () {
    let result = filterDOMProps(junk, { pick: new Set(['a']) });
    expect(result).toMatchObject({ a: 1 });
  });
  it('should support "omit" option', function () {
    let result = filterDOMProps(junk, { omit: new Set(['a']) });
    expect(result).toMatchObject({ b: 2, c: 3 });
  });
  it('should include valid props', function () {
    let valid = { id: 'foo', title: 'bar', 'data-testid': 'baz' };
    let result = filterDOMProps({ ...junk, ...valid });
    expect(result).toMatchObject(valid);
  });
});
