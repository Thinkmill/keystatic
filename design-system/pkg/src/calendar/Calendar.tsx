import {
  Calendar as AriaCalendar,
  type CalendarProps as AriaCalendarProps,
  type CalendarState,
  type DateValue,
} from 'react-aria-components/Calendar';
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
import { CalendarProps } from './types';

function Calendar<T extends DateValue>(
  props: CalendarProps<T>,
  forwardedRef: ForwardedRef<HTMLDivElement>
) {
  props = useProviderProps(props);
  let visibleMonths = Math.max(props.visibleMonths ?? 1, 1);
  let { visibleMonths: _visibleMonths, ...otherProps } = props;
  let domRef = useRef<HTMLDivElement>(null);
  let stateRef = useRef<CalendarState<'single'> | null>(null);
  let styleProps = useStyleProps(props);

  useImperativeHandle(forwardedRef, () => ({
    ...domRef.current!,
    focus() {
      stateRef.current?.setFocused(true);
    },
  }));

  return (
    <AriaCalendar
      {...(filterStyleProps(otherProps) as AriaCalendarProps<T>)}
      ref={domRef}
      visibleDuration={{ months: visibleMonths }}
      className={classNames(calendarRootClassName, styleProps.className)}
      style={styleProps.style}
    >
      {({ state }) => {
        stateRef.current = state;
        return <CalendarBase state={state} visibleMonths={visibleMonths} />;
      }}
    </AriaCalendar>
  );
}

/** Calendars display one or more months and allow single-date selection. */
const _Calendar = forwardRef(Calendar) as <T extends DateValue>(
  props: CalendarProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReactElement;
export { _Calendar as Calendar };
