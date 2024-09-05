import {
  ClassList,
  classNames,
  css,
  toDataAttributes,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';

import { ButtonProps } from './types';

type ButtonState = {
  isHovered: boolean;
  isPressed: boolean;
  isPending?: boolean;
  isSelected?: boolean;
};

export const buttonClassList = new ClassList('Button', ['icon', 'text']);

export function useButtonStyles(props: ButtonProps, state: ButtonState) {
  const {
    prominence = 'default',
    tone = prominence === 'high' ? 'accent' : 'neutral',
  } = props;
  const { isHovered, isPending, isPressed } = state;
  const styleProps = useStyleProps(props);

  return {
    ...toDataAttributes({
      hovered: isHovered || undefined,
      pending: isPending || undefined,
      pressed: isPressed || undefined,
      prominence: prominence === 'default' ? undefined : prominence,
      tone: tone,
      static: props.static,
    }),
    style: styleProps.style,
    className: classNames(
      buttonClassList.element('root'),
      css({
        alignItems: 'center',
        borderRadius: tokenSchema.size.radius.full,
        cursor: 'default',
        display: 'inline-flex',
        flexShrink: 0,
        fontSize: tokenSchema.typography.text.regular.size,
        fontWeight: tokenSchema.typography.fontWeight.medium,
        height: tokenSchema.size.element.regular,
        justifyContent: 'center',
        minWidth: tokenSchema.size.element.regular,
        outline: 0,
        paddingInline: tokenSchema.size.space.medium,
        position: 'relative',
        transitionDuration: '130ms',
        transitionProperty: 'background, border-color, box-shadow, color, ',
        transitionTimingFunction: 'ease-out',
        userSelect: 'none',

        // indicate when external link? e.g. `&[href^=http]`
        'a&': {
          cursor: 'pointer',
        },

        '&:disabled, &[aria-disabled]': {
          cursor: 'default',
        },

        // inherit text styles from parent
        [buttonClassList.selector('text', 'descendant')]: {
          fontSize: 'inherit',
          fontWeight: 'inherit',
          marginInline: tokenSchema.size.space.regular,
        },
        [`&[data-pending] ${buttonClassList.selector('text')}`]: {
          opacity: 0,
        },

        // special size for button icons. otherwise they appear too "thin"
        // beside the bold text
        [buttonClassList.selector('icon', 'descendant')]: {
          height: tokenSchema.size.scale[225],
          width: tokenSchema.size.scale[225],
        },
        [`&[data-pending] ${buttonClassList.selector('icon')}`]: {
          opacity: 0,
        },

        // focus ring
        '--focus-ring-color': tokenSchema.color.alias.focusRing,
        '&[data-static=light]': {
          '--focus-ring-color': '#fff',
        },
        '&[data-static=dark]': {
          '--focus-ring-color': '#000',
        },
        '&::after': {
          borderRadius: tokenSchema.size.radius.full,
          content: '""',
          inset: 0,
          pointerEvents: 'none',
          position: 'absolute' as const,
          transition: transition(['box-shadow', 'margin'], {
            easing: 'easeOut',
          }),
        },
        '&[data-focus=visible]::after': {
          boxShadow: `0 0 0 ${tokenSchema.size.alias.focusRing} var(--focus-ring-color)`,
          margin: `calc(-1 * ${tokenSchema.size.alias.focusRingGap})`,
        },

        // PROMINENCE: default
        '&:not([data-prominence])': {
          backgroundColor: tokenSchema.color.scale.slate4,
          color: tokenSchema.color.foreground.neutralEmphasis,

          '&[data-hovered], &[data-focus="visible"]': {
            backgroundColor: tokenSchema.color.scale.slate5,
          },
          '&[data-pressed]': {
            backgroundColor: tokenSchema.color.scale.slate6,
          },

          // tones
          '&[data-tone=accent]': {
            color: tokenSchema.color.foreground.accent,
          },
          '&[data-tone=critical]': {
            color: tokenSchema.color.foreground.critical,
          },

          // states
          '&:disabled, &[aria-disabled=true]': {
            backgroundColor: tokenSchema.color.alias.backgroundDisabled,
            color: tokenSchema.color.alias.foregroundDisabled,
          },

          // static
          '&[data-static=light]': {
            backgroundColor: '#ffffff12',
            color: '#fff',

            '&[data-hovered], &[data-focus="visible"]': {
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
            backgroundColor: '#00000012',
            color: '#000',

            '&[data-hovered], &[data-focus="visible"]': {
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
        },

        // PROMINENCE: high
        '&[data-prominence=high]': {
          backgroundColor: tokenSchema.color.scale.slate10,
          color: tokenSchema.color.foreground.inverse,

          '&[data-hovered], &[data-focus="visible"]': {
            backgroundColor: tokenSchema.color.scale.slate11,
          },
          '&[data-pressed]': {
            backgroundColor: tokenSchema.color.scale.slate11,
          },

          // NOTE: "neutral" tone invalid for "high" prominence
          '&[data-tone=accent]': {
            backgroundColor: tokenSchema.color.scale.indigo9,
            color: tokenSchema.color.foreground.onEmphasis,

            '&[data-hovered], &[data-focus="visible"]': {
              backgroundColor: tokenSchema.color.scale.indigo10,
            },
            '&[data-pressed]': {
              backgroundColor: tokenSchema.color.scale.indigo11,
            },
          },
          '&[data-tone=critical]': {
            backgroundColor: tokenSchema.color.scale.red9,
            color: tokenSchema.color.foreground.onEmphasis,

            '&[data-hovered], &[data-focus="visible"]': {
              backgroundColor: tokenSchema.color.scale.red10,
            },
            '&[data-pressed]': {
              backgroundColor: tokenSchema.color.scale.red11,
            },
          },

          // tone selector to increase specificity
          '&[data-tone]:disabled, &[data-tone][aria-disabled=true]': {
            backgroundColor: tokenSchema.color.alias.backgroundDisabled,
            color: tokenSchema.color.alias.foregroundDisabled,
          },

          // static
          '&[data-static=light]': {
            backgroundColor: '#ffffffe6',
            color: '#000',

            '&[data-hovered], &[data-focus="visible"]': {
              backgroundColor: '#fff',
            },
            '&[data-pressed]': {
              backgroundColor: '#fff',
            },
            '&:disabled, &[aria-disabled]': {
              backgroundColor: '#ffffff1a',
              color: '#ffffff8c',
            },
          },
          '&[data-static=dark]': {
            backgroundColor: '#000000e6',
            color: '#fff',

            '&[data-hovered], &[data-focus="visible"]': {
              backgroundColor: '#000',
            },
            '&[data-pressed]': {
              backgroundColor: '#000',
            },
            '&:disabled, &[aria-disabled]': {
              backgroundColor: '#0000001a',
              color: '#0000008c',
            },
          },
        },

        // PROMINENCE: low
        '&[data-prominence=low]': {
          color: tokenSchema.color.foreground.neutral,

          // neutral interactions
          '&[data-hovered], &[data-focus="visible"]': {
            backgroundColor: tokenSchema.color.alias.backgroundHovered,
            color: tokenSchema.color.foreground.neutralEmphasis,
          },
          '&[data-pressed]': {
            backgroundColor: tokenSchema.color.alias.backgroundPressed,
          },

          // tones
          '&[data-tone=accent]': {
            color: tokenSchema.color.foreground.accent,
            '&[data-hovered], &[data-focus="visible"]': {
              backgroundColor: tokenSchema.color.scale.indigo3,
            },
            '&[data-pressed]': {
              backgroundColor: tokenSchema.color.scale.indigo4,
            },
          },
          '&[data-tone=critical]': {
            color: tokenSchema.color.foreground.critical,
            '&[data-hovered], &[data-focus="visible"]': {
              backgroundColor: tokenSchema.color.scale.red3,
            },
            '&[data-pressed]': {
              backgroundColor: tokenSchema.color.scale.red4,
            },
          },

          '&:disabled, &[aria-disabled=true]': {
            backgroundColor: tokenSchema.color.alias.backgroundDisabled,
            color: tokenSchema.color.alias.foregroundDisabled,
          },

          // static
          '&[data-static=light]': {
            color: '#fff',

            '&[data-hovered], &[data-focus="visible"]': {
              backgroundColor: '#ffffff1a',
            },
            '&[data-pressed]': {
              backgroundColor: '#ffffff26',
            },
            '&:disabled, &[aria-disabled]': {
              color: '#ffffff8c',
            },
          },
          '&[data-static=dark]': {
            color: '#000',

            '&[data-hovered], &[data-focus="visible"]': {
              backgroundColor: '#0000001a',
            },
            '&[data-pressed]': {
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
