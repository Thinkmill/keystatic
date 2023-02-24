import { useMemo } from 'react';
import {
  getCollectionPath,
  getDataFileExtension,
  getCollectionFormat,
} from './path-utils';
import { useConfig } from './shell';
import { useTree } from './shell/data';
import { getTreeNodeAtPath } from './trees';
import { getTreeNodeForItem } from './utils';

export function useSlugsInCollection(collection: string) {
  const config = useConfig();
  const tree = useTree().current;

  return useMemo(() => {
    const loadedTree = tree.kind === 'loaded' ? tree.data.tree : new Map();
    const treeNode = getTreeNodeAtPath(
      loadedTree,
      getCollectionPath(config, collection)
    );
    if (!treeNode?.children) return [];
    const extension = getDataFileExtension(
      getCollectionFormat(config, collection)
    );
    return [...treeNode.children].flatMap(([, entry]) =>
      getTreeNodeForItem(config, collection, entry)?.children?.has(
        `index${extension}`
      )
        ? [entry.entry.path.replace(/^.+\/([^/]+)$/, '$1')]
        : []
    );
  }, [config, tree, collection]);
}
