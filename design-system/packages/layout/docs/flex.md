---
title: Flex
description:
  The Flex component can be used to layout its children in one dimension with
  flexbox. Any component(s) can be used as children, and Flex components can be
  nested to create more complex layouts.
category: Layout
---

## Related

- [Concepts](/package/layout/concepts) — The patterns and opinions behind layout
  primitives.
- [Grid](/package/layout/grid) — For two-dimensional layout requirements.

### Learn flex layout

Consider these resources for learning flex layout:

- [The MDN guide to CSS flex](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Flexible_Box_Layout)
  — an outline of the main features of flexbox.
- [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
  — references for all flexbox properties with easy to follow examples and
  illustrations.

## Props

### Gap

Spacing between elements, including
[text and headings](/package/typography/concepts#spacing), should be expressed
with the `gap` prop rather than added as margins to children. This ensures that
components are composable when reused in different places, and that spacing is
consistent.

`Flex` also supports `columnGap` and `rowGap` props, but they're only relevant
for [wrapping content](#wrapping).

```jsx {% live=true %}
<Flex gap="medium" height="element.large">
  <Placeholder width="element.large" />
  <Placeholder width="element.large" />
  <Placeholder width="element.large" />
</Flex>
```

### Direction

The default `direction` for flex containers is `"row"`, though
[other values](https://developer.mozilla.org/en-US/docs/Web/CSS/flex-direction#values)
are available. The most common alternative being `"column"`, for creating
vertical stacks.

```jsx {% live=true %}
<Flex direction="column" gap="medium">
  <Placeholder height="element.large" />
  <Placeholder height="element.large" />
  <Placeholder height="element.large" />
</Flex>
```

**NOTE:** Using `direction` props of `"row-reverse"` or `"column-reverse"` will
create a disconnect between the visual presentation of content and DOM order.
This will adversely affect users experiencing low vision navigating with the aid
of assistive technology such as a screen reader.

### Alignment

The `alignItems` prop can be used to align items along the cross axis. When
`direction` is `"column"`, this refers to horizontal alignment, and when
`direction` is `"row"` it refers to vertical alignment.

This example horizontally centers items in a vertical stack.

```jsx {% live=true %}
<Flex direction="column" gap="medium" alignItems="center">
  <Placeholder height="element.large" width="element.large" />
  <Placeholder height="element.large" width="container.xsmall" />
  <Placeholder height="element.large" width="element.large" />
</Flex>
```

**NOTE:** The default value for `alignItems` is `"stretch"`, which means that if
your items do not have a size defined in the cross direction they will be
stretched to fill the height of the container. This may be undesirable in some
cases, e.g. a group of elements with varying heights. Ensure you set an
`alignItems` value to account for this.

### Justification

The `justifyContent` prop can be used to align items along the main axis. When
`direction` is` "column"`, this refers to vertical alignment, and when
`direction` is `"row"` it refers to horizontal alignment.

This example distributes the available space between each item in the container.

```jsx {% live=true %}
<Flex justifyContent="space-between">
  <Placeholder height="element.large" width="element.large" />
  <Placeholder height="element.large" width="container.xsmall" />
  <Placeholder height="element.large" width="element.large" />
</Flex>
```

### Wrapping

When the `wrap` prop is enabled, items can wrap onto multiple lines.

```jsx {% live=true %}
<Flex
  wrap
  border="neutral"
  borderRadius="small"
  gap="medium"
  padding="medium"
  width="scale.3000"
>
  <Placeholder height="element.large" width="element.large" />
  <Placeholder height="element.large" width="element.large" />
  <Placeholder height="element.large" width="element.large" />
  <Placeholder height="element.large" width="element.large" />
  <Placeholder height="element.large" width="element.large" />
  <Placeholder height="element.large" width="element.large" />
</Flex>
```

**NOTE:** When `wrap` is not enabled items are forced onto a single line. If
there's a chance that children may overflow ensure that you've taken other
measures, e.g. allow users to scroll the container.

## Patterns

### Nesting

This example shows how you can nest flexboxes to create more complicated
layouts. It also uses the `flex` prop on children to expand them to fill a ratio
of the remaining space.

```jsx {% live=true %}
<Flex direction="column" gap="medium" height="scale.3000">
  <Placeholder height="element.large">Header</Placeholder>
  <Flex gap="medium" flex>
    <Placeholder flex={1}>Sidebar</Placeholder>
    <Placeholder flex={3}>Content</Placeholder>
  </Flex>
  <Placeholder height="element.large">Footer</Placeholder>
</Flex>
```
