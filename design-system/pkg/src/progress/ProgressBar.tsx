import {
  ProgressBar as AriaProgressBar,
  type ProgressBarProps as AriaProgressBarProps,
} from 'react-aria-components/ProgressBar';
import { ForwardedRef, forwardRef } from 'react';

import { filterStyleProps } from '@keystar/ui/style';

import { BarBase, useBarStyles } from './BarBase';
import { ProgressBarProps } from './types';

/**
 * ProgressBars show the progression of a system operation: downloading,
 * uploading, processing, etc. They may be determinate or indeterminate.
 */
export const ProgressBar = forwardRef(function ProgressBar(
  props: ProgressBarProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  let styleProps = useBarStyles(props);

  return (
    <AriaProgressBar
      {...(filterStyleProps(props, [
        'label',
        'showValueLabel',
        'valueLabel',
      ]) as AriaProgressBarProps)}
      {...styleProps}
      ref={forwardedRef}
    >
      {({ percentage, valueText }) => (
        <BarBase {...props} percentage={percentage} valueText={valueText} />
      )}
    </AriaProgressBar>
  );
});
