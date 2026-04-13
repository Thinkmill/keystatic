import { makeRouteHandler } from '@itgkey/next/route-handler';
import keystaticConfig from '../../../../keystatic.config';

export const { POST, GET } = makeRouteHandler({
  config: keystaticConfig,
});

