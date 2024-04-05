import localConfig from '../../../../keystatic.config';
import { makeRouteHandler } from '@keystatic/next/route-handler';

export const runtime = 'edge';

export const { POST, GET } = makeRouteHandler({
  clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID,
  clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET,
  secret: process.env.KEYSTATIC_SECRET,
  config: localConfig,
});
