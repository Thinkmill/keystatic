import isEqual from 'fast-deep-equal';
import { useCallback, useState, useMemo } from 'react';
import { ComponentSchema } from '../DocumentEditor/component-blocks/api';
import { toFiles } from '../utils';
import { useData } from './useData';

export function useHasChanged(args: {
  initialState: unknown;
  state: unknown;
  schema: ComponentSchema;
}) {
  const initialFilesForUpdate = useData(
    useCallback(() => toFiles(args.initialState, args.schema), [args.initialState, args.schema])
  );
  const filesForUpdate = useData(
    useCallback(() => toFiles(args.state, args.schema), [args.state, args.schema])
  );

  const [hasChanged, setHasChanged] = useState(false);

  const hasChangedState = useMemo(() => {
    if (initialFilesForUpdate.kind === 'loaded' && filesForUpdate.kind === 'loaded') {
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
