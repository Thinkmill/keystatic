import { FocusableProvider } from '@react-aria/focus';
import { useTooltipTrigger } from '@react-aria/tooltip';
import { useTooltipTriggerState } from '@react-stately/tooltip';
import React, { ReactElement, useRef } from 'react';

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

// Support TooltipTrigger inside components using CollectionBuilder.
TooltipTrigger.getCollectionNode = function* (props: TooltipTriggerProps) {
  // Children.toArray mutates the key prop, use Children.forEach instead.
  let childArray: ReactElement[] = [];
  React.Children.forEach(props.children, child => {
    if (React.isValidElement(child)) {
      childArray.push(child);
    }
  });
  let [trigger, tooltip] = childArray;
  yield {
    element: trigger,
    wrapper: (element: ReactElement) => (
      <TooltipTrigger key={element.key} {...props}>
        {element}
        {tooltip}
      </TooltipTrigger>
    ),
  };
};

/**
 * TooltipTrigger wraps around a trigger element and a Tooltip. It handles opening and closing
 * the Tooltip when the user hovers over or focuses the trigger, and positioning the Tooltip
 * relative to the trigger.
 */
// We don't want getCollectionNode to show up in the type definition
let _TooltipTrigger = TooltipTrigger as (
  props: TooltipTriggerProps
) => JSX.Element;
export { _TooltipTrigger as TooltipTrigger };
