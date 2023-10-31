import {
  CalendarDate,
  CalendarDateTime,
  DateValue,
  parseAbsolute,
  parseAbsoluteToLocal,
  parseDate,
  parseDateTime,
  parseZonedDateTime,
  toZoned,
} from '@internationalized/date';
import { useLocale } from '@react-aria/i18n';
import { KeystarProvider } from '@keystar/ui/core';
import { Flex } from '@keystar/ui/layout';
import { Item, Picker, Section } from '@keystar/ui/picker';
import { ArgTypes, action } from '@keystar/ui-storybook';
import React from 'react';

import { DateField, DateFieldProps } from '..';

export default {
  title: 'Components/Date and Time/DateField',
};

export const Default = () => <Example label="Date" />;

Default.story = {
  name: 'default',
};

export const DefaultValue = () => (
  <Example label="Date" defaultValue={parseDate('2023-04-14')} />
);

DefaultValue.story = {
  name: 'default value',
};

export const ControlledValue = () => <ControlledExample />;

ControlledValue.story = {
  name: 'controlled value',
};

export const Datetime = () => (
  <Example label="Date" defaultValue={parseDateTime('2023-04-14T14:45')} />
);

Datetime.story = {
  name: 'datetime',
};

export const DatetimeZoned = () => (
  <Example
    label="Date"
    defaultValue={parseZonedDateTime('2023-04-14T14:45[Australia/Sydney]')}
  />
);

DatetimeZoned.story = {
  name: 'datetime: zoned',
};

export const DatetimeAbsolute = () => (
  <Example
    label="Date"
    defaultValue={parseAbsoluteToLocal('2023-04-14T14:45:00Z')}
  />
);

DatetimeAbsolute.story = {
  name: 'datetime: absolute',
};

export const DatetimeAbsoluteZoned = () => (
  <Example
    label="Date"
    defaultValue={parseAbsolute('2023-04-14T14:45:00Z', 'Australia/Sydney')}
  />
);

DatetimeAbsoluteZoned.story = {
  name: 'datetime: absolute + zoned',
};

export const Min201011Max202011 = () => (
  <Example
    label="Date"
    minValue={new CalendarDate(2010, 0, 1)}
    maxValue={new CalendarDate(2020, 0, 1)}
  />
);

Min201011Max202011.story = {
  name: 'min: 2010/1/1, max: 2020/1/1',
};

export const DatePlaceholder198011 = () => (
  <Example label="Date" placeholderValue={new CalendarDate(1980, 1, 1)} />
);

DatePlaceholder198011.story = {
  name: 'date placeholder: 1980/1/1',
};

export const DatetimePlaceholder1980118Am = () => (
  <Example
    label="Date"
    placeholderValue={new CalendarDateTime(1980, 1, 1, 8)}
  />
);

DatetimePlaceholder1980118Am.story = {
  name: 'datetime placeholder: 1980/1/1 8AM',
};

export const DatePlaceholder198011Zoned = () => (
  <Example
    label="Date"
    placeholderValue={toZoned(new CalendarDate(1980, 1, 1), 'Australia/Sydney')}
  />
);

DatePlaceholder198011Zoned.story = {
  name: 'date placeholder: 1980/1/1 (zoned)',
};

export const Events = () => (
  <Example
    label="Date"
    onBlur={action('onBlur')}
    onFocus={action('onFocus')}
    onFocusChange={action('onFocusChange')}
    onKeyDown={action('onKeyDown')}
    onKeyUp={action('onKeyUp')}
    placeholderValue={new CalendarDateTime(1980, 1, 1, 8)}
  />
);

Events.story = {
  name: 'events',
};

export const Controls = (args: ArgTypes) => (
  <Example
    {...args}
    label="Date"
    placeholderValue={toZoned(new CalendarDate(1980, 1, 1), 'Australia/Sydney')}
  />
);

Controls.argTypes = {
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
};

function ControlledExample() {
  const [value, setValue] = React.useState(new CalendarDate(2023, 4, 14));
  return <Example label="Date" value={value} onChange={setValue} />;
}

