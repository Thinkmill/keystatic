import { useOverlayTriggerState } from '@react-stately/overlays';
import React, { ReactNode, useState } from 'react';

import { Modal } from '@keystar/ui/overlays';

import { DialogContext } from './context';
import { DialogContainerProps } from './types';

/**
 * A DialogContainer accepts a single Dialog as a child, and manages showing and hiding
 * it in a modal. Useful in cases where there is no trigger element
 * or when the trigger unmounts while the dialog is open.
 */
export function DialogContainer(props: DialogContainerProps) {
  let {
    children,
    type = 'modal',
    onDismiss,
    isDismissable,
    isKeyboardDismissDisabled,
  } = props;

  let childArray = React.Children.toArray(children);
  if (childArray.length > 1) {
    throw new Error('Only a single child can be passed to DialogContainer.');
  }

  let child = React.isValidElement(childArray[0]) ? childArray[0] : null;
  let [lastChild, setLastChild] = useState<ReactNode>(child);
  if (child && child !== lastChild) {
    setLastChild(child);
  }

  let context = {
    type,
    onClose: onDismiss,
    isDismissable,
  };

  let state = useOverlayTriggerState({
    isOpen: !!child,
    onOpenChange: isOpen => {
      if (!isOpen) {
        onDismiss();
      }
    },
  });

  return (
    <Modal
      state={state}
      type={type}
      isDismissable={isDismissable}
      isKeyboardDismissDisabled={isKeyboardDismissDisabled}
    >
      <DialogContext.Provider value={context}>
        {lastChild}
      </DialogContext.Provider>
    </Modal>
  );
}
