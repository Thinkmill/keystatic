import { clamp } from '@react-aria/utils';
import { warning } from 'emery';
import { CSSProperties, ForwardedRef, forwardRef, HTMLAttributes } from 'react';

import {
  classNames,
  css,
  keyframes,
  toDataAttributes,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

import { ProgressBarProps } from './types';

interface BarBaseProps extends ProgressBarProps {
  barClassName?: string;
  barProps?: HTMLAttributes<HTMLDivElement>;
  labelProps?: Omit<HTMLAttributes<HTMLLabelElement>, 'color'>;
}

/** @private Internal component shared between `Meter` and `ProgressBar`. */
export const BarBase = forwardRef(function BarBase(
  props: BarBaseProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let {
    value = 0,
    minValue = 0,
    maxValue = 100,
    label,
    barClassName,
    showValueLabel = !!label,
    isIndeterminate,
    barProps,
    labelProps,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledby,
    ...otherProps
  } = props;
  let styleProps = useStyleProps(otherProps);

  value = clamp(value, minValue, maxValue);

  let barStyle: CSSProperties = {};
  if (!isIndeterminate) {
    let percentage = (value - minValue) / (maxValue - minValue);
    barStyle.width = `${Math.round(percentage * 100)}%`;
  }

  warning(
    !!(label || ariaLabel || ariaLabelledby),
    'If you do not provide a visible label via children, you must specify an aria-label or aria-labelledby attribute for accessibility.'
  );

  return (
    <div
      {...barProps}
      {...styleProps}
      ref={forwardedRef}
      className={classNames(
        css({
          '--bar-fill': tokenSchema.color.background.accentEmphasis,

          alignItems: 'flex-start',
          display: 'inline-flex',
          gap: tokenSchema.size.space.regular,
          flexFlow: 'wrap',
          isolation: 'isolate',
          justifyContent: 'space-between',
          minWidth: 0,
          position: 'relative',
          verticalAlign: 'top',
          width: tokenSchema.size.alias.singleLineWidth,
        }),
        barClassName,
        styleProps.className
      )}
    >
      {label && (
        <Text {...labelProps} flex>
          {label}
        </Text>
      )}
      {showValueLabel && barProps && (
        <Text flexShrink={0}>{barProps['aria-valuetext']}</Text>
      )}
      <div
        className={css({
          backgroundColor: tokenSchema.color.border.muted,
          borderRadius: tokenSchema.size.radius.full,
          height: tokenSchema.size.space.regular,
          minWidth: 0,
          overflow: 'hidden',
          width: '100%',
          zIndex: '1',
        })}
      >
        <div
          {...toDataAttributes({ indeterminate: isIndeterminate ?? undefined })}
          className={css({
            backgroundColor: 'var(--bar-fill)',
            height: tokenSchema.size.space.regular,
            transition: transition('width', { duration: 'regular' }),

            '&[data-indeterminate]': {
              animation: `${indeterminateLoopLtr} ${tokenSchema.animation.duration.long} ${tokenSchema.animation.easing.easeInOut} infinite`,
              willChange: 'transform',

              '[dir=rtl] &': {
                animationName: indeterminateLoopRtl,
              },
            },
          })}
          style={barStyle}
        />
      </div>
    </div>
  );
});

const indeterminateLoopLtr = keyframes({
  from: { transform: 'translate(-100%)' },
  to: { transform: 'translate(100%)' },
});

const indeterminateLoopRtl = keyframes({
  from: { transform: 'translate(100%)' },
  to: { transform: 'translate(-100%)' },
});
