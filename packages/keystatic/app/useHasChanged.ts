import isEqual from 'fast-deep-equal';
import { useCallback, useState, useMemo } from 'react';
import {
  ComponentSchema,
  ObjectField,
} from '../DocumentEditor/component-blocks/api';
import { toFiles } from '../utils';
import { useData } from './useData';
import { getSlugFromState } from './utils';

export function useHasChanged(args: {
  initialState: unknown;
  state: unknown;
  schema: ObjectField<Record<string, ComponentSchema>>;
  slugField: string | undefined;
}) {
  const initialFilesForUpdate = useData(
    useCallback(
      () =>
        toFiles(
          args.initialState,
          args.schema,
          args.slugField
            ? {
                field: args.slugField,
                value: getSlugFromState(
                  { schema: args.schema.fields, slugField: args.slugField },
                  args.initialState as Record<string, unknown>
                ),
              }
            : undefined
        ),
      [args.initialState, args.schema, args.slugField]
    )
  );
  const filesForUpdate = useData(
    useCallback(
      () =>
        toFiles(
          args.state,
          args.schema,
          args.slugField
            ? {
                field: args.slugField,
                value: getSlugFromState(
                  { schema: args.schema.fields, slugField: args.slugField },
                  args.state as Record<string, unknown>
                ),
              }
            : undefined
        ),
      [args.state, args.schema, args.slugField]
    )
  );

  const [hasChanged, setHasChanged] = useState(false);

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

  if (typeof hasChangedState === 'boolean' && hasChangedState !== hasChanged) {
    setHasChanged(hasChangedState);
  }
  return hasChanged;
}
