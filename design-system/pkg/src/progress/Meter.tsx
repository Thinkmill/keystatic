import { useMeter } from '@react-aria/meter';
import { css, toDataAttributes, tokenSchema } from '@keystar/ui/style';
import { ForwardedRef, forwardRef } from 'react';

import { BarBase } from './BarBase';
import { MeterProps } from './types';

/**
 * Meters are visual representations of a quantity or an achievement. Their
 * progress is determined by user actions, rather than system actions.
 */
export const Meter = forwardRef(function Meter(
  props: MeterProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let { tone, ...otherProps } = props;
  const { meterProps, labelProps } = useMeter(props);

  return (
    <BarBase
      {...otherProps}
      ref={forwardedRef}
      barClassName={css({
        '&[data-tone="positive"]': {
          '--bar-fill': tokenSchema.color.background.positiveEmphasis,
        },
        '&[data-tone="caution"]': {
          '--bar-fill': tokenSchema.color.background.cautionEmphasis,
        },
        '&[data-tone="critical"]': {
          '--bar-fill': tokenSchema.color.background.criticalEmphasis,
        },
      })}
      barProps={{ ...meterProps, ...toDataAttributes({ tone }) }}
      labelProps={labelProps}
    />
  );
});
