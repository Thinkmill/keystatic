import { useMemo } from 'react';
import {
  getSlugFieldsForCollection,
  getSlugGlobForCollection,
} from './path-utils';
import { useSlugsInCollection } from './useSlugsInCollection';
import { SlugFieldInfo } from '../form/fields/text/path-slug-context';
import { useConfig } from './shell/context';

export function useSlugFieldInfo(
  collection: string,
  slugToExclude?: string
): SlugFieldInfo {
  const config = useConfig();
  const allSlugs = useSlugsInCollection(collection);

  return useMemo((): SlugFieldInfo => {
    const slugs = new Set(allSlugs);
    if (slugToExclude) {
      slugs.delete(slugToExclude);
    }
    const slugFields = getSlugFieldsForCollection(config, collection);
    return {
      field: slugFields[slugFields.length - 1],
      fields: slugFields,
      slugs,
      glob: getSlugGlobForCollection(config, collection),
    };
  }, [allSlugs, collection, config, slugToExclude]);
}
