import { PressResponder } from '@react-aria/interactions';
import { useOverlayTrigger } from '@react-aria/overlays';
import { mergeProps, useEffectEvent } from '@react-aria/utils';
import {
  OverlayTriggerState,
  useOverlayTriggerState,
} from '@react-stately/overlays';
import { assertNever } from 'emery';
import { Children, Fragment, ReactElement, useEffect, useRef } from 'react';

import { Modal, Popover, PopoverProps, Tray } from '@keystar/ui/overlays';
import { breakpointQueries, useMediaQuery } from '@keystar/ui/style';

import { DialogContext } from './context';
import { DialogRenderFn, DialogProps, DialogTriggerProps } from './types';

function DialogTrigger(props: DialogTriggerProps) {
  let {
    children,
    type = 'modal',
    mobileType = type === 'popover' ? 'modal' : type,
    hideArrow,
    targetRef,
    isDismissable,
    isKeyboardDismissDisabled,
    ...positionProps
  } = props;
  if (!Array.isArray(children) || children.length > 2) {
    throw new Error('DialogTrigger must have exactly 2 children');
  }
  // if a function is passed as the second child, it won't appear in toArray
  let [trigger, content] = children as [ReactElement, DialogRenderFn];

  // On small devices, show a modal or tray instead of a popover.
  let isMobile = useMediaQuery(breakpointQueries.below.tablet);
  if (isMobile) {
    // handle cases where desktop popovers need a close button for the mobile modal view
    if (type !== 'modal' && mobileType === 'modal') {
      isDismissable = true;
    }

    type = mobileType;
  }

  let state = useOverlayTriggerState(props);
  let wasOpen = useRef(false);
  wasOpen.current = state.isOpen;
  let isExiting = useRef(false);
  let onExiting = () => (isExiting.current = true);
  let onExited = () => (isExiting.current = false);

  const onUnmount = useEffectEvent(() => {
    if (
      (wasOpen.current || isExiting.current) &&
      type !== 'popover' &&
      type !== 'tray'
    ) {
      console.warn(
        'A DialogTrigger unmounted while open. This is likely due to being placed within a trigger that unmounts or inside a conditional. Consider using a DialogContainer instead.'
      );
    }
  });

  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    return onUnmount;
  }, [onUnmount]);

  if (type === 'popover') {
    return (
      <PopoverTrigger
        {...positionProps}
        state={state}
        targetRef={targetRef}
        trigger={trigger}
        content={content}
        isKeyboardDismissDisabled={isKeyboardDismissDisabled}
        hideArrow={hideArrow}
      />
    );
  }

  let renderOverlay = () => {
    switch (type) {
      case 'fullscreen':
      case 'modal':
        return (
          <Modal
            state={state}
            isDismissable={type === 'modal' ? isDismissable : false}
            type={type}
            isKeyboardDismissDisabled={isKeyboardDismissDisabled}
            onExiting={onExiting}
            onExited={onExited}
          >
            {typeof content === 'function' ? content(state.close) : content}
          </Modal>
        );
      case 'tray':
        return (
          <Tray
            state={state}
            isKeyboardDismissDisabled={isKeyboardDismissDisabled}
          >
            {typeof content === 'function' ? content(state.close) : content}
          </Tray>
        );
    }

    assertNever(type as never);
  };

  return (
    <DialogTriggerBase
      type={type}
      state={state}
      isDismissable={isDismissable}
      trigger={trigger}
      overlay={renderOverlay()}
    />
  );
}

// Support DialogTrigger inside components using CollectionBuilder.
DialogTrigger.getCollectionNode = function* (props: DialogTriggerProps) {
  // @ts-ignore
  let [trigger] = Children.toArray(props.children);
  let [, content] = props.children as [ReactElement, DialogRenderFn];
  yield {
    element: trigger,
    wrapper: (element: ReactElement) => (
      <DialogTrigger key={element.key} {...props}>
        {element}
        {content}
      </DialogTrigger>
    ),
  };
};

/**
 * DialogTrigger serves as a wrapper around a Dialog and its associated trigger, linking the Dialog's
 * open state with the trigger's press state. Additionally, it allows you to customize the type and
 * positioning of the Dialog.
 */

// We don't want getCollectionNode to show up in the type definition
let _DialogTrigger = DialogTrigger as (
  props: DialogTriggerProps
) => JSX.Element;
export { _DialogTrigger as DialogTrigger };

function PopoverTrigger({
  state,
  targetRef,
  trigger,
  content,
  hideArrow,
  ...props
}: Omit<PopoverProps, 'children' | 'triggerRef'> &
  Omit<DialogTriggerProps, 'children'> & {
    trigger: ReactElement;
    content: DialogRenderFn | ReactElement;
  }) {
  let triggerRef = useRef<HTMLElement>(null);
  let { triggerProps, overlayProps } = useOverlayTrigger(
    { type: 'dialog' },
    state,
    triggerRef
  );

  let triggerPropsWithRef = {
    ...triggerProps,
    ref: targetRef ? undefined : triggerRef,
  };

  let overlay = (
    <Popover
      {...props}
      hideArrow={hideArrow}
      triggerRef={targetRef || triggerRef}
      state={state}
    >
      {typeof content === 'function' ? content(state.close) : content}
    </Popover>
  );

  return (
    <DialogTriggerBase
      type="popover"
      state={state}
      triggerProps={triggerPropsWithRef}
      dialogProps={overlayProps}
      trigger={trigger}
      overlay={overlay}
    />
  );
}

interface DialogTriggerBase {
  type: 'modal' | 'popover' | 'tray' | 'fullscreen';
  state: OverlayTriggerState;
  isDismissable?: boolean;
  dialogProps?: DialogProps | {};
  triggerProps?: any;
  overlay: ReactElement;
  trigger: ReactElement;
}

function DialogTriggerBase({
  type,
  state,
  isDismissable,
  dialogProps = {},
  triggerProps = {},
  overlay,
  trigger,
}: DialogTriggerBase) {
  let context = {
    type,
    onClose: state.close,
    isDismissable,
    ...dialogProps,
  };

  return (
    <Fragment>
      <PressResponder
        {...mergeProps(triggerProps, { onPress: state.open })}
        isPressed={state.isOpen && type !== 'modal' && type !== 'fullscreen'}
      >
        {trigger}
      </PressResponder>
      <DialogContext.Provider value={context}>{overlay}</DialogContext.Provider>
    </Fragment>
  );
}
