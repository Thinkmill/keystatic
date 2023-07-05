// src/pages/api/keystatic/[...params].ts
import { makeHandler } from '@keystatic/astro/api';
import keystaticConfig from '../../../../keystatic.config';

export const all = makeHandler({
  config: keystaticConfig,
});

export const prerender = false;
