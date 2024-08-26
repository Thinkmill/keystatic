import { useButton } from '@react-aria/button';
import { useHover } from '@react-aria/interactions';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import {
  ForwardedRef,
  forwardRef,
  ForwardRefExoticComponent,
  Ref,
  useMemo,
} from 'react';

import { useSlotProps } from '@keystar/ui/slots';
import { FocusRing, classNames, css } from '@keystar/ui/style';
import { PropsWithElementType } from '@keystar/ui/utils/ts';

import { FieldButtonProps } from './types';
import { useActionButtonStyles } from './useActionButtonStyles';
import { useActionButtonChildren } from './ActionButton';

/** @private Internal component for composing complex field interactions. */
export const FieldButton: ForwardRefExoticComponent<
  FieldButtonProps & { ref?: Ref<HTMLButtonElement> }
> = forwardRef(function FieldButton(
  props: PropsWithElementType<FieldButtonProps>,
  forwardedRef: ForwardedRef<HTMLButtonElement>
) {
  props = useSlotProps(props, 'button');
  let {
    elementType: ElementType = 'button',
    isDisabled,
    autoFocus,
    isActive,
  } = props;
  let domRef = useObjectRef(forwardedRef);
  let { buttonProps, isPressed } = useButton(props, domRef);
  let { hoverProps, isHovered } = useHover({ isDisabled });
  let { children, styleProps } = useFieldButton(props, {
    isHovered,
    isPressed: isActive ?? isPressed,
  });

  return (
    <FocusRing autoFocus={autoFocus}>
      <ElementType
        {...styleProps}
        {...mergeProps(buttonProps, hoverProps)}
        ref={domRef}
        className={classNames(
          css({
            justifyContent: 'space-between',
            textAlign: 'start',
          }),
          styleProps.className
        )}
        style={{ ...styleProps.style, boxShadow: 'none' }}
      >
        {children}
      </ElementType>
    </FocusRing>
  );
});

// Utils
// -----------------------------------------------------------------------------

type FieldButtonState = {
  isHovered: boolean;
  isPressed: boolean;
};

export function useFieldButton(
  props: FieldButtonProps,
  state: FieldButtonState
) {
  let { isHovered, isPressed } = state;
  const styleProps = useActionButtonStyles(props, { isHovered, isPressed });
  let slots = useMemo(() => ({ text: { flex: true } }), []);
  let children = useActionButtonChildren(props, slots);

  return { children, styleProps };
}
