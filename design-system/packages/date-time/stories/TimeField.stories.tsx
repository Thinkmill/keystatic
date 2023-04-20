import {
  CalendarDateTime,
  parseTime,
  parseZonedDateTime,
  Time,
  toZoned,
} from '@internationalized/date';
import { ArgTypes, action, storiesOf } from '@voussoir/storybook';
import { useState } from 'react';

import { TimeField } from '../src';

storiesOf('Components/Date and Time/TimeField', module)
  .add('default', () => <TimeField label="Time" />)
  .add('default value', () => (
    <TimeField label="Time" defaultValue={parseTime('14:45')} />
  ))
  .add('controlled value', () => <ControlledExample />)
  .add('hourCycle: 24', () => <TimeField label="Time" hourCycle={24} />)
  .add('granularity: second', () => (
    <TimeField label="Time" granularity="second" />
  ))
  .add('zoned', () => (
    <TimeField
      label="Time"
      defaultValue={parseZonedDateTime('2023-04-14T14:45[Australia/Sydney]')}
    />
  ))
  .add('hideTimeZone', () => (
    <TimeField
      label="Time"
      defaultValue={parseZonedDateTime('2023-04-14T14:45[Australia/Sydney]')}
      hideTimeZone
    />
  ))
  .add('placeholderValue: 8 AM', () => (
    <TimeField label="Time" placeholderValue={new Time(8)} />
  ))
  .add('placeholderValue: 1980/1/1 8AM, zoned', () => (
    <TimeField
      label="Time"
      placeholderValue={toZoned(
        new CalendarDateTime(1980, 1, 1),
        'Australia/Sydney'
      )}
    />
  ))
  .add('minValue: 8 AM, maxValue: 8 PM', () => (
    <TimeField label="Time" minValue={new Time(8)} maxValue={new Time(20)} />
  ))
  .add('events', () => (
    <TimeField
      label="Time"
      onBlur={action('onBlur')}
      onFocus={action('onFocus')}
      onFocusChange={action('onFocusChange')}
      onKeyDown={action('onKeyDown')}
      onKeyUp={action('onKeyUp')}
    />
  ))
  .add(
    'controls',
    (args: ArgTypes) => (
      <TimeField
        {...args}
        label="Time"
        defaultValue={parseZonedDateTime('2023-04-14T14:45[Australia/Sydney]')}
      />
    ),
    {
      argTypes: {
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
      },
    }
  );

function ControlledExample() {
  const [value, setValue] = useState(new Time(14, 45));
  return <TimeField label="Time" value={value} onChange={setValue} />;
}
