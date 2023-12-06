import { APIRouteConfig } from '@keystatic/core/api/generic';
export declare function handleLoader(_config: APIRouteConfig, args: {
    request: Request;
    params: {
        readonly [key: string]: string | undefined;
    };
    context: Record<string, unknown>;
}): Promise<Response>;
