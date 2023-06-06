import localConfig from '../../../local-config';
import { makeAPIRouteHandler } from '@keystatic/next/api';

function requiredEnv(name: string, val: string | undefined): string {
  if (!val) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return val;
}

export default makeAPIRouteHandler({
  secret: requiredEnv('NEXTAUTH_SECRET', process.env.NEXTAUTH_SECRET),
  clientId: requiredEnv('GITHUB_CLIENT_ID', process.env.GITHUB_CLIENT_ID),
  clientSecret: requiredEnv(
    'GITHUB_CLIENT_SECRET',
    process.env.GITHUB_CLIENT_SECRET
  ),
  config: localConfig,
});
