import { useMemo } from 'react';
import { getLocaleDirsToSkip, getSlugGlobForCollection } from './path-utils';
import { useSlugsInCollection } from './useSlugsInCollection';
import { SlugFieldInfo } from '../form/fields/text/path-slug-context';
import { useConfig } from './shell/context';
import { useActiveLocale } from './shell/content-locale';

export function useSlugFieldInfo(
  collection: string,
  slugToExclude?: string
): SlugFieldInfo {
  const config = useConfig();
  const allSlugs = useSlugsInCollection(collection);
  const locale = useActiveLocale();

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
      reservedLocaleDirs: getLocaleDirsToSkip(config, collection, locale),
    };
  }, [allSlugs, collection, config, locale, slugToExclude]);
}
