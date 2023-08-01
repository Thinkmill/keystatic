import { getMockToken } from '../../test-utils';
import { getTokenValue } from './getTokenValue';

describe('Utilities: getTokenValue', () => {
  it('it retrieves the token value', () => {
    const token = getMockToken({
      value: '#223344',
    });
    expect(getTokenValue(token)).toStrictEqual('#223344');
  });

  it('it throws a typeError if invalid input is used', () => {
    expect(() => {
      // @ts-expect-error due to testing wrong input
      getTokenValue('invalid');
    }).toThrow(TypeError);
  });
});
