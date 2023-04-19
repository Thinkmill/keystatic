---
title: ListView
description:
  Displays a list of interactive items, and allows a user to navigate, select,
  or perform an action.
category: Layout
---

## Example

```jsx {% live=true %}
<ListView aria-label="static list view example" selectionMode="multiple">
  <Item>Bilby</Item>
  <Item>Kangaroo</Item>
  <Item>Echidna</Item>
</ListView>
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
  { id: 1, name: 'Bilby' },
  { id: 2, name: 'Kangaroo' },
  { id: 3, name: 'Quokka' },
  { id: 4, name: 'Echidna' },
  { id: 5, name: 'Dingo' },
  { id: 6, name: 'Cassowary' },
];

return (
  <ListView
    aria-label="list view collection example"
    items={items}
    selectionMode="multiple"
    height="scale.3000"
  >
    {item => <Item>{item.name}</Item>}
  </ListView>
);
```

### Selection

Setting a selected item can be done by using the `defaultSelectedKeys` or
`selectedKeys` prop. The selected key corresponds to the key of an item, where
`"id"` is used by default.

See the `react-stately`
[selection docs](https://react-spectrum.adobe.com/react-stately/selection.html#selected-key-data-type)
for more information.

#### Multiple selection

Use the `selectedKeys` to control the value of the picker and watch for changes
with the `onSelectionChange` handler, which accepts the selected item's key as
its only argument.

Use the `defaultSelectedKeys` prop for uncontrolled cases.

```jsx {% live=true %}
let items = [
  { name: 'Bilby' },
  { name: 'Kangaroo' },
  { name: 'Quokka' },
  { name: 'Echidna' },
  { name: 'Dingo' },
  { name: 'Cassowary' },
];
let [animal, setAnimal] = React.useState(['Kangaroo']);

return (
  <Grid autoFlow="column" gap="large">
    <ListView
      aria-label="controlled selection example"
      selectionMode="multiple"
      items={items}
      selectedKeys={animal}
      onSelectionChange={setAnimal}
    >
      {item => <Item key={item.name}>{item.name}</Item>}
    </ListView>

    <ListView
      aria-label="uncontrolled selection example"
      selectionMode="multiple"
      items={items}
      defaultSelectedKeys={['Echidna']}
    >
      {item => <Item key={item.name}>{item.name}</Item>}
    </ListView>
  </Grid>
);
```

#### Single selection

To limit users to selecting only a single item at a time, `selectionMode` can be
set to `"single"`.

While single selection is enabled it's recomended to improve affordance with the
`selectionStyle` of `"highlight"`.

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
  <ListView
    aria-label="single selection example"
    selectionMode="single"
    selectionStyle="highlight"
    items={items}
  >
    {item => <Item key={item.name}>{item.name}</Item>}
  </ListView>
);
```

### Slots

Complex content can be added as `children` of an item. If a description is
added, the prop `slot="description"` must be used to distinguish it from the
primary `<Text>` label.

```jsx {% live=true %}
<ListView
  selectionMode="multiple"
  aria-label="complex list view items"
  onAction={key => alert(`Action on item ${key}`)}
>
  <Item key="1" textValue="Random Access Memories">
    <Image
      src="https://cdn.lorem.space/images/album/.cache/150x150/random-access-memories_daft-punk.jpg"
      alt="Daft Punk album cover — Random Access Memories"
      aspectRatio="1"
    />
    <Text>Random Access Memories</Text>
    <Text slot="description">Daft Punk</Text>
    <ActionMenu>
      <Item key="edit" textValue="Edit">
        <Icon src={pencilIcon} />
        <Text>Edit</Text>
      </Item>
      <Item key="delete" textValue="Delete">
        <Icon src={trash2Icon} />
        <Text>Delete</Text>
      </Item>
    </ActionMenu>
  </Item>
  <Item key="2" textValue="Nevermind">
    <Image
      src="https://cdn.lorem.space/images/album/.cache/150x150/nevermind_nirvana.jpg"
      alt="Nirvana album cover — Nevermind"
      aspectRatio="1"
    />
    <Text>Nevermind</Text>
    <Text slot="description">Nirvana</Text>
    <ActionMenu>
      <Item key="edit" textValue="Edit">
        <Icon src={pencilIcon} />
        <Text>Edit</Text>
      </Item>
      <Item key="delete" textValue="Delete">
        <Icon src={trash2Icon} />
        <Text>Delete</Text>
      </Item>
    </ActionMenu>
  </Item>
  <Item key="3" textValue="Abbey Road">
    <Image
      src="https://cdn.lorem.space/images/album/.cache/150x150/abbey-road_beatles.jpg"
      alt="Beatles album cover — Abbey Road"
      aspectRatio="1"
    />
    <Text>Abbey Road</Text>
    <Text slot="description">Beatles</Text>
    <ActionMenu>
      <Item key="edit" textValue="Edit">
        <Icon src={pencilIcon} />
        <Text>Edit</Text>
      </Item>
      <Item key="delete" textValue="Delete">
        <Icon src={trash2Icon} />
        <Text>Delete</Text>
      </Item>
    </ActionMenu>
  </Item>
</ListView>
```

## Props

### Density

The amount of vertical padding that each row contains can be modified by
providing the `density` prop.

```jsx {% live=true %}
<Grid autoFlow="column" gap="large">
  <ListView density="compact" aria-label="compact list view example">
    <Item>Bilby</Item>
    <Item>Kangaroo</Item>
    <Item>Echidna</Item>
  </ListView>
  <ListView density="spacious" aria-label="spacious list view example">
    <Item>Bilby</Item>
    <Item>Kangaroo</Item>
    <Item>Echidna</Item>
  </ListView>
</Grid>
```

### Overflow mode

By default, text content that overflows its row will be truncated. You can have
it wrap instead by passing `overflowMode="wrap"` to the list view.

```jsx {% live=true %}
let items = [
  {
    id: 1,
    title: 'There’s an ouch in my pouch',
    description:
      'Willaby Wallaby has an ouch in the pouch and it’s making him grouch!',
  },
  {
    id: 2,
    title: 'E is for Echidna — Australian word book',
    description: 'A great introduction to Australian words.',
  },
  {
    id: 3,
    title: 'Can you cuddle like a Koala?',
    description: 'A book about little animals from around the world.',
  },
];

return (
  <Grid autoFlow={{ tablet: 'column' }} gap="large" maxWidth="scale.5000">
    <ListView
      overflowMode="truncate"
      aria-label="list view truncate example"
      items={items}
    >
      {item => (
        <Item textValue={`${item.title}. ${item.description}`}>
          <Text>{item.title}</Text>
          <Text slot="description">{item.description}</Text>
        </Item>
      )}
    </ListView>
    <ListView
      overflowMode="wrap"
      aria-label="list view wrap example"
      items={items}
    >
      {item => (
        <Item textValue={`${item.title}. ${item.description}`}>
          <Text>{item.title}</Text>
          <Text slot="description">{item.description}</Text>
        </Item>
      )}
    </ListView>
  </Grid>
);
```
