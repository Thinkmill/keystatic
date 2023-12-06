import { Collection, ComponentSchema, Config, Singleton } from "../index.js";
import { BaseReader } from "./generic.js";
export type { Entry, EntryWithResolvedLinkedFiles } from "./generic.js";
export type Reader<Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
}, Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
}> = BaseReader<Collections, Singletons> & {
    repoPath: string;
};
export declare function createReader<Collections extends {
    [key: string]: Collection<Record<string, ComponentSchema>, string>;
}, Singletons extends {
    [key: string]: Singleton<Record<string, ComponentSchema>>;
}>(repoPath: string, config: Config<Collections, Singletons>): Reader<Collections, Singletons>;
