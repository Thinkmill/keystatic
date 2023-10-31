---
title: Menu
description:
  A menu displays a list of actions or options for the user to choose from.
category: Overlays
---

## Example

On mobile devices, the `Menu` automatically displays in a tray instead of a
popover to improve usability.

```jsx {% live=true %}
<MenuTrigger>
  <ActionButton>Actions</ActionButton>
  <Menu>
    <Item>Edit</Item>
    <Item>Share</Item>
    <Item>Duplicate</Item>
  </Menu>
</MenuTrigger>
```

## Patterns

### Collections

Menu implements `react-stately`
[collection components](https://react-spectrum.adobe.com/react-stately/collections.html),
`<Item>` and `<Section>`.

Static collections, seen in the example above, can be used when the full list of
options is known ahead of time.

Dynamic collections, as shown below, can be used when the options come from an
external data source such as an API call, or update over time. Providing the
data in this way allows the menu to cache the rendering of each item, which
improves performance.

```jsx {% live=true %}
let options = [
  { key: 'edit', name: 'Edit' },
  { key: 'share', name: 'Share' },
  { key: 'duplicate', name: 'Duplicate' },
];

return (
  <MenuTrigger>
    <ActionButton>Actions</ActionButton>
    <Menu label="Animal" items={options} onAction={key => alert(key)}>
      {item => <Item key={item.key}>{item.name}</Item>}
    </Menu>
  </MenuTrigger>
);
```

#### Keys and IDs

Dynamic collections provide an iterable list of `items` to the menu. Each item
accepts a unique `key` prop, which is passed to [the handler](#handlers).

If the item objects contain an `id` property, as shown in the example above,
then this is _used automatically and a **key prop is not required**_.

#### Sections

Use the `<Section>` component to group related items. Each `Section` takes a
`title` and `key` prop.

```jsx {% live=true %}
<MenuTrigger>
  <ActionButton>Animals</ActionButton>
  <Menu>
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
  </Menu>
</MenuTrigger>
```

Sections used with dynamic items are populated from a hierarchical data
structure. Similar to the menu itself, `Section` takes an array of data using
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
  <MenuTrigger>
    <ActionButton>Animals</ActionButton>
    <Menu items={items}>
      {item => (
        <Section key={item.name} items={item.children} title={item.name}>
          {item => <Item>{item.name}</Item>}
        </Section>
      )}
    </Menu>
  </MenuTrigger>
);
```

Sections without a `title` must provide an `aria-label` for accessibility.

### Selection

Enable the selection of items with the `selectionMode` prop. See the
`react-stately`
[selection docs](https://react-spectrum.adobe.com/react-stately/selection.html#selected-key-data-type)
for more information about selection.

Use `defaultSelectedKeys` to provide a default set of selected items
(uncontrolled) and `selectedKeys` to set the selected items (controlled). The
selected keys must match the `key` prop of the items, which will be passed to
the `onSelectionChange` handler when the user selects an item.

```jsx {% live=true %}
let [selected, setSelected] = React.useState(new Set(['center']));

return (
  <Flex direction="column" gap="large" alignItems="start">
    <MenuTrigger>
      <ActionButton>Align</ActionButton>
      <Menu
        selectionMode="single"
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        <Item key="left">Left</Item>
        <Item key="center">Center</Item>
        <Item key="right">Right</Item>
      </Menu>
    </MenuTrigger>
    <Text>Selected keys: {selected}</Text>
  </Flex>
);
```

Set the `selectionMode` to `"multiple"` to allow more than one selection.

```jsx {% live=true %}
let [selected, setSelected] = React.useState(new Set(['category', 'status']));

return (
  <Flex direction="column" gap="large" alignItems="start">
    <MenuTrigger>
      <ActionButton>Columns</ActionButton>
      <Menu
        selectionMode="multiple"
        selectedKeys={selected}
        onSelectionChange={setSelected}
      >
        <Item key="name">Name</Item>
        <Item key="createdAt">Created date</Item>
        <Item key="category">Category</Item>
        <Item key="priority">Priority</Item>
        <Item key="status">Status</Item>
      </Menu>
    </MenuTrigger>
    <Text>Selected keys: {[...selected].join(', ')}</Text>
  </Flex>
);
```

### Links

By default, interacting with an item in a menu triggers `onAction` and
optionally `onSelectionChange` depending on the `selectionMode`. Alternatively,
items may be links to another page or website. This can be achieved by passing
the `href` prop to the `<Item>` component. Link items in a menu are not
selectable.

```jsx {% live=true %}
<MenuTrigger>
  <ActionButton>Monorepo tools</ActionButton>
  <Menu>
    <Item href="https://github.com/changesets/changesets" target="_blank">
      Changesets
    </Item>
    <Item href="https://github.com/Thinkmill/manypkg" target="_blank">
      Manypkg
    </Item>
    <Item href="https://github.com/preconstruct/preconstruct" target="_blank">
      Preconstruct
    </Item>
  </Menu>
</MenuTrigger>
```

### Slots

Icons, keyboard shortcuts and descriptions can be added as `children` of an
item, to better communicate the effect of each option. If a description is
added, the prop `slot="description"` must be used to distinguish it from the
`<Text>` label.

```jsx {% live=true %}
<MenuTrigger>
  <ActionButton>Edit</ActionButton>
  <Menu>
    <Item key="cut" textValue="cut">
      <Icon src={scissorsIcon} />
      <Text>Cut</Text>
      <Kbd meta>X</Kbd>
    </Item>
    <Item key="copy" textValue="copy">
      <Icon src={copyIcon} />
      <Text>Copy</Text>
      <Kbd meta>C</Kbd>
    </Item>
    <Item key="paste" textValue="paste">
      <Icon src={clipboardCopyIcon} />
      <Text>Paste</Text>
      <Kbd meta>V</Kbd>
    </Item>
  </Menu>
</MenuTrigger>
```

## Props

### Actions

When no [selection mode](#selection) is set, or it is set to `"none"` (default),
use the `onAction` callback to handle press events on items.

```jsx {% live=true %}
<MenuTrigger>
  <ActionButton>Actions</ActionButton>
  <Menu onAction={key => alert(key)}>
    <Item key="edit">Edit</Item>
    <Item key="share">Share</Item>
    <Item key="duplicate">Duplicate</Item>
  </Menu>
</MenuTrigger>
```

### Focus

Providing an `autoFocus` prop to the `Menu` sets the focus of a menu item, once
open.

When the [selection mode](#selection) is "single" or "multiple" the first
selected item will be focused by default. You turn off this behaviour by passing
`autoFocus=false` to the menu.

```jsx {% live=true %}
const items = [
  { id: 1, name: 'One' },
  { id: 2, name: 'Two' },
  { id: 3, name: 'Three' },
  { id: 4, name: 'Four' },
  { id: 5, name: 'Five' },
];

return (
  <Flex gap="regular">
    <MenuTrigger>
      <ActionButton>Default</ActionButton>
      <Menu items={items} selectedKeys={[2, 4]} selectionMode="multiple">
        {item => <Item>{item.name}</Item>}
      </Menu>
    </MenuTrigger>
    <MenuTrigger>
      <ActionButton>Off</ActionButton>
      <Menu
        items={items}
        autoFocus={false}
        selectedKeys={[2, 4]}
        selectionMode="multiple"
      >
        {item => <Item>{item.name}</Item>}
      </Menu>
    </MenuTrigger>
    <MenuTrigger>
      <ActionButton>First</ActionButton>
      <Menu items={items} autoFocus="first">
        {item => <Item>{item.name}</Item>}
      </Menu>
    </MenuTrigger>
    <MenuTrigger>
      <ActionButton>Last</ActionButton>
      <Menu items={items} autoFocus="last">
        {item => <Item>{item.name}</Item>}
      </Menu>
    </MenuTrigger>
  </Flex>
);
```

### Disabled

When the trigger element is disabled the menu cannot be invoked.

```jsx {% live=true %}
<MenuTrigger>
  <ActionButton isDisabled>Actions</ActionButton>
  <Menu>
    <Item key="edit">Edit</Item>
    <Item key="share">Share</Item>
    <Item key="duplicate">Duplicate</Item>
  </Menu>
</MenuTrigger>
```

You can also provide `disabledKeys` to limit [selection](#selection).

```jsx {% live=true %}
<MenuTrigger>
  <ActionButton>Columns</ActionButton>
  <Menu
    selectionMode="multiple"
    disabledKeys={['name', 'status']}
    defaultSelectedKeys={['name', 'category', 'status']}
  >
    <Item key="name">Name</Item>
    <Item key="createdAt">Created date</Item>
    <Item key="category">Category</Item>
    <Item key="priority">Priority</Item>
    <Item key="status">Status</Item>
  </Menu>
</MenuTrigger>
```

### Alignment

The `align` prop aligns the menu relative to the trigger, while the `direction`
prop controls the direction the menu will render.

```jsx {% live=true %}
<Flex gap="regular">
  <MenuTrigger align="start">
    <ActionButton>Start</ActionButton>
    <Menu>
      <Item>Platypus</Item>
      <Item>Red-bellied black snake</Item>
      <Item>Saltwater crocodile</Item>
    </Menu>
  </MenuTrigger>
  <MenuTrigger align="end" direction="top" shouldFlip={false}>
    <ActionButton>Top/End</ActionButton>
    <Menu>
      <Item>Platypus</Item>
      <Item>Red-bellied black snake</Item>
      <Item>Saltwater crocodile</Item>
    </Menu>
  </MenuTrigger>
  <MenuTrigger direction="start" align="start">
    <ActionButton>Start/Start</ActionButton>
    <Menu>
      <Item>Platypus</Item>
      <Item>Red-bellied black snake</Item>
      <Item>Saltwater crocodile</Item>
    </Menu>
  </MenuTrigger>
  <MenuTrigger direction="end" align="end">
    <ActionButton>End/End</ActionButton>
    <Menu>
      <Item>Platypus</Item>
      <Item>Red-bellied black snake</Item>
      <Item>Saltwater crocodile</Item>
    </Menu>
  </MenuTrigger>
</Flex>
```