// https://github.com/unicode-org/cldr/blob/22af90ae3bb04263f651323ce3d9a71747a75ffb/common/supplemental/supplementalData.xml#L4649-L4664
const preferences = [
  { locale: '', label: 'Default', ordering: 'gregory' },
  {
    label: 'Arabic (Algeria)',
    locale: 'ar-DZ',
    ordering: 'gregory islamic islamic-civil islamic-tbla',
  },
  {
    label: 'Arabic (United Arab Emirates)',
    locale: 'ar-AE',
    ordering: 'gregory islamic-umalqura islamic islamic-civil islamic-tbla',
  },
  {
    label: 'Arabic (Egypt)',
    locale: 'AR-EG',
    ordering: 'gregory coptic islamic islamic-civil islamic-tbla',
  },
  {
    label: 'Arabic (Saudi Arabia)',
    locale: 'ar-SA',
    ordering: 'islamic-umalqura gregory islamic islamic-rgsa',
  },
  {
    label: 'Farsi (Afghanistan)',
    locale: 'fa-AF',
    ordering: 'persian gregory islamic islamic-civil islamic-tbla',
  },
  {
    label: 'Amharic (Ethiopia)',
    locale: 'am-ET',
    ordering: 'gregory ethiopic ethioaa',
  },
  {
    label: 'Hebrew (Israel)',
    locale: 'he-IL',
    ordering: 'gregory hebrew islamic islamic-civil islamic-tbla',
  },
  {
    label: 'Hindi (India)',
    locale: 'hi-IN',
    ordering: 'gregory indian',
  },
  {
    label: 'Bengali (India)',
    locale: 'bn-IN',
    ordering: 'gregory indian',
  },
  {
    label: 'Japanese (Japan)',
    locale: 'ja-JP',
    ordering: 'gregory japanese',
  },
  {
    label: 'Thai (Thailand)',
    locale: 'th-TH',
    ordering: 'buddhist gregory',
  },
  {
    label: 'Chinese (Taiwan)',
    locale: 'zh-TW',
    ordering: 'gregory roc chinese',
  },
];

const calendars = [
  { key: 'gregory', name: 'Gregorian' },
  { key: 'japanese', name: 'Japanese' },
  { key: 'buddhist', name: 'Buddhist' },
  { key: 'roc', name: 'Taiwan' },
  { key: 'persian', name: 'Persian' },
  { key: 'indian', name: 'Indian' },
  { key: 'islamic-umalqura', name: 'Islamic (Umm al-Qura)' },
  { key: 'islamic-civil', name: 'Islamic Civil' },
  { key: 'islamic-tbla', name: 'Islamic Tabular' },
  { key: 'hebrew', name: 'Hebrew' },
  { key: 'coptic', name: 'Coptic' },
  { key: 'ethiopic', name: 'Ethiopic' },
  { key: 'ethioaa', name: 'Ethiopic (Amete Alem)' },
];

function Example<T extends DateValue>(props: DateFieldProps<T>) {
  let [locale, setLocale] = React.useState<React.Key>('');
  let [calendar, setCalendar] = React.useState<React.Key>(calendars[0].key);
  let { locale: defaultLocale } = useLocale();

  let pref = preferences.find(p => p.locale === locale);
  let preferredCalendars = React.useMemo(
    () =>
      pref
        ? pref.ordering
            .split(' ')
            .map(p => calendars.find(c => c.key === p))
            .filter(Boolean)
        : [calendars[0]],
    [pref]
  );
  let otherCalendars = React.useMemo(
    () =>
      calendars.filter(c => !preferredCalendars.some(p => p?.key === c.key)),
    [preferredCalendars]
  );

  let updateLocale = (locale: React.Key) => {
    setLocale(locale);
    let pref = preferences.find(p => p.locale === locale);
    setCalendar(pref!.ordering.split(' ')[0]);
  };

  return (
    <Flex direction="column" gap="large" alignItems="center">
      <Flex direction="row" gap="regular" wrap justifyContent="center">
        <Picker
          label="Locale"
          items={preferences}
          selectedKey={locale}
          onSelectionChange={updateLocale}
        >
          {item => <Item key={item.locale}>{item.label}</Item>}
        </Picker>
        <Picker
          label="Calendar"
          selectedKey={calendar}
          onSelectionChange={setCalendar}
        >
          <Section title="Preferred" items={preferredCalendars}>
            {item => <Item>{item?.name || 'ERROR'}</Item>}
          </Section>
          <Section title="Other" items={otherCalendars}>
            {item => <Item>{item.name}</Item>}
          </Section>
        </Picker>
      </Flex>
      <KeystarProvider
        locale={
          (locale || defaultLocale) +
          (calendar && calendar !== preferredCalendars[0]?.key
            ? '-u-ca-' + calendar
            : '')
        }
      >
        <DateField {...props} />
      </KeystarProvider>
    </Flex>
  );
}
