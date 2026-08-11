import { useDateFormatter } from 'react-aria/useDateFormatter';
import { useLocale } from 'react-aria-components/I18nProvider';
import {
  Button as AriaButton,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  type CalendarState,
} from 'react-aria-components/Calendar';
import type { RangeCalendarState } from 'react-aria-components/RangeCalendar';

import { ActionButton, type ActionButtonProps } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { chevronLeftIcon } from '@keystar/ui/icon/icons/chevronLeftIcon';
import { chevronRightIcon } from '@keystar/ui/icon/icons/chevronRightIcon';
import { css, tokenSchema } from '@keystar/ui/style';
import { Heading, Text } from '@keystar/ui/typography';

type CalendarBaseProps = {
  state: CalendarState<'single'> | RangeCalendarState;
  visibleMonths: number;
};

export const calendarRootClassName = css({
  boxSizing: 'border-box',
  maxWidth: '100%',
  overflow: 'auto',
  padding: `calc(${tokenSchema.size.alias.focusRing} + ${tokenSchema.size.alias.focusRingGap})`,
  '--calendar-cell-width': tokenSchema.size.element.regular,
  '--calendar-cell-padding': tokenSchema.size.space.xsmall,
  '--calendar-width':
    'calc(var(--calendar-cell-width) * 7 + var(--calendar-cell-padding) * 12)',
});

export function CalendarBase({ state, visibleMonths }: CalendarBaseProps) {
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

  return (
    <>
      <div
        className={css({
          boxSizing: 'border-box',
          display: 'grid',
          gap: tokenSchema.size.space.large,
          gridAutoColumns: '1fr',
          gridAutoFlow: 'column',
          paddingInline: 'var(--calendar-cell-padding)',
          width: '100%',
        })}
      >
        {Array.from({ length: visibleMonths }, (_, index) => {
          let date = currentMonth.add({ months: index });
          return (
            <div
              key={index}
              className={css({
                alignItems: 'center',
                display: 'grid',
                gridTemplateAreas: '"prev title next"',
                gridTemplateColumns: 'minmax(auto, 1fr) auto minmax(auto, 1fr)',
                width: 'var(--calendar-width)',
              })}
            >
              {index === 0 && (
                <CalendarButton slot="previous" gridArea="prev">
                  <Icon
                    src={
                      direction === 'rtl' ? chevronRightIcon : chevronLeftIcon
                    }
                    size="medium"
                  />
                </CalendarButton>
              )}
              <Heading
                aria-hidden
                align="center"
                elementType="h2"
                gridArea="title"
                size="small"
              >
                {monthDateFormatter.format(date.toDate(state.timeZone))}
              </Heading>
              {index === visibleMonths - 1 && (
                <CalendarButton slot="next" gridArea="next">
                  <Icon
                    src={
                      direction === 'rtl' ? chevronLeftIcon : chevronRightIcon
                    }
                    size="medium"
                  />
                </CalendarButton>
              )}
            </div>
          );
        })}
      </div>
      <div
        className={css({
          alignItems: 'start',
          display: 'grid',
          gap: tokenSchema.size.space.large,
          gridAutoColumns: '1fr',
          gridAutoFlow: 'column',
        })}
      >
        {Array.from({ length: visibleMonths }, (_, index) => (
          <CalendarGrid
            key={index}
            offset={{ months: index }}
            className={css({
              borderCollapse: 'collapse',
              borderSpacing: 0,
              tableLayout: 'fixed',
              userSelect: 'none',
              width: 'var(--calendar-width)',
            })}
          >
            <CalendarGridHeader>
              {day => (
                <CalendarHeaderCell className={cellClassName}>
                  <Text align="center" color="neutralTertiary" size="small">
                    {day}
                  </Text>
                </CalendarHeaderCell>
              )}
            </CalendarGridHeader>
            <CalendarGridBody>
              {date => (
                <CalendarCell date={date} className={dayClassName}>
                  {({ formattedDate }) => (
                    <Text
                      align="center"
                      color="inherit"
                      trim={false}
                      weight="inherit"
                    >
                      {formattedDate}
                    </Text>
                  )}
                </CalendarCell>
              )}
            </CalendarGridBody>
          </CalendarGrid>
        ))}
      </div>
    </>
  );
}

function CalendarButton({
  children,
  gridArea,
  slot,
}: Pick<ActionButtonProps, 'children' | 'gridArea'> & {
  slot: 'next' | 'previous';
}) {
  return (
    <AriaButton
      slot={slot}
      render={({ className: _, ...buttonProps }) => (
        <ActionButton
          {...(buttonProps as ActionButtonProps)}
          gridArea={gridArea}
          justifySelf={slot === 'previous' ? 'start' : 'end'}
          prominence="low"
          UNSAFE_style={{ padding: 0 }}
        />
      )}
    >
      {children}
    </AriaButton>
  );
}

const cellClassName = css({
  boxSizing: 'content-box',
  height: 'var(--calendar-cell-width)',
  padding: 'var(--calendar-cell-padding)',
  textAlign: 'center',
  width: 'var(--calendar-cell-width)',
});

const dayClassName = css({
  alignItems: 'center',
  borderRadius: tokenSchema.size.radius.full,
  color: tokenSchema.color.foreground.neutral,
  cursor: 'default',
  display: 'flex',
  height: 'var(--calendar-cell-width)',
  justifyContent: 'center',
  outline: 0,
  width: 'var(--calendar-cell-width)',

  '&[data-hovered]': {
    backgroundColor: tokenSchema.color.alias.backgroundHovered,
  },
  '&[data-pressed]': {
    backgroundColor: tokenSchema.color.alias.backgroundPressed,
  },
  '&[data-selected]': {
    backgroundColor: tokenSchema.color.background.accentEmphasis,
    color: tokenSchema.color.foreground.onEmphasis,
    fontWeight: tokenSchema.typography.fontWeight.semibold,
  },
  '&[data-focus-visible]': {
    boxShadow: `0 0 0 ${tokenSchema.size.alias.focusRing} ${tokenSchema.color.alias.focusRing}`,
  },
  '&[data-disabled], &[data-outside-month]': {
    color: tokenSchema.color.alias.foregroundDisabled,
  },
  '&[data-unavailable]': {
    color: tokenSchema.color.foreground.critical,
    textDecoration: 'line-through',
  },
  '&[data-invalid][data-selected]': {
    backgroundColor: tokenSchema.color.background.criticalEmphasis,
  },
});
