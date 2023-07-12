---
title: ActionGroup
description:
  Groups multiple related actions in a stack or row to help with arrangement,
  spacing, and selection.
category: Feedback
---

## Example

On mobile devices, the `Menu` automatically displays in a tray instead of a
popover to improve usability.

```jsx {% live=true %}
let [action, setAction] = React.useState();

return (
  <Flex direction="column" gap="large" alignItems="start">
    <ActionGroup onAction={setAction}>
      <Item key="add">Add</Item>
      <Item key="edit">Edit</Item>
      <Item key="delete">Delete</Item>
    </ActionGroup>
    <Text>Action: {action}</Text>
  </Flex>
);
```

## Patterns

### Collections

`ActionGroup` implements the `react-stately`
[collection component](https://react-spectrum.adobe.com/react-stately/collections.html),
`<Item>`.

Static collections, seen in the example above, can be used when the full list of
options is known ahead of time.

Dynamic collections, as shown below, provide an iterable list of `items` to the
component and a render function that returns `Item` elements.

```jsx {% live=true %}
let items = [
  { key: 'add', label: 'Add' },
  { key: 'edit', label: 'Edit' },
  { key: 'delete', label: 'Delete' },
];

return (
  <ActionGroup label="Animal" items={items} onAction={key => alert(key)}>
    {item => <Item key={item.key}>{item.label}</Item>}
  </ActionGroup>
);
```

### Slots

Icons can be added as `children` of an item, to better communicate the intent of
each option.

```jsx {% live=true %}
<ActionGroup>
  <Item key="add" textValue="add">
    <Icon src={plusIcon} />
    <Text>Add</Text>
  </Item>
  <Item key="edit" textValue="edit">
    <Icon src={editIcon} />
    <Text>Edit</Text>
  </Item>
  <Item key="delete" textValue="delete">
    <Icon src={trashIcon} />
    <Text>Delete</Text>
  </Item>
</ActionGroup>
```

When the `buttonLabelBehavior` is set to `"hide"`, the label is hidden and
automatically shown in a tooltip.

```jsx {% live=true %}
<ActionGroup buttonLabelBehavior="hide">
  <Item key="add" textValue="add">
    <Icon src={plusIcon} />
    <Text>Add</Text>
  </Item>
  <Item key="edit" textValue="edit">
    <Icon src={editIcon} />
    <Text>Edit</Text>
  </Item>
  <Item key="delete" textValue="delete">
    <Icon src={trashIcon} />
    <Text>Delete</Text>
  </Item>
</ActionGroup>
```

### Selection

Enable the selection of items with the `selectionMode` prop. See the
`react-stately`
[selection docs](https://react-spectrum.adobe.com/react-stately/selection.html#selected-key-data-type)
for more information about selection.

```jsx {% live=true %}
<ActionGroup selectionMode="single" defaultSelectedKeys={['italic']}>
  <Item key="bold">Bold</Item>
  <Item key="italic">Italic</Item>
  <Item key="underline">Underline</Item>
  <Item key="strikethrough">Strikethrough</Item>
</ActionGroup>
```

Use the `selectedKeys` prop and the `onSelectionChange` handler to control the
selected state of items within the action group.

```jsx {% live=true %}
let [selected, setSelected] = React.useState(new Set(['italic']));
return (
  <ActionGroup
    selectionMode="single"
    selectedKeys={selected}
    onSelectionChange={setSelected}
  >
    <Item key="bold">Bold</Item>
    <Item key="italic">Italic</Item>
    <Item key="underline">Underline</Item>
    <Item key="strikethrough">Strikethrough</Item>
  </ActionGroup>
);
```

Setting the `selectionMode` to `"multiple"` allows more than one selection.

```jsx {% live=true %}
let [selected, setSelected] = React.useState(new Set(['bold', 'italic']));
return (
  <ActionGroup
    selectionMode="multiple"
    selectedKeys={selected}
    onSelectionChange={setSelected}
  >
    <Item key="bold">Bold</Item>
    <Item key="italic">Italic</Item>
    <Item key="underline">Underline</Item>
    <Item key="strikethrough">Strikethrough</Item>
  </ActionGroup>
);
```

### Collapsing

By default, items wrap to form a new line when horizontal space is limited.
However, this can cause content to shift below the group. If items should always
appear in a single line, the `overflowMode` can be set to `"collapse"`. In this
mode, when horizontal space is limited, items will collapse into a
[menu](/package/menu). The exact behavior depends on the
[selection mode](#selection).

#### Standard

When selection is not enabled, `ActionGroup` displays as many items as possible
and collapses the remaining items into a "more actions" menu.

```jsx {% live=true %}
<ActionGroup overflowMode="collapse" maxWidth="scale.2400">
  <Item key="add" textValue="add">
    <Icon src={plusIcon} />
    <Text>Add</Text>
  </Item>
  <Item key="edit" textValue="edit">
    <Icon src={editIcon} />
    <Text>Edit</Text>
  </Item>
  <Item key="copy" textValue="copy">
    <Icon src={copyIcon} />
    <Text>Copy</Text>
  </Item>
  <Item key="delete" textValue="delete">
    <Icon src={trashIcon} />
    <Text>Delete</Text>
  </Item>
</ActionGroup>
```

#### Multi-select

When [selection is enabled](#selection) and space is limited, _all items_ are
collapsed into a menu together. The menu button indicates when one of the
options within it is selected by showing a highlighted state.

A `summaryIcon` should be specified to visually communicate the purpose of the
`ActionGroup` when collapsed, and an `aria-label` should be provided to describe
the group to assistive technology.

```jsx {% live=true %}
<ActionGroup
  aria-label="Text style"
  overflowMode="collapse"
  selectionMode="multiple"
  summaryIcon={<Icon src={typeIcon} />}
  maxWidth="scale.1200"
>
  <Item key="bold" textValue="bold">
    <Icon src={boldIcon} />
    <Text>Bold</Text>
  </Item>
  <Item key="italic" textValue="italic">
    <Icon src={italicIcon} />
    <Text>Italic</Text>
  </Item>
  <Item key="underline" textValue="underline">
    <Icon src={underlineIcon} />
    <Text>Underline</Text>
  </Item>
  <Item key="strikethrough" textValue="strikethrough">
    <Icon src={strikethroughIcon} />
    <Text>Strikethrough</Text>
  </Item>
</ActionGroup>
```

#### Single-select

A special case where a `summaryIcon` is not needed is a single selectable
`ActionGroup` (`selectionMode="single"`) which enforces that an item is always
selected (`disallowEmptySelection`). In this case, the selected item is
displayed inside the menu button when collapsed.

```jsx {% live=true %}
<ActionGroup
  aria-label="Text alignment"
  overflowMode="collapse"
  selectionMode="single"
  defaultSelectedKeys={['left']}
  disallowEmptySelection
  buttonLabelBehavior="hide"
  maxWidth="scale.1200"
>
  <Item key="left" textValue="left">
    <Icon src={alignLeftIcon} />
    <Text>Align Left</Text>
  </Item>
  <Item key="center" textValue="center">
    <Icon src={alignCenterIcon} />
    <Text>Align Center</Text>
  </Item>
  <Item key="right" textValue="right">
    <Text>Align Right</Text>
    <Icon src={alignRightIcon} />
  </Item>
  <Item key="justify" textValue="justify">
    <Icon src={alignJustifyIcon} />
    <Text>Justify</Text>
  </Item>
</ActionGroup>
```

## Props

### Disabled

To disable the entire group, use the `isDisabled` prop.

```jsx {% live=true %}
<ActionGroup isDisabled>
  <Item key="add">Add</Item>
  <Item key="edit">Edit</Item>
  <Item key="delete">Delete</Item>
</ActionGroup>
```

To disable individual items, a list of `disabledKeys` can be provided.

```jsx {% live=true %}
<ActionGroup disabledKeys={['add', 'delete']}>
  <Item key="add">Add</Item>
  <Item key="edit">Edit</Item>
  <Item key="delete">Delete</Item>
</ActionGroup>
```

### Prominence

By default, buttons have a background and border, which works well to separate
buttons from surrounding content. Low `prominence` buttons have no "chrome"
until they’re interacted with.

```jsx {% live=true %}
<ActionGroup prominence="low">
  <Item key="add">Add</Item>
  <Item key="edit">Edit</Item>
  <Item key="delete">Delete</Item>
</ActionGroup>
```

High prominence buttons should be used sparingly and in isolation, so they are
not supported in groups.

### Density

The `density` prop affects the gap between items. In the default case the
borders of neighbouring buttons are merged, making them contiguous.

```jsx {% live=true %}
<ActionGroup density="compact">
  <Item key="add">Add</Item>
  <Item key="edit">Edit</Item>
  <Item key="delete">Delete</Item>
</ActionGroup>
```

Low `prominence` groups have a reduced gap between each button.

```jsx {% live=true %}
<ActionGroup density="compact" prominence="low">
  <Item key="add">Add</Item>
  <Item key="edit">Edit</Item>
  <Item key="delete">Delete</Item>
</ActionGroup>
```

### Justified

The `isJustified` prop will divide the available horizontal space evenly among
the buttons.

```jsx {% live=true %}
<ActionGroup isJustified width="scale.3600">
  <Item key="add">Add</Item>
  <Item key="edit">Edit</Item>
  <Item key="delete">Delete</Item>
</ActionGroup>
```
