import { alpha } from './alpha';
import { expect, it, describe } from '@jest/globals';

describe('Utilities: alpha', () => {
  it('it transforms `hex3`', () => {
    expect(alpha('#345', 0)).toStrictEqual('rgba(51, 68, 85, 0)');
    expect(alpha('#345', 0.4)).toStrictEqual('rgba(51, 68, 85, 0.4)');
  });

  it('it transforms `hex6`', () => {
    expect(alpha('#334455', 0)).toStrictEqual('rgba(51, 68, 85, 0)');
    expect(alpha('#334455', 0.4)).toStrictEqual('rgba(51, 68, 85, 0.4)');
  });

  it('it transforms `hex8` by ignoring opacity in the color', () => {
    expect(alpha('#33445566', 0)).toStrictEqual('rgba(51, 68, 85, 0)');
    expect(alpha('#33445566', 0.4)).toStrictEqual('rgba(51, 68, 85, 0.4)');
  });

  it('it transforms `rgb`', () => {
    expect(alpha('rgba(51, 68, 85)', 0)).toStrictEqual('rgba(51, 68, 85, 0)');
    expect(alpha('rgba(51, 68, 85)', 0.4)).toStrictEqual(
      'rgba(51, 68, 85, 0.4)'
    );
  });

  it('it transforms `rgba` by ignoring opacity in the color', () => {
    expect(alpha('rgba(51, 68, 85, 0.4)', 0)).toStrictEqual(
      'rgba(51, 68, 85, 0)'
    );
    expect(alpha('rgba(51, 68, 85, 0.6)', 0.4)).toStrictEqual(
      'rgba(51, 68, 85, 0.4)'
    );
  });
});
