import {
  ClassList,
  classNames,
  css,
  tokenSchema,
  transition,
  useStyleProps,
} from '@voussoir/style';
import { toDataAttributes } from '@voussoir/utils';

import { ActionButtonProps } from './types';

type ButtonState = {
  isHovered: boolean;
  isPressed: boolean;
  isSelected?: boolean;
};

export const actionButtonClassList = new ClassList('ActionButton');

export function useActionButtonStyles(
  props: ActionButtonProps,
  state: ButtonState
) {
  const { prominence = 'default' } = props;
  const { isHovered, isPressed } = state;
  const styleProps = useStyleProps(props);

  let icon = actionButtonClassList.selector('icon');
  let text = actionButtonClassList.selector('text');

  return {
    ...toDataAttributes({
      interaction: isPressed ? 'press' : isHovered ? 'hover' : undefined,
      prominence: prominence === 'default' ? undefined : prominence,
      selected: ('isSelected' in props && props.isSelected) || undefined,
    }),
    style: styleProps.style,
    className: classNames(
      actionButtonClassList.root(),
      css({
        alignItems: 'center',
        borderColor: 'transparent',
        borderRadius: tokenSchema.size.radius.regular,
        borderStyle: 'solid',
        borderWidth: tokenSchema.size.border.regular,
        cursor: 'default',
        display: 'inline-flex',
        flexShrink: 0,
        fontWeight: tokenSchema.typography.fontWeight.medium,
        height: tokenSchema.size.element.regular,
        justifyContent: 'center',
        minWidth: tokenSchema.size.element.regular,
        outline: 0,
        gap: tokenSchema.size.space.small,
        paddingInline: tokenSchema.size.space.medium,
        position: 'relative',
        transitionDuration: '130ms',
        transitionProperty: 'background, border-color, box-shadow, color, ',
        transitionTimingFunction: 'ease-out',
        userSelect: 'none',

        // CONTENTS
        // NOTE: the `:has` selector isn't fully supported yet. since this is
        // cosmetic CSS we can avoid runtime checks in JS to improve perf
        [`&:has(${icon}):not(:has(${text}:not([hidden])))`]: {
          paddingInline: tokenSchema.size.space.regular,
        },
        [actionButtonClassList.childSelector('text')]: {
          fontWeight: 'inherit',
        },

        // FOCUS RING
        '&::after': {
          borderRadius: `inherit`,
          content: '""',
          inset: 0,
          margin: 0,
          pointerEvents: 'none',
          position: 'absolute' as const,
          transition: transition(['box-shadow', 'margin'], {
            easing: 'easeOut',
          }),
        },
        '&[data-focus=visible]::after': {
          boxShadow: `0 0 0 ${tokenSchema.size.alias.focusRing} ${tokenSchema.color.alias.focusRing}`,
        },

        // PROMINENCE

        // prominence: default
        '&:not([data-prominence])': {
          backgroundColor: tokenSchema.color.background.surface,
          borderColor: tokenSchema.color.alias.borderIdle,
          boxShadow: `${tokenSchema.size.shadow.small} ${tokenSchema.color.shadow.muted}`,
          color: tokenSchema.color.alias.foregroundIdle,

          // interactions
          '&[data-interaction=hover]': {
            backgroundColor: tokenSchema.color.alias.backgroundHovered,
            borderColor: tokenSchema.color.alias.borderHovered,
            boxShadow: `${tokenSchema.size.shadow.small} ${tokenSchema.color.shadow.regular}`,
            color: tokenSchema.color.alias.foregroundHovered,
          },
          '&[data-interaction=press]': {
            backgroundColor: tokenSchema.color.alias.backgroundPressed,
            borderColor: tokenSchema.color.alias.borderPressed,
            boxShadow: 'none',
            color: tokenSchema.color.alias.foregroundPressed,
          },

          // states
          '&[data-selected]': {
            backgroundColor: tokenSchema.color.alias.backgroundSelected,
            color: tokenSchema.color.foreground.neutralEmphasis,

            '&[data-interaction=hover]': {
              backgroundColor:
                tokenSchema.color.alias.backgroundSelectedHovered,
            },
          },
        },

        // prominence: low
        '&[data-prominence=low]': {
          color: tokenSchema.color.foreground.neutral,

          // interactions
          '&[data-interaction=hover]': {
            backgroundColor: tokenSchema.color.alias.backgroundHovered,
            color: tokenSchema.color.foreground.neutralEmphasis,
          },
          '&[data-interaction=press]': {
            backgroundColor: tokenSchema.color.alias.backgroundPressed,
          },

          // states
          '&[data-selected]': {
            backgroundColor: tokenSchema.color.alias.backgroundSelected,
            borderColor: tokenSchema.color.alias.borderIdle,
            color: tokenSchema.color.foreground.neutralEmphasis,

            '&[data-interaction=hover]': {
              backgroundColor:
                tokenSchema.color.alias.backgroundSelectedHovered,
              borderColor: tokenSchema.color.alias.borderHovered,
            },
          },
        },

        // STATES
        '&:disabled, &[aria-disabled=true], &[data-disabled=true]': {
          backgroundColor: tokenSchema.color.alias.backgroundDisabled,
          borderColor: 'transparent',
          boxShadow: 'none',
          color: tokenSchema.color.alias.foregroundDisabled,
        },
      }),
      styleProps.className
    ),
  };
}
