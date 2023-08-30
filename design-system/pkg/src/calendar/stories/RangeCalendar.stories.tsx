import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';

import { action, Parameters, StoryObj } from '@keystar/ui-storybook';

import { RangeCalendar } from '../index';

type Story = StoryObj<typeof RangeCalendar>;

const dateToday = today(getLocalTimeZone());

export default {
  title: 'Components/Date and Time/RangeCalendar',
  component: RangeCalendar,
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
  args: {
    defaultValue: {
      start: new CalendarDate(2023, 8, 5),
      end: new CalendarDate(2023, 8, 10),
    },
  },
};

export const ControlledValue: Story = {
  ...Default,
  args: {
    value: {
      start: new CalendarDate(2023, 8, 5),
      end: new CalendarDate(2023, 8, 10),
    },
  },
};

export const OneWeek: Story = {
  ...Default,
  args: {
    minValue: dateToday,
    maxValue: dateToday.add({ weeks: 1 }),
  },
  name: 'minValue + maxValue',
};

export const InvalidSelection: Story = {
  ...Default,
  args: {
    minValue: dateToday,
    defaultValue: {
      start: dateToday.subtract({ weeks: 2 }),
      end: dateToday.subtract({ weeks: 1 }),
    },
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
      <RangeCalendar
        {...args}
        onChange={action('change')}
        UNSAFE_className="custom-class-name"
        {...props}
      />
    ),
  };
}
