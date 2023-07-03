---
title: ProgressCircle
description:
  Shows the progression of a system operation such as downloading, uploading,
  processing, etc. in a visual way.
category: Feedback
---

## Example

```jsx {% live=true %}
<ProgressCircle aria-label="Loading…" value={40} />
```

## Props

### Value

ProgressCircles are controlled with the `value` prop. By default, the `value`
prop represents the current percentage of progress, as the minimum and maxiumum
values default to 0 and 100, respectively.

```jsx {% live=true %}
<ProgressCircle aria-label="Loading…" value={60} />
```

#### Min/Max

Alternatively, a different scale can be used by setting the `minValue` and
`maxValue` props.

```jsx {% live=true %}
<ProgressCircle aria-label="Loading…" minValue={50} maxValue={150} value={80} />
```

### Indeterminate

By default, the `ProgressCircle` is determinate; when progress can be calculated
against a specific goal. Use the `isIndeterminate` prop when progress is
happening but the time or effort to completion can’t be determined.

```jsx {% live=true %}
<ProgressCircle aria-label="Loading…" isIndeterminate />
```

### Size

Progress circles come in 3 sizes, to fit various contexts. For example, the
small progress circle can be used in place of an icon or in tight spaces, while
the large variant can be used for full-page loading.

```jsx {% live=true %}
<Flex gap="medium" alignItems="baseline">
  <ProgressCircle aria-label="Loading…" value={20} size="small" />
  <ProgressCircle aria-label="Loading…" value={40} size="medium" />
  <ProgressCircle aria-label="Loading…" value={60} size="large" />
</Flex>
```
