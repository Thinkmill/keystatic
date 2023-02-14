---
title: Combobox
description:
  A combobox combines a text input with a listbox, and allows users to filter a
  list of options.
category: Overlays
---

## Example

On mobile devices, `Combobox` automatically displays in a tray instead of a
popover to improve usability.

```jsx {% live=true %}
<Combobox label="Density">
  <Item key="compact">Compact</Item>
  <Item key="regular">Regular</Item>
  <Item key="spacious">Spacious</Item>
</Combobox>
```

## Patterns

### Collections

Combobox implements `react-stately`
[collection components](https://react-spectrum.adobe.com/react-stately/collections.html),
`<Item>` and `<Section>`.

Static collections, seen in the example above, can be used when the full list of
options is known ahead of time.

Dynamic collections, as shown below, can be used when the options come from an
external data source such as an API call, or update over time. Providing the
data in this way allows the combobox to cache the rendering of each item, which
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
    <Combobox label="Animal" items={options} onSelectionChange={setAnimalId}>
      {item => <Item>{item.name}</Item>}
    </Combobox>
    <Text>Selected ID: {animalId}</Text>
  </Flex>
);
```

#### Keys and IDs

Dynamic collections provide an iterable list of `items` to the combobox. Each
item accepts a unique `key` prop, which is passed to the `onSelectionChange`
handler to identify the selected item.

If the item objects contain an `id` property, as shown in the example above,
then this is _used automatically and a **key prop is not required**_.

#### Sections

Use the `<Section>` component to group related items. Each `Section` takes a
`title` and `key` prop.

```jsx {% live=true %}
<Combobox label="Animal">
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
</Combobox>
```

Sections used with dynamic items are populated from a hierarchical data
structure. Similar to the combobox itself, `Section` takes an array of data
using the `items` prop.

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
  <Combobox
    label="Animal"
    items={items}
    onSelectionChange={selected => alert(selected)}
  >
    {item => (
      <Section key={item.name} items={item.children} title={item.name}>
        {item => <Item>{item.name}</Item>}
      </Section>
    )}
  </Combobox>
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

Use the `selectedKey` the control the value of the combobox and watch for
changes with the `onSelectionChange` handler, which accepts the selected item's
key as its only argument.

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
  <Combobox
    label="Animal"
    items={items}
    selectedKey={animal}
    onSelectionChange={setAnimal}
  >
    {item => <Item key={item.name}>{item.name}</Item>}
  </Combobox>
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
  <Combobox label="Animal" items={items} defaultSelectedKey="Quokka">
    {item => <Item key={item.name}>{item.name}</Item>}
  </Combobox>
);
```

### Slots

Icons and descriptions can be added as `children` of an item, to better
communicate the effect of each option's selection. If a description is added,
the prop `slot="description"` must be used to distinguish it from the primary
`<Text>` label.

```jsx {% live=true %}
<Combobox label="Permissions">
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
</Combobox>
```

Extra visual details increase the cognitive load on users. Include additional
elements only when it improves clarity and will contribute positively to the
understanding of an interface.

## Props

### Label

Combobox should be labelled using the `label` prop. If a visible label isn't
appropriate, use the `aria-label` prop to identify the control for
accessibility.

```jsx {% live=true %}
<Combobox aria-label="Density">
  <Item key="compact">Compact</Item>
  <Item key="regular">Regular</Item>
  <Item key="spacious">Spacious</Item>
</Combobox>
```

### Disabled

A combobox that `isDisabled` shows that a field exists, but is not currently
available.

```jsx {% live=true %}
<Combobox aria-label="Density" isDisabled>
  <Item key="compact">Compact</Item>
  <Item key="regular">Regular</Item>
  <Item key="spacious">Spacious</Item>
</Combobox>
```

You can also provide `disabledKeys` to limit [selection](#selection).

```jsx {% live=true %}
<Combobox aria-label="Density" disabledKeys={['spacious']}>
  <Item key="compact">Compact</Item>
  <Item key="regular">Regular</Item>
  <Item key="spacious">Spacious</Item>
</Combobox>
```

### Read only

The `isReadOnly` prop makes a field's value immutable. Unlike `isDisabled`, the
field remains focusable and the contents can still be copied.

```jsx {% live=true %}
<Combobox aria-label="Density" isReadOnly selectedKey="compact">
  <Item key="compact">Compact</Item>
  <Item key="regular">Regular</Item>
  <Item key="spacious">Spacious</Item>
</Combobox>
```

### Required

A combobox can be marked as required by setting the `isRequired` prop.

```jsx {% live=true %}
<Combobox label="Default currency" isRequired>
  <Item key="AUD">Australian dollar</Item>
  <Item key="GBP">British pound</Item>
  <Item key="JPY">Japanese yen</Item>
</Combobox>
```

### Description

The `description` communicates a hint or helpful information, such as specific
requirements for what to choose.

```jsx {% live=true %}
<Combobox
  label="Default currency"
  description="Products without an ISO currency code will default to this currency."
>
  <Item key="AUD">Australian dollar</Item>
  <Item key="GBP">British pound</Item>
  <Item key="JPY">Japanese yen</Item>
</Combobox>
```

### Error message

The `errorMessage` communicates an error when the selection requirements aren’t
met, prompting the user to adjust what they had originally selected.

```jsx {% live=true %}
<Combobox
  label="Default currency"
  errorMessage="You must select a default currency."
  isRequired
  selectedKey={null}
>
  <Item key="AUD">Australian dollar</Item>
  <Item key="GBP">British pound</Item>
  <Item key="JPY">Japanese yen</Item>
</Combobox>
```

### Custom width

The menu will assume the `width` of the invoking trigger.

```jsx {% live=true %}
<Combobox label="Density" width="auto">
  <Item key="compact">Compact</Item>
  <Item key="regular">Regular</Item>
  <Item key="spacious">Spacious</Item>
</Combobox>
```

### Direction

The menu will "flip" when there isn't enough space to render below the trigger,
by default. You can force the menu's opening `direction` in cases where it
should always render above.

```jsx {% live=true %}
<Combobox label="Density" direction="top">
  <Item key="compact">Compact</Item>
  <Item key="regular">Regular</Item>
  <Item key="spacious">Spacious</Item>
</Combobox>
```
