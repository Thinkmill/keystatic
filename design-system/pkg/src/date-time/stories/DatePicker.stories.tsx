import {
  CalendarDate,
  CalendarDateTime,
  DateValue,
  getLocalTimeZone,
  parseDate,
  today,
} from '@internationalized/date';
import { Parameters, StoryObj, action } from '@keystar/ui-storybook';
import React from 'react';

import { DatePicker } from '../index';

type DatePickerStory = StoryObj<typeof DatePicker>;

export default {
  title: 'Components/Date and Time/DatePicker',
  component: DatePicker,
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

export const Default: DatePickerStory = render();

export const DefaultValue: DatePickerStory = {
  ...Default,
  args: { defaultValue: parseDate('2023-08-25') },
};

export const MinMaxValue: DatePickerStory = {
  ...Default,
  args: {
    minValue: today(getLocalTimeZone()),
    maxValue: today(getLocalTimeZone()).add({ weeks: 2 }),
  },
  name: 'minValue + maxValue',
};

export const PlaceholderVal: DatePickerStory = {
  ...Default,
  args: { placeholderValue: new CalendarDate(1980, 1, 1) },
  name: 'placeholder value: 1980/1/1',
};

export const PlaceholderValTime: DatePickerStory = {
  ...Default,
  args: { placeholderValue: new CalendarDateTime(1980, 1, 1, 8) },
  name: 'placeholder value: 1980/1/1 8AM',
};

export const DateUnavailable: DatePickerStory = {
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

export const AllEvents: DatePickerStory = {
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
    render: (args: Parameters) => <DatePicker {...args} {...props} />,
  };
}
