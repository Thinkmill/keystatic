import {
  MenuTrigger as AriaMenuTrigger,
  type MenuTriggerProps as AriaMenuTriggerProps,
} from 'react-aria-components/Menu';
import { Popover } from '@keystar/ui/overlays';
import {
  Children,
  ForwardedRef,
  Ref,
  cloneElement,
  forwardRef,
  isValidElement,
  useMemo,
} from 'react';

import { css, tokenSchema } from '@keystar/ui/style';
import { mergeRefs } from 'react-aria/mergeRefs';

import { MenuTriggerProps } from './types';

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
  let mergedTriggerRef = useMemo(
    () => mergeRefs(triggerRef, forwardedRef),
    [triggerRef, forwardedRef]
  );
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
        hideArrow
        UNSAFE_className={css({
          maxWidth: tokenSchema.size.dialog.xsmall,
        })}
      >
        {isValidElement(menu) && closeOnSelect !== undefined
          ? cloneElement(menu, { shouldCloseOnSelect: closeOnSelect } as {})
          : menu}
      </Popover>
    </AriaMenuTrigger>
  );
});
