import type {
  DateFieldProps as AriaDateFieldProps,
  DateValue,
} from 'react-aria-components/DateField';
import type { DatePickerProps as AriaDatePickerProps } from 'react-aria-components/DatePicker';
import type { DateRangePickerProps as AriaDateRangePickerProps } from 'react-aria-components/DateRangePicker';
import type {
  TimeFieldProps as AriaTimeFieldProps,
  TimeValue,
} from 'react-aria-components/TimeField';

import { FieldProps } from '@keystar/ui/field';
import { BaseStyleProps } from '@keystar/ui/style';

type FieldCompositionProps = FieldProps & BaseStyleProps;

export type DateFieldProps<T extends DateValue> = Omit<
  AriaDateFieldProps<T>,
  'children' | 'className' | 'style' | keyof FieldCompositionProps
> &
  FieldCompositionProps;

export type TimeFieldProps<T extends TimeValue> = Omit<
  AriaTimeFieldProps<T>,
  'children' | 'className' | 'style' | keyof FieldCompositionProps
> &
  FieldCompositionProps;

type PickerOptions = {
  /** The maximum number of months to display at once. */
  maxVisibleMonths?: number;
  /** Whether the calendar popover should flip when space is limited. */
  shouldFlip?: boolean;
};

export type DatePickerProps<T extends DateValue> = Omit<
  AriaDatePickerProps<T>,
  'children' | 'className' | 'style' | keyof FieldCompositionProps
> &
  FieldCompositionProps &
  PickerOptions;

export type DateRangePickerProps<T extends DateValue> = Omit<
  AriaDateRangePickerProps<T>,
  'children' | 'className' | 'style' | keyof FieldCompositionProps
> &
  FieldCompositionProps &
  PickerOptions;
