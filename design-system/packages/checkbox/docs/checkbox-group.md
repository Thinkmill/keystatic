---
title: CheckboxGroup
description:
  A checkbox group allows users to select one or more items from a list of
  choices.
category: Forms
---

## Example

```jsx {% live=true %}
<CheckboxGroup label="Favourite marsupials">
  <Checkbox value="bilby">Bilby</Checkbox>
  <Checkbox value="kangaroo">Kangaroo</Checkbox>
  <Checkbox value="quokka">Quokka</Checkbox>
</CheckboxGroup>
```

## Patterns

`CheckboxGroup` accepts multiple `Checkbox` elements as children. Each
`Checkbox` represents an option that can be selected, labeled by its children.

**Note:** A `Checkbox` cannot be used outside of a `CheckboxGroup`.

### Label

Each `CheckboxGroup` should be labelled using the `label` prop. If a visible
label isn't appropriate, use the `aria-label` prop to identify the control for
accessibility.

```jsx {% live=true %}
<CheckboxGroup aria-label="Favourite marsupials">
  <Checkbox value="bilby">Bilby</Checkbox>
  <Checkbox value="kangaroo">Kangaroo</Checkbox>
  <Checkbox value="quokka">Quokka</Checkbox>
</CheckboxGroup>
```

Custom labels should be wrapped with the [Text](/package/typography/text)
component.

```jsx {% live=true %}
<CheckboxGroup aria-label="Favourite marsupials">
  <Checkbox value="bilby">
    <Text>Bilby label text, with multiple paragraphs.</Text>
    <Text slot="description">
      Secondary text can be used to clarify the primary label.
    </Text>
  </Checkbox>
  <Checkbox value="kangaroo">Kangaroo</Checkbox>
  <Checkbox value="quokka">Quokka</Checkbox>
</CheckboxGroup>
```

### Value

`CheckboxGroup` only allows single selection. An initial, uncontrolled value can
be provided to the `CheckboxGroup` using the `defaultValue` prop. Alternatively,
a controlled value can be provided using the `value` and `onChange` props.

```jsx {% live=true %}
const [selected, setSelected] = React.useState(['bilby']);

return (
  <Grid autoFlow="column">
    <CheckboxGroup label="Favourite marsupials" defaultValue={['bilby']}>
      <Checkbox value="bilby">Bilby</Checkbox>
      <Checkbox value="kangaroo">Kangaroo</Checkbox>
      <Checkbox value="quokka">Quokka</Checkbox>
    </CheckboxGroup>
    <CheckboxGroup
      label="Favourite marsupials"
      onChange={setSelected}
      value={selected}
    >
      <Checkbox value="bilby">Bilby</Checkbox>
      <Checkbox value="kangaroo">Kangaroo</Checkbox>
      <Checkbox value="quokka">Quokka</Checkbox>
    </CheckboxGroup>
  </Grid>
);
```

## Props

### Orientation

Checkbox groups are vertically oriented by default. The `orientation` prop can
be used to change the orientation to "horizontal".

```jsx {% live=true %}
<CheckboxGroup label="Favourite marsupials" orientation="horizontal">
  <Checkbox value="bilby">Bilby</Checkbox>
  <Checkbox value="kangaroo">Kangaroo</Checkbox>
  <Checkbox value="quokka">Quokka</Checkbox>
</CheckboxGroup>
```

### Disabled

A radio group that `isDisabled` shows that a field exists, but is not currently
available.

```jsx {% live=true %}
<CheckboxGroup label="Favourite marsupials" isDisabled>
  <Checkbox value="bilby">Bilby</Checkbox>
  <Checkbox value="kangaroo">Kangaroo</Checkbox>
  <Checkbox value="quokka">Quokka</Checkbox>
</CheckboxGroup>
```

You can also provide the `isDisabled` prop to individual radio buttons.

```jsx {% live=true %}
<CheckboxGroup label="Favourite marsupials">
  <Checkbox value="bilby">Bilby</Checkbox>
  <Checkbox value="kangaroo" isDisabled>
    Kangaroo
  </Checkbox>
  <Checkbox value="quokka">Quokka</Checkbox>
</CheckboxGroup>
```

### Required

A `CheckboxGroup` can be marked as required by setting the `isRequired` prop.

```jsx {% live=true %}
<CheckboxGroup label="Favourite marsupials" isRequired>
  <Checkbox value="bilby">Bilby</Checkbox>
  <Checkbox value="kangaroo">Kangaroo</Checkbox>
  <Checkbox value="quokka">Quokka</Checkbox>
</CheckboxGroup>
```

### Description

The `description` communicates a hint or helpful information, such as specific
requirements for what to choose.

```jsx {% live=true %}
<CheckboxGroup
  label="Favourite marsupials"
  description="Even though this is an extremely limited selection, please choose your favourites."
>
  <Checkbox value="bilby">Bilby</Checkbox>
  <Checkbox value="kangaroo">Kangaroo</Checkbox>
  <Checkbox value="quokka">Quokka</Checkbox>
</CheckboxGroup>
```

### Error message

The `errorMessage` communicates an error when the selection requirements aren’t
met, prompting the user to adjust what they had originally selected.

```jsx {% live=true %}
<CheckboxGroup
  label="Favourite marsupials"
  errorMessage="Please choose your favourites."
  isRequired
  value=""
>
  <Checkbox value="bilby">Bilby</Checkbox>
  <Checkbox value="kangaroo">Kangaroo</Checkbox>
  <Checkbox value="quokka">Quokka</Checkbox>
</CheckboxGroup>
```
