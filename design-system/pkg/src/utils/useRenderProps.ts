import { WithRenderProps } from '@keystar/ui/types';

export function useRenderProps<T>(props: WithRenderProps<T>, values: T) {
  if (typeof props.children === 'function') {
    return props.children(values);
  } else {
    return props.children;
  }
}
