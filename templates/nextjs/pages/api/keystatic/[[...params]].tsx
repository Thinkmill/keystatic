import config from '../../../keystatic.config';
import { makeAPIRouteHandler } from '@keystatic/next/api';

export default makeAPIRouteHandler({
  config,
});
