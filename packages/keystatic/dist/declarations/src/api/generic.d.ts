import { Config } from "../index.js";
import { KeystaticResponse, KeystaticRequest } from "./internal-utils.js";
export type APIRouteConfig = {
    /** @default process.env.KEYSTATIC_GITHUB_CLIENT_ID */
    clientId?: string;
    /** @default process.env.KEYSTATIC_GITHUB_CLIENT_SECRET */
    clientSecret?: string;
    /** @default process.env.KEYSTATIC_SECRET */
    secret?: string;
    localBaseDirectory?: string;
    config: Config<any, any>;
};
export declare function makeGenericAPIRouteHandler(_config: APIRouteConfig, options?: {
    slugEnvName?: string;
}): (req: KeystaticRequest) => Promise<KeystaticResponse>;
