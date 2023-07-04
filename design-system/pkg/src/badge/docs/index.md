---
title: Badge
description:
  A badge is a decorative indicator used to either call attention to an item or
  for communicating non-actionable, supplemental information.
category: Feedback
---

## Example

```jsx {% live=true %}
<Badge>Badge</Badge>
```

## Props

### Tone

Use the `tone` property to indicate the intent of the badge.

```jsx {% live=true %}
<Flex gap="large" wrap>
  <Badge tone="neutral">Neutral</Badge>
  <Badge tone="accent">Accent</Badge>
  <Badge tone="positive">Positive</Badge>
  <Badge tone="caution">Caution</Badge>
  <Badge tone="critical">Critical</Badge>
  <Badge tone="highlight">Highlight</Badge>
  <Badge tone="pending">Pending</Badge>
</Flex>
```

## Patterns

### Numeric badges

Values that exceed hundreds should be abbreviated, using the
[Numeral](/package/typography/numeral) component, to avoid cluttering the
interface.

```jsx {% live=true %}
<Flex gap="large">
  <Badge>
    <Numeral value={1234} abbreviate />
  </Badge>
  <Badge>
    <Numeral value={12345} abbreviate />
  </Badge>
  <Badge>
    <Numeral value={123456} abbreviate />
  </Badge>
  <Badge>
    <Numeral value={1234567} abbreviate />
  </Badge>
</Flex>
```

### Complex children

Icons and text inside badges will inherit the correct gap, size, tone, and
weight.

```jsx {% live=true %}
<Flex gap="large" wrap>
  <Badge tone="critical">
    <Icon src={arrowDownRightIcon} />
    <Text>12%</Text>
  </Badge>
  <Badge tone="positive">
    <Icon src={arrowUpRightIcon} />
    <Text>45%</Text>
  </Badge>
</Flex>
```

## Accessibility

Badges that convey information with icons or color may need to provide
supplemental text. This text is read out by assistive technologies like screen
readers so that users with vision issues can access the meaning of the badge in
context.

### Aria attributes

The `aria-label` and `aria-labelledby` attributes will override the element's
text content.

```tsx {% live=true %}
<Badge tone="critical" aria-label="Trending down: -12%">
  <Icon src={arrowDownRightIcon} />
  <Text>-12%</Text>
</Badge>
```

### Visually hidden

Use the `visuallyHidden` prop on the [Text](/package/typography/text) component
to provide additional information to assistive technologies, without overriding
the other badge content.

```tsx {% live=true %}
<Badge tone="positive">
  <Icon src={arrowUpRightIcon} />
  <Text>
    <Text visuallyHidden>Trending up: </Text> 45%
  </Text>
</Badge>
```

## Best practices

Use badges to highlight an item's status for quick recognition. Badges should
contain short easy-to-scan text.

### Usage

Badges are most effective when:

- Consistent tonal patterns are employed throughout the interface, so users can
  quickly identify their intent.
- Clearly positioned, to identify the object they’re informing or labelling.
  Proximity is key.
- Used sparingly within an interface. Overuse dilutes their importance.

### Labelling

Badge labels should:

- Use sentence case.
- Use a single word to describe the status of an object.
- Rarely use two words, only when describing a _complex state_, e.g. “Partially
  complete”.
