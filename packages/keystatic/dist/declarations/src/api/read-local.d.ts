import { Config } from "../config.js";
export declare function readToDirEntries(baseDir: string): Promise<import("./trees-server-side.js").TreeEntry[]>;
export declare function getAllowedDirectories(config: Config): string[];
