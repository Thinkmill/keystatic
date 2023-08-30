import {
  CalendarDate,
  getLocalTimeZone,
  parseDate,
  today,
} from '@internationalized/date';

import { action, Parameters, StoryObj } from '@keystar/ui-storybook';

import { Calendar } from '../index';

type Story = StoryObj<typeof Calendar>;

const dateToday = today(getLocalTimeZone());

export default {
  title: 'Components/Date and Time/Calendar',
  component: Calendar,
  args: {
    onChange: action('onChange'),
  },
  argTypes: {
    onChange: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    minValue: { table: { disable: true } },
    value: { table: { disable: true } },
    maxValue: { table: { disable: true } },
    defaultFocusedValue: { table: { disable: true } },
    isDisabled: {
      control: 'boolean',
    },
    isReadOnly: {
      control: 'boolean',
    },
    autoFocus: {
      control: 'boolean',
    },
    visibleMonths: {
      control: 'number',
    },
    pageBehavior: {
      control: 'select',
      options: [null, 'single', 'visible'],
    },
    'aria-label': {
      control: 'text',
    },
  },
};

export const Default: Story = render();

export const DefaultValue: Story = {
  ...Default,
  args: { defaultValue: parseDate('2023-08-25') },
};

export const ControlledValue: Story = {
  ...Default,
  args: { value: parseDate('2023-08-26') },
};

export const OneWeek: Story = {
  ...Default,
  args: {
    minValue: dateToday,
    maxValue: dateToday.add({ weeks: 2 }),
  },
  name: 'minValue + maxValue',
};

export const DateUnavailable: Story = {
  render: args => (
    <Calendar
      {...args}
      defaultValue={dateToday.add({ days: 1 })}
      isDateUnavailable={date => {
        const now = dateToday;
        const disabledIntervals = [
          [now.add({ days: 1 }), now.add({ weeks: 1 })],
          [now.add({ weeks: 2 }), now.add({ weeks: 3 })],
        ];
        return disabledIntervals.some(
          interval =>
            date.compare(interval[0]) > 0 && date.compare(interval[1]) < 0
        );
      }}
    />
  ),
  name: 'isDateUnavailable',
};

export const InvalidSelection: Story = {
  ...Default,
  args: {
    minValue: dateToday,
    defaultValue: dateToday.subtract({ weeks: 1 }),
  },
  name: 'Invalid selection',
};

export const DefaultFocusedValue: Story = {
  ...Default,
  args: { defaultFocusedValue: new CalendarDate(2013, 9, 4) },
  name: 'defaultFocusedValue',
};

function render(props = {}) {
  return {
    render: (args: Parameters) => (
      <Calendar
        {...args}
        onChange={action('change')}
        UNSAFE_className="custom-class-name"
        {...props}
      />
    ),
  };
}
