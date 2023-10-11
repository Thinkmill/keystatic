import { useHover } from '@react-aria/interactions';
import { useSwitch } from '@react-aria/switch';
import { useToggleState } from '@react-stately/toggle';
import { AriaSwitchProps } from '@react-types/switch';
import {
  ForwardedRef,
  ForwardRefExoticComponent,
  forwardRef,
  useRef,
  useMemo,
} from 'react';

import { useProviderProps } from '@keystar/ui/core';
import { SlotProvider } from '@keystar/ui/slots';
import {
  BaseStyleProps,
  FocusRing,
  classNames,
  css,
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
    let { autoFocus, children, ...otherProps } = props;

    let inputRef = useRef<HTMLInputElement>(null);
    let state = useToggleState(props);
    let { inputProps } = useSwitch(props, state, inputRef);
    let styleProps = useSwitchStyles(otherProps);

    const slots = useMemo(
      () =>
        ({
          text: { color: 'inherit' },
          description: { color: 'neutralTertiary' },
        }) as const,
      []
    );

    return (
      <label {...styleProps.label} ref={forwardedRef}>
        <FocusRing autoFocus={autoFocus}>
          <input {...styleProps.input} {...inputProps} ref={inputRef} />
        </FocusRing>
        <span {...styleProps.indicator} />
        {children && (
          <SlotProvider slots={slots}>
            <span {...styleProps.content}>
              {isReactText(children) ? <Text>{children}</Text> : children}
            </span>
          </SlotProvider>
        )}
      </label>
    );
  }
);

function useSwitchStyles(props: SwitchProps) {
  let { isDisabled = false, prominence, size, ...otherProps } = props;
  let styleProps = useStyleProps(otherProps);
  let { hoverProps, isHovered } = useHover({ isDisabled });

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
  let labelStyleProps = {
    ...styleProps,
    ...hoverProps,
    ...toDataAttributes({
      disabled: isDisabled || undefined,
      hovered: isHovered || undefined,
      prominence,
      size,
    }),
    className: classNames(labelClassName, styleProps.className),
  };

  let inputStyleProps = {
    className: css({
      position: 'absolute',
      zIndex: 1,
      inset: `calc(${tokenSchema.size.space.regular} * -1)`, // expand hit area
      opacity: 0.0001,
    }),
  };

  let contentStyleProps = {
    className: css({
      color: tokenSchema.color.alias.foregroundIdle,
      display: 'grid',
      paddingTop: `calc((var(--track-height) - ${tokenSchema.typography.text.regular.capheight}) / 2)`,
      gap: tokenSchema.size.space.large,

      [`.${inputStyleProps.className}:hover ~ &`]: {
        color: tokenSchema.color.alias.foregroundHovered,
      },

      [`.${inputStyleProps.className}:disabled ~ &`]: {
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
        [`.${inputStyleProps.className}[data-focus=visible] + &::after`]: {
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

        [`.${inputStyleProps.className}:hover + &::before`]: {
          borderColor: tokenSchema.color.alias.borderHovered,
        },
        [`.${inputStyleProps.className}:active + &::before`]: {
          borderColor: tokenSchema.color.alias.borderPressed,
        },

        // checked state
        [`.${inputStyleProps.className}:checked + &`]: {
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
        [`.${inputStyleProps.className}:disabled + &`]: {
          backgroundColor: tokenSchema.color.alias.backgroundDisabled,
          '&::before': {
            backgroundColor: tokenSchema.color.alias.borderIdle,
            borderColor: tokenSchema.color.alias.backgroundDisabled,
          },
        },
        [`.${inputStyleProps.className}:disabled:checked + &`]: {
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
    input: inputStyleProps,
    label: labelStyleProps,
  };
}
