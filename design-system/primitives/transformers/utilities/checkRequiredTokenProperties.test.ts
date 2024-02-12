import { checkRequiredTokenProperties } from './checkRequiredTokenProperties';
import { expect, it, describe } from '@jest/globals';

describe('Utilities: checkRequiredTokenProperties', () => {
  it('it throws if property is missing', () => {
    const requiredProps = ['propA', 'propB'];
    expect(() =>
      checkRequiredTokenProperties(
        {
          propA: '42px',
        },
        requiredProps
      )
    ).toThrow();
  });

  it('it does NOT throws if properties are present', () => {
    const requiredProps = ['propA', 'propB'];
    expect(() =>
      checkRequiredTokenProperties(
        {
          propA: '42px',
          propB: '700',
        },
        requiredProps
      )
    ).not.toThrow();
  });
});
