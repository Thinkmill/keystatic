import { makeHandler } from '../api';
// eslint-disable-next-line import/no-unresolved
import config from 'virtual:keystatic-config';

export const all = makeHandler({
  config,
  secret: import.meta.env.KEYSTATIC_SECRET,
  clientId: import.meta.env.KEYSTATIC_GITHUB_CLIENT_ID,
  clientSecret: import.meta.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
});
