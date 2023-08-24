import { AriaButtonProps } from '@react-types/button';
import { CalendarPropsBase } from '@react-types/calendar';
import { CalendarState, RangeCalendarState } from '@react-stately/calendar';
import { DOMProps } from '@react-types/shared';
import { useDateFormatter, useLocale } from '@react-aria/i18n';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import React, { HTMLAttributes, RefObject } from 'react';

import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { chevronLeftIcon } from '@keystar/ui/icon/icons/chevronLeftIcon';
import { chevronRightIcon } from '@keystar/ui/icon/icons/chevronRightIcon';
import { BaseStyleProps, useStyleProps } from '@keystar/ui/style';

import { CalendarMonth } from './CalendarMonth';

interface CalendarBaseProps<T extends CalendarState | RangeCalendarState>
  extends CalendarPropsBase,
    DOMProps,
    BaseStyleProps {
  state: T;
  visibleMonths?: number;
  calendarProps: HTMLAttributes<HTMLElement>;
  nextButtonProps: AriaButtonProps;
  prevButtonProps: AriaButtonProps;
  calendarRef: RefObject<HTMLDivElement>;
}

export function CalendarBase<T extends CalendarState | RangeCalendarState>(
  props: CalendarBaseProps<T>
) {
  let {
    state,
    calendarProps,
    nextButtonProps,
    prevButtonProps,
    calendarRef: ref,
    visibleMonths = 1,
  } = props;
  let styleProps = useStyleProps(props);
  let { direction } = useLocale();
  let currentMonth = state.visibleRange.start;
  let monthDateFormatter = useDateFormatter({
    month: 'long',
    year: 'numeric',
    era:
      currentMonth.calendar.identifier === 'gregory' &&
      currentMonth.era === 'BC'
        ? 'short'
        : undefined,
    calendar: currentMonth.calendar.identifier,
    timeZone: state.timeZone,
  });

  let titles = [];
  let calendars = [];
  for (let i = 0; i < visibleMonths; i++) {
    let d = currentMonth.add({ months: i });
    titles.push(
      // monthHeader
      <div key={i}>
        {i === 0 && (
          // prevMonth
          <ActionButton {...prevButtonProps} prominence="low">
            <Icon
              src={direction === 'rtl' ? chevronRightIcon : chevronLeftIcon}
            />
          </ActionButton>
        )}
        {/* title */}
        <h2
          // We have a visually hidden heading describing the entire visible range,
          // and the calendar itself describes the individual month
          // so we don't need to repeat that here for screen reader users.
          aria-hidden
        >
          {monthDateFormatter.format(d.toDate(state.timeZone))}
        </h2>
        {i === visibleMonths - 1 && (
          // nextMonth
          <ActionButton {...nextButtonProps} prominence="low">
            <Icon
              src={direction === 'rtl' ? chevronLeftIcon : chevronRightIcon}
            />
          </ActionButton>
        )}
      </div>
    );

    calendars.push(
      <CalendarMonth {...props} key={i} state={state} startDate={d} />
    );
  }

  return (
    <div {...styleProps} {...calendarProps} ref={ref}>
      {/* Add a screen reader only description of the entire visible range rather than
       * a separate heading above each month grid. This is placed first in the DOM order
       * so that it is the first thing a touch screen reader user encounters.
       * In addition, VoiceOver on iOS does not announce the aria-label of the grid
       * elements, so the aria-label of the Calendar is included here as well. */}
      <VisuallyHidden>
        <h2>{calendarProps['aria-label']}</h2>
      </VisuallyHidden>
      {/* header */}
      <div>{titles}</div>
      {/* months */}
      <div>{calendars}</div>
      {/* For touch screen readers, add a visually hidden next button after the month grid
       * so it's easy to navigate after reaching the end without going all the way
       * back to the start of the month. */}
      <VisuallyHidden>
        <button
          aria-label={nextButtonProps['aria-label']}
          disabled={nextButtonProps.isDisabled}
          onClick={() => state.focusNextPage()}
          tabIndex={-1}
        />
      </VisuallyHidden>
    </div>
  );
}
