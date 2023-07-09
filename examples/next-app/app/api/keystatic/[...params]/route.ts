import localConfig from '../../../../keystatic.config';
import { makeRouteHandler } from '@keystatic/next/route-handler';

const fakeValueInPreviewEnv =
  process.env.VERCEL_ENV === 'preview'
    ? "some fake value so preview builds don't fail"
    : undefined;

export const { POST, GET } = makeRouteHandler({
  clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID ?? fakeValueInPreviewEnv,
  clientSecret:
    process.env.KEYSTATIC_GITHUB_CLIENT_SECRET ?? fakeValueInPreviewEnv,
  secret: process.env.KEYSTATIC_SECRET ?? fakeValueInPreviewEnv,
  config: localConfig,
});
