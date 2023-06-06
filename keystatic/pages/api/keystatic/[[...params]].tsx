import localConfig from '../../../local-config';
import { makeAPIRouteHandler } from '@keystatic/next/api';

export default makeAPIRouteHandler({
  config: localConfig,
  localBaseDirectory: './content',
});
