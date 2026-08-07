import { AriaCalendarProps } from 'react-aria/useCalendar';
import { AriaRangeCalendarProps } from 'react-aria/useRangeCalendar';
import { DateValue } from 'react-stately/useCalendarState';
import { BaseStyleProps } from '@keystar/ui/style';

export interface CalendarProps<T extends DateValue>
  extends AriaCalendarProps<T>,
    BaseStyleProps {
  /**
   * The number of months to display at once. Up to 3 months are supported.
   * @default 1
   */
  visibleMonths?: number;
}

export interface RangeCalendarProps<T extends DateValue>
  extends AriaRangeCalendarProps<T>,
    BaseStyleProps {
  /**
   * The number of months to display at once. Up to 3 months are supported.
   * @default 1
   */
  visibleMonths?: number;
}
