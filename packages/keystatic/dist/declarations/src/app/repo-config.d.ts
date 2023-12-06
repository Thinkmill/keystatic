export type RepoConfig = `${string}/${string}` | {
    owner: string;
    name: string;
};
export declare function parseRepoConfig(repo: RepoConfig): {
    owner: string;
    name: string;
};
export declare function serializeRepoConfig(repo: RepoConfig): string;
export declare function assertValidRepoConfig(repo: RepoConfig): void;
