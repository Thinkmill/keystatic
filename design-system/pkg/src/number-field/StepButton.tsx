import { useButton } from '@react-aria/button';
import { useHover } from '@react-aria/interactions';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import { AriaButtonProps } from '@react-types/button';
import { ForwardedRef, forwardRef } from 'react';

import { useProvider, useProviderProps } from '@keystar/ui/core';
import { plusIcon } from '@keystar/ui/icon/icons/plusIcon';
import { minusIcon } from '@keystar/ui/icon/icons/minusIcon';
import { chevronDownIcon } from '@keystar/ui/icon/icons/chevronDownIcon';
import { chevronUpIcon } from '@keystar/ui/icon/icons/chevronUpIcon';
import { Icon } from '@keystar/ui/icon';
import {
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  transition,
} from '@keystar/ui/style';

interface StepButtonProps extends AriaButtonProps {
  direction: 'up' | 'down';
}

/** @private "step" buttons for incrementing and decrementing. */
export const StepButton = forwardRef(function StepButton(
  props: StepButtonProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  props = useProviderProps(props);
  let { scale } = useProvider();
  let { direction } = props;
  let domRef = useObjectRef(forwardedRef);
  /**
   * Must use div for now because Safari pointer event bugs on disabled form elements.
   * Link https://bugs.webkit.org/show_bug.cgi?id=219188.
   */
  let { buttonProps, isPressed } = useButton(
    { ...props, elementType: 'div' },
    domRef
  );
  let { hoverProps, isHovered } = useHover(props);

  let incrementIcon = scale === 'large' ? plusIcon : chevronUpIcon;
  let decrementIcon = scale === 'large' ? minusIcon : chevronDownIcon;

  return (
    <div
      {...toDataAttributes({
        direction,
        hovered: isHovered || undefined,
        pressed: isPressed || undefined,
        scale,
      })}
      {...mergeProps(hoverProps, buttonProps)}
      ref={domRef}
      className={classNames(
        css({
          alignItems: 'center',
          color: tokenSchema.color.alias.foregroundIdle,
          cursor: 'default',
          display: 'flex',
          justifyContent: 'center',
          transition: transition('border-color'),

          svg: {
            position: 'absolute', // stop SVG from taking space; affecting layout.
          },

          // states
          '&[data-hovered]': {
            backgroundColor: tokenSchema.color.alias.backgroundHovered,
            color: tokenSchema.color.alias.foregroundHovered,
          },
          '&[data-pressed]': {
            backgroundColor: tokenSchema.color.alias.backgroundPressed,
          },
          '&[aria-disabled=true]': {
            backgroundColor: tokenSchema.color.background.surfaceSecondary,
            color: tokenSchema.color.alias.foregroundDisabled,
          },

          '&[data-direction=up]': {
            gridArea: 'increment',
          },
          '&[data-direction=down]': {
            gridArea: 'decrement',
          },

          // fine pointers
          '&:not([data-scale=large])': {
            '&[data-direction=up]': {
              borderStartStartRadius: tokenSchema.size.radius.small,
              borderStartEndRadius: tokenSchema.size.radius.small,
            },
            '&[data-direction=down]': {
              borderEndStartRadius: tokenSchema.size.radius.small,
              borderEndEndRadius: tokenSchema.size.radius.small,
            },

            svg: {
              width: tokenSchema.size.icon.small,
            },
          },

          // coarse pointers
          '&[data-scale=large]': {
            '&[data-direction=up]': {
              borderStartEndRadius: tokenSchema.size.radius.regular,
              borderEndEndRadius: tokenSchema.size.radius.regular,
            },
            '&[data-direction=down]': {
              borderEndStartRadius: tokenSchema.size.radius.regular,
              borderStartStartRadius: tokenSchema.size.radius.regular,
            },

            'input:enabled ~ &': {
              border: `${tokenSchema.size.border.regular} solid ${tokenSchema.color.alias.borderIdle}`,
            },
            'input:focus ~ &': {
              borderColor: tokenSchema.color.alias.borderFocused,
            },
          },
        })
      )}
    >
      {direction === 'up' && <Icon src={incrementIcon} />}
      {direction === 'down' && <Icon src={decrementIcon} />}
    </div>
  );
});
