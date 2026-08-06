import { warning } from 'emery';
import { Fragment } from 'react';
import { Label } from 'react-aria-components/Label';

import {
  classNames,
  css,
  keyframes,
  tokenSchema,
  transition,
  useStyleProps,
} from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

import { CommonBarProps } from './types';

type BarBaseProps = CommonBarProps & {
  isIndeterminate?: boolean;
  percentage?: number;
  valueText?: string;
};

/** @private Visual content shared between `Meter` and `ProgressBar`. */
export function BarBase(props: BarBaseProps) {
  let {
    label,
    showValueLabel = !!label,
    valueLabel,
    valueText,
    percentage,
    isIndeterminate,
  } = props;

  warning(
    !!(label || props['aria-label'] || props['aria-labelledby']),
    'If you do not provide a visible label via children, you must specify an aria-label or aria-labelledby attribute for accessibility.'
  );

  return (
    <Fragment>
      {label && (
        <Label>
          <Text flex>{label}</Text>
        </Label>
      )}
      {showValueLabel && <Text flexShrink={0}>{valueLabel ?? valueText}</Text>}
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
          data-indeterminate={isIndeterminate || undefined}
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
          style={{ width: percentage == null ? undefined : `${percentage}%` }}
        />
      </div>
    </Fragment>
  );
}

export function useBarStyles(props: CommonBarProps, className?: string) {
  let styleProps = useStyleProps(props);
  return {
    ...styleProps,
    className: classNames(
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
      className,
      styleProps.className
    ),
  };
}

const indeterminateLoopLtr = keyframes({
  from: { transform: 'translate(-100%)' },
  to: { transform: 'translate(100%)' },
});

const indeterminateLoopRtl = keyframes({
  from: { transform: 'translate(100%)' },
  to: { transform: 'translate(-100%)' },
});
