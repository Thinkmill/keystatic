import { useButton } from '@react-aria/button';
import { useHover } from '@react-aria/interactions';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import { ForwardedRef, forwardRef } from 'react';

import { xIcon } from '@voussoir/icon/icons/xIcon';
import { Icon } from '@voussoir/icon';
import { FocusRing, useStyleProps } from '@voussoir/style';
import { toDataAttributes } from '@voussoir/utils';
import { PropsWithElementType } from '@voussoir/utils/ts';

import { ButtonProps } from './types';

type ClearButtonProps = Omit<
  ButtonProps,
  'children' | 'prominence' | 'tone'
> & {
  excludeFromTabOrder?: boolean;
  preventFocus?: boolean;
};

/**
 * A clear button is a button that is typically found on search fields and is
 * used to clear the current search query. This can be useful if the user has
 * entered a search query by mistake, or if they want to start over with a new
 * search.
 */
export const ClearButton = forwardRef(function ClearButton(
  props: PropsWithElementType<ClearButtonProps>,
  forwardedRef: ForwardedRef<HTMLButtonElement>
) {
  let {
    autoFocus,
    isDisabled,
    preventFocus,
    elementType = preventFocus ? 'div' : 'button',
    ...otherProps
  } = props;

  let domRef = useObjectRef(forwardedRef);
  let { buttonProps, isPressed } = useButton({ ...props, elementType }, domRef);
  let { hoverProps, isHovered } = useHover({ isDisabled });
  let styleProps = useStyleProps(otherProps);

  // For cases like the clear button in a search field, remove the tabIndex so
  // iOS 14 with VoiceOver doesn't focus the button and hide the keyboard when
  // moving the cursor over the clear button.
  if (preventFocus) {
    delete buttonProps.tabIndex;
  }

  let ElementType = elementType;
  return (
    <FocusRing autoFocus={autoFocus}>
      <ElementType
        {...styleProps}
        {...mergeProps(buttonProps, hoverProps)}
        {...toDataAttributes({
          interaction: isPressed ? 'press' : isHovered ? 'hover' : undefined,
        })}
        ref={domRef}
      >
        <Icon src={xIcon} />
      </ElementType>
    </FocusRing>
  );
});
