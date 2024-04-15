import { ForwardedRef, forwardRef } from 'react';
import { Overlay as ReactAriaOverlay } from '@react-aria/overlays';
import { OverlayProps } from '@react-types/overlays';

import { KeystarProvider } from '@keystar/ui/core';

import { cloneValidElement } from '../utils';

import { useTransition } from './Transition';

/** * Utility component for implementing overlay transitions. */
export const Overlay = forwardRef(function Overlay(
  props: OverlayProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { isOpen } = useTransition(props);

  // NOTE: wait for the exit animation to complete before unmounting content.
  if (!isOpen) {
    return null;
  }

  return (
    <ReactAriaOverlay portalContainer={props.container}>
      <KeystarProvider
        ref={forwardedRef}
        // ensure children
        UNSAFE_style={{ background: 'transparent', isolation: 'isolate' }}
        // unset container
        isDisabled={false}
      >
        {cloneValidElement(props.children, {
          isOpen: isOpen === 'mounting' ? false : props.isOpen,
        }) ?? props.children}
      </KeystarProvider>
    </ReactAriaOverlay>
  );
});
