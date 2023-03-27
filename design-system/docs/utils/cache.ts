import { cache as _cache } from 'react';

export const cache: <T extends (...args: any[]) => any>(fn: T) => T =
  typeof _cache === 'function' ? _cache : a => a;
