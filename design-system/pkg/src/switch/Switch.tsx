import { type AriaSwitchProps } from 'react-aria/useSwitch';
import {
  Switch as AriaSwitch,
  type SwitchProps as AriaSwitchComponentProps,
} from 'react-aria-components/Switch';

import {
  ForwardedRef,
  ForwardRefExoticComponent,
  forwardRef,
  useMemo,
} from 'react';

import { useProviderProps } from '@keystar/ui/core';
import { SlotProvider } from '@keystar/ui/slots';
import {
  BaseStyleProps,
  classNames,
  css,
  filterStyleProps,
  toDataAttributes,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { isReactText } from '@keystar/ui/utils';

export type SwitchProps = AriaSwitchProps &
  BaseStyleProps & {
    /**
     * The prominence of the switch element.
     * @default 'default'
     */
    prominence?: 'low' | 'default';
    /**
     * The size of the switch element.
     * @default 'regular'
     */
    size?: 'small' | 'regular';
  };

/**
 * Switches allow users to turn an individual option on or off.
 * They are usually used to activate or deactivate a specific setting.
 */
export const Switch: ForwardRefExoticComponent<SwitchProps> = forwardRef(
  function Switch(
    props: SwitchProps,
    forwardedRef: ForwardedRef<HTMLLabelElement>
  ) {
    props = useProviderProps(props);
    let { children } = props;
    let styleProps = useSwitchStyles(props);

    const slots = useMemo(
      () =>
        ({
          text: { color: 'inherit' },
          description: { color: 'neutralTertiary' },
        }) as const,
      []
    );

    return (
      <AriaSwitch
        {...(filterStyleProps(props, [
          'prominence',
          'size',
        ]) as AriaSwitchComponentProps)}
        {...styleProps.root}
        ref={forwardedRef}
      >
        <span {...styleProps.indicator} />
        {children && (
          <SlotProvider slots={slots}>
            <span {...styleProps.content}>
              {isReactText(children) ? <Text>{children}</Text> : children}
            </span>
          </SlotProvider>
        )}
      </AriaSwitch>
    );
  }
);

function useSwitchStyles(props: SwitchProps) {
  let { prominence, size } = props;
  let styleProps = useStyleProps(props);

  let labelClassName = css({
    alignItems: 'flex-start',
    display: 'inline-flex',
    gap: tokenSchema.size.space.regular,
    position: 'relative',
    userSelect: 'none',

    '--track-background-color': tokenSchema.color.background.accentEmphasis,
    '--track-height': tokenSchema.size.element.small,
    '--track-width': tokenSchema.size.element.large,

    '&[data-size="small"]': {
      '--track-height': tokenSchema.size.element.xsmall,
      '--track-width': tokenSchema.size.element.regular,
    },
    '&[data-prominence="low"]': {
      '--track-background-color': tokenSchema.color.background.inverse,
    },
  });
  let rootStyleProps = {
    ...styleProps,
    ...toDataAttributes({
      prominence,
      size,
    }),
    className: classNames(labelClassName, styleProps.className),
  };

  let contentStyleProps = {
    className: css({
      color: tokenSchema.color.alias.foregroundIdle,
      display: 'grid',
      paddingTop: `calc((var(--track-height) - ${tokenSchema.typography.text.regular.capheight}) / 2)`,
      gap: tokenSchema.size.space.large,

      'label[data-hovered] &': {
        color: tokenSchema.color.alias.foregroundHovered,
      },

      'label[data-disabled] &': {
        color: tokenSchema.color.alias.foregroundDisabled,
      },
    }),
  };

  let indicatorStyleProps = {
    className: classNames(
      css({
        backgroundColor: tokenSchema.color.background.surfaceTertiary,
        borderRadius: tokenSchema.size.radius.full,
        display: 'inline-block',
        flexShrink: 0,
        height: 'var(--track-height)',
        position: 'relative',
        transition: transition('background-color'),
        width: 'var(--track-width)',
        willChange: 'transform',

        // focus ring
        '::after': {
          borderRadius: tokenSchema.size.radius.full,
          content: '""',
          inset: 0,
          margin: 0,
          position: 'absolute',
          transition: transition(['box-shadow', 'margin'], {
            easing: 'easeOut',
          }),
        },
        'label[data-focus-visible] &::after': {
          boxShadow: `0 0 0 ${tokenSchema.size.alias.focusRing} ${tokenSchema.color.alias.focusRing}`,
          margin: `calc(${tokenSchema.size.alias.focusRingGap} * -1)`,
        },

        // handle
        '&::before': {
          backgroundColor: tokenSchema.color.background.canvas,
          border: `${tokenSchema.size.border.medium} solid ${tokenSchema.color.alias.borderIdle}`,
          borderRadius: `inherit`,
          boxSizing: 'border-box',
          content: '""',
          inlineSize: 'var(--track-height)',
          blockSize: 'var(--track-height)',
          insetBlockStart: 0,
          insetInlineStart: 0,
          margin: 0,
          position: 'absolute',
          transition: transition(['border-color', 'transform']),
        },

        'label[data-hovered] &::before': {
          borderColor: tokenSchema.color.alias.borderHovered,
        },
        'label[data-pressed] &::before': {
          borderColor: tokenSchema.color.alias.borderPressed,
        },

        // checked state
        'label[data-selected] &': {
          backgroundColor: 'var(--track-background-color)',
          '&::before': {
            borderColor: 'var(--track-background-color)',
          },
          '[dir=ltr] &::before': {
            transform: `translateX(calc(var(--track-width) - 100%))`,
          },
          '[dir=rtl] &::before': {
            transform: `translateX(calc(100% - var(--track-width)))`,
          },
        },

        // disabled state
        'label[data-disabled] &': {
          backgroundColor: tokenSchema.color.alias.backgroundDisabled,
          '&::before': {
            backgroundColor: tokenSchema.color.alias.borderIdle,
            borderColor: tokenSchema.color.alias.backgroundDisabled,
          },
        },
        'label[data-disabled][data-selected] &': {
          backgroundColor: tokenSchema.color.alias.borderIdle,
          '&::before': {
            backgroundColor: tokenSchema.color.alias.backgroundDisabled,
            borderColor: tokenSchema.color.alias.borderIdle,
          },
        },
      })
    ),
  };

  return {
    content: contentStyleProps,
    indicator: indicatorStyleProps,
    root: rootStyleProps,
  };
}
