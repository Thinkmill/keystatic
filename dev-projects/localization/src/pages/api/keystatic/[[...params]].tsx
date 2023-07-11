import { makeAPIRouteHandler } from '@keystatic/next/api';

import config from '../../../keystatic.config';

export default makeAPIRouteHandler({
  config,
});
