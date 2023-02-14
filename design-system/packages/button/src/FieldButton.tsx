import { useButton } from '@react-aria/button';
import { useHover } from '@react-aria/interactions';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import { ForwardedRef, forwardRef, useMemo } from 'react';

import { SlotProvider, useSlotProps } from '@voussoir/slots';
import { BaseStyleProps, FocusRing, classNames, css } from '@voussoir/style';
import { DOMProps } from '@voussoir/types';

import { ActionButtonProps } from './types';
import { useActionButtonStyles } from './useActionButtonStyles';

interface FieldButtonProps extends ActionButtonProps, DOMProps, BaseStyleProps {
  isActive?: boolean;
}

/** @private Internal component for fields that don't accept text input. */
export const FieldButton = forwardRef(function FieldButton(
  props: FieldButtonProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>
) {
  props = useSlotProps(props, 'button');
  let { isDisabled, children, autoFocus, isActive, ...otherProps } = props;
  let domRef = useObjectRef(forwardedRef);
  let { buttonProps, isPressed } = useButton(props, domRef);
  let { hoverProps, isHovered } = useHover({ isDisabled });
  const styleProps = useActionButtonStyles(otherProps, {
    isHovered,
    isPressed: isActive ?? isPressed,
  });
  let slots = useMemo(() => ({ text: { flex: true, truncate: true } }), []);

  return (
    <FocusRing autoFocus={autoFocus}>
      <button
        {...styleProps}
        {...mergeProps(buttonProps, hoverProps)}
        ref={domRef}
        className={classNames(
          styleProps.className,
          css({
            cursor: 'default',
            justifyContent: 'space-between',
            textAlign: 'start',
          })
        )}
      >
        <SlotProvider slots={slots}>{children}</SlotProvider>
      </button>
    </FocusRing>
  );
});
