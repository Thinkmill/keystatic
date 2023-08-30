import {
  CalendarDate,
  CalendarDateTime,
  DateValue,
  getLocalTimeZone,
  isWeekend,
  parseDate,
  today,
} from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';
import { Parameters, StoryObj, action } from '@keystar/ui-storybook';
import React from 'react';

import { DateRangePicker } from '../index';

type DateRangePickerStory = StoryObj<typeof DateRangePicker>;

export default {
  title: 'Components/Date and Time/DateRangePicker',
  component: DateRangePicker,
  args: {
    label: 'Date',
    onChange: action('onChange'),
  },
  argTypes: {
    defaultValue: { table: { disable: true } },
    isDateUnavailable: { table: { disable: true } },
    maxValue: { table: { disable: true } },
    minValue: { table: { disable: true } },
    onBlur: { table: { disable: true } },
    onChange: { table: { disable: true } },
    onFocus: { table: { disable: true } },
    onFocusChange: { table: { disable: true } },
    onKeyDown: { table: { disable: true } },
    onKeyUp: { table: { disable: true } },
    onOpenChange: { table: { disable: true } },
    placeholderValue: { table: { disable: true } },
    value: { table: { disable: true } },
    label: {
      control: 'text',
    },
    granularity: {
      control: 'select',
      options: ['day', 'hour', 'minute', 'second'],
    },
    hourCycle: {
      control: 'select',
      options: [12, 24],
    },
    hideTimeZone: {
      control: 'boolean',
    },
    shouldForceLeadingZeros: {
      control: 'boolean',
    },
    isDisabled: {
      control: 'boolean',
    },
    isReadOnly: {
      control: 'boolean',
    },
    isRequired: {
      control: 'boolean',
    },
    description: {
      control: 'text',
    },
    errorMessage: {
      control: 'text',
    },
    autoFocus: {
      control: 'boolean',
    },
    showFormatHelpText: {
      control: 'boolean',
    },
    'aria-label': {
      control: 'text',
    },
    maxVisibleMonths: {
      control: 'number',
    },
    shouldFlip: {
      control: 'boolean',
    },
    defaultOpen: {
      control: 'boolean',
    },
    isOpen: {
      control: 'boolean',
    },
  },
} as any;

export const Default: DateRangePickerStory = render();

export const DefaultValue: DateRangePickerStory = {
  ...Default,
  args: {
    defaultValue: {
      start: parseDate('2023-08-25'),
      end: parseDate('2023-08-30'),
    },
  },
};

export const MinMaxValue: DateRangePickerStory = {
  ...Default,
  args: {
    minValue: today(getLocalTimeZone()),
    maxValue: today(getLocalTimeZone()).add({ weeks: 2 }),
  },
  name: 'minValue + maxValue',
};

export const PlaceholderVal: DateRangePickerStory = {
  ...Default,
  args: { placeholderValue: new CalendarDate(1980, 1, 1) },
  name: 'placeholder value: 1980/1/1',
};

export const PlaceholderValTime: DateRangePickerStory = {
  ...Default,
  args: { placeholderValue: new CalendarDateTime(1980, 1, 1, 8) },
  name: 'placeholder value: 1980/1/1 8AM',
};

export const DateUnavailable: DateRangePickerStory = {
  ...Default,
  args: {
    isDateUnavailable: (date: DateValue) => {
      const disabledIntervals = [
        [
          today(getLocalTimeZone()),
          today(getLocalTimeZone()).add({ weeks: 1 }),
        ],
        [
          today(getLocalTimeZone()).add({ weeks: 2 }),
          today(getLocalTimeZone()).add({ weeks: 3 }),
        ],
      ];
      return disabledIntervals.some(
        interval =>
          date.compare(interval[0]) > 0 && date.compare(interval[1]) < 0
      );
    },
  },
  name: 'isDateUnavailable',
};

export const IsDateAvailableAllowsNonContiguousRanges = () => {
  let { locale } = useLocale();
  return render({
    isDateUnavailable: (date: DateValue) => isWeekend(date, locale),
    allowsNonContiguousRanges: true,
  });
};

IsDateAvailableAllowsNonContiguousRanges.storyName =
  'isDateAvailable, allowsNonContiguousRanges';

export const AllEvents: DateRangePickerStory = {
  ...Default,
  args: {
    onBlur: action('onBlur'),
    onFocus: action('onFocus'),
    onFocusChange: action('onFocusChange'),
    onKeyDown: action('onKeyDown'),
    onKeyUp: action('onKeyUp'),
    onOpenChange: action('onOpenChange'),
  },
  name: 'all the events',
};

function render(props = {}) {
  return {
    render: (args: Parameters) => <DateRangePicker {...args} {...props} />,
  };
}
