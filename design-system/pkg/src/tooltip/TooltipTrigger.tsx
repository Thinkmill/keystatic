import { TooltipTrigger as AriaTooltipTrigger } from 'react-aria-components/Tooltip';
import { Children, cloneElement, isValidElement } from 'react';

import { TooltipTriggerProps } from './types';

export const MOUSE_REST_TIMEOUT = 600;

/** Handles hover/focus interaction for a RAC-aware trigger and tooltip. */
export function TooltipTrigger({
  delay = MOUSE_REST_TIMEOUT,
  placement,
  offset,
  crossOffset,
  shouldFlip,
  children,
  ...triggerProps
}: TooltipTriggerProps) {
  let [trigger, tooltip] = Children.toArray(children);
  return (
    <AriaTooltipTrigger {...triggerProps} delay={delay}>
      {trigger}
      {isValidElement(tooltip)
        ? cloneElement(tooltip, {
            placement,
            offset,
            crossOffset,
            shouldFlip,
          } as {})
        : tooltip}
    </AriaTooltipTrigger>
  );
}
