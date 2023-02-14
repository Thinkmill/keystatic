import { HTMLAttributes, useRef } from 'react';

import { useCheckbox } from '@react-aria/checkbox';
import { useToggleState } from '@react-stately/toggle';

import { Icon } from '@voussoir/icon';
import { checkIcon } from '@voussoir/icon/icons/checkIcon';
import { minusIcon } from '@voussoir/icon/icons/minusIcon';
import {
  FocusRing,
  classNames,
  css,
  tokenSchema,
  transition,
  useStyleProps,
} from '@voussoir/style';
import { Text } from '@voussoir/typography';
import { isReactText } from '@voussoir/utils';

import { CheckboxProps } from './types';

export function Checkbox(props: CheckboxProps) {
  let {
    isIndeterminate = false,
    isDisabled = false,
    autoFocus,
    children,
    ...otherProps
  } = props;
  let styleProps = useStyleProps(otherProps);
  let ref = useRef<HTMLInputElement>(null);
  let state = useToggleState(props);
  let { inputProps } = useCheckbox(props, state, ref);

  const labelClassName = css({
    alignItems: 'flex-start',
    display: 'inline-flex',
    gap: tokenSchema.size.space.regular,
    position: 'relative',
    userSelect: 'none',
  });

  return (
    <label
      data-disabled={isDisabled}
      className={classNames(styleProps.className, labelClassName)}
      style={styleProps.style}
    >
      <FocusRing autoFocus={autoFocus}>
        <input
          {...inputProps}
          ref={ref}
          className={classNames(
            css({
              position: 'absolute',
              zIndex: 1,
              inset: `calc(${tokenSchema.size.space.regular} * -1)`, // expand hit area
              opacity: 0.0001,
            })
          )}
        />
      </FocusRing>
      <Indicator isIndeterminate={isIndeterminate} />
      {children && (
        <Content>
          {isReactText(children) ? (
            <Text color="inherit">{children}</Text>
          ) : (
            children
          )}
        </Content>
      )}
    </label>
  );
}

// Styled components
// -----------------------------------------------------------------------------

let sizeToken = tokenSchema.size.element.xsmall;
type IndicatorProps = { isIndeterminate: boolean };

const Indicator = (props: IndicatorProps) => {
  let { isIndeterminate } = props;

  return (
    <span
      className={classNames(
        css({
          backgroundColor: tokenSchema.color.background.canvas,
          borderRadius: tokenSchema.size.radius.small,
          color: tokenSchema.color.foreground.onEmphasis,
          display: 'flex',
          flexShrink: 0,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          height: sizeToken,
          width: sizeToken,

          // indicator icons
          '.ksv-checkbox-indicator': {
            opacity: 0,
            transform: `scale(0) translate3d(0, 0, 0)`,
            transition: transition(['opacity', 'transform']),
            willChange: 'opacity, transform',
          },

          // focus ring
          '::after': {
            borderRadius: `calc(${tokenSchema.size.alias.focusRingGap} + ${tokenSchema.size.radius.small})`,
            content: '""',
            inset: 0,
            margin: 0,
            position: 'absolute',
            transition: transition(['box-shadow', 'margin'], {
              easing: 'easeOut',
            }),
          },
          'input[type="checkbox"][data-focus=visible] + &::after': {
            boxShadow: `0 0 0 ${tokenSchema.size.alias.focusRing} ${tokenSchema.color.alias.focusRing}`,
            margin: `calc(${tokenSchema.size.alias.focusRingGap} * -1)`,
          },

          // border / background
          '&::before': {
            border: `${tokenSchema.size.border.medium} solid ${tokenSchema.color.alias.borderIdle}`,
            borderRadius: `inherit`,
            content: '""',
            inset: 0,
            margin: 0,
            position: 'absolute',
            transition: transition(['border-color', 'border-width']),
          },

          'input[type="checkbox"]:disabled + &': {
            color: tokenSchema.color.alias.foregroundDisabled,
            '&::before': {
              borderColor: tokenSchema.color.alias.borderDisabled,
            },
          },
          'input[type="checkbox"]:enabled:hover + &::before': {
            borderColor: tokenSchema.color.alias.borderHovered,
          },
          'input[type="checkbox"]:enabled:active + &::before': {
            borderColor: tokenSchema.color.alias.borderPressed,
          },

          // checked states
          'input[type="checkbox"]:checked + &, input[type="checkbox"]:indeterminate + &':
            {
              '&::before': {
                borderWidth: `calc(${sizeToken} / 2)`,
              },

              '.ksv-checkbox-indicator': {
                opacity: 1,
                transform: `scale(1)`,
              },
            },
          'input[type="checkbox"]:enabled:checked + &::before, input[type="checkbox"]:enabled:indeterminate + &::before':
            {
              borderColor: tokenSchema.color.scale.indigo9,
            },
          'input[type="checkbox"]:enabled:checked:hover + &::before, input[type="checkbox"]:enabled:indeterminate:hover + &::before':
            {
              borderColor: tokenSchema.color.scale.indigo10,
            },
          'input[type="checkbox"]:enabled:checked:active + &::before, input[type="checkbox"]:enabled:indeterminate:active + &::before':
            {
              borderColor: tokenSchema.color.scale.indigo11,
            },
        })
      )}
    >
      {/* firefox has issues when transform combined with transition on SVG; circumvent with this wrapper */}
      <span className="ksv-checkbox-indicator">
        <Icon
          size="small"
          src={isIndeterminate ? minusIcon : checkIcon}
          strokeScaling={false}
        />
      </span>
    </span>
  );
};

const Content = (props: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={classNames(
        css({
          color: tokenSchema.color.alias.foregroundIdle,
          paddingTop: `calc((${sizeToken} - ${tokenSchema.fontsize.text.regular.capheight}) / 2)`,

          'input[type="checkbox"]:hover ~ &': {
            color: tokenSchema.color.alias.foregroundHovered,
          },

          'input[type="checkbox"]:disabled ~ &': {
            color: tokenSchema.color.alias.foregroundDisabled,
          },
        })
      )}
      {...props}
    />
  );
};
