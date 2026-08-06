import {
  Button as AriaButton,
  type ButtonProps as AriaButtonProps,
} from 'react-aria-components/Button';
import { ForwardedRef, forwardRef } from 'react';

import { xIcon } from '@keystar/ui/icon/icons/xIcon';
import { Icon } from '@keystar/ui/icon';
import {
  classNames,
  css,
  filterStyleProps,
  toDataAttributes,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';

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
  props: ClearButtonProps,
  forwardedRef: ForwardedRef<HTMLButtonElement>
) {
  let { autoFocus, excludeFromTabOrder, preventFocus, ...otherProps } = props;

  let styleProps = useClearButtonStyles(otherProps);
  return (
    <AriaButton
      {...(filterStyleProps(props, [
        'preventFocus',
        'static',
      ]) as AriaButtonProps)}
      {...styleProps}
      autoFocus={autoFocus}
      excludeFromTabOrder={preventFocus || excludeFromTabOrder}
      onMouseDown={preventFocus ? event => event.preventDefault() : undefined}
      ref={forwardedRef}
    >
      <Icon src={xIcon} />
    </AriaButton>
  );
});

function useClearButtonStyles(props: ClearButtonProps) {
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
    '&[data-focus-visible]::after': {
      boxShadow: `0 0 0 ${tokenSchema.size.alias.focusRing} var(--focus-ring-color)`,
      margin: `calc(-1 * ${tokenSchema.size.alias.focusRingGap})`,
    },

    '&[data-hovered]': {
      color: tokenSchema.color.foreground.neutral,
    },
    '&[data-pressed]': {
      color: tokenSchema.color.foreground.neutralEmphasis,
    },
    '&:disabled, &[aria-disabled]': {
      color: tokenSchema.color.alias.foregroundDisabled,
    },

    // static
    '&[data-static=light]': {
      color: '#fff',

      '&[data-hovered], &[data-focus-visible]': {
        backgroundColor: '#ffffff1a',
      },
      '&[data-pressed]': {
        backgroundColor: '#ffffff26',
      },
      '&:disabled, &[aria-disabled]': {
        backgroundColor: '#ffffff1a',
        color: '#ffffff8c',
      },
    },
    '&[data-static=dark]': {
      color: '#000',

      '&[data-hovered], &[data-focus-visible]': {
        backgroundColor: '#0000001a',
      },
      '&[data-pressed]': {
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
    }),
    className: classNames(clearButtonStyles, styleProps.className),
  };
}
