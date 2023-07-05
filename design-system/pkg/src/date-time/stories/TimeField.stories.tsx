import {
  CalendarDateTime,
  parseTime,
  parseZonedDateTime,
  Time,
  toZoned,
} from '@internationalized/date';
import { ArgTypes, action } from '@keystar/ui-storybook';
import { useState } from 'react';

import { TimeField } from '..';

export default {
  title: 'Components/Date and Time/TimeField',
};

export const Default = () => <TimeField label="Time" />;

Default.story = {
  name: 'default',
};

export const DefaultValue = () => (
  <TimeField label="Time" defaultValue={parseTime('14:45')} />
);

DefaultValue.story = {
  name: 'default value',
};

export const ControlledValue = () => <ControlledExample />;

ControlledValue.story = {
  name: 'controlled value',
};

export const HourCycle24 = () => <TimeField label="Time" hourCycle={24} />;

HourCycle24.story = {
  name: 'hourCycle: 24',
};

export const GranularitySecond = () => (
  <TimeField label="Time" granularity="second" />
);

GranularitySecond.story = {
  name: 'granularity: second',
};

export const Zoned = () => (
  <TimeField
    label="Time"
    defaultValue={parseZonedDateTime('2023-04-14T14:45[Australia/Sydney]')}
  />
);

Zoned.story = {
  name: 'zoned',
};

export const HideTimeZone = () => (
  <TimeField
    label="Time"
    defaultValue={parseZonedDateTime('2023-04-14T14:45[Australia/Sydney]')}
    hideTimeZone
  />
);

HideTimeZone.story = {
  name: 'hideTimeZone',
};

export const PlaceholderValue8Am = () => (
  <TimeField label="Time" placeholderValue={new Time(8)} />
);

PlaceholderValue8Am.story = {
  name: 'placeholderValue: 8 AM',
};

export const PlaceholderValue1980118AmZoned = () => (
  <TimeField
    label="Time"
    placeholderValue={toZoned(
      new CalendarDateTime(1980, 1, 1),
      'Australia/Sydney'
    )}
  />
);

PlaceholderValue1980118AmZoned.story = {
  name: 'placeholderValue: 1980/1/1 8AM, zoned',
};

export const MinValue8AmMaxValue8Pm = () => (
  <TimeField label="Time" minValue={new Time(8)} maxValue={new Time(20)} />
);

MinValue8AmMaxValue8Pm.story = {
  name: 'minValue: 8 AM, maxValue: 8 PM',
};

export const Events = () => (
  <TimeField
    label="Time"
    onBlur={action('onBlur')}
    onFocus={action('onFocus')}
    onFocusChange={action('onFocusChange')}
    onKeyDown={action('onKeyDown')}
    onKeyUp={action('onKeyUp')}
  />
);

Events.story = {
  name: 'events',
};

export const Controls = (args: ArgTypes) => (
  <TimeField
    {...args}
    label="Time"
    defaultValue={parseZonedDateTime('2023-04-14T14:45[Australia/Sydney]')}
  />
);

Controls.argTypes = {
  granularity: {
    control: 'select',
    options: ['hour', 'minute', 'second'],
  },
  hourCycle: {
    control: 'select',
    options: [12, 24],
  },
  hideTimeZone: {
    control: 'boolean',
  },
};

function ControlledExample() {
  const [value, setValue] = useState(new Time(14, 45));
  return <TimeField label="Time" value={value} onChange={setValue} />;
}
