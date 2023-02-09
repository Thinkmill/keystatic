import { useProgressBar } from '@react-aria/progress';
import { ForwardedRef, forwardRef } from 'react';

import { BarBase } from './BarBase';
import { ProgressBarProps } from './types';

/**
 * ProgressBars show the progression of a system operation: downloading, uploading, processing, etc., in a visual way.
 * They can represent either determinate or indeterminate progress.
 */
export const ProgressBar = forwardRef(function ProgressBar(
  props: ProgressBarProps,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  const { progressBarProps, labelProps } = useProgressBar(props);

  return (
    <BarBase
      {...props}
      ref={forwardedRef}
      barProps={progressBarProps}
      labelProps={labelProps}
    />
  );
});
