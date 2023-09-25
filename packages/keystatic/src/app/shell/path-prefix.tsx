import { Config } from '../../config';
import { getPathPrefix } from '../path-utils';
import { treeEntriesToTreeNodes, TreeEntry, TreeNode } from '../trees';

export function scopeEntriesWithPathPrefix(
  tree: {
    entries: Map<string, TreeEntry>;
    tree: Map<string, TreeNode>;
  },
  config: Config
): {
  entries: Map<string, TreeEntry>;
  tree: Map<string, TreeNode>;
} {
  const prefix = getPathPrefix(config.storage);
  if (!prefix) return tree;
  const newEntries = [];
  for (const entry of tree.entries.values()) {
    if (entry.path.startsWith(prefix)) {
      newEntries.push({
        ...entry,
        path: entry.path.slice(prefix.length),
      });
    }
  }
  return {
    entries: new Map(newEntries.map(entry => [entry.path, entry])),
    tree: treeEntriesToTreeNodes(newEntries),
  };
}
