import {
  CalendarDate,
  CalendarDateTime,
  parseAbsolute,
  parseAbsoluteToLocal,
  parseDate,
  parseDateTime,
  parseZonedDateTime,
  toZoned,
} from '@internationalized/date';
import { ArgTypes, action, storiesOf } from '@voussoir/storybook';

import { DateField } from '../src';
import { useState } from 'react';

storiesOf('Components/Date and Time/DateField', module)
  .add('default', () => <DateField label="Date" />)
  .add('default value', () => (
    <DateField label="Date" defaultValue={parseDate('2023-04-14')} />
  ))
  .add('controlled value', () => <ControlledExample />)
  .add('datetime', () => (
    <DateField label="Date" defaultValue={parseDateTime('2023-04-14T14:45')} />
  ))
  .add('datetime: zoned', () => (
    <DateField
      label="Date"
      defaultValue={parseZonedDateTime('2023-04-14T14:45[Australia/Sydney]')}
    />
  ))
  .add('datetime: absolute', () => (
    <DateField
      label="Date"
      defaultValue={parseAbsoluteToLocal('2023-04-14T14:45:00Z')}
    />
  ))
  .add('datetime: absolute + zoned', () => (
    <DateField
      label="Date"
      defaultValue={parseAbsolute('2023-04-14T14:45:00Z', 'Australia/Sydney')}
    />
  ))
  .add('min: 2010/1/1, max: 2020/1/1', () => (
    <DateField
      label="Date"
      minValue={new CalendarDate(2010, 0, 1)}
      maxValue={new CalendarDate(2020, 0, 1)}
    />
  ))
  .add('date placeholder: 1980/1/1', () => (
    <DateField label="Date" placeholderValue={new CalendarDate(1980, 1, 1)} />
  ))
  .add('datetime placeholder: 1980/1/1 8AM', () => (
    <DateField
      label="Date"
      placeholderValue={new CalendarDateTime(1980, 1, 1, 8)}
    />
  ))
  .add('date placeholder: 1980/1/1 (zoned)', () => (
    <DateField
      label="Date"
      placeholderValue={toZoned(
        new CalendarDate(1980, 1, 1),
        'Australia/Sydney'
      )}
    />
  ))
  .add('events', () => (
    <DateField
      label="Date"
      onBlur={action('onBlur')}
      onFocus={action('onFocus')}
      onFocusChange={action('onFocusChange')}
      onKeyDown={action('onKeyDown')}
      onKeyUp={action('onKeyUp')}
      placeholderValue={new CalendarDateTime(1980, 1, 1, 8)}
    />
  ))
  .add(
    'controls',
    (args: ArgTypes) => (
      <DateField
        {...args}
        label="Date"
        placeholderValue={toZoned(
          new CalendarDate(1980, 1, 1),
          'Australia/Sydney'
        )}
      />
    ),
    {
      argTypes: {
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
      },
    }
  );

function ControlledExample() {
  const [value, setValue] = useState(new CalendarDate(2023, 4, 14));
  return <DateField label="Date" value={value} onChange={setValue} />;
}
