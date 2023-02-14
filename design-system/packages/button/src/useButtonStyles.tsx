import {
  ClassList,
  classNames,
  css,
  tokenSchema,
  transition,
  useStyleProps,
} from '@voussoir/style';
import { toDataAttributes } from '@voussoir/utils';

import { ButtonProps } from './types';

type ButtonState = {
  isHovered: boolean;
  isPressed: boolean;
  isSelected?: boolean;
};

export const buttonClassList = new ClassList('Button');

export function useButtonStyles(props: ButtonProps, state: ButtonState) {
  const {
    prominence = 'default',
    tone = prominence === 'high' ? 'accent' : 'neutral',
  } = props;
  const { isHovered, isPressed } = state;
  const styleProps = useStyleProps(props);

  return {
    ...toDataAttributes({
      hovered: isHovered || undefined,
      pressed: isPressed || undefined,
      prominence: prominence === 'default' ? undefined : prominence,
      tone: tone === 'neutral' ? undefined : tone,
    }),
    style: styleProps.style,
    className: classNames(
      buttonClassList.root(),
      styleProps.className,
      css({
        alignItems: 'center',
        borderRadius: tokenSchema.size.radius.regular,
        cursor: 'pointer',
        display: 'inline-flex',
        flexShrink: 0,
        fontSize: tokenSchema.fontsize.text.regular.size,
        fontWeight: tokenSchema.typography.fontWeight.semibold,
        height: tokenSchema.size.element.regular,
        justifyContent: 'center',
        minWidth: tokenSchema.size.element.regular,
        outline: 0,
        gap: tokenSchema.size.space.small,
        paddingInline: tokenSchema.size.space.large,
        position: 'relative',
        transitionDuration: '130ms',
        transitionProperty: 'background, border-color, box-shadow, color, ',
        transitionTimingFunction: 'ease-out',
        userSelect: 'none',

        '&:disabled, &[aria-disabled]': {
          cursor: 'default',
        },

        // contents
        '&[data-contents=icon]': {
          paddingInline: tokenSchema.size.space.regular,
        },
        [buttonClassList.childSelector('text')]: {
          fontSize: 'inherit',
          fontWeight: 'inherit',
        },

        // lighting
        // '&:not(:disabled, [aria-disabled], [data-prominence=low])::before': {
        //   background: `linear-gradient(rgba(255,255,255, 0.12), transparent 4%, transparent 96%, rgba(0,0,0, 0.12))`,
        //   backgroundBlendMode: 'hard-light',
        //   borderRadius: 'inherit',
        //   content: '""',
        //   inset: 0,
        //   pointerEvents: 'none',
        //   position: 'absolute' as const,
        // },

        // focus ring
        '&::after': {
          borderRadius: `calc(${tokenSchema.size.radius.regular} + ${tokenSchema.size.alias.focusRingGap})`,
          content: '""',
          inset: 0,
          margin: `calc(-1 * ${tokenSchema.size.alias.focusRingGap})`,
          pointerEvents: 'none',
          position: 'absolute' as const,
          transition: transition(['box-shadow', 'margin'], {
            easing: 'easeOut',
          }),
        },
        '&[data-focus=visible]::after': {
          boxShadow: `0 0 0 ${tokenSchema.size.alias.focusRing} ${tokenSchema.color.alias.focusRing}`,
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
          '&:disabled, &[aria-disabled]': {
            backgroundColor: tokenSchema.color.alias.backgroundHovered,
            color: tokenSchema.color.alias.foregroundDisabled,
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
            backgroundColor: tokenSchema.color.scale.slate12,
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

          '&:disabled, &[aria-disabled]': {
            backgroundColor: tokenSchema.color.background.surfaceTertiary,
            color: tokenSchema.color.alias.foregroundDisabled,
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

          '&:disabled, &[aria-disabled]': {
            color: tokenSchema.color.alias.foregroundDisabled,
          },
        },
      })
    ),
  };
}
