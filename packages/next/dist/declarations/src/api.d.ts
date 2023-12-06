import type { NextApiRequest, NextApiResponse } from 'next';
import { APIRouteConfig } from '@keystatic/core/api/generic';
export declare function makeAPIRouteHandler(_config: APIRouteConfig): (req: NextApiRequest, res: NextApiResponse) => Promise<Response | undefined>;
