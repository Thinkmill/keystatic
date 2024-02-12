import StyleDictionary from 'style-dictionary';

import { typographyToCapsize } from './typographyToCapsize';
import { getMockToken } from '../test-utilities';
import { describe, expect, it } from '@jest/globals';

describe('Transformer: typographyToCapsize', () => {
  const tokens = [
    getMockToken({
      value: '',
      $type: 'color',
    }),
    getMockToken({
      path: ['typography', 'baselineTrim'],
      value: {
        size: '14px',
        lineheight: 1.4,
      },
      $type: 'capsize',
    }),
    getMockToken({
      path: ['typography', 'capheightTrim'],
      value: {
        size: '14px',
        lineheight: 1.4,
      },
      $type: 'capsize',
    }),
    getMockToken({
      path: ['typography', 'capheight'],
      value: {
        size: '14px',
        lineheight: 1.4,
      },
      $type: 'capsize',
    }),
    getMockToken({
      value: '',
    }),
  ];

  it('matches `capsize` tokens with required meta as value', () => {
    expect(
      tokens.filter(typographyToCapsize.matcher as StyleDictionary.Matcher)
    ).toStrictEqual([tokens[1], tokens[2], tokens[3]]);
  });

  it('transforms `capsize` tokens', () => {
    expect(
      tokens
        .filter(typographyToCapsize.matcher as StyleDictionary.Matcher)
        .map(item => typographyToCapsize.transformer(item, {}))
    ).toStrictEqual(['-0.3364em', '-0.3364em', '10.1818px']);
  });
});
