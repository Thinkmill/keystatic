import { useMemo } from 'react';
import { Collection } from '../config';
import { ComponentSchema } from '../form/api';

export function useDuplicateSlug(
  duplicateInitalState: Record<string, unknown> | undefined,
  collectionConfig: Collection<Record<string, ComponentSchema>, string>
) {
  return useMemo(() => {
    if (duplicateInitalState) {
      // we'll make a best effort to add something to the slug after duplicated so it's different
      // but if it fails a user can change it before creating
      // (e.g. potentially it's not just a text field so appending -copy might not work)
      const { slugField } = collectionConfig;
      const defaultSlugVal = duplicateInitalState[collectionConfig.slugField];
      const slugFieldSchema =
        collectionConfig.schema[collectionConfig.slugField];
      if (
        slugFieldSchema.kind === 'form' &&
        slugFieldSchema.formKind === 'slug'
      ) {
        try {
          const serialized = slugFieldSchema.serializeWithSlug(defaultSlugVal);
          const slugFieldValue = slugFieldSchema.parse(serialized.value, {
            slug: serialized.slug ? `${serialized.slug}-copy` : '',
          });
          return {
            ...duplicateInitalState,
            [slugField]: slugFieldValue,
          };
        } catch {}
      }
      return {
        ...duplicateInitalState,
        [slugField]: defaultSlugVal,
      };
    }
  }, [collectionConfig, duplicateInitalState]);
}
