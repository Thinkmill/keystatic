---
title: Tabs
description:
  Tabs organise related content into multiple sections. They allow the user to
  navigate between groups of information that appear within the same context.
category: Navigation
---

## Example

```jsx {% live=true %}
<Tabs aria-label="Tabs example">
  <TabList>
    <Item key="all">All items</Item>
    <Item key="pending">Pending</Item>
    <Item key="complete">Complete</Item>
  </TabList>
  <Divider marginBottom="large" />
  <TabPanels>
    <Item key="all">
      <Text>All panel</Text>
    </Item>
    <Item key="pending">
      <Text>Pending panel</Text>
    </Item>
    <Item key="complete">
      <Text>Complete panel</Text>
    </Item>
  </TabPanels>
</Tabs>
```

## Patterns

### Collections

Tabs implements `react-stately`
[collection components](https://react-spectrum.adobe.com/react-stately/collections.html),
`<Item>`.

Static collections, seen in the example above, can be used when the full list of
tabs is known ahead of time.

Dynamic collections, as shown below, can be used when the tabs come from an
external data source such as an API call, or update over time. Providing the
data in this way allows `Tabs` to cache the rendering of each item, which
improves performance.

```jsx {% live=true %}
let tabs = [
  { key: 'comment', name: 'Comment' },
  { key: 'inspect', name: 'Inspect' },
  { key: 'export', name: 'Export' },
];

return (
  <Tabs aria-label="Tabs collection example" items={tabs}>
    <TabList>{item => <Item key={item.key}>{item.name}</Item>}</TabList>
    <Divider marginBottom="large" />
    <TabPanels>
      {item => (
        <Item key={item.key}>
          <Text>{item.name} panel</Text>
        </Item>
      )}
    </TabPanels>
  </Tabs>
);
```

#### Keys and IDs

Dynamic collections provide an iterable list of `items` to the picker. Each item
accepts a unique `key` prop, which is passed to the `onSelectionChange` handler
to identify the selected item. If the item objects contain an `id` property it
is used automatically and a key prop is not required.

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
let tabs = [
  { key: 'comment', name: 'Comment' },
  { key: 'inspect', name: 'Inspect' },
  { key: 'export', name: 'Export' },
];
let [selectedTab, setSelectedTab] = React.useState(tabs[1].key);

return (
  <Tabs
    aria-label="Tabs controlled selection example"
    items={tabs}
    selectedKey={selectedTab}
    onSelectionChange={setSelectedTab}
  >
    <TabList>{item => <Item key={item.key}>{item.name}</Item>}</TabList>
    <Divider marginBottom="large" />
    <TabPanels>
      {item => (
        <Item key={item.key}>
          <Text>{item.name} panel</Text>
        </Item>
      )}
    </TabPanels>
  </Tabs>
);
```

#### Uncontrolled

Use the `defaultSelectedKey` prop for uncontrolled cases.

```jsx {% live=true %}
let tabs = [
  { key: 'comment', name: 'Comment' },
  { key: 'inspect', name: 'Inspect' },
  { key: 'export', name: 'Export' },
];

return (
  <Tabs
    aria-label="Tabs uncontrolled selection example"
    items={tabs}
    defaultSelectedKey={tabs[1].key}
  >
    <TabList>{item => <Item key={item.key}>{item.name}</Item>}</TabList>
    <Divider marginBottom="large" />
    <TabPanels>
      {item => (
        <Item key={item.key}>
          <Text>{item.name} panel</Text>
        </Item>
      )}
    </TabPanels>
  </Tabs>
);
```

### Slots

Icons can be added as `children` of an item, to better communicate intent.

```jsx {% live=true %}
<Tabs aria-label="Tabs icons example">
  <TabList>
    <Item key="read">
      <Icon src={eyeIcon} />
      <Text>Read</Text>
    </Item>
    <Item key="write">
      <Icon src={editIcon} />
      <Text>Write</Text>
    </Item>
    <Item key="admin">
      <Icon src={userCheckIcon} />
      <Text>Admin</Text>
    </Item>
  </TabList>
  <Divider marginBottom="large" />
  <TabPanels>
    <Item key="read">
      <Text>Read only</Text>
    </Item>
    <Item key="write">
      <Text>Read and write</Text>
    </Item>
    <Item key="admin">
      <Text>Unrestricted access</Text>
    </Item>
  </TabPanels>
</Tabs>
```

Extra visual details increase the cognitive load on users. Include additional
elements only when it improves clarity and will contribute positively to the
understanding of an interface.

## Props

### Prominence

The `prominence` of the tabs influences their visual weight. Tabs with "low"
prominence have a more subtle indicator that shows the selected tab item. These
should be used as sub-level navigation or for containers.

```jsx {% live=true %}
<Tabs aria-label="Tabs prominence example" prominence="low">
  <TabList>
    <Item key="all">All items</Item>
    <Item key="pending">Pending</Item>
    <Item key="complete">Complete</Item>
  </TabList>
  <Divider marginBottom="large" />
  <TabPanels>
    <Item key="all">
      <Text>All panel</Text>
    </Item>
    <Item key="pending">
      <Text>Pending panel</Text>
    </Item>
    <Item key="complete">
      <Text>Complete panel</Text>
    </Item>
  </TabPanels>
</Tabs>
```

### Disabled

Provide `disabledKeys` to disable individual tabs. This state can be used to
maintain layout continuity and to communicate that the tab item may become
available later.

```jsx {% live=true %}
<Tabs aria-label="Tabs disabled example" disabledKeys={['val-2', 'val-3']}>
  <TabList>
    <Item key="val-1">Tab 1</Item>
    <Item key="val-2">Tab 2</Item>
    <Item key="val-3">Tab 3</Item>
    <Item key="val-4">Tab 4</Item>
  </TabList>
  <Divider marginBottom="large" />
  <TabPanels>
    <Item key="val-1">
      <Text>Panel 1</Text>
    </Item>
    <Item key="val-2">
      <Text>Panel 2</Text>
    </Item>
    <Item key="val-3">
      <Text>Panel 3</Text>
    </Item>
    <Item key="val-4">
      <Text>Panel 4</Text>
    </Item>
  </TabPanels>
</Tabs>
```

You can also disable the entire `Tabs` component with the `isDisabled` prop.
However this is uncommon and would only be appropriate, for instance, during a
busy state of the application.

```jsx {% live=true %}
<Tabs aria-label="Tabs disabled example" isDisabled>
  <TabList>
    <Item key="val-1">Tab 1</Item>
    <Item key="val-2">Tab 2</Item>
    <Item key="val-3">Tab 3</Item>
  </TabList>
  <Divider marginBottom="large" />
  <TabPanels>
    <Item key="val-1">
      <Text>Panel 1</Text>
    </Item>
    <Item key="val-2">
      <Text>Panel 2</Text>
    </Item>
    <Item key="val-3">
      <Text>Panel 3</Text>
    </Item>
  </TabPanels>
</Tabs>
```

### Orientation

Vertical tabs should be used when horizontal space is more generous and when the
list of sections is greater than can be presented to the user in a horizontal
format.

```jsx {% live=true %}
<Tabs
  aria-label="Tabs orientation example"
  orientation="vertical"
  prominence="low"
>
  <TabList>
    <Item key="all">All items</Item>
    <Item key="pending">Pending</Item>
    <Item key="complete">Complete</Item>
  </TabList>
  <Divider marginEnd="large" orientation="vertical" />
  <TabPanels>
    <Item key="all">
      <Text>All panel</Text>
    </Item>
    <Item key="pending">
      <Text>Pending panel</Text>
    </Item>
    <Item key="complete">
      <Text>Complete panel</Text>
    </Item>
  </TabPanels>
</Tabs>
```

## Accessibility

While an `aria-label` is not explicitly required for a tab list, `Tabs` should
be labeled using a `aria-label` in the absence of an ancestor
[landmark](https://www.w3.org/WAI/GL/wiki/Using_ARIA_landmarks_to_identify_regions_of_a_page).
This will prevent screen readers from announcing non-focused tabs, allowing for
a more focused experience.

## Best practices

Tabs are used to group different but related content, allowing users to navigate
views without leaving the page. They always contain at least two items and one
tab is active at a time. Tabs can be used in full page layouts or in components
such as dialogs or cards.

Tabs should:

- Represent the same kind of content, such as a list-view with different filters
  applied. Don’t use tabs to group content that is dissimilar.
- Not force users to jump back and forth to do a single task. Users should be
  able to complete their work and find what they need under each tab.
- Not be used for primary navigation.
