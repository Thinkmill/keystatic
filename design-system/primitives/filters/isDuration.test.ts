import StyleDictionary from 'style-dictionary';
import { expect, it, describe } from '@jest/globals';

import { isDuration } from './isDuration';

describe('Filter: isDuration', () => {
  const items = [
    {
      value: '300ms',
      $type: 'duration',
    },
    {
      value: '2rem',
      $type: 'dimension',
    },
    {
      value: '10ms',
      $type: 'duration',
    },
    {
      value: 'string',
    },
  ] as StyleDictionary.TransformedToken[];
  it('filters duration tokens', () => {
    expect(items.filter(isDuration)).toStrictEqual([items[0], items[2]]);
  });
});
