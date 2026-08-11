import {
  DialogTrigger as AriaDialogTrigger,
  OverlayTriggerStateContext,
} from 'react-aria-components/Dialog';
import { type ReactElement, useContext } from 'react';

import { Modal, Popover, Tray } from '@keystar/ui/overlays';
import { breakpointQueries, useMediaQuery } from '@keystar/ui/style';

import { DialogContext } from './context';
import { DialogRenderFn, DialogTriggerProps, DialogType } from './types';

/** Links a RAC-aware trigger with a dialog overlay. */
export function DialogTrigger(props: DialogTriggerProps) {
  let {
    children,
    type = 'modal',
    mobileType = type === 'popover' ? 'modal' : type,
    hideArrow,
    targetRef,
    isDismissable,
    isKeyboardDismissDisabled,
    isOpen,
    defaultOpen,
    onOpenChange,
    ...positionProps
  } = props;
  if (!Array.isArray(children) || children.length !== 2) {
    throw new Error('DialogTrigger must have exactly 2 children');
  }
  let [trigger, content] = children as [ReactElement, DialogRenderFn];

  let isMobile = useMediaQuery(breakpointQueries.below.tablet);
  if (isMobile) {
    if (type !== 'modal' && mobileType === 'modal') {
      isDismissable = true;
    }
    type = mobileType;
  }

  let dialog = (
    <DialogContent
      type={type}
      isDismissable={isDismissable}
      content={content}
    />
  );

  return (
    <AriaDialogTrigger
      isOpen={isOpen}
      defaultOpen={defaultOpen}
      onOpenChange={onOpenChange}
    >
      {trigger}
      {renderOverlay(type, dialog, {
        ...positionProps,
        hideArrow,
        isDismissable,
        isKeyboardDismissDisabled,
        targetRef,
      })}
    </AriaDialogTrigger>
  );
}

function renderOverlay(
  type: DialogType,
  dialog: ReactElement,
  props: Omit<DialogTriggerProps, 'children' | 'type' | 'mobileType'>
) {
  let {
    hideArrow,
    isDismissable,
    isKeyboardDismissDisabled,
    targetRef,
    ...positionProps
  } = props;

  switch (type) {
    case 'popover':
      return (
        <Popover
          {...positionProps}
          hideArrow={hideArrow}
          isKeyboardDismissDisabled={isKeyboardDismissDisabled}
          triggerRef={targetRef}
        >
          {dialog}
        </Popover>
      );
    case 'tray':
      return (
        <Tray
          isDismissable
          isKeyboardDismissDisabled={isKeyboardDismissDisabled}
        >
          {dialog}
        </Tray>
      );
    case 'fullscreen':
    case 'modal':
      return (
        <Modal
          type={type}
          isDismissable={type === 'modal' ? isDismissable : false}
          isKeyboardDismissDisabled={isKeyboardDismissDisabled}
        >
          {dialog}
        </Modal>
      );
  }
}

function DialogContent({
  content,
  isDismissable,
  type,
}: {
  content: DialogRenderFn | ReactElement;
  isDismissable?: boolean;
  type: DialogType;
}) {
  let state = useContext(OverlayTriggerStateContext);
  if (!state) return null;

  return (
    <DialogContext.Provider
      value={{ type, isDismissable, onClose: state.close }}
    >
      {typeof content === 'function' ? content(state.close) : content}
    </DialogContext.Provider>
  );
}
