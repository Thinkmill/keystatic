import { useMemo } from 'react';
import { S as useConfig, b as useTree, d as getEntriesInCollectionWithTreeKey } from './index-47692431.esm.js';

function useSlugsInCollection(collection) {
  const config = useConfig();
  const tree = useTree().current;
  return useMemo(() => {
    const loadedTree = tree.kind === 'loaded' ? tree.data.tree : new Map();
    return getEntriesInCollectionWithTreeKey(config, collection, loadedTree).map(x => x.slug);
  }, [config, tree, collection]);
}

export { useSlugsInCollection as u };
