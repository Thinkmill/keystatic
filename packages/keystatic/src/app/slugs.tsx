import { useMemo } from 'react';
import { getSlugGlobForCollection } from './path-utils';
import { useSlugsInCollection } from './useSlugsInCollection';
import { getCollectionPathFieldSegments } from './utils';
import { SlugFieldInfo } from '../form/fields/text/path-slug-context';
import { useConfig } from './shell/context';

export function useSlugFieldInfo(
  collection: string,
  slugToExclude?: string,
  state?: Record<string, unknown>
): SlugFieldInfo {
  const config = useConfig();
  const allSlugs = useSlugsInCollection(collection);

  return useMemo((): SlugFieldInfo => {
    const slugs = new Set(allSlugs);
    if (slugToExclude) {
      slugs.delete(slugToExclude);
    }
    const collectionConfig = config.collections![collection];
    return {
      field: collectionConfig.slugField,
      slugs,
      glob: getSlugGlobForCollection(config, collection),
      pathSegments:
        state === undefined
          ? undefined
          : getCollectionPathFieldSegments(collectionConfig, state),
    };
  }, [allSlugs, collection, config, slugToExclude, state]);
}
