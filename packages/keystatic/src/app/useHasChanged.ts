import isEqual from 'fast-deep-equal';
import { useCallback, useMemo, useState } from 'react';
import { ComponentSchema, ObjectField } from '../form/api';
import { getSlugFromState } from './utils';
import { serializeProps } from '../form/serialize-props';
import { useData } from './useData';
import { blobSha } from './trees';

export function useHasChanged(args: {
  initialState: unknown;
  state: unknown;
  schema: ObjectField<Record<string, ComponentSchema>>;
  slugFields: readonly string[] | undefined;
}) {
  const serialize = useCallback(
    async (state: unknown) => {
      const slug = args.slugFields?.length
        ? getSlugFromState(
            { schema: args.schema.fields, slugFields: args.slugFields },
            state as Record<string, unknown>
          )
        : undefined;
      const serializedState = serializeProps(
        state,
        args.schema,
        args.slugFields,
        slug,
        true
      );
      return {
        slug,
        value: serializedState.value,
        extraFiles: Object.fromEntries(
          await Promise.all(
            serializedState.extraFiles.map(async val => [
              JSON.stringify([val.path, val.parent]),
              await blobSha(val.contents),
            ])
          )
        ),
      };
    },
    [args.schema, args.slugFields]
  );
  const initialFilesForUpdate = useData(
    useCallback(
      () => (args.initialState === null ? null : serialize(args.initialState)),
      [args.initialState, serialize]
    )
  );

  const filesForUpdate = useData(
    useCallback(() => serialize(args.state), [serialize, args.state])
  );

  const hasChangedState = useMemo(() => {
    if (
      initialFilesForUpdate.kind === 'loaded' &&
      filesForUpdate.kind === 'loaded'
    ) {
      const a = initialFilesForUpdate.data;
      const b = filesForUpdate.data;
      return !isEqual(a, b);
    }
    return 'unknown' as const;
  }, [initialFilesForUpdate, filesForUpdate]);

  const [hasChanged, setHasChanged] = useState(false);

  if (typeof hasChangedState === 'boolean' && hasChangedState !== hasChanged) {
    setHasChanged(hasChangedState);
  }
  return hasChanged;
}
