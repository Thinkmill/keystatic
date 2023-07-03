---
title: Meter
description:
  Meters are visual representations of a quantity or an achievement. Their
  progress is determined by user actions, rather than system actions.
category: Feedback
---

## Example

```jsx {% live=true %}
<Meter label="Storage" value={40} />
```

## Props

### Value

Meters are controlled with the `value` prop. By default, the `value` prop
represents the current percentage of progress, as the minimum and maxiumum
values default to 0 and 100, respectively.

```jsx {% live=true %}
<Meter label="Storage" value={60} />
```

#### Min/Max

Alternatively, a different scale can be used by setting the `minValue` and
`maxValue` props.

```jsx {% live=true %}
<Meter label="Storage" minValue={50} maxValue={150} value={80} />
```

#### Formatting

Values are formatted as a percentage by default, but this can be modified by
using the `formatOptions` prop to specify a different format. `formatOptions` is
compatible with the option parameter of
[Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat)
and is applied based on the current locale.

```jsx {% live=true %}
<Meter
  label="Storage"
  formatOptions={{ style: 'unit', unit: 'gigabyte' }}
  value={32}
/>
```

### Tone

Use tones to add additional semantic meaning to the value value as it progresses
over time.

Used to represent a neutral or _non-semantic_ value, e.g. the number of sections
completed.

#### Positive

Used to represent a positive semantic value, e.g. when there’s a lot of space
remaining.

```jsx {% live=true %}
<Meter label="Storage" tone="positive" value={12} />
```

#### Caution

Used to warn users about a situation that may need to be addressed soon, e.g.
when space remaining is becoming limited.

```jsx {% live=true %}
<Meter label="Storage" tone="caution" value={83} />
```

#### Critical

Used to warn users about a critical situation that needs their urgent attention,
e.g. when space remaining is becoming very limited.

```jsx {% live=true %}
<Meter label="Storage" tone="critical" value={94} />
```

### Labelling

By default, the value label is formatted as a percentage, but can be customised
with the `valueLabel` and [formatOptions](#formatting) props.

```jsx {% live=true %}
<Meter label="Sections completed" valueLabel="1 of 4" value={1} maxValue={4} />
```
