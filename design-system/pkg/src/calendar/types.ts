import type {
  CalendarProps as AriaCalendarProps,
  DateValue,
} from 'react-aria-components/Calendar';
import type { RangeCalendarProps as AriaRangeCalendarProps } from 'react-aria-components/RangeCalendar';
import { BaseStyleProps } from '@keystar/ui/style';

export type CalendarProps<T extends DateValue> = Omit<
  AriaCalendarProps<T>,
  'children' | 'className' | 'style' | 'visibleDuration'
> &
  BaseStyleProps & {
    /**
     * The number of months to display at once. Up to 3 months are supported.
     * @default 1
     */
    visibleMonths?: number;
  };

export type RangeCalendarProps<T extends DateValue> = Omit<
  AriaRangeCalendarProps<T>,
  'children' | 'className' | 'style' | 'visibleDuration'
> &
  BaseStyleProps & {
    /**
     * The number of months to display at once. Up to 3 months are supported.
     * @default 1
     */
    visibleMonths?: number;
  };
