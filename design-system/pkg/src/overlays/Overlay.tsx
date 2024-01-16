import { ForwardedRef, forwardRef, useLayoutEffect, useState } from 'react';
import { Overlay as ReactAriaOverlay } from '@react-aria/overlays';
import { OverlayProps } from '@react-types/overlays';

import { KeystarProvider } from '@keystar/ui/core';
import { cloneValidElement } from '../utils';

const forceReflow = (node: HTMLElement) => node.scrollTop;

/**
 * A low-level utility component for implementing overlay transitions, which
 * safely unmount children _after their animation has completed.
 */
export const Overlay = forwardRef(function Overlay(
  props: OverlayProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { isOpen, container, children, nodeRef } = props;

  const [isOpenState, setIsOpenState] = useState<'mounting' | boolean>(
    props.isOpen ? 'mounting' : false
  );
  if (isOpen && !isOpenState) {
    setIsOpenState('mounting');
  }

  useLayoutEffect(() => {
    if (isOpen === isOpenState) return;
    if (isOpen) {
      if (nodeRef.current) {
        forceReflow(nodeRef.current);
      }
      setIsOpenState(true);
    } else {
      const id = setTimeout(() => {
        setIsOpenState(false);
      }, 320);
      return () => clearTimeout(id);
    }
  }, [isOpen, isOpenState, nodeRef]);

  // NOTE: wait for the exit animation to complete before unmounting content.
  if (!isOpenState) {
    return null;
  }

  return (
    <ReactAriaOverlay portalContainer={container}>
      <KeystarProvider
        ref={forwardedRef}
        // ensure children
        UNSAFE_style={{ background: 'transparent', isolation: 'isolate' }}
        // unset container
        isDisabled={false}
      >
        {cloneValidElement(children, {
          isOpen: isOpenState === 'mounting' ? false : isOpen,
        }) ?? children}
      </KeystarProvider>
    </ReactAriaOverlay>
  );
});
