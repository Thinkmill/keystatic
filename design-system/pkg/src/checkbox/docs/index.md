---
title: Checkbox
description:
  Checkboxes allow users to select multiple values from a list of items, or
  toggle the selection of an individual item on and off.
category: Forms
---

## Example

```jsx {% live=true %}
<Checkbox>Checkbox example</Checkbox>
```

## Props

### Label

Checkboxes accept `children`, which are rendered as the label.

If you do not provide a visible label, you must specify an `aria-label` or
`aria-labelledby` attribute for accessibility.

```jsx
<Checkbox aria-label="This checkbox has no visible label" />
```

### Indeterminate

An indeterminate checkbox is used to represent a group of checkboxes that has a
mix of selected and unselected values.

When a checkbox is indeterminate, it overrides the selection state.

```jsx {% live=true %}
<Checkbox isIndeterminate>Indeterminate</Checkbox>
```

### Disabled

A checkbox in a `disabled` state shows that a selection exists, but is not
available in that circumstance. This can be used to maintain layout continuity
and communicate that an action may become available later.

```jsx {% live=true %}
<Grid gap="regular">
  <Checkbox isDisabled>Not selected</Checkbox>
  <Checkbox isDisabled isSelected>
    Selected
  </Checkbox>
  <Checkbox isDisabled isIndeterminate>
    Indeterminate
  </Checkbox>
</Grid>
```

## Best practices

### Usage

Checkboxes should:

- Work independently from each other: selecting one checkbox shouldn’t change
  the selection status of another checkbox in the same group. The exception is
  when a checkbox is used to make a bulk selection of multiple items.
- Be stacked vertically with adequate spacing between each checkbox. This makes
  it easier for users to scan the list of options.
- Have a visible label when submitted in a form. Only use a checkbox without a
  visible label for ephemeral state changes.

### Labelling

Checkbox labels should:

- Be concise and descriptive, so users should know what will happen if they
  select a checkbox, without the need for additional context.
- Use positive and active wording. Avoid negations such as "Don't send me more
  email", which can be confusing for users.
- Be listed according to a logical order, whether it’s alphabetical, numerical,
  time-based, or some other system.
