import { useVisuallyHidden } from '@react-aria/visually-hidden';

import { BreakpointRange, useResponsiveRange } from '@voussoir/style';

export function useVisuallyHiddenRange(range?: BreakpointRange) {
  let matchedBreakpoints = useResponsiveRange();
  let { visuallyHiddenProps } = useVisuallyHidden();

  if (range && matchedBreakpoints(range)) {
    return visuallyHiddenProps;
  }
}
