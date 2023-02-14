import { useButton } from '@react-aria/button';
import { useHover } from '@react-aria/interactions';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import { ForwardedRef, forwardRef, useMemo } from 'react';

import { useSlotProps } from '@voussoir/slots';
import { FocusRing, classNames, css } from '@voussoir/style';
import { PropsWithElementType } from '@voussoir/utils/ts';

import { FieldButtonProps } from './types';
import { useActionButtonStyles } from './useActionButtonStyles';
import { useActionButtonChildren } from './ActionButton';

function FieldButton(
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
          styleProps.className,
          css({
            justifyContent: 'space-between',
            textAlign: 'start',
          })
        )}
        style={{ ...styleProps.style, boxShadow: 'none' }}
      >
        {children}
      </ElementType>
    </FocusRing>
  );
}

/** @private Internal component for composing complex field interactions. */
const _FieldButton = forwardRef(FieldButton);
export { _FieldButton as FieldButton };

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
  let slots = useMemo(() => ({ text: { flex: true, truncate: true } }), []);
  let children = useActionButtonChildren(props, slots);

  return { children, styleProps };
}
