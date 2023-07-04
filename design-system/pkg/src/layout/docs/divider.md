---
title: Divider
description:
  Dividers bring clarity to a layout by grouping and dividing content in close
  proximity. They can also be used to establish rhythm and hierarchy.
category: Layout
---

## Example

```jsx {% live=true %}
<Divider />
```

## Props

### Orientation

The axis the `Divider` should align with, defaults to "horizontal".

#### Horizontal

```jsx {% live=true %}
<Flex direction="column" gap="regular">
  <Text>Content above</Text>
  <Divider orientation="horizontal" />
  <Text>Content below</Text>
</Flex>
```

#### Vertical

```jsx {% live=true %}
<Flex direction="row" gap="regular">
  <Text>Content before</Text>
  <Divider orientation="vertical" />
  <Text>Content after</Text>
</Flex>
```

### Size

How thick the `Divider` should be, defaults to "regular".

```jsx {% live=true %}
<Flex direction="column" gap="regular">
  <Text>Regular divider</Text>
  <Divider size="regular" />
  <Text>Medium divider</Text>
  <Divider size="medium" />
  <Text>Large divider</Text>
  <Divider size="large" />
</Flex>
```

## Accessibility

Horizontal separators can be built with the HTML
[<hr>](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/hr) element.
However, there is no HTML element for a vertical separator. `Divider` implements
accessible separators:

- Support for horizontal and vertical orientation with the
- Support for HTML `<hr>` element or a custom element type.

Learn more about this
[WAI-ARIA pattern](https://www.w3.org/TR/wai-aria-1.2/#separator).

## Patterns

The `Divider` is a [slot component](/package/slots). Slots are a mechanism for
managing props when composing components together.

For instance, when used in the [NavList](/package/nav-list#divider) it yields an
`<li>` element to maintain semantic markup.
