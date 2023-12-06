type Changes = {
    additions: {
        path: string;
        contents: {
            byteLength: number;
            sha: string;
        };
    }[];
    deletions: string[];
};
export declare function blobSha(contents: Uint8Array): Promise<string>;
export type TreeNode = {
    entry: TreeEntry;
    children?: Map<string, TreeNode>;
};
export declare function getTreeNodeAtPath(root: Map<string, TreeNode>, path: string): TreeNode | undefined;
export type TreeEntry = {
    path: string;
    mode: string;
    type: string;
    sha: string;
    size?: number;
};
export declare function toTreeChanges(changes: Changes): Map<any, any>;
export declare function treeSha(children: Map<string, TreeNode>): Promise<string>;
export declare function createBlobNodeEntry(path: string, contents: {
    byteLength: number;
    sha: string;
}): Promise<TreeEntry>;
export declare function updateTreeWithChanges(tree: Map<string, TreeNode>, changes: Changes): Promise<{
    entries: TreeEntry[];
    sha: string;
}>;
export declare function treeEntriesToTreeNodes(entries: TreeEntry[]): Map<string, TreeNode>;
export {};
