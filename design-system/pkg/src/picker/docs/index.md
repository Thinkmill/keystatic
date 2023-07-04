---
title: Picker
description:
  Pickers allow users to choose a single option from a collapsible list of
  options when space is limited.
category: Overlays
---

## Example

On mobile devices, `Picker` automatically displays in a tray instead of a
popover to improve usability.

```jsx {% live=true %}
<Picker label="Density">
  <Item key="compact">Compact</Item>
  <Item key="regular">Regular</Item>
  <Item key="spacious">Spacious</Item>
</Picker>
```

## Patterns

### Collections

Picker implements `react-stately`
[collection components](https://react-spectrum.adobe.com/react-stately/collections.html),
`<Item>` and `<Section>`.

Static collections, seen in the example above, can be used when the full list of
options is known ahead of time.

Dynamic collections, as shown below, can be used when the options come from an
external data source such as an API call, or update over time. Providing the
data in this way allows the picker to cache the rendering of each item, which
improves performance.

```jsx {% live=true %}
let options = [
  { id: 1, name: 'Bilby' },
  { id: 2, name: 'Kangaroo' },
  { id: 3, name: 'Quokka' },
  { id: 4, name: 'Echidna' },
  { id: 5, name: 'Dingo' },
  { id: 6, name: 'Cassowary' },
];
let [animalId, setAnimalId] = React.useState();

return (
  <Flex direction="column" gap="large">
    <Picker label="Animal" items={options} onSelectionChange={setAnimalId}>
      {item => <Item>{item.name}</Item>}
    </Picker>
    <Text>Selected ID: {animalId}</Text>
  </Flex>
);
```

#### Keys and IDs

Dynamic collections provide an iterable list of `items` to the picker. Each item
accepts a unique `key` prop, which is passed to the `onSelectionChange` handler
to identify the selected item.

If the item objects contain an `id` property, as shown in the example above,
then this is _used automatically and a **key prop is not required**_.

#### Sections

Use the `<Section>` component to group related items. Each `Section` takes a
`title` and `key` prop.

```jsx {% live=true %}
<Picker label="Animal">
  <Section title="Marsupials">
    <Item key="Bilby">Bilby</Item>
    <Item key="Kangaroo">Kangaroo</Item>
    <Item key="Quokka">Quokka</Item>
  </Section>
  <Section title="Other">
    <Item key="Echidna">Echidna</Item>
    <Item key="Dingo">Dingo</Item>
    <Item key="Cassowary">Cassowary</Item>
  </Section>
</Picker>
```

Sections used with dynamic items are populated from a hierarchical data
structure. Similar to the picker itself, `Section` takes an array of data using
the `items` prop.

```jsx {% live=true %}
let items = [
  {
    name: 'Marsupials',
    children: [
      { id: 1, name: 'Bilby' },
      { id: 2, name: 'Kangaroo' },
      { id: 3, name: 'Quokka' },
    ],
  },
  {
    name: 'Other',
    children: [
      { id: 4, name: 'Echidna' },
      { id: 5, name: 'Dingo' },
      { id: 6, name: 'Cassowary' },
    ],
  },
];

return (
  <Picker
    label="Animal"
    items={items}
    onSelectionChange={selected => alert(selected)}
  >
    {item => (
      <Section key={item.name} items={item.children} title={item.name}>
        {item => <Item>{item.name}</Item>}
      </Section>
    )}
  </Picker>
);
```

### Selection

Setting a selected item can be done by using the `defaultSelectedKey` or
`selectedKey` prop. The selected key corresponds to the key of an item, where
`"id"` is used by default.

See the `react-stately`
[selection docs](https://react-spectrum.adobe.com/react-stately/selection.html#selected-key-data-type)
for more information.

#### Controlled

Use the `selectedKey` the control the value of the picker and watch for changes
with the `onSelectionChange` handler, which accepts the selected item's key as
its only argument.

```jsx {% live=true %}
let items = [
  { name: 'Bilby' },
  { name: 'Kangaroo' },
  { name: 'Quokka' },
  { name: 'Echidna' },
  { name: 'Dingo' },
  { name: 'Cassowary' },
];
let [animal, setAnimal] = React.useState('Quokka');

return (
  <Picker
    label="Animal"
    items={items}
    selectedKey={animal}
    onSelectionChange={setAnimal}
  >
    {item => <Item key={item.name}>{item.name}</Item>}
  </Picker>
);
```

#### Uncontrolled

Use the `defaultSelectedKey` prop for uncontrolled cases.

```jsx {% live=true %}
let items = [
  { name: 'Bilby' },
  { name: 'Kangaroo' },
  { name: 'Quokka' },
  { name: 'Echidna' },
  { name: 'Dingo' },
  { name: 'Cassowary' },
];

return (
  <Picker label="Animal" items={items} defaultSelectedKey="Quokka">
    {item => <Item key={item.name}>{item.name}</Item>}
  </Picker>
);
```

### Slots

Icons and descriptions can be added as `children` of an item, to better
communicate the effect of each option's selection. If a description is added,
the prop `slot="description"` must be used to distinguish it from the primary
`<Text>` label.

```jsx {% live=true %}
<Picker label="Permissions">
  <Item textValue="Read">
    <Icon src={eyeIcon} />
    <Text>Read</Text>
    <Text slot="description">Read only</Text>
  </Item>
  <Item textValue="Write">
    <Icon src={editIcon} />
    <Text>Write</Text>
    <Text slot="description">Read and write</Text>
  </Item>
  <Item textValue="Admin">
    <Icon src={userCheckIcon} />
    <Text>Admin</Text>
    <Text slot="description">Unrestricted access</Text>
  </Item>
</Picker>
```

Extra visual details increase the cognitive load on users. Include additional
elements only when it improves clarity and will contribute positively to the
understanding of an interface.

## Props

### Label

Picker should be labelled using the `label` prop. If a visible label isn't
appropriate, use the `aria-label` prop to identify the control for
accessibility.

```jsx {% live=true %}
<Picker aria-label="Density">
  <Item key="compact">Compact</Item>
  <Item key="regular">Regular</Item>
  <Item key="spacious">Spacious</Item>
</Picker>
```

### Disabled

A picker that `isDisabled` shows that a field exists, but is not currently
available.

```jsx {% live=true %}
<Picker aria-label="Density" isDisabled>
  <Item key="compact">Compact</Item>
  <Item key="regular">Regular</Item>
  <Item key="spacious">Spacious</Item>
</Picker>
```

You can also provide `disabledKeys` to limit [selection](#selection).

```jsx {% live=true %}
<Picker aria-label="Density" disabledKeys={['spacious']}>
  <Item key="compact">Compact</Item>
  <Item key="regular">Regular</Item>
  <Item key="spacious">Spacious</Item>
</Picker>
```

### Required

A picker can be marked as required by setting the `isRequired` prop.

```jsx {% live=true %}
<Picker label="Default currency" isRequired>
  <Item key="AUD">Australian dollar</Item>
  <Item key="GBP">British pound</Item>
  <Item key="JPY">Japanese yen</Item>
</Picker>
```

### Description

The `description` communicates a hint or helpful information, such as specific
requirements for what to choose.

```jsx {% live=true %}
<Picker
  label="Default currency"
  description="Products without an ISO currency code will default to this currency."
>
  <Item key="AUD">Australian dollar</Item>
  <Item key="GBP">British pound</Item>
  <Item key="JPY">Japanese yen</Item>
</Picker>
```

### Error message

The `errorMessage` communicates an error when the selection requirements aren’t
met, prompting the user to adjust what they had originally selected.

```jsx {% live=true %}
<Picker
  label="Default currency"
  errorMessage="You must select a default currency."
  isRequired
  selectedKey={null}
>
  <Item key="AUD">Australian dollar</Item>
  <Item key="GBP">British pound</Item>
  <Item key="JPY">Japanese yen</Item>
</Picker>
```

### Custom widths

The menu will assume the `width` of the invoking trigger, by default.

```jsx {% live=true %}
<Picker label="Density" width="scale.3600">
  <Item key="compact">Compact</Item>
  <Item key="regular">Regular</Item>
  <Item key="spacious">Spacious</Item>
</Picker>
```

The `menuWidth` can be customized. A minimum width restriction will not allow
the menu to be more narrow than the trigger.

```jsx {% live=true %}
<Picker label="Density" menuWidth={320}>
  <Item key="compact">Compact</Item>
  <Item key="regular">Regular</Item>
  <Item key="spacious">Spacious</Item>
</Picker>
```

When wider than the trigger you can `align` the menu, relative to the trigger.

```jsx {% live=true %}
<Picker label="Density" menuWidth={320} align="end">
  <Item key="compact">Compact</Item>
  <Item key="regular">Regular</Item>
  <Item key="spacious">Spacious</Item>
</Picker>
```

### Direction

The menu will "flip" when there isn't enough space to render below the trigger,
by default. You can force the menu's opening `direction` in cases where it
should always render above.

```jsx {% live=true %}
<Picker label="Density" direction="top">
  <Item key="compact">Compact</Item>
  <Item key="regular">Regular</Item>
  <Item key="spacious">Spacious</Item>
</Picker>
```
