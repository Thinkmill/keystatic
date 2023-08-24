import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';

import { action, Parameters, StoryObj } from '@keystar/ui-storybook';

import { Calendar } from '../index';

type Story = StoryObj<typeof Calendar>;

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
  args: { defaultValue: new CalendarDate(2019, 6, 5) },
};

export const ControlledValue: Story = {
  ...Default,
  args: { value: new CalendarDate(2019, 5, 5) },
};

export const OneWeek: Story = {
  ...Default,
  args: {
    minValue: today(getLocalTimeZone()),
    maxValue: today(getLocalTimeZone()).add({ weeks: 1 }),
  },
  name: 'minValue: today, maxValue: 1 week from now',
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
