---
title: Switch
description:
  Switches allow users to toggle a discrete option on or off. They are usually
  used to activate or deactivate a specific setting.
category: Forms
---

## Example

```jsx {% live=true %}
<Switch>Autosave</Switch>
```

## Patterns

### Content

Switches are best used for communicating activation (e.g. on/off states), while
[checkboxes](/package/checkbox) are best used for communicating selection (e.g.
multiple table rows). Switches, unlike checkboxes, can't have an error state.

If a visible label isn't specified, an `aria-label` must be provided to the
switch for accessibility. If the field is labeled by a separate element, an
`aria-labelledby` prop must be provided using the id of the labeling element
instead.

```jsx {% live=true %}
<Switch aria-label="This switch has no visible label" />
```

### Value

Switches are not selected by default. The `defaultSelected` prop can be used to
set the default state (uncontrolled).

Alternatively, the `isSelected` prop can be used to control the selected state.
Listen to changes with the `onChange` prop, triggered whenever the switch is
toggled.

```jsx {% live=true %}
let [selected, setSelection] = React.useState(false);

return (
  <Flex gap="large" wrap>
    <Switch defaultSelected>Low power mode (uncontrolled)</Switch>

    <Switch isSelected={selected} onChange={setSelection}>
      Low power mode (controlled)
    </Switch>
  </Flex>
);
```

## Props

### Disabled

A switch in a `disabled` state shows that a selection exists, but is not
available in that circumstance. This can be used to maintain layout continuity
and communicate that an action may become available later.

```jsx {% live=true %}
<Grid gap="regular">
  <Switch isDisabled>Not selected</Switch>
  <Switch isDisabled isSelected>
    Selected
  </Switch>
</Grid>
```

### Prominence

Low prominence switches are for instances with secondary or tertiary controls,
which shouldn't distract focus from the primary content.

```jsx {% live=true %}
<Switch prominence="low" defaultSelected>
  Low prominence
</Switch>
```

### Size

Small toggles are often used in condensed spaces and appear inline with other
components or content. They can be used in conjunction with "low" prominence to
further reduce their visual impact within an interface.

```jsx {% live=true %}
<Switch size="small" defaultSelected>
  Small size
</Switch>
```

## Best practices

### Usage

A switch allows the user to choose between two mutually exclusive options.
Toggling the value should produce an _immediate_ result; `Switch` is
innapropriate within a form context where submission is a separate event. For
example, if the user must click a "Submit", "Next", or "Okay" button to apply
changes, use a [checkbox](/package/checkbox).

Each switch should be considered a solitary, standalone option. For multiple,
related choices, use [checkboxes](/package/checkbox-group) or
[radio group](/package/radio) instead.

### Labelling

Keep descriptive text short and concise—two to four words; preferably nouns. A
verb isn’t usually needed to communicate the thing being turned on or off, but
there can be instances where phrasing the label as a verb can aid in clarity.
