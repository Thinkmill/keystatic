import { makeHandler } from '../api';
// eslint-disable-next-line import/no-unresolved
import config from 'virtual:keystatic-config';

export const all = makeHandler({ config });
export const ALL = all;

export const prerender = false;
