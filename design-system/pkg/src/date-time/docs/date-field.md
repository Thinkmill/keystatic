---
title: DateField
description:
  DateFields allow users to enter and edit date and time values using a
  keyboard. Each part of a date value is displayed in an individually editable
  segment.
category: Date and time
---

## Example

```jsx {% live=true %}
<DateField label="Date" />
```

## Patterns

### Value

A `DateField` displays a placeholder by default. An initial, uncontrolled value
can be provided to the `DateField` using the `defaultValue` prop. Alternatively,
a controlled value can be provided using the `value` prop.

Date values are provided using objects from the
[@internationalized/date](https://react-spectrum.adobe.com/internationalized/date/)
package. This library handles correct international date manipulation across
calendars, time zones, and other localization concerns. `DateField` supports
values of the following types:

- [CalendarDate](https://react-spectrum.adobe.com/internationalized/date/CalendarDate.html)
  – a date without any time components. May be parsed from a string
  representation using the `parseDate` function. Use this type to represent
  dates where the time is not important, such as a birthday or an all day
  calendar event.
- [CalendarDateTime](https://react-spectrum.adobe.com/internationalized/date/CalendarDateTime.html)
  – a date with a time, but not in any specific time zone. May be parsed from a
  string representation using the `parseDateTime` function. Use this type to
  represent times that occur at the same local time regardless of the time zone,
  such as the time of New Years Eve fireworks which always occur at midnight.
  Most times are better stored as a `ZonedDateTime`.
- [ZonedDateTime](https://react-spectrum.adobe.com/internationalized/date/ZonedDateTime.html)
  – a date with a time in a specific time zone. May be parsed from a string
  representation using the `parseZonedDateTime`, `parseAbsolute`, or
  `parseAbsoluteToLocal` functions. Use this type to represent an exact moment
  in time at a particular location on Earth.

```jsx {% live=true %}
// import { parseDate } from '@internationalized/date';

let [value, setValue] = React.useState(parseDate('2023-04-14'));

return (
  <Flex gap="large" wrap>
    <DateField
      label="Date (uncontrolled)"
      defaultValue={parseDate('2023-04-14')}
    />
    <DateField label="Date (controlled)" value={value} onChange={setValue} />
  </Flex>
);
```

### Time zones

`DateField` is time zone aware when a
[ZonedDateTime](https://react-spectrum.adobe.com/internationalized/date/ZonedDateTime.html)
object is provided as the value. In this case, the time zone abbreviation is
displayed, and time zone concerns such as daylight saving time are taken into
account when the value is manipulated.

In most cases, your data will come from and be sent to a server as an
[ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) formatted string.
[@internationalized/date](https://react-spectrum.adobe.com/internationalized/date)
includes functions for parsing strings in multiple formats into `ZonedDateTime`
objects. Which format you use will depend on what information you need to store.

- `parseZonedDateTime` – This function parses a date with an explicit time zone
  and optional UTC offset attached (e.g. `"2023-04-14T00:45[Australia/Sydney]"`
  or `"2023-04-14T00:45+10:00[Australia/Sydney]"`). This format preserves the
  maximum amount of information. If the exact local time and time zone that a
  user selected is important, use this format. Storing the time zone and offset
  that was selected rather than converting to UTC ensures that the local time is
  correct regardless of daylight saving rule changes (e.g. if a locale abolishes
  DST). Examples where this applies include calendar events, reminders, and
  other times that occur in a particular location.
- `parseAbsolute` – This function parses an absolute date and time that occurs
  at the same instant at all locations on Earth. It can be represented in UTC
  (e.g. `"2023-04-14T07:45:00Z"`), or stored with a particular offset (e.g.
  `"2023-04-14T07:45:00+10:00"`). A time zone identifier, e.g.
  `Australia/Sydney`, must be passed, and the result will be converted into that
  time zone. Absolute times are the best way to represent events that occurred
  in the past, or future events where an exact time is needed, regardless of
  time zone.
- `parseAbsoluteToLocal` – This function parses an absolute date and time into
  the current user's local time zone. It is a shortcut for `parseAbsolute`, and
  accepts the same formats.

```jsx {% live=true %}
// import { parseZonedDateTime } from '@internationalized/date';

return (
  <DateField
    label="Event date"
    defaultValue={parseZonedDateTime('2023-04-14T07:45[Australia/Sydney]')}
  />
);
```

`DateField` displays times in the time zone included in the `ZonedDateTime`
object. The above example is always displayed in Australian Eastern Standard
Time because the `Australia/Sydney` time zone identifier is provided.
[@internationalized/date](https://react-spectrum.adobe.com/internationalized/date/)
includes functions for converting dates between time zones, or parsing a date
directly into a specific time zone or the user's local time zone, as shown
below.

```jsx {% live=true %}
// import { parseAbsoluteToLocal } from '@internationalized/date';

return (
  <DateField
    label="Event date"
    defaultValue={parseAbsoluteToLocal('2023-04-14T07:45:00Z')}
  />
);
```

### Granularity

The `granularity` prop allows you to control the smallest unit that is displayed
by a `DateField`. By default, `CalendarDate` values are displayed with "day"
granularity (year, month, and day), and `CalendarDateTime` and `ZonedDateTime`
values are displayed with "minute" granularity. More granular time values can be
displayed by setting the granularity prop to "second".

In addition, when a value with a time is provided but you wish to only display
the date, you can set the granularity to `"day"`. This has no effect on the
actual value (it still has a time component), only on what fields are displayed.
In the following example, two DateFields are synchronized with the same value,
but display different granularities.

```jsx {% live=true %}
let [date, setDate] = React.useState(
  parseAbsoluteToLocal('2023-04-14T18:45:22Z')
);

return (
  <Flex gap="large" wrap>
    <DateField
      label="Date and time"
      granularity="second"
      value={date}
      onChange={setDate}
    />
    <DateField label="Date" granularity="day" value={date} onChange={setDate} />
  </Flex>
);
```

If no `value` or `defaultValue` prop is passed, then the `granularity` prop also
affects which type of value is emitted from the `onChange` event. Note that by
default, time values will not have a time zone because none was supplied. You
can override this by setting the `placeholderValue` prop explicitly. Values
emitted from `onChange` will use the time zone of the placeholder value.

```jsx {% live=true %}
// import { now } from '@internationalized/date';

return (
  <Flex gap="large" wrap>
    <DateField label="Event date" granularity="second" />
    <DateField
      label="Event date"
      placeholderValue={now('America/New_York')}
      granularity="second"
    />
  </Flex>
);
```

### International calendars

DateField supports selecting dates in many calendar systems used around the
world, including Gregorian, Hebrew, Indian, Islamic, Buddhist, and more. Dates
are automatically displayed in the appropriate calendar system for the user's
locale. The calendar system can be overridden using the
[Unicode calendar locale extension](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Locale/calendar#adding_a_calendar_in_the_locale_string),
passed to the `Provider` component.

Selected dates passed to `onChange` always use the same calendar system as the
`value` or `defaultValue` prop. If no `value` or `defaultValue` is provided,
then dates passed to `onChange` are always in the Gregorian calendar since this
is the most commonly used. This means that even though the user selects dates in
their local calendar system, applications are able to deal with dates from all
users consistently.

The below example displays a `DateField` in the Hindi language, using the Indian
calendar. Dates emitted from `onChange` are in the Gregorian calendar.

```jsx {% live=true %}
let [date, setDate] = React.useState(null);

return (
  <KeystarProvider locale="hi-IN-u-ca-indian">
    <Grid gap="large">
      <DateField label="Date" value={date} onChange={setDate} />
      <Text>Selected date: {date?.toString()}</Text>
    </Grid>
  </KeystarProvider>
);
```

### Formatting

`DateField` accepts an `onChange` prop which is triggered whenever the date is
edited by the user. The example below uses `onChange` to update a separate
element with a formatted version of the date in the user's locale and local time
zone. This is done by converting the date to a native JavaScript `Date` object
to pass to the formatter.

```jsx {% live=true %}
// import { getLocalTimeZone } from '@internationalized/date';
// import { useDateFormatter } from '@react-aria/i18n';

let [date, setDate] = React.useState(parseDate('1987-04-23'));
let formatter = useDateFormatter({ dateStyle: 'full' });

return (
  <Grid gap="large">
    <DateField label="Birth date" value={date} onChange={setDate} />
    <Text>
      Selected date:{' '}
      {date ? formatter.format(date.toDate(getLocalTimeZone())) : '--'}
    </Text>
  </Grid>
);
```

## Props

### Disabled

A date field can be disabled by setting the `isDisabled` prop. This can be used
to maintain layout continuity and communicate that a field may become available
later.

```jsx {% live=true %}
<DateField label="Date" isDisabled />
```

### Read only

The `isReadOnly` prop makes the field's value immutable. Unlike `isDisabled`,
the field remains focusable.

```jsx {% live=true %}
<DateField label="Date" value={today(getLocalTimeZone())} isReadOnly />
```

### Description

The `description` communicates a hint or helpful information, such as specific
requirements for correctly filling out the field.

```jsx {% live=true %}
<DateField
  label="Publish date"
  description="The post will visible from this date."
/>
```

### Error message

The `errorMessage` communicates validation errors when field requirements aren’t
met. Prompting the user to adjust their input.

```jsx {% live=true %}
// import { today, isWeekend } from '@internationalized/date';
// import { useLocale } from '@react-aria/i18n';

let [date, setDate] = React.useState(today(getLocalTimeZone()));
let { locale } = useLocale();

return (
  <DateField
    label="Appointment date"
    value={date}
    onChange={setDate}
    errorMessage={isWeekend(date, locale) && 'We are closed on weekends.'}
    description="Select a weekday."
  />
);
```

#### Minimum and maximum values

The `minValue` and `maxValue` props can also be used to perform builtin
validation. This displays an invalid state if the user enters an invalid date.
The example below only accepts dates after today.

```jsx {% live=true %}
let minValue = today(getLocalTimeZone());

return (
  <DateField
    label="Appointment date"
    minValue={minValue}
    defaultValue={minValue.subtract({ weeks: 1 })}
  />
);
```

### Placeholder value

When no value is set, a placeholder is shown. The format of the placeholder is
influenced by the `granularity` and `placeholderValue` props. `placeholderValue`
also controls the default values of each segment when the user first interacts
with them, e.g. using the up and down arrow keys. By default, the
`placeholderValue` is the current date at midnight, but you can set it to a more
appropriate value if needed.

```jsx {% live=true %}
// import { CalendarDate } from '@internationalized/date';

return (
  <DateField
    label="Birth date"
    placeholderValue={new CalendarDate(1980, 1, 1)}
  />
);
```

### Hide time zone

When a `ZonedDateTime` object is provided as the value of a `DateField`, the
time zone abbreviation is displayed by default. However, if this is displayed
elsewhere or implicit based on the usecase, it can be hidden using the
`hideTimeZone` prop.

```jsx {% live=true %}
// import { parseZonedDateTime } from '@internationalized/date';

return (
  <DateField
    label="Appointment time"
    defaultValue={parseZonedDateTime('2022-11-07T10:45[America/Los_Angeles]')}
    hideTimeZone
  />
);
```

### Hour cycle

By default, `DateField` displays times in either 12 or 24 hour hour format
depending on the user's locale. However, this can be overridden using the
`hourCycle` prop if needed for a specific usecase. This example forces the
`DateField` to use 24-hour time, regardless of the locale.

```jsx {% live=true %}
<DateField label="Appointment time" granularity="minute" hourCycle={24} />
```
