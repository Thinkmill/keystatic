import { createCalendar } from '@internationalized/date';
import { useCalendar } from '@react-aria/calendar';
import { useLocale } from '@react-aria/i18n';
import { useObjectRef } from '@react-aria/utils';
import { useCalendarState } from '@react-stately/calendar';
import { DateValue } from '@react-types/calendar';
import {
  forwardRef,
  ForwardedRef,
  ReactElement,
  useImperativeHandle,
  useMemo,
} from 'react';

import { useProviderProps } from '@keystar/ui/core';

import { CalendarBase } from './CalendarBase';
import { CalendarProps } from './types';

function Calendar<T extends DateValue>(
  props: CalendarProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  props = useProviderProps(props);
  let { visibleMonths = 1 } = props;
  visibleMonths = Math.max(visibleMonths, 1);
  let visibleDuration = useMemo(
    () => ({ months: visibleMonths }),
    [visibleMonths]
  );
  let { locale } = useLocale();
  let state = useCalendarState({
    ...props,
    locale,
    visibleDuration,
    createCalendar,
  });

  let domRef = useObjectRef(forwardedRef);
  // @ts-expect-error FIXME: not sure how to properly resolve this type issue
  useImperativeHandle(forwardedRef, () => ({
    ...domRef.current,
    focus() {
      state.setFocused(true);
    },
  }));

  let { calendarProps, prevButtonProps, nextButtonProps } = useCalendar(
    props,
    state
  );

  return (
    <CalendarBase
      {...props}
      visibleMonths={visibleMonths}
      state={state}
      calendarRef={domRef}
      calendarProps={calendarProps}
      prevButtonProps={prevButtonProps}
      nextButtonProps={nextButtonProps}
    />
  );
}

/**
 * Calendars display a grid of days in one or more months and allow users to
 * select a single date.
 */
const _Calendar = forwardRef(Calendar) as <T extends DateValue>(
  props: CalendarProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;
export { _Calendar as Calendar };
