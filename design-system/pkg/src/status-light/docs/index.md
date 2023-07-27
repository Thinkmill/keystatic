---
title: StatusLight
description: Status lights describe the state or condition of an entity.
category: Feedback
---

## Example

```jsx {% live=true %}
<StatusLight>Status light</StatusLight>
```

## Props

### Tone

Use the `tone` prop to indicate the semantic meaning of the status light.

```jsx {% live=true %}
<Flex gap="large" wrap>
  <StatusLight tone="neutral">Neutral</StatusLight>
  <StatusLight tone="accent">Accent</StatusLight>
  <StatusLight tone="positive">Positive</StatusLight>
  <StatusLight tone="caution">Caution</StatusLight>
  <StatusLight tone="critical">Critical</StatusLight>
  <StatusLight tone="pending">Pending</StatusLight>
</Flex>
```

### Label

If no children are provided, an `aria-label` must be specified.

```tsx {% live=true %}
<StatusLight aria-label="Approved" tone="positive" role="status" />
```
