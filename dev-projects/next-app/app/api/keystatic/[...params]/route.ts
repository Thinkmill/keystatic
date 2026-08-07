import localConfig from '../../../../keystatic.config';
import { makeRouteHandler } from '@keystatic/next/route-handler';

export const { POST, GET } = makeRouteHandler({
  clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID || 'placeholder',
  clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET || 'placeholder',
  secret: process.env.KEYSTATIC_SECRET || 'placeholder',
  config: localConfig,
});
