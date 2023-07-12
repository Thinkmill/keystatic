import { PressResponder } from '@react-aria/interactions';
import { useMenuTrigger } from '@react-aria/menu';
import { useObjectRef } from '@react-aria/utils';
import { useMenuTriggerState } from '@react-stately/menu';
import { Placement } from '@react-types/overlays';
import React, { ForwardedRef, forwardRef, Fragment, useRef } from 'react';

import { Popover, Tray } from '@keystar/ui/overlays';
import { SlotProvider } from '@keystar/ui/slots';
import { tokenSchema, useIsMobileDevice } from '@keystar/ui/style';

import { MenuContext } from './context';
import { MenuTriggerProps } from './types';

/**
 * The MenuTrigger serves as a wrapper around a Menu and its associated trigger,
 * linking the Menu's open state with the trigger's press state.
 */
export const MenuTrigger = forwardRef(function MenuTrigger(
  props: MenuTriggerProps,
  forwardedRef: ForwardedRef<HTMLElement>
) {
  let triggerRef = useRef<HTMLElement>(null);
  let domRef = useObjectRef(forwardedRef);
  let menuTriggerRef = domRef || triggerRef;
  let menuRef = useRef<HTMLUListElement>(null);
  let {
    children,
    align = 'start',
    shouldFlip = true,
    direction = 'bottom',
    closeOnSelect,
    trigger = 'press',
  } = props;

  let [menuTrigger, menu] = React.Children.toArray(children);
  let state = useMenuTriggerState(props);

  let { menuTriggerProps, menuProps } = useMenuTrigger(
    { trigger },
    state,
    menuTriggerRef
  );

  let initialPlacement: Placement;
  switch (direction) {
    case 'left':
    case 'right':
    case 'start':
    case 'end':
      initialPlacement = `${direction} ${
        align === 'end' ? 'bottom' : 'top'
      }` as Placement;
      break;
    case 'bottom':
    case 'top':
    default:
      initialPlacement = `${direction} ${align}` as Placement;
  }

  let isMobile = useIsMobileDevice();
  let menuContext = {
    ...menuProps,
    ref: menuRef,
    onClose: state.close,
    closeOnSelect,
    autoFocus: state.focusStrategy || true,
    UNSAFE_style: isMobile
      ? {
          width: '100%',
          maxHeight: 'inherit',
        }
      : {
          maxWidth: tokenSchema.size.dialog.xsmall,
        },
  };

  // On small screen devices, the menu is rendered in a tray, otherwise a popover.
  let overlay;
  if (isMobile) {
    overlay = <Tray state={state}>{menu}</Tray>;
  } else {
    overlay = (
      <Popover
        state={state}
        triggerRef={menuTriggerRef}
        scrollRef={menuRef}
        placement={initialPlacement}
        hideArrow
        shouldFlip={shouldFlip}
      >
        {menu}
      </Popover>
    );
  }

  return (
    <Fragment>
      <SlotProvider
        slots={{ actionButton: { holdAffordance: trigger === 'longPress' } }}
      >
        <PressResponder
          {...menuTriggerProps}
          ref={menuTriggerRef}
          isPressed={state.isOpen}
        >
          {menuTrigger}
        </PressResponder>
      </SlotProvider>
      <MenuContext.Provider
        // TODO: Fix this type error
        // @ts-expect-error
        value={menuContext}
      >
        {overlay}
      </MenuContext.Provider>
    </Fragment>
  );
});
