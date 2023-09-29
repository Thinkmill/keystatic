import isEqual from 'fast-deep-equal';
import { useCallback, useMemo } from 'react';
import { ComponentSchema, ObjectField } from '../form/api';
import { getSlugFromState } from './utils';
import { serializeProps } from '../form/serialize-props';

export function useHasChanged(args: {
  initialState: unknown;
  state: unknown;
  schema: ObjectField<Record<string, ComponentSchema>>;
  slugField: string | undefined;
}) {
  const serialize = useCallback(
    (state: unknown) => {
      const slug = args.slugField
        ? getSlugFromState(
            { schema: args.schema.fields, slugField: args.slugField },
            state as Record<string, unknown>
          )
        : undefined;
      return {
        slug,
        state: serializeProps(state, args.schema, args.slugField, slug, true),
      };
    },
    [args.schema, args.slugField]
  );
  const initialFilesForUpdate = useMemo(
    () => (args.initialState === null ? null : serialize(args.initialState)),
    [args.initialState, serialize]
  );

  const filesForUpdate = useMemo(
    () => serialize(args.state),
    [serialize, args.state]
  );

  return useMemo(() => {
    return !isEqual(initialFilesForUpdate, filesForUpdate);
  }, [initialFilesForUpdate, filesForUpdate]);
}
