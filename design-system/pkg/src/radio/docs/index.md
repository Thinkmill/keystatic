---
title: RadioGroup
description:
  Radio buttons allow users to select a single option from a list of mutually
  exclusive options.
category: Forms
---

## Example

```jsx {% live=true %}
<RadioGroup label="Favourite marsupial">
  <Radio value="bilby">Bilby</Radio>
  <Radio value="kangaroo">Kangaroo</Radio>
  <Radio value="quokka">Quokka</Radio>
</RadioGroup>
```

## Patterns

`RadioGroup` accepts multiple `Radio` elements as children. Each `Radio`
represents an option that can be selected, labeled by its children.

**Note:** A `Radio` cannot be used outside of a `RadioGroup`.

### Label

Each `RadioGroup` should be labelled using the `label` prop. If a visible label
isn't appropriate, use the `aria-label` prop to identify the control for
accessibility.

```jsx {% live=true %}
<RadioGroup aria-label="Favourite marsupial">
  <Radio value="bilby">Bilby</Radio>
  <Radio value="kangaroo">Kangaroo</Radio>
  <Radio value="quokka">Quokka</Radio>
</RadioGroup>
```

Custom labels should be wrapped with the [Text](/package/typography/text)
component.

```jsx {% live=true %}
<RadioGroup aria-label="Favourite marsupial">
  <Radio value="bilby">
    <Text>Bilby label text, with multiple paragraphs.</Text>
    <Text slot="description">
      Secondary text can be used to clarify the primary label.
    </Text>
  </Radio>
  <Radio value="kangaroo">Kangaroo</Radio>
  <Radio value="quokka">Quokka</Radio>
</RadioGroup>
```

### Value

`RadioGroup` only allows single selection. An initial, uncontrolled value can be
provided to the `RadioGroup` using the `defaultValue` prop. Alternatively, a
controlled value can be provided using the `value` and `onChange` props.

```jsx {% live=true %}
const [selected, setSelected] = React.useState('bilby');

return (
  <Grid autoFlow="column">
    <RadioGroup label="Favourite marsupial" defaultValue="bilby">
      <Radio value="bilby">Bilby</Radio>
      <Radio value="kangaroo">Kangaroo</Radio>
      <Radio value="quokka">Quokka</Radio>
    </RadioGroup>
    <RadioGroup
      label="Favourite marsupial"
      onChange={setSelected}
      value={selected}
    >
      <Radio value="bilby">Bilby</Radio>
      <Radio value="kangaroo">Kangaroo</Radio>
      <Radio value="quokka">Quokka</Radio>
    </RadioGroup>
  </Grid>
);
```

## Props

### Orientation

Radio groups are vertically oriented by default. The `orientation` prop can be
used to change the orientation to "horizontal".

```jsx {% live=true %}
<RadioGroup label="Favourite marsupial" orientation="horizontal">
  <Radio value="bilby">Bilby</Radio>
  <Radio value="kangaroo">Kangaroo</Radio>
  <Radio value="quokka">Quokka</Radio>
</RadioGroup>
```

### Disabled

A radio group that `isDisabled` shows that a field exists, but is not currently
available.

```jsx {% live=true %}
<RadioGroup label="Favourite marsupial" isDisabled>
  <Radio value="bilby">Bilby</Radio>
  <Radio value="kangaroo">Kangaroo</Radio>
  <Radio value="quokka">Quokka</Radio>
</RadioGroup>
```

You can also provide the `isDisabled` prop to individual radio buttons.

```jsx {% live=true %}
<RadioGroup label="Favourite marsupial">
  <Radio value="bilby">Bilby</Radio>
  <Radio value="kangaroo" isDisabled>
    Kangaroo
  </Radio>
  <Radio value="quokka">Quokka</Radio>
</RadioGroup>
```

### Required

A `RadioGroup` can be marked as required by setting the `isRequired` prop.

```jsx {% live=true %}
<RadioGroup label="Favourite marsupial" isRequired>
  <Radio value="bilby">Bilby</Radio>
  <Radio value="kangaroo">Kangaroo</Radio>
  <Radio value="quokka">Quokka</Radio>
</RadioGroup>
```

### Description

The `description` communicates a hint or helpful information, such as specific
requirements for what to choose.

```jsx {% live=true %}
<RadioGroup
  label="Favourite marsupial"
  description="Even though this is an extremely limited selection, please choose your favourite."
>
  <Radio value="bilby">Bilby</Radio>
  <Radio value="kangaroo">Kangaroo</Radio>
  <Radio value="quokka">Quokka</Radio>
</RadioGroup>
```

### Error message

The `errorMessage` communicates an error when the selection requirements aren’t
met, prompting the user to adjust what they had originally selected.

```jsx {% live=true %}
<RadioGroup
  label="Favourite marsupial"
  errorMessage="Please choose your favourite."
  isRequired
  value=""
>
  <Radio value="bilby">Bilby</Radio>
  <Radio value="kangaroo">Kangaroo</Radio>
  <Radio value="quokka">Quokka</Radio>
</RadioGroup>
```
