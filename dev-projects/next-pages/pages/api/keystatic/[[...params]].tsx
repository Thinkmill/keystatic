import { makeAPIRouteHandler } from '@keystatic/next/api';
import keystaticConfig from '../../../../next-app/keystatic.config';

export default makeAPIRouteHandler({ config: keystaticConfig });
