import {
  useVisuallyHidden,
  VisuallyHiddenProps,
} from 'react-aria/VisuallyHidden';

import { BreakpointRange, useResponsiveRange } from '@keystar/ui/style';

export function useVisuallyHiddenRange(
  range?: BreakpointRange
): VisuallyHiddenProps | undefined {
  let matchedBreakpoints = useResponsiveRange();
  let { visuallyHiddenProps } = useVisuallyHidden();

  if (range && matchedBreakpoints(range)) {
    return visuallyHiddenProps;
  }
}
