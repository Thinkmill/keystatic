import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from 'react-aria-components/Button';

import { useProvider } from '@keystar/ui/core';
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
export function StepButton(props: StepButtonProps) {
  let { scale } = useProvider();
  let { direction, ...otherProps } = props;

  let incrementIcon = scale === 'large' ? plusIcon : chevronUpIcon;
  let decrementIcon = scale === 'large' ? minusIcon : chevronDownIcon;

  return (
    <AriaButton
      {...otherProps}
      slot={direction === 'up' ? 'increment' : 'decrement'}
      {...toDataAttributes({
        direction,
        scale,
      })}
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
          '&[data-disabled]': {
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
    </AriaButton>
  );
}
