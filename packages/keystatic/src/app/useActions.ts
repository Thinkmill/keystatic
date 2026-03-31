import { useMemo } from 'react';
import { getActions } from '../hooks';
import type { Action } from '../hooks';

export function useActions(params: {
  collection?: string;
  singleton?: string;
  slug?: string;
  data: Record<string, unknown>;
}): Action[] {
  return useMemo(() => {
    const actions = getActions(params.collection, params.singleton);

    return actions.filter(action => {
      if (action.when?.match) {
        return action.when.match({ slug: params.slug, data: params.data });
      }
      return true;
    });
  }, [params.collection, params.singleton, params.slug, params.data]);
}
