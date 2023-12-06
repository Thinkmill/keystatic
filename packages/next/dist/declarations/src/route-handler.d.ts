import { APIRouteConfig } from '@keystatic/core/api/generic';
export declare function makeRouteHandler(_config: APIRouteConfig): {
    GET: (request: Request) => Promise<Response>;
    POST: (request: Request) => Promise<Response>;
};
