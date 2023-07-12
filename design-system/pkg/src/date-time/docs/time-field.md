---
title: TimeField
description:
  TimeFields allow users to enter and edit time values using a keyboard. Each
  part of the time is displayed in an individually editable segment.
category: Date and time
---

## Example

```jsx {% live=true %}
<TimeField label="Time" />
```

## Patterns

### Value

A `TimeField` displays a placeholder by default. An initial, uncontrolled value
can be provided to the `TimeField` using the defaultValue prop. Alternatively, a
controlled value can be provided using the value prop.

Time values are provided using objects in the
[@internationalized/date](https://react-spectrum.adobe.com/internationalized/date/)
package. This library handles correct international date and time manipulation
across calendars, time zones, and other localization concerns.

`TimeField` only supports selecting times, but values with date components are
also accepted. By default, `TimeField` will emit
[Time](https://react-spectrum.adobe.com/internationalized/date/Time.html)
objects in the `onChange` event, but if a
[CalendarDateTime](https://react-spectrum.adobe.com/internationalized/date/CalendarDate.html)
or
[ZonedDateTime](https://react-spectrum.adobe.com/internationalized/date/ZonedDateTime.html)
object is passed as the `value` or `defaultValue`, values of that type will be
emitted, changing only the time and preserving the date components.

```jsx {% live=true %}
// import { Time } from '@internationalized/date';

let [value, setValue] = React.useState(new Time(11, 45));

return (
  <Flex gap="large" wrap>
    <TimeField label="Time (uncontrolled)" defaultValue={new Time(11, 45)} />
    <TimeField label="Time (controlled)" value={value} onChange={setValue} />
  </Flex>
);
```

`Time` values may also be parsed from strings using the `parseTime` function.
This accepts [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601#Times) formatted
time strings such as `"04:45:23.123"`. The `toString` method of a T`ime object
can also be used to convert a time object to a string.

### Time zones

`TimeField` is time zone aware when a `ZonedDateTime` object is provided as the
value. In this case, the time zone abbreviation is displayed, and time zone
concerns such as daylight saving time are taken into account when the value is
manipulated.

In most cases, your data will come from and be sent to a server as an
[ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) formatted string.
[@internationalized/date](<[@internationalized/date](https://react-spectrum.adobe.com/internationalized/date/)>)
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
  <TimeField
    label="Event time"
    defaultValue={parseZonedDateTime('2023-04-14T07:45[Australia/Sydney]')}
  />
);
```

`TimeField` displays times in the time zone included in the `ZonedDateTime`
object. The above example is always displayed in Australian Eastern Standard
Time because the `Australia/Sydney` time zone identifier is provided.
[@internationalized/date](https://react-spectrum.adobe.com/internationalized/date/)
includes functions for converting dates between time zones, or parsing a date
directly into a specific time zone or the user's local time zone, as shown
below.

```jsx {% live=true %}
// import { parseAbsoluteToLocal } from '@internationalized/date';

return (
  <TimeField
    label="Event time"
    defaultValue={parseAbsoluteToLocal('2023-04-14T07:45:00Z')}
  />
);
```

### Granularity

The `granularity` prop allows you to control the smallest unit that is displayed
by a `TimeField`. By default, times are displayed with `"minute"` granularity.
More granular time values can be displayed by setting the `granularity` prop to
`"second"`.

```jsx {% live=true %}
<TimeField
  label="Event time"
  granularity="second"
  defaultValue={parseAbsoluteToLocal('2023-04-14T18:45:22Z')}
/>
```

### Formatting

`TimeField` accepts an `onChange` prop which is triggered whenever the date is
edited by the user. The example below uses `onChange` to update a separate
element with a formatted version of the date in the user's locale and local time
zone. This is done by converting the date to a native JavaScript `Date` object
to pass to the formatter.

```jsx {% live=true %}
// import { parseAbsoluteToLocal } from '@internationalized/date';
// import { useDateFormatter } from '@react-aria/i18n';

let [date, setDate] = React.useState(
  parseAbsoluteToLocal('2021-04-07T18:45:22Z')
);
let formatter = useDateFormatter({ dateStyle: 'long', timeStyle: 'long' });

return (
  <Grid gap="large">
    <TimeField label="Time" value={date} onChange={setDate} />
    <Text>
      Selected date and time: {date ? formatter.format(date.toDate()) : '--'}
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
<TimeField label="Time" isDisabled />
```

### Read only

The `isReadOnly` prop makes the field's value immutable. Unlike `isDisabled`,
the field remains focusable.

```jsx {% live=true %}
<TimeField label="Time" value={new Time(11)} isReadOnly />
```

### Description

The `description` communicates a hint or helpful information, such as specific
requirements for correctly filling out the field.

```jsx {% live=true %}
<TimeField
  label="Publish time"
  description="The post will visible from this date."
/>
```

### Error message

The `errorMessage` communicates validation errors when field requirements aren’t
met. Prompting the user to adjust their input.

```jsx {% live=true %}
let [time, setTime] = React.useState(new Time(9, 15));

return (
  <TimeField
    label="Meeting time"
    value={time}
    onChange={setTime}
    description="Select a meeting time."
    errorMessage={
      time.minute % 15 ? 'Meetings start every 15 minutes.' : undefined
    }
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
// import { Time } from '@internationalized/date';

return <TimeField label="Appointment time" placeholderValue={new Time(9)} />;
```

### Hide time zone

When a `ZonedDateTime` object is provided as the value of a `TimeField`, the
time zone abbreviation is displayed by default. However, if this is displayed
elsewhere or implicit based on the usecase, it can be hidden using the
`hideTimeZone` prop.

```jsx {% live=true %}
// import { parseZonedDateTime } from '@internationalized/date';

return (
  <TimeField
    label="Appointment time"
    defaultValue={parseZonedDateTime('2022-11-07T10:45[America/Los_Angeles]')}
    hideTimeZone
  />
);
```

### Hour cycle

By default, `TimeField` displays times in either 12 or 24 hour hour format
depending on the user's locale. However, this can be overridden using the
`hourCycle` prop if needed for a specific usecase. This example forces the
`TimeField` to use 24-hour time, regardless of the locale.

```jsx {% live=true %}
<TimeField label="Appointment time" granularity="minute" hourCycle={24} />
```
