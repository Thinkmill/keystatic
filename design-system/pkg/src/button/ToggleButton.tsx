import {
  ToggleButton as AriaToggleButton,
  type ToggleButtonProps as AriaToggleButtonProps,
} from 'react-aria-components/ToggleButton';
import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  Ref,
} from 'react';

import { useProviderProps } from '@keystar/ui/core';
import { useSlotProps } from '@keystar/ui/slots';
import { filterStyleProps } from '@keystar/ui/style';

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
  props = useProviderProps(props);
  props = useSlotProps(props, 'button');

  const children = useActionButtonChildren(props);
  const styleProps = useActionButtonStyles(props);

  return (
    <AriaToggleButton
      {...(filterStyleProps(props, [
        'prominence',
        'static',
      ]) as AriaToggleButtonProps)}
      {...styleProps}
      ref={forwardedRef}
    >
      {children}
    </AriaToggleButton>
  );
});
