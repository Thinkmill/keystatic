import {
  Meter as AriaMeter,
  type MeterProps as AriaMeterProps,
} from 'react-aria-components/Meter';
import { ForwardedRef, forwardRef } from 'react';

import { css, filterStyleProps, tokenSchema } from '@keystar/ui/style';

import { BarBase, useBarStyles } from './BarBase';
import { MeterProps } from './types';

/**
 * Meters are visual representations of a quantity or an achievement. Their
 * progress is determined by user actions, rather than system actions.
 */
export const Meter = forwardRef(function Meter(
  props: MeterProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let styleProps = useBarStyles(
    props,
    css({
      '&[data-tone="positive"]': {
        '--bar-fill': tokenSchema.color.background.positiveEmphasis,
      },
      '&[data-tone="caution"]': {
        '--bar-fill': tokenSchema.color.background.cautionEmphasis,
      },
      '&[data-tone="critical"]': {
        '--bar-fill': tokenSchema.color.background.criticalEmphasis,
      },
    })
  );

  return (
    <AriaMeter
      {...(filterStyleProps(props, [
        'label',
        'showValueLabel',
        'tone',
        'valueLabel',
      ]) as AriaMeterProps)}
      {...styleProps}
      ref={forwardedRef}
      data-tone={props.tone}
    >
      {({ percentage, valueText }) => (
        <BarBase {...props} percentage={percentage} valueText={valueText} />
      )}
    </AriaMeter>
  );
});
