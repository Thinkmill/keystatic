---
title: NavList
description: Navigation lists let users navigate the application.
category: Navigation
---

## Example

```jsx {% live=true %}
<NavList>
  <NavItem href="#" aria-current="page">
    Item 1
  </NavItem>
  <NavItem href="#">Item 2</NavItem>
  <NavItem href="#">Item 3</NavItem>
</NavList>
```

## Props

### Aria current

Use
[aria-current](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-current)
to indicate which `NavItem` represents the current item. Typically "page" will
be the appropriate value.

```jsx
<NavItem href="/path" aria-current="page">
  Current page
</NavItem>
```

Only one item per list may be current at any given time.

### Href

Each navigation item requires an `href` prop.

```jsx
<NavItem href="/path">Item label</NavItem>
```

Items links should always open in the current window. Avoid using navigation
items for links to other applications or outside resources.

## Patterns

### Icons

Use [icons](/package/icon) only when they add essential value and have a strong
association with the text. Never use icons for decoration.

When providing an icon, wrap the item label with
[Text](/package/typography/text) so it inherits the correct layout and
appearance.

```jsx {% live=true %}
<NavList>
  <NavItem href="#" aria-current="page">
    <Icon src={homeIcon} />
    <Text>Home</Text>
  </NavItem>
  <NavItem href="#">
    <Icon src={mailsIcon} />
    <Text>Orders</Text>
  </NavItem>
  <NavItem href="#">
    <Icon src={tagIcon} />
    <Text>Products</Text>
  </NavItem>
</NavList>
```

Do not alternate betwen icon and text-only navigation items within the same
context. [Grouped items](#groups) should either all have icons or all be
text-only.

### Dividers

[Dividers](/package/layout/divider) can be used to separate navigation items.
Prefer [navigation groups](#groups) for grouping related items under a title.

```jsx {% live=true %}
<NavList>
  <NavItem href="#" aria-current="page">
    Home
  </NavItem>
  <Divider />
  <NavItem href="#">Orders</NavItem>
  <NavItem href="#">Products</NavItem>
</NavList>
```

Choose either dividers or groups to separate items, using both is redundant.
Avoid using dividers inside of a navigation group.

### Groups

Group related navigation items together into categories using the `NavGroup`
component.

```jsx {% live=true %}
<NavList>
  <NavItem href="#" aria-current="page">
    Home
  </NavItem>
  <NavGroup title="Lists">
    <NavItem href="#">
      <Icon src={mailsIcon} />
      <Text>Orders</Text>
    </NavItem>
    <NavItem href="#">
      <Icon src={tagIcon} />
      <Text>Products</Text>
    </NavItem>
  </NavGroup>
</NavList>
```

If some navigation items don’t naturally fall into a category, place them at the
top. Grouped items should either all have icons or all be text-only.

## Accessibility

### List label

The `NavList` should be labelled for users of assistive technology, offering any
relevant context for the items contained within.

Reference an element by ID with `aria-labelledby`, or label the nav list
directly using `aria-label`.

```jsx
<Heading id="list-heading">
  List heading
</Heading>
<NavList aria-labelledby="list-heading">
  ...
</NavList>

// ---------- OR ----------

<NavList aria-label="List heading">
  ...
</NavList>
```

## Best practices

### Labelling

Use sentence case and be descriptive. Choose labels for navigation items that
clearly communicate where they will go. Likewise, choose group titles that
clearly communicate the shared theme among the contained items.

Reduce unnecessary words to ensure simplicity. While descriptive, navigation
items and group titles should be succinct.

### Text overflow

When the item text is too long for the horizontal space available, it wraps to
form another line.

Item labels should never be so long that they require truncation, except in
instances where navigation is user-generated.

```jsx {% live=true %}
<NavList width="scale.3000">
  <NavItem href="#" aria-current="page">
    Labels should be concise, but may wrap when necessary
  </NavItem>
  <NavItem href="#">
    <Text truncate>User-generated labels may need to be truncated</Text>
  </NavItem>
</NavList>
```
