---
title: Breadcrumbs
description:
  Breadcrumbs show hierarchy and navigational context for a user’s location
  within an application.
category: Navigation
---

## Example

```jsx {% live=true %}
<Breadcrumbs>
  <Item key="dashboard">Dashboard</Item>
  <Item key="posts">Posts</Item>
  <Item key="some-post-title">Some post title</Item>
</Breadcrumbs>
```

## Patterns

### Collections

Breadcrumbs implements `react-stately`
[collection components](https://react-spectrum.adobe.com/react-stately/collections.html),
accepting only static children.

`Breadcrumbs` accepts `<Item>` elements as children, each with a `key` prop,
which is passed to the `onAction` handler to identify the selected item.

```jsx {% live=true %}
let items = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'posts', label: 'Posts' },
  { key: 'some-post-title', label: 'Some post title' },
];
let [itemKey, setItemKey] = React.useState();

return (
  <Grid gap="large">
    <Breadcrumbs onAction={setItemKey}>
      {items.map(item => (
        <Item key={item.key}>{item.label}</Item>
      ))}
    </Breadcrumbs>
    <Text>Last key: {itemKey}</Text>
  </Grid>
);
```

### Overflow

Breadcrumbs collapses items into a menu when space is limited. It will only show
a maximum of 4 visible items including the root and menu button, if either are
visible. Note that the last breadcrumb item will automatically truncate with an
ellipsis instead of collapsing into the menu.

Resize your browser window to see the above behavior in the examples below.

```jsx {% live=true %}
<Breadcrumbs>
  <Item key="Home">Home</Item>
  <Item key="Products">Products</Item>
  <Item key="Tools">Tools</Item>
  <Item key="Power Tools">Power Tools</Item>
  <Item key="Drills">Drills</Item>
  <Item key="Impact Drill Drivers">Impact Drill Drivers</Item>
</Breadcrumbs>
```

If the root item cannot be rendered in the available horizontal space, it will
be collapsed into the menu regardless of `showRoot`.

```jsx {% live=true %}
<Breadcrumbs showRoot>
  <Item key="Home">Home</Item>
  <Item key="Products">Products</Item>
  <Item key="Tools">Tools</Item>
  <Item key="Power Tools">Power Tools</Item>
  <Item key="Drills">Drills</Item>
  <Item key="Impact Drill Drivers">Impact Drill Drivers</Item>
</Breadcrumbs>
```

## Props

### Disabled

Breadcrumbs in a disabled state shows items, but indicates that navigation is
not available. This can be used to maintain layout continuity.

```jsx {% live=true %}
<Breadcrumbs isDisabled>
  <Item key="dashboard">Dashboard</Item>
  <Item key="posts">Posts</Item>
  <Item key="some-post-title">Some post title</Item>
</Breadcrumbs>
```

### Size

Breadcrumbs accept a `size` prop, which aligns with the
[Text](/package/typography/text) component.

```jsx {% live=true %}
<Grid gap="large">
  <Breadcrumbs size="small">
    <Item key="dashboard">Dashboard</Item>
    <Item key="posts">Posts</Item>
    <Item key="some-post-title">Some post title</Item>
  </Breadcrumbs>
  <Breadcrumbs size="large">
    <Item key="dashboard">Dashboard</Item>
    <Item key="posts">Posts</Item>
    <Item key="some-post-title">Some post title</Item>
  </Breadcrumbs>
</Grid>
```
