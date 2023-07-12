import { ReactNode } from 'react';
import { AriaLabelingProps, DOMProps } from '@react-types/shared';

import { BaseStyleProps } from '@keystar/ui/style';

// Common props
// -----------------------------------------------------------------------------

interface CommonProgressProps {
  /**
   * The current value (controlled).
   * @default 0
   */
  value?: number;
  /**
   * The smallest value allowed for the input.
   * @default 0
   */
  minValue?: number;
  /**
   * The largest value allowed for the input.
   * @default 100
   */
  maxValue?: number;
}

// Bar props shared between `Meter` and `ProgressBar`
// -----------------------------------------------------------------------------

export interface CommonBarProps
  extends CommonProgressProps,
    DOMProps,
    AriaLabelingProps,
    BaseStyleProps {
  /** The content to display as the label. */
  label?: ReactNode;
  /**
   * Whether the value's label is displayed.
   *
   * True by default if there's a `label`, false by default if not.
   */
  showValueLabel?: boolean;
  /**
   * The display format of the value label.
   *
   * @default { style: 'percent' }
   */
  formatOptions?: Intl.NumberFormatOptions;
  /** The content to display as the value's label. */
  valueLabel?: ReactNode;
}

// Meter props
// -----------------------------------------------------------------------------

export interface MeterProps extends CommonBarProps {
  /**
   * The tone of the meter.
   *
   * @default 'neutral
   */
  tone?: 'positive' | 'critical' | 'caution' | 'neutral';
}

// Bar props
// -----------------------------------------------------------------------------

export interface ProgressBarProps extends CommonBarProps {
  /**
   * Whether progress is indeterminate.
   */
  isIndeterminate?: boolean;
}

// Circle props
// -----------------------------------------------------------------------------

export interface ProgressCircleProps
  extends CommonProgressProps,
    DOMProps,
    AriaLabelingProps,
    BaseStyleProps {
  /**
   * Whether progress is indeterminate.
   */
  isIndeterminate?: boolean;
  /**
   * The size of the circle.
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large';
}
