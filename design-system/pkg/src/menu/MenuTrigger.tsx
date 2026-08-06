import {
  MenuTrigger as AriaMenuTrigger,
  type MenuTriggerProps as AriaMenuTriggerProps,
} from 'react-aria-components/Menu';
import { Popover } from 'react-aria-components/Popover';
import {
  Children,
  ForwardedRef,
  Ref,
  cloneElement,
  forwardRef,
  isValidElement,
} from 'react';

import { css, tokenSchema } from '@keystar/ui/style';

import { MenuTriggerProps } from './types';

function setRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (typeof ref === 'function') {
    ref(value);
  } else if (ref) {
    ref.current = value;
  }
}

/** Links a RAC-aware trigger with a menu in a positioned popover. */
export const MenuTrigger = forwardRef(function MenuTrigger(
  props: MenuTriggerProps,
  forwardedRef: ForwardedRef<HTMLElement>
) {
  let {
    align = 'start',
    children,
    closeOnSelect,
    direction = 'bottom',
    shouldFlip = true,
    ...triggerProps
  } = props;
  let [trigger, menu] = Children.toArray(children);
  let triggerRef = isValidElement(trigger)
    ? (trigger.props as { ref?: Ref<HTMLElement> }).ref
    : undefined;
  let mergedTriggerRef = (element: HTMLElement | null) => {
    setRef(triggerRef, element);
    setRef(forwardedRef, element);
  };
  let placement =
    direction === 'left' ||
    direction === 'right' ||
    direction === 'start' ||
    direction === 'end'
      ? `${direction} ${align === 'end' ? 'bottom' : 'top'}`
      : `${direction} ${align}`;

  return (
    <AriaMenuTrigger {...(triggerProps as AriaMenuTriggerProps)}>
      {isValidElement(trigger)
        ? cloneElement(trigger, { ref: mergedTriggerRef } as {})
        : trigger}
      <Popover
        placement={placement as never}
        shouldFlip={shouldFlip}
        className={css({
          backgroundColor: tokenSchema.color.background.surface,
          border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.border.emphasis}`,
          borderRadius: tokenSchema.size.radius.medium,
          boxSizing: 'content-box',
          filter: `drop-shadow(0 1px 4px ${tokenSchema.color.shadow.regular})`,
          maxWidth: tokenSchema.size.dialog.xsmall,
          outline: 0,
        })}
      >
        {isValidElement(menu) && closeOnSelect !== undefined
          ? cloneElement(menu, { shouldCloseOnSelect: closeOnSelect } as {})
          : menu}
      </Popover>
    </AriaMenuTrigger>
  );
});
