import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  Ref,
} from 'react';

import { useToggleButton } from '@react-aria/button';
import { useHover } from '@react-aria/interactions';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import { useToggleState } from '@react-stately/toggle';

import { useProviderProps } from '@voussoir/core';
import { useSlotProps } from '@voussoir/slots';
import { FocusRing } from '@voussoir/style';
import { filterDOMProps } from '@voussoir/utils';

import { useActionButtonStyles } from './useActionButtonStyles';
import { ToggleButtonProps } from './types';
import { useActionButtonChildren } from './ActionButton';

/**
 * Toggle buttons allow users to toggle a selection on or off, for example
 * switching between two states or modes.
 */
export const ToggleButton: ForwardRefExoticComponent<
  ToggleButtonProps & { ref?: Ref<HTMLButtonElement> }
> = forwardRef(function ToggleButton(
  props: ToggleButtonProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>
) {
  const { isDisabled, ...otherProps } = props;
  props = useProviderProps(props);
  props = useSlotProps(props, 'button');

  const children = useActionButtonChildren(props);
  const domRef = useObjectRef(forwardedRef);
  const state = useToggleState(props);
  const { buttonProps, isPressed } = useToggleButton(props, state, domRef);
  const { hoverProps, isHovered } = useHover({ isDisabled });
  const styleProps = useActionButtonStyles(props, {
    isHovered,
    isPressed,
    isSelected: state.isSelected,
  });

  return (
    <FocusRing autoFocus={props.autoFocus}>
      <button
        ref={domRef}
        {...styleProps}
        {...mergeProps(buttonProps, hoverProps)}
        {...filterDOMProps(otherProps)}
      >
        {children}
      </button>
    </FocusRing>
  );
});
