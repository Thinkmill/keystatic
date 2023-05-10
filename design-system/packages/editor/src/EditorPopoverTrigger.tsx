import { cloneElement, useRef } from 'react';
import { PressResponder } from '@react-aria/interactions';
import { useOverlay, useOverlayTrigger } from '@react-aria/overlays';
import { mergeProps } from '@react-aria/utils';
import { useOverlayTriggerState } from '@react-stately/overlays';
import {
  FloatingPortal,
  autoUpdate,
  useFloating,
  useMergeRefs,
} from '@floating-ui/react';

import { DialogElement } from './styled-components';
import { EditorPopoverProps } from './types';
import { getMiddleware } from './utils';

type EditorPopoverTriggerProps = Omit<
  EditorPopoverProps,
  'children' | 'reference'
> & {
  children: [React.ReactElement, React.ReactElement];
};

export function EditorPopoverTrigger(props: EditorPopoverTriggerProps) {
  const { children, placement = 'bottom' } = props;

  if (!Array.isArray(children) || children.length > 2) {
    throw new Error('DialogTrigger must have exactly 2 children');
  }

  let [trigger, content] = children;

  let triggerRef = useRef<HTMLElement>(null);
  let popoverRef = useRef<HTMLElement>(null);

  let state = useOverlayTriggerState(props);
  let { triggerProps, overlayProps: triggerOverlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    state,
    triggerRef
  );
  let { overlayProps } = useOverlay(
    {
      isOpen: state.isOpen,
      onClose: state.close,
      shouldCloseOnBlur: true,
      isDismissable: true,
      isKeyboardDismissDisabled: false,
    },
    popoverRef
  );

  let middleware = getMiddleware(props);
  let { refs, floatingStyles } = useFloating({
    open: state.isOpen,
    onOpenChange: state.toggle,
    middleware,
    whileElementsMounted: autoUpdate,
    placement,
  });

  let floatingRef = useMergeRefs([refs.setFloating, popoverRef]);

  return (
    <>
      {/* <PressResponder
        {...triggerProps}
        ref={refs.setReference}
        onPress={state.toggle}
        isPressed={state.isOpen}
      >
        {trigger}
      </PressResponder> */}
      {cloneElement(trigger, {
        ...triggerProps,
        ref: refs.setReference,
        onPress: state.toggle,
        isPressed: state.isOpen,
      })}
      {state.isOpen && (
        <FloatingPortal>
          <DialogElement
            ref={floatingRef}
            style={floatingStyles}
            {...mergeProps(overlayProps, triggerOverlayProps)}
          >
            {content}
          </DialogElement>
        </FloatingPortal>
      )}
    </>
  );
}
