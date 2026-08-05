import { FocusableProvider } from 'react-aria/private/interactions/useFocusable';
import { useTooltipTrigger } from 'react-aria/useTooltipTrigger';
import { useTooltipTriggerState } from 'react-stately/useTooltipTriggerState';
import React, { ReactElement, useRef, type JSX } from 'react';

import { Overlay } from '@keystar/ui/overlays';

import { TooltipContext } from './context';
import { TooltipTriggerProps } from './types';

export const MOUSE_REST_TIMEOUT = 600;

function TooltipTrigger(props: TooltipTriggerProps) {
  let { children, isDisabled, trigger: triggerMode, ...otherProps } = props;

  let targetRef = useRef<HTMLElement>(null);
  let overlayRef = useRef<HTMLDivElement>(null);

  let state = useTooltipTriggerState({
    isDisabled,
    delay: MOUSE_REST_TIMEOUT,
    trigger: triggerMode,
    ...props,
  });
  let { triggerProps, tooltipProps } = useTooltipTrigger(
    { isDisabled, trigger: triggerMode },
    state,
    targetRef
  );

  let [triggerElement, tooltipElement] = React.Children.toArray(children);

  return (
    <FocusableProvider {...triggerProps} ref={targetRef}>
      {triggerElement}
      <TooltipContext.Provider
        value={{
          overlayRef,
          targetRef,
          state,
          ...otherProps,
          ...tooltipProps,
        }}
      >
        <Overlay isOpen={state.isOpen} nodeRef={overlayRef}>
          {tooltipElement}
        </Overlay>
      </TooltipContext.Provider>
    </FocusableProvider>
  );
}

/**
 * TooltipTrigger wraps around a trigger element and a Tooltip. It handles opening and closing
 * the Tooltip when the user hovers over or focuses the trigger, and positioning the Tooltip
 * relative to the trigger.
 */
export { TooltipTrigger };
