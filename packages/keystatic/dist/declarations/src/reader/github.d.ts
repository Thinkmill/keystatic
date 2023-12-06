import { Collection, ComponentSchema, Config, Singleton } from "../index.js";
import { BaseReader } from "./generic.js";
export type { Entry, EntryWithResolvedLinkedFiles } from "./generic.js";
export type Reader<Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
}, Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
}> = BaseReader<Collections, Singletons>;
export declare function createGitHubReader<Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
}, Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
}>(config: Config<Collections, Singletons>, opts: {
    repo: `${string}/${string}`;
    pathPrefix?: string;
    ref?: string;
    token?: string;
}): Reader<Collections, Singletons>;
