import { makePage } from '../dist/keystatic-astro-ui.js';
// eslint-disable-next-line import/no-unresolved
import config from 'virtual:keystatic-config';

export const Keystatic = makePage(config);
