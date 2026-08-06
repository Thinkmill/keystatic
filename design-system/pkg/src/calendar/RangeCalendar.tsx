import {
  RangeCalendar as AriaRangeCalendar,
  type RangeCalendarProps as AriaRangeCalendarProps,
  type RangeCalendarState,
  type DateValue,
} from 'react-aria-components/RangeCalendar';
import {
  ForwardedRef,
  ReactElement,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';

import { useProviderProps } from '@keystar/ui/core';
import { classNames, filterStyleProps, useStyleProps } from '@keystar/ui/style';

import { CalendarBase, calendarRootClassName } from './CalendarBase';
import { RangeCalendarProps } from './types';

function RangeCalendar<T extends DateValue>(
  props: RangeCalendarProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  props = useProviderProps(props);
  let visibleMonths = Math.max(props.visibleMonths ?? 1, 1);
  let { visibleMonths: _visibleMonths, ...otherProps } = props;
  let domRef = useRef<HTMLDivElement>(null);
  let stateRef = useRef<RangeCalendarState | null>(null);
  let styleProps = useStyleProps(props);

  useImperativeHandle(forwardedRef, () => ({
    ...domRef.current!,
    focus() {
      stateRef.current?.setFocused(true);
    },
  }));

  return (
    <AriaRangeCalendar
      {...(filterStyleProps(otherProps) as AriaRangeCalendarProps<T>)}
      ref={domRef}
      visibleDuration={{ months: visibleMonths }}
      className={classNames(calendarRootClassName, styleProps.className)}
      style={styleProps.style}
    >
      {({ state }) => {
        stateRef.current = state;
        return <CalendarBase state={state} visibleMonths={visibleMonths} />;
      }}
    </AriaRangeCalendar>
  );
}

/** Range calendars display one or more months and allow range selection. */
const _RangeCalendar = forwardRef(RangeCalendar) as <T extends DateValue>(
  props: RangeCalendarProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;
export { _RangeCalendar as RangeCalendar };
