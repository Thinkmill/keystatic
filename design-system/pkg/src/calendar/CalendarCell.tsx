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

  let dayState = {
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
  };
  let cellStyleProps = useCellStyles(dayState);
  let dayStyleProps = useDayStyles(dayState);

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

export function useCellStyles(props: Partial<CellStyleProps> = {}) {
  let cellSize = `var(--calendar-cell-width, ${tokenSchema.size.element.regular})`;
  let cellPadding = `var(--calendar-cell-padding, ${tokenSchema.size.space.xsmall})`;
  return {
    ...toDataAttributes(props, {
      omitFalsyValues: true,
      trimBooleanKeys: true,
    }),
    className: css({
      boxSizing: 'content-box',
      height: cellSize,
      padding: cellPadding,
      position: 'relative',
      textAlign: 'center',
      width: cellSize,

      '&[data-range-selection]:not([data-outside-month])': {
        backgroundColor: tokenSchema.color.alias.backgroundSelected,
        '&[data-invalid]': {
          backgroundColor: tokenSchema.color.background.critical,
          color: tokenSchema.color.foreground.critical,
        },
      },
      '&[data-selection-start], &[data-range-start]': {
        borderStartStartRadius: tokenSchema.size.radius.full,
        borderEndStartRadius: tokenSchema.size.radius.full,
      },
      '&[data-selection-end], &[data-range-end]': {
        borderStartEndRadius: tokenSchema.size.radius.full,
        borderEndEndRadius: tokenSchema.size.radius.full,
      },
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
  isSelectionEnd: boolean | null;
  isSelectionStart: boolean | null;
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

    // Date specific
    // -------------------------------------------------------------------------

    // hide dates from other months
    '&[data-outside-month]': {
      visibility: 'hidden',
    },

    // today — indicated by a small underline beneath the date
    '&[data-today]': {
      color: tokenSchema.color.foreground.accent,
      fontWeight: tokenSchema.typography.fontWeight.semibold,

      '&:not([data-unavailable])::before': {
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

    // unavailable — indicated by an angled strike-through over the date
    '&[data-unavailable]:not([data-selected])': {
      '::before': {
        backgroundColor: 'currentColor',
        borderRadius: tokenSchema.size.radius.full,
        content: '""',
        height: tokenSchema.size.border.medium,
        marginInline: 'auto',
        position: 'absolute',
        top: '50%',
        insetInline: tokenSchema.size.space.small,
        transform: 'rotate(-16deg)',
      },
    },

    // Interaction states
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

    // Selection states
    // -------------------------------------------------------------------------

    '&[data-disabled]': {
      color: tokenSchema.color.alias.foregroundDisabled,
    },
    '&[data-selected]:not([data-range-selection], [data-disabled]), &[data-selection-start], &[data-selection-end]':
      {
        backgroundColor: tokenSchema.color.background.accentEmphasis,
        color: tokenSchema.color.foreground.onEmphasis,

        '&[data-invalid]': {
          backgroundColor: tokenSchema.color.background.criticalEmphasis,
        },
      },
    '&[data-range-selection]:not([data-selection-start], [data-selection-end])':
      {
        color: tokenSchema.color.foreground.accent,
        '&[data-hovered]': {
          backgroundColor: tokenSchema.color.alias.backgroundSelectedHovered,
        },
        '&[data-invalid]': {
          color: tokenSchema.color.foreground.critical,
        },
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
