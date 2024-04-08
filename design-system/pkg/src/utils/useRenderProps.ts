import { WithRenderProps } from '@keystar/ui/types';
import { useMemo } from 'react';

/**
 * Render the children of a component, either as a function or a ReactNode.
 *
 * @param props The props of the component.
 * @param values A **memoized** object, which is passed as the argument to your `props.children` render fn.
 */
export function useRenderProps<T extends Record<string, any>>(
  props: WithRenderProps<T>,
  values: T
) {
  let { children } = props;

  return useMemo(() => {
    if (typeof children === 'function') {
      return children(values);
    }

    return children;
  }, [children, values]);
}
