import { useLayoutEffect, useRef, useState } from 'react';

import { cloneValidElement } from '../utils';

import { TransitionProps } from './types';

const forceReflow = (node: HTMLElement) => node.scrollTop;

/**
 * A low-level utility component for implementing transitions, which
 * safely unmount children _after_ their animation has completed.
 */
export const Transition = function Transition(props: TransitionProps) {
  let { isOpen } = useTransition(props);

  // NOTE: wait for the exit animation to complete before unmounting content.
  if (!isOpen) {
    return null;
  }

  return (
    cloneValidElement(props.children, {
      isOpen: isOpen === 'mounting' ? false : props.isOpen,
    }) ?? props.children
  );
};

export function useTransition(props: TransitionProps) {
  let {
    isOpen: isOpenProp,
    nodeRef,
    onEnter,
    onEntered,
    onEntering,
    onExit,
    onExited,
    onExiting,
  } = props;

  const [isOpen, setIsOpen] = useState<'mounting' | boolean>(
    isOpenProp ? 'mounting' : false
  );
  if (isOpenProp && !isOpen) {
    setIsOpen('mounting');
  }

  const hasCalledCompletedCallback = useRef(false);

  useLayoutEffect(() => {
    if (!hasCalledCompletedCallback.current && isOpenProp === isOpen) {
      hasCalledCompletedCallback.current = true;
      if (isOpenProp) {
        onEntered?.();
      } else {
        onExited?.();
      }
    }
    if (isOpenProp === isOpen) return;
    hasCalledCompletedCallback.current = false;
    if (isOpenProp) {
      onEnter?.();
      if (nodeRef.current) {
        forceReflow(nodeRef.current);
      }
      setIsOpen(true);
      onEntering?.();
    } else {
      onExit?.();
      onExiting?.();
      const id = setTimeout(() => {
        setIsOpen(false);
      }, 320);
      return () => clearTimeout(id);
    }
  }, [
    isOpenProp,
    isOpen,
    nodeRef,
    onEnter,
    onEntering,
    onExit,
    onExiting,
    onEntered,
    onExited,
  ]);

  return { isOpen, setIsOpen };
}
