---
title: Slots
description:
  Slots are a mechanism for managing props when composing components together.
  Mainly for accessibility and styling requirements.
category: Concepts
---

## Example

```jsx {% live=true %}
<Flex direction="column" gap="large">
  <Text>Default</Text>

  <SlotProvider slots={{ text: { weight: 'bold' } }}>
    <Text>Inherit</Text>

    <SlotProvider slots={{ text: { size: 'large' } }}>
      <Text color="neutralEmphasis">Inherit and extend</Text>

      <SlotProvider slots={{ text: { color: 'accent' } }}>
        <Text color="neutralEmphasis">Inherit, extend and override</Text>

        <ClearSlots>
          <Text>Cleared</Text>
        </ClearSlots>
      </SlotProvider>
    </SlotProvider>
  </SlotProvider>
</Flex>
```

## Motivation

### Summary

In React you can split elements into independent, reusable pieces (components),
and think about each piece in isolation. It's great, components can refer to
other components in their output.

```tsx
function Child(props) {
  return <p>Hello, {props.name}</p>;
}

function Parent() {
  return (
    <div>
      <Child name="Amy" />
      <Child name="Benjamin" />
      <Child name="Clare" />
    </div>
  );
}
```

Unfortunately however, when applying the constraints and requirements of the
design system, component libraries are often forced to forfeit composition in
favour of predictability. Sometimes we need container components that can have
multiple complex layouts that solve a variety of cases.

### Approaches

We want to separate design from implementation. It's been historically hard to
solve the problem of where to place child components. Slot components will be
automatically placed within a container's layout.

```tsx
<Parent>
  <Child slot="first-name">First text</Child>
  <Child slot="second-name">Second text</Child>
</Parent>
```

## Dedicated slots

Dedicated slot components provide no styling of their own. Only when composed
within a container component will they inherit appearance and behaviour,
depending on context.

### Content

The `Content` component represents the main content within a container.

```jsx {% live=true %}
<Content>Content component</Content>
```

### Footer

The `Footer` component represents the footer content of a container.

```jsx {% live=true %}
<Footer>Footer component</Footer>
```

### Header

The `Header` component represents the header content of a container.

```jsx {% live=true %}
<Header>Header component</Header>
```

## Complementary slots

Complementary slot components have their own API and may be used to create
miscellaneous interfaces. However they may also be used within a container
component, which will overide their appearance and behaviour.

### Icon

The [Icon](/package/icon) component is used all over the place, most notably in
[buttons](/package/button).

### Heading

The [Heading](/package/typography/heading) component is used all over the place.

### Text

The [Text](/package/typography/text) component is used all over the place.
