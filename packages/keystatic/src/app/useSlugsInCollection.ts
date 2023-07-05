import { useMemo } from 'react';
import { useConfig } from './shell/context';
import { useTree } from './shell/data';
import { getEntriesInCollectionWithTreeKey } from './utils';

export function useSlugsInCollection(collection: string) {
  const config = useConfig();
  const tree = useTree().current;

  return useMemo(() => {
    const loadedTree = tree.kind === 'loaded' ? tree.data.tree : new Map();
    return getEntriesInCollectionWithTreeKey(
      config,
      collection,
      loadedTree
    ).map(x => x.slug);
  }, [config, tree, collection]);
}
