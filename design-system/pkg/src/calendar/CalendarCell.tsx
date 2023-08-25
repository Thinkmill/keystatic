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

import { css, toDataAttributes, tokenSchema } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';

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

  let cellStyleProps = useCellStyles();
  let dayStyleProps = useDayStyles({
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
    <td {...cellStyleProps} {...cellProps}>
      <span
        ref={ref}
        {...mergeProps(buttonProps, hoverProps, focusProps)}
        {...dayStyleProps}
      >
        <Text align="center" color="inherit" trim={false} weight="inherit">
          {formattedDate}
        </Text>
      </span>
    </td>
  );
}

export function useCellStyles() {
  let cellSize = `var(--calendar-cell-width, ${tokenSchema.size.element.regular})`;
  let cellPadding = `var(--calendar-cell-padding, ${tokenSchema.size.space.xsmall})`;
  return {
    className: css({
      height: cellSize,
      padding: cellPadding,
      position: 'relative',
      textAlign: 'center',
      width: cellSize,
    }),
  };
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

function useDayStyles(props: CellStyleProps) {
  let className = css({
    alignItems: 'center',
    borderRadius: tokenSchema.size.radius.full,
    color: tokenSchema.color.foreground.neutral,
    cursor: 'default',
    display: 'flex',
    inset: tokenSchema.size.space.xsmall,
    justifyContent: 'center',
    outline: 0,
    position: 'absolute',

    // Ephemeral states
    // -------------------------------------------------------------------------

    '&[data-hovered]': {
      backgroundColor: tokenSchema.color.alias.backgroundHovered,
      color: tokenSchema.color.alias.foregroundHovered,
    },
    '&[data-pressed]': {
      backgroundColor: tokenSchema.color.alias.backgroundPressed,
    },
    '&[data-focused]': {
      outline: `${tokenSchema.size.alias.focusRing} solid ${tokenSchema.color.alias.focusRing}`,
      outlineOffset: tokenSchema.size.alias.focusRingGap,
    },

    // Date specific
    // -------------------------------------------------------------------------

    // dates from other months
    '&[data-outside-month]': {
      visibility: 'hidden',
    },

    // today's date
    '&[data-today]': {
      color: tokenSchema.color.foreground.accent,
      fontWeight: tokenSchema.typography.fontWeight.semibold,

      '::before': {
        backgroundColor: 'currentColor',
        borderRadius: tokenSchema.size.radius.full,
        content: '""',
        height: tokenSchema.size.border.medium,
        marginInline: 'auto',
        position: 'absolute',
        top: `calc(50% + 1ch)`,
        width: '2ch',
      },
    },

    // Deterministic states
    // -------------------------------------------------------------------------

    '&[data-disabled]': {
      color: tokenSchema.color.alias.foregroundDisabled,
    },
    '&[data-selected]': {
      backgroundColor: tokenSchema.color.background.accentEmphasis,
      color: tokenSchema.color.foreground.onEmphasis,
    },
  });

  return {
    ...toDataAttributes(props, {
      omitFalsyValues: true,
      trimBooleanKeys: true,
    }),
    className,
  };
}
