---
title: ProgressBar
description:
  The progress bar is used to visually represent the completion of a task or
  operation, indicating how much of the task has been completed and how much is
  still left.
category: Feedback
---

## Example

```jsx {% live=true %}
<ProgressBar label="Loading…" value={40} />
```

## Props

### Value

ProgressBars are controlled with the `value` prop. By default, the `value` prop
represents the current percentage of progress, as the minimum and maxiumum
values default to 0 and 100, respectively.

```jsx {% live=true %}
<ProgressBar label="Loading…" value={60} />
```

#### Min/Max

Alternatively, a different scale can be used by setting the `minValue` and
`maxValue` props.

```jsx {% live=true %}
<ProgressBar label="Loading…" minValue={50} maxValue={150} value={80} />
```

#### Formatting

Values are formatted as a percentage by default, but this can be modified by
using the `formatOptions` prop to specify a different format. `formatOptions` is
compatible with the option parameter of
[Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat)
and is applied based on the current locale.

```jsx {% live=true %}
<ProgressBar
  label="Loading…"
  formatOptions={{ style: 'currency', currency: 'AUD' }}
  value={80}
/>
```

### Indeterminate

By default, the `ProgressBar` is determinate; when progress can be calculated
against a specific goal. Use the `isIndeterminate` prop when progress is
happening but the time or effort to completion can’t be determined.

```jsx {% live=true %}
<ProgressBar label="Reconnecting…" isIndeterminate />
```

### Labelling

Labels and values are shown by default, but they can be hidden as needed. Use
the `showValueLabel` prop to hide the value, and instead provide an `aria-label`
attribute for a visually hidden label.

```jsx {% live=true %}
<Grid columns={{ tablet: 'repeat(3, 1fr)' }} gap="large" alignItems="end">
  <ProgressBar width={{ tablet: '100%' }} label="Processing…" value={20} />
  <ProgressBar
    width={{ tablet: '100%' }}
    label="Processing…"
    value={40}
    showValueLabel={false}
  />
  <ProgressBar width={{ tablet: '100%' }} aria-label="Processing…" value={60} />
</Grid>
```

By default, the value label is formatted as a percentage, but can be customised
with the `valueLabel` and [formatOptions](#formatting) props.

```jsx {% live=true %}
<ProgressBar
  label="Uploading…"
  valueLabel="12 of 17 files"
  value={12}
  maxValue={17}
/>
```
