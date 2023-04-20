import isEqual from 'fast-deep-equal';
import { useMemo } from 'react';
import { ComponentSchema, ObjectField } from '../form/api';
import { getSlugFromState } from './utils';
import { serializeProps } from '../form/serialize-props';

export function useHasChanged(args: {
  initialState: unknown;
  state: unknown;
  schema: ObjectField<Record<string, ComponentSchema>>;
  slugField: string | undefined;
}) {
  const initialFilesForUpdate = useMemo(
    () =>
      args.initialState === null
        ? null
        : serializeProps(
            args.initialState,
            args.schema,
            args.slugField,
            args.slugField
              ? getSlugFromState(
                  { schema: args.schema.fields, slugField: args.slugField },
                  args.initialState as Record<string, unknown>
                )
              : undefined,
            true
          ),
    [args.initialState, args.schema, args.slugField]
  );

  const filesForUpdate = useMemo(
    () =>
      serializeProps(
        args.state,
        args.schema,
        args.slugField,
        args.slugField
          ? getSlugFromState(
              { schema: args.schema.fields, slugField: args.slugField },
              args.state as Record<string, unknown>
            )
          : undefined,
        true
      ),
    [args.state, args.schema, args.slugField]
  );

  return useMemo(() => {
    return !isEqual(initialFilesForUpdate, filesForUpdate);
  }, [initialFilesForUpdate, filesForUpdate]);
}
