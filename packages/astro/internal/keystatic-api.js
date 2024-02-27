import { makeHandler } from '../dist/keystatic-astro-api.js';
import config from 'virtual:keystatic-config';

export const all = makeHandler({ config });
export const ALL = all;
