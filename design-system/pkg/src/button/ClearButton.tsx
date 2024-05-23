import { useButton } from '@react-aria/button';
import { useHover } from '@react-aria/interactions';
import { mergeProps, useObjectRef } from '@react-aria/utils';
import { ForwardedRef, forwardRef } from 'react';

import { xIcon } from '@keystar/ui/icon/icons/xIcon';
import { Icon } from '@keystar/ui/icon';
import {
  classNames,
  css,
  FocusRing,
  toDataAttributes,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';
import { PropsWithElementType } from '@keystar/ui/utils/ts';

import { ButtonProps } from './types';

type ClearButtonProps = Omit<
  ButtonProps,
  'children' | 'prominence' | 'tone'
> & {
  excludeFromTabOrder?: boolean;
  preventFocus?: boolean;
  static?: 'dark' | 'light';
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
  let styleProps = useClearButtonStyles(otherProps, { isHovered, isPressed });

  // For cases like the clear button in a search field, remove the tabIndex so
  // iOS 14 with VoiceOver doesn't focus the button and hide the keyboard when
  // moving the cursor over the clear button.
  if (preventFocus) {
    const { tabIndex, ..._buttonProps } = buttonProps;
    buttonProps = _buttonProps;
  }

  let ElementType = elementType;
  return (
    <FocusRing autoFocus={autoFocus}>
      <ElementType
        {...styleProps}
        {...mergeProps(buttonProps, hoverProps)}
        ref={domRef}
      >
        <Icon src={xIcon} />
      </ElementType>
    </FocusRing>
  );
});

function useClearButtonStyles(
  props: ClearButtonProps,
  state: { isHovered: boolean; isPressed: boolean }
) {
  let { isPressed, isHovered } = state;
  let styleProps = useStyleProps(props);

  const clearButtonStyles = css({
    alignItems: 'center',
    borderRadius: '100%',
    color: tokenSchema.color.foreground.neutralSecondary,
    display: 'flex',
    height: tokenSchema.size.element.regular,
    justifyContent: 'center',
    outline: 0,
    position: 'relative',
    transition: transition(['box-shadow', 'margin'], { easing: 'easeOut' }),
    width: tokenSchema.size.element.regular,

    '--focus-ring-color': tokenSchema.color.alias.focusRing,
    '&[data-static]': {
      '--focus-ring-color': 'currentColor',
    },
    '&::after': {
      borderRadius: `inherit`,
      content: '""',
      inset: 0,

      pointerEvents: 'none',
      position: 'absolute',
      transition: transition(['box-shadow', 'margin'], {
        easing: 'easeOut',
      }),
    },
    '&[data-focus=visible]::after': {
      boxShadow: `0 0 0 ${tokenSchema.size.alias.focusRing} var(--focus-ring-color)`,
      margin: `calc(-1 * ${tokenSchema.size.alias.focusRingGap})`,
    },

    '&[data-interaction=hover]': {
      color: tokenSchema.color.foreground.neutral,
    },
    '&[data-interaction=press]': {
      color: tokenSchema.color.foreground.neutralEmphasis,
    },
    '&:disabled, &[aria-disabled]': {
      color: tokenSchema.color.alias.foregroundDisabled,
    },

    // static
    '&[data-static=light]': {
      color: '#fff',

      '&[data-interaction=hover], &[data-focus="visible"]': {
        backgroundColor: '#ffffff1a',
      },
      '&[data-interaction=press]': {
        backgroundColor: '#ffffff26',
      },
      '&:disabled, &[aria-disabled]': {
        backgroundColor: '#ffffff1a',
        color: '#ffffff8c',
      },
    },
    '&[data-static=dark]': {
      color: '#000',

      '&[data-interaction=hover], &[data-focus="visible"]': {
        backgroundColor: '#0000001a',
      },
      '&[data-interaction=press]': {
        backgroundColor: '#00000026',
      },
      '&:disabled, &[aria-disabled]': {
        backgroundColor: '#0000001a',
        color: '#0000008c',
      },
    },
  });
  return {
    ...styleProps,
    ...toDataAttributes({
      static: props.static,
      interaction: isPressed ? 'press' : isHovered ? 'hover' : undefined,
    }),
    className: classNames(clearButtonStyles, styleProps.className),
  };
}
