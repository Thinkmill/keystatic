import { ForwardedRef, forwardRef, useMemo } from 'react';

import { useButton } from '@react-aria/button';
import { useHover } from '@react-aria/interactions';
import { mergeProps, useObjectRef } from '@react-aria/utils';

import { useProviderProps } from '@voussoir/core';
import { SlotProvider, SlotContextType, useSlotProps } from '@voussoir/slots';
import { FocusRing } from '@voussoir/style';
import { Text } from '@voussoir/typography';
import { filterDOMProps, isReactText } from '@voussoir/utils';

import {
  actionButtonClassList,
  useActionButtonStyles,
} from './useActionButtonStyles';
import { ActionButtonProps, CommonProps } from './types';

/**
 * Action buttons allow users to perform an action. They’re used for similar,
 * task-based options within a workflow, and are ideal for interfaces where
 * buttons aren’t meant to draw a lot of attention.
 */
export const ActionButton = forwardRef(function ActionButton(
  props: ActionButtonProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>
) {
  const { isDisabled, ...otherProps } = props;
  props = useProviderProps(props);
  props = useSlotProps(props, 'button');

  const children = useActionButtonChildren(props);
  const domRef = useObjectRef(forwardedRef);
  const { buttonProps, isPressed } = useButton(props, domRef);
  const { hoverProps, isHovered } = useHover({ isDisabled });
  const styleProps = useActionButtonStyles(props, { isHovered, isPressed });

  return (
    <FocusRing autoFocus={props.autoFocus}>
      <button
        ref={domRef}
        {...styleProps}
        {...filterDOMProps(otherProps)}
        {...mergeProps(buttonProps, hoverProps)}
      >
        {children}
      </button>
    </FocusRing>
  );
});

// Utils
// -----------------------------------------------------------------------------

export const useActionButtonChildren = (
  props: CommonProps,
  alternateSlots?: SlotContextType
) => {
  const { children } = props;

  // avoid unnecessary re-renders
  const slots = useMemo(() => {
    return {
      icon: {
        UNSAFE_className: actionButtonClassList.declare('icon'),
        ...alternateSlots?.icon,
      },
      text: {
        color: 'inherit',
        overflow: 'unset',
        trim: false,
        UNSAFE_className: actionButtonClassList.declare('text'),
        ...alternateSlots?.text,
      },
    } as const;
  }, [alternateSlots]);

  return (
    <SlotProvider slots={slots}>
      {isReactText(children) ? <Text>{children}</Text> : children}
    </SlotProvider>
  );
};
