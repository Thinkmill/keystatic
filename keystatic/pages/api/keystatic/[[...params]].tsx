import localConfig from '../../../local-config';
import { collection, config } from '../../../src';
import createKeystaticAPIRoute from '../../../src/api';

function requiredEnv(name: string, val: string | undefined): string {
  if (!val) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return val;
}

export default createKeystaticAPIRoute({
  secret: requiredEnv('NEXTAUTH_SECRET', process.env.NEXTAUTH_SECRET),
  clientId: requiredEnv('GITHUB_CLIENT_ID', process.env.GITHUB_CLIENT_ID),
  clientSecret: requiredEnv('GITHUB_CLIENT_SECRET', process.env.GITHUB_CLIENT_SECRET),
  url: process.env.AUTH_URL ? process.env.AUTH_URL : 'http://localhost:3000',
  config: config({
    storage: {
      kind: 'github',
      repo: {
        owner: 'Thinkmill',
        name: 'keystatic',
      },
    },
    collections: {
      posts: collection({
        ...(localConfig.collections?.posts as any),
        directory: 'test-data/posts',
      }),
    },
  }),
});
