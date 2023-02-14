import { ForwardedRef, forwardRef, useCallback, useState } from 'react';
import { Overlay as ReactAriaOverlay } from '@react-aria/overlays';
import { OverlayProps } from '@react-types/overlays';

import { VoussoirProvider } from '@voussoir/core';

import { OpenTransition } from './OpenTransition';

/**
 * A low-level utility component for implementing overlay transitions, which
 * safely unmount children _after their animation has completed.
 */
export const Overlay = forwardRef(function Overlay(
  props: OverlayProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let {
    children,
    isOpen,
    container,
    onEnter,
    onEntering,
    onEntered,
    onExit,
    onExiting,
    onExited,
  } = props;
  let [exited, setExited] = useState(!isOpen);

  let handleEntered = useCallback(() => {
    setExited(false);
    if (onEntered) {
      onEntered();
    }
  }, [onEntered]);

  let handleExited = useCallback(() => {
    setExited(true);
    if (onExited) {
      onExited();
    }
  }, [onExited]);

  // NOTE: wait for the exit animation to complete before unmounting content.
  if (!(isOpen || !exited)) {
    return null;
  }

  return (
    <ReactAriaOverlay portalContainer={container}>
      <VoussoirProvider
        ref={forwardedRef}
        // ensure children
        UNSAFE_style={{ background: 'transparent', isolation: 'isolate' }}
        // unset container
        isDisabled={false}
      >
        <OpenTransition
          in={isOpen}
          appear
          onExit={onExit}
          onExiting={onExiting}
          onExited={handleExited}
          onEnter={onEnter}
          onEntering={onEntering}
          onEntered={handleEntered}
        >
          {children}
        </OpenTransition>
      </VoussoirProvider>
    </ReactAriaOverlay>
  );
});
