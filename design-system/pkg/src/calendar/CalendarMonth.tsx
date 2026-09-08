import {
  CalendarDate,
  endOfMonth,
  getWeeksInMonth,
} from '@internationalized/date';
import { useCalendarGrid } from 'react-aria/useCalendar';
import { useLocale } from 'react-aria/I18nProvider';
import {
  CalendarState,
  CalendarPropsBase,
} from 'react-stately/useCalendarState';
import { RangeCalendarState } from 'react-stately/useRangeCalendarState';

import { DOMProps } from '@react-types/shared';
import React from 'react';

import { css } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

import { CalendarCell, useCellStyles } from './CalendarCell';

interface CalendarMonthProps extends CalendarPropsBase, DOMProps {
  state: CalendarState | RangeCalendarState;
  startDate: CalendarDate;
}

export function CalendarMonth(props: CalendarMonthProps) {
  let { state, startDate } = props;
  let { gridProps, headerProps, weekDays } = useCalendarGrid(
    {
      ...props,
      endDate: endOfMonth(startDate),
    },
    state
  );

  let { locale } = useLocale();
  let weeksInMonth = getWeeksInMonth(startDate, locale);
  let cellStyleProps = useCellStyles();

  return (
    <table
      className={css({
        borderCollapse: 'collapse',
        borderSpacing: 0,
        tableLayout: 'fixed',
        userSelect: 'none',
        width: 'var(--calendar-width)',
      })}
      {...gridProps}
    >
      <thead {...headerProps}>
        <tr>
          {weekDays.map((day, index) => (
            <th key={index} {...cellStyleProps}>
              <Text align="center" color="neutralTertiary" size="small">
                {day}
              </Text>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {[...new Array(weeksInMonth).keys()].map(weekIndex => (
          <tr key={weekIndex}>
            {state
              .getDatesInWeek(weekIndex, startDate)
              .map((date, i) =>
                date ? (
                  <CalendarCell
                    key={i}
                    state={state}
                    date={date}
                    currentMonth={startDate}
                  />
                ) : (
                  <td key={i} />
                )
              )}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
