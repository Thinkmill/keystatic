---
title: Layout
description:
  Layout primitives are the building blocks for application layout. Compose
  layout primitives with other components to create structure and hierarchy
  between elements.
category: Concepts
---

## Introduction

The [Flex](/package/layout/flex) and [Grid](/package/layout/grid) components are
"layout primitives", which are responsible for the layout of their children. Use
layout primitives to build different parts of your application, and nest them to
create more complex layouts.

Spacing between elements, including
[text and headings](/package/typography/concepts#spacing), should be expressed
as _gaps_ or "gutters" on layout components rather than added as margins to
children. This ensures that components are composable when reused in different
places, and that spacing is consistent.

### Semantic elements

Each layout primitive renders a `<div>` element, by default. To provide semantic
markup you can customise the `elementType` as necessary. Non-style props will be
forwarded to the underlying element.

```tsx
<Flex elementType="section" id="element-type-example">
  ...
</Flex>
```

### Style props

In addition to their own API, layout primitives accept
[style props](/package/style#style-props), a limited set of styling options, for
common cases like, sizing and positioning.

```tsx
<Grid position="absolute" minWidth={0}>
  ...
</Grid>
```

## Components

### Flex

The flex layout model is a simple yet versatile method of laying out components
in rows and columns. You can use it to build vertical or horizontal stacks,
simple wrapping grids, and more.

The [Flex](/package/layout/flex) component can be used to create flexbox
containers, with any components or elements as children. Flex layouts are
automatically mirrored in RTL languages, and can be nested to create more
complex layouts.

```jsx {% live=true %}
<Flex direction="column" gap="medium" width="scale.2400">
  <Placeholder height="element.large" />
  <Placeholder height="element.large" />
  <Placeholder height="element.large" />
</Flex>
```

### Grid

The grid layout model is a powerful way to lay out elements in two dimensions.
It can be used to to build full page application layouts, or smaller user
interface elements. It is especially powerful because it allows you to build
many types of layouts without extra presentational elements, keeping your code
clean and semantic.

The [Grid](/package/layout/grid) component can be used to define a grid layout,
with any components or elements as children. Grid layouts are automatically
mirrored in RTL languages, and can be nested to create more complex layouts.

```jsx {% live=true %}
<Grid columns="1fr 3fr" rows={['element.large', 'element.large']} gap="medium">
  <Placeholder />
  <Placeholder />
  <Placeholder gridColumn="2" gridRow="1/3">
    Main
  </Placeholder>
</Grid>
```

## Responsive layout

The example below shows how you could combine `Flex` and `Grid` to define a
complex responsive layout. On mobile screens each area is displayed in a
vertical stack, and the navigation items are layed out horizontally

The layout is accomplished by changing the grid areas and columns at the tablet
and desktop breakpoints, and changing the Flex direction at the tablet
breakpoint. Also, notice that
[the aside element is hidden](/package/style#conditional-visibility) below the
desktop breakpoint.

Resize your browser window to see how the layout changes.

```jsx {% live=true %}
<Grid
  areas={{
    mobile: ['header', 'nav', 'main', 'footer'],
    tablet: [
      'header   header',
      'nav      main',
      'nav      main',
      'footer   footer',
    ],
    desktop: [
      'header header  header',
      'nav    main    aside',
      'nav    main    aside',
      'footer footer  footer',
    ],
  }}
  columns={{
    tablet: ['1fr', '3fr'],
    desktop: ['1fr', '3fr', '1fr'],
  }}
  gap="medium"
>
  <Placeholder gridArea="header" height="element.large">
    Header
  </Placeholder>
  <Flex
    gridArea="nav"
    direction={{ mobile: 'row', tablet: 'column' }}
    gap="small"
  >
    <Placeholder minWidth="element.large" />
    <Placeholder minWidth="element.large" />
    <Placeholder minWidth="element.large" />
  </Flex>
  <Placeholder gridArea="main" height="scale.1200">
    Main
  </Placeholder>
  <Placeholder
    gridArea="aside"
    minHeight="element.large"
    isHidden={{ below: 'desktop' }}
  >
    Aside
  </Placeholder>
  <Placeholder gridArea="footer" height="element.large">
    Footer
  </Placeholder>
</Grid>
```
