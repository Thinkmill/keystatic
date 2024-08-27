import {
  ClassList,
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';

import { ActionButtonProps } from './types';

type ButtonState = {
  isHovered: boolean;
  isPressed: boolean;
  isSelected?: boolean;
};

export const actionButtonClassList = new ClassList('ActionButton', [
  'icon',
  'text',
]);

export function useActionButtonStyles(
  props: ActionButtonProps,
  state: ButtonState
) {
  const { prominence = 'default' } = props;
  const { isHovered, isPressed } = state;
  const isSelected =
    ('isSelected' in props && props.isSelected) || state.isSelected;
  const styleProps = useStyleProps(props);

  return {
    ...toDataAttributes({
      interaction: isPressed ? 'press' : isHovered ? 'hover' : undefined,
      prominence: prominence === 'default' ? undefined : prominence,
      selected: isSelected || undefined,
      static: props.static,
    }),
    style: styleProps.style,
    className: classNames(
      actionButtonClassList.element('root'),
      css({
        alignItems: 'center',
        borderColor: 'transparent',
        borderRadius: tokenSchema.size.radius.regular,
        borderStyle: 'solid',
        borderWidth: tokenSchema.size.border.regular,
        cursor: 'default',
        display: 'inline-flex',
        flexShrink: 0,
        fontWeight: tokenSchema.typography.fontWeight.regular,
        height: tokenSchema.size.element.regular,
        justifyContent: 'center',
        minWidth: tokenSchema.size.element.regular,
        outline: 0,
        paddingInline: tokenSchema.size.space.regular,
        position: 'relative',
        transitionDuration: '130ms',
        transitionProperty: 'background, border-color, box-shadow, color',
        transitionTimingFunction: 'ease-out',
        userSelect: 'none',

        // indicate when external link? e.g. `&[href^=http]`
        'a&': {
          cursor: 'pointer',
        },

        // CONTENTS
        [actionButtonClassList.selector('text', 'descendant')]: {
          fontWeight: 'inherit',
          marginInline: tokenSchema.size.space.small,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },

        // FOCUS RING
        '--focus-ring-color': tokenSchema.color.alias.focusRing,
        '&[data-static]': {
          '--focus-ring-color': 'currentColor',
        },
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
          boxShadow: `0 0 0 ${tokenSchema.size.alias.focusRing} var(--focus-ring-color)`,
        },

        // PROMINENCE

        // prominence: default
        '&:not([data-prominence])': {
          backgroundColor: tokenSchema.color.alias.backgroundIdle,
          borderColor: tokenSchema.color.alias.borderIdle,
          color: tokenSchema.color.alias.foregroundIdle,

          // interactions
          '&[data-interaction=hover]': {
            backgroundColor: tokenSchema.color.alias.backgroundHovered,
            borderColor: tokenSchema.color.alias.borderHovered,
            // boxShadow: `${tokenSchema.size.shadow.small} ${tokenSchema.color.shadow.regular}`,
            color: tokenSchema.color.alias.foregroundHovered,
          },
          '&[data-interaction=press]': {
            backgroundColor: tokenSchema.color.alias.backgroundPressed,
            borderColor: tokenSchema.color.alias.borderPressed,
            color: tokenSchema.color.alias.foregroundPressed,
          },

          // states
          '&[data-selected]': {
            backgroundColor: tokenSchema.color.foreground.neutralSecondary,
            borderColor: tokenSchema.color.foreground.neutralSecondary,
            color: tokenSchema.color.foreground.inverse,

            '&[data-interaction=hover]': {
              backgroundColor: tokenSchema.color.foreground.neutral,
              borderColor: tokenSchema.color.foreground.neutral,
            },
            '&[data-interaction=press]': {
              backgroundColor: tokenSchema.color.foreground.neutralEmphasis,
              borderColor: tokenSchema.color.foreground.neutralEmphasis,
            },
          },
          '&:disabled, &[aria-disabled=true], &[data-disabled=true]': {
            backgroundColor: tokenSchema.color.alias.backgroundDisabled,
            borderColor: 'transparent',
            color: tokenSchema.color.alias.foregroundDisabled,
          },

          // static
          '&[data-static]': {
            backgroundColor: 'transparent',
          },
          '&[data-static=light]': {
            borderColor: '#fff6',
            color: '#fff',

            '&[data-interaction=hover], &[data-focus="visible"]': {
              backgroundColor: '#ffffff1a',
              borderColor: '#ffffff8c',
            },
            '&[data-interaction=press]': {
              backgroundColor: '#ffffff26',
              borderColor: '#ffffffb3',
            },
            '&:disabled, &[aria-disabled]': {
              borderColor: '#ffffff40',
              color: '#ffffff8c',
            },
          },
          '&[data-static=dark]': {
            borderColor: '#0006',
            color: '#000',

            '&[data-interaction=hover], &[data-focus="visible"]': {
              backgroundColor: '#0000001a',
              borderColor: '#0000008c',
            },
            '&[data-interaction=press]': {
              backgroundColor: '#00000026',
              borderColor: '#000000b3',
            },
            '&:disabled, &[aria-disabled]': {
              borderColor: '#00000040',
              color: '#0000008c',
            },
          },
        },

        // prominence: low
        '&[data-prominence=low]': {
          color: tokenSchema.color.foreground.neutral,

          // interactions
          '&[data-interaction=hover]': {
            backgroundColor: tokenSchema.color.alias.backgroundHovered,
            color: tokenSchema.color.alias.foregroundHovered,
          },
          '&[data-interaction=press]': {
            backgroundColor: tokenSchema.color.alias.backgroundPressed,
            color: tokenSchema.color.alias.foregroundPressed,
          },

          // states
          '&[data-selected]': {
            backgroundColor: tokenSchema.color.foreground.neutralSecondary,
            borderColor: tokenSchema.color.foreground.neutralSecondary,
            color: tokenSchema.color.foreground.inverse,

            '&[data-interaction=hover]': {
              backgroundColor: tokenSchema.color.foreground.neutral,
              borderColor: tokenSchema.color.foreground.neutral,
            },
            '&[data-interaction=press]': {
              backgroundColor: tokenSchema.color.foreground.neutralEmphasis,
              borderColor: tokenSchema.color.foreground.neutralEmphasis,
            },
          },
          '&:disabled, &[aria-disabled=true], &[data-disabled=true]': {
            borderColor: 'transparent',
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
              color: '#0000008c',
            },
          },
        },
      }),
      styleProps.className
    ),
  };
}
