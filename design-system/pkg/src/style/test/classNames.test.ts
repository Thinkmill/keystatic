import { classNames, resetClassName } from '@keystar/ui/style';

describe('style/classNames', function () {
  it('includes the reset className, once', function () {
    let a = classNames('a');
    let b = classNames(a, 'b');
    expect(classNames(b)).toBe(`${resetClassName} a b`);
  });
});
