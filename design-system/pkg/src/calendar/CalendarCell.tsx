import {
  CalendarDate,
  getDayOfWeek,
  isSameDay,
  isSameMonth,
  isToday,
} from '@internationalized/date';
import { AriaCalendarCellProps, useCalendarCell } from '@react-aria/calendar';
import { useFocusRing } from '@react-aria/focus';
import { useLocale } from '@react-aria/i18n';
import { useHover } from '@react-aria/interactions';
import { mergeProps } from '@react-aria/utils';
import { CalendarState, RangeCalendarState } from '@react-stately/calendar';
import React, { useRef } from 'react';

// import { classNames } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { toDataAttributes } from '@keystar/ui/utils';

interface CalendarCellProps extends AriaCalendarCellProps {
  state: CalendarState | RangeCalendarState;
  currentMonth: CalendarDate;
}

export function CalendarCell({
  currentMonth,
  state,
  ...props
}: CalendarCellProps) {
  let ref = useRef<HTMLElement>(null);
  let {
    buttonProps,
    cellProps,
    formattedDate,
    isDisabled,
    isFocused,
    isInvalid,
    isPressed,
    isSelected,
  } = useCalendarCell(
    {
      ...props,
      isDisabled: !isSameMonth(props.date, currentMonth),
    },
    state,
    ref
  );
  let isUnavailable = state.isCellUnavailable(props.date) && !isDisabled;
  let isLastSelectedBeforeDisabled =
    !isDisabled &&
    !isInvalid &&
    state.isCellUnavailable(props.date.add({ days: 1 }));
  let isFirstSelectedAfterDisabled =
    !isDisabled &&
    !isInvalid &&
    state.isCellUnavailable(props.date.subtract({ days: 1 }));
  let highlightedRange = 'highlightedRange' in state && state.highlightedRange;
  let isSelectionStart =
    isSelected &&
    highlightedRange &&
    isSameDay(props.date, highlightedRange.start);
  let isSelectionEnd =
    isSelected &&
    highlightedRange &&
    isSameDay(props.date, highlightedRange.end);
  let { locale } = useLocale();
  let dayOfWeek = getDayOfWeek(props.date, locale);
  let isRangeStart =
    isSelected &&
    (isFirstSelectedAfterDisabled || dayOfWeek === 0 || props.date.day === 1);
  let isRangeEnd =
    isSelected &&
    (isLastSelectedBeforeDisabled ||
      dayOfWeek === 6 ||
      props.date.day === currentMonth.calendar.getDaysInMonth(currentMonth));
  let { focusProps, isFocusVisible } = useFocusRing();
  let { hoverProps, isHovered } = useHover({
    isDisabled: isDisabled || isUnavailable || state.isReadOnly,
  });

  let styleProps = useCellStyles({
    // Style disabled (i.e. out of min/max range), but selected dates as unavailable
    // since it is more clear than trying to dim the selection.
    isDisabled: isDisabled && !isInvalid,
    isFocused: isFocused && isFocusVisible,
    isHovered: isHovered,
    isInvalid: isInvalid,
    isOutsideMonth: !isSameMonth(props.date, currentMonth),
    isPressed: isPressed && !state.isReadOnly,
    isRangeEnd: isRangeEnd,
    isRangeSelection: isSelected && 'highlightedRange' in state,
    isRangeStart: isRangeStart,
    isSelected: isSelected,
    isSelectionEnd: isSelectionEnd,
    isSelectionStart: isSelectionStart,
    isToday: isToday(props.date, state.timeZone),
    isUnavailable: isUnavailable || (isInvalid && isDisabled),
  });

  return (
    <td {...cellProps}>
      <span
        ref={ref}
        {...mergeProps(buttonProps, hoverProps, focusProps)}
        {...styleProps}
      >
        <Text>{formattedDate}</Text>
      </span>
    </td>
  );
}

type CellStyleProps = {
  isDisabled: boolean;
  isFocused: boolean;
  isHovered: boolean;
  isInvalid: boolean;
  isOutsideMonth: boolean;
  isPressed: boolean;
  isRangeEnd: boolean;
  isRangeSelection: boolean;
  isRangeStart: boolean;
  isSelected: boolean;
  isSelectionEnd: boolean;
  isSelectionStart: boolean;
  isToday: boolean;
  isUnavailable: boolean;
};

function useCellStyles(props: CellStyleProps) {
  let className = 'calendar-cell';

  return {
    ...toDataAttributes({
      isDisabled: props.isDisabled,
      isFocused: props.isFocused,
      isHovered: props.isHovered,
      isInvalid: props.isInvalid,
      isOutsideMonth: props.isOutsideMonth,
      isPressed: props.isPressed,
      isRangeEnd: props.isRangeEnd,
      isRangeSelection: props.isRangeSelection,
      isRangeStart: props.isRangeStart,
      isSelected: props.isSelected,
      isSelectionEnd: props.isSelectionEnd,
      isSelectionStart: props.isSelectionStart,
      isToday: props.isToday,
      isUnavailable: props.isUnavailable,
    }),
    className,
  };
}
