import {
  DateValue,
  Granularity,
  MappedDateValue,
  MappedTimeValue,
  TimeValue,
} from '@react-types/datepicker';
import { FocusableProps, ValueBase } from '@react-types/shared';

import { FieldProps } from '@voussoir/field';

export type DateFieldProps<T extends DateValue> = {
  /** The minimum allowed date that a user may select. */
  minValue?: DateValue;
  /** The maximum allowed date that a user may select. */
  maxValue?: DateValue;
  /** Callback that is called for each date of the calendar. If it returns true, then the date is unavailable. */
  isDateUnavailable?: (date: DateValue) => boolean;
  /** A placeholder date that influences the format of the placeholder shown when no value is selected. Defaults to today's date at midnight. */
  placeholderValue?: T;
  /** Whether to display the time in 12 or 24 hour format. By default, this is determined by the user's locale. */
  hourCycle?: 12 | 24;
  /** Determines the smallest unit that is displayed in the date picker. By default, this is `"day"` for dates, and `"minute"` for times. */
  granularity?: Granularity;
  /**
   * Whether to hide the time zone abbreviation.
   * @default false
   */
  hideTimeZone?: boolean;
} & FocusableProps &
  ValueBase<T | null, MappedDateValue<T>> &
  FieldProps;

export type TimeFieldProps<T extends TimeValue> = {
  /** Whether to display the time in 12 or 24 hour format. By default, this is determined by the user's locale. */
  hourCycle?: 12 | 24;
  /**
   * Determines the smallest unit that is displayed in the time picker.
   * @default 'minute'
   */
  granularity?: 'hour' | 'minute' | 'second';
  /** Whether to hide the time zone abbreviation. */
  hideTimeZone?: boolean;
  /**
   * A placeholder time that influences the format of the placeholder shown when no value is selected.
   * Defaults to 12:00 AM or 00:00 depending on the hour cycle.
   */
  placeholderValue?: T;
  /** The minimum allowed time that a user may select. */
  minValue?: TimeValue;
  /** The maximum allowed time that a user may select. */
  maxValue?: TimeValue;
} & FocusableProps &
  ValueBase<T | null, MappedTimeValue<T>> &
  FieldProps;
