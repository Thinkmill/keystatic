---
title: Grid
description:
  The Grid component can be used to layout its children in two dimensions with
  CSS grid. Any React component(s) can be used as children, and style props
  ensure consistency across applications, and allows the layout to adapt to
  different devices automatically.
category: Layout
---

## Related

- [Concepts](/package/layout/concepts) — The patterns and opinions behind layout
  primitives.
- [Flex](/package/layout/flex) — For one-dimensional layout requirements.

### Learn grid layout

Consider these resources for learning grid layout:

- [The MDN guide to CSS grid](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout)
  — full walkthrough of grid layout.
- [A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid)
  — references for all grid properties with easy to follow examples and
  illustrations.
- [The Difference Between Explicit and Implicit Grids](https://css-tricks.com/difference-explicit-implicit-grids/)
  — an article that discusses the various ways of defining grids.

## Props

### Gap

Spacing between elements, including
[text and headings](/package/typography/concepts#spacing), should be expressed
with the `gap` prop rather than added as margins to children. This ensures that
components are composable when reused in different places, and that spacing is
consistent.

```jsx {% live=true %}
<Grid gap="medium">
  <Placeholder />
  <Placeholder />
  <Placeholder />
</Grid>
```

`Grid` also supports `columnGap` and `rowGap` props, should you need to specify
a different gap for each axis.

### Areas

A grid area is one or more grid cells that make up a rectangular area on the
grid. Grid areas are created when you place an item using line-based placement
or, in this case, when defining areas using
[named grid areas](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout/Grid_Template_Areas).

Child components should define their area using the `gridArea`
[style prop](/package/style#style-props).

```jsx {% live=true %}
<Grid areas={['a a a', 'b c c', 'b c c']} gap="medium">
  <Placeholder gridArea="a">A</Placeholder>
  <Placeholder gridArea="b">B</Placeholder>
  <Placeholder gridArea="c">C</Placeholder>
</Grid>
```

**NOTE:** Grid areas must be rectangular in nature; it is not possible to
create, for example, a T- or L-shaped grid area.

### Rows

A grid row is a horizontal track in a grid layout, that is the space between two
horizontal grid lines.

Rows may be created in the _implicit grid_ when items are placed outside of rows
created in the _explicit grid_. These rows will be auto sized by default, or can
have a size specified with the [`autoRows` prop](#auto-rows).

```jsx {% live=true %}
<Grid rows={['element.medium', '2fr', '1fr']} gap="medium" height="scale.3000">
  <Placeholder />
  <Placeholder />
  <Placeholder />
</Grid>
```

### Columns

A grid column is a vertical track in a grid layout, that is the space between
two vertical grid lines.

Columns may be created in the _implicit grid_ when items are placed outside of
columns created in the _explicit grid_. These columns will be auto sized by
default, or can have a size specified with the
[`autoColumns` prop](#auto-columns).

```jsx {% live=true %}
<Grid columns={['element.medium', '2fr', '1fr']} gap="medium">
  <Placeholder />
  <Placeholder />
  <Placeholder />
</Grid>
```

### Auto rows

If a grid item is positioned into a row that is not explicitly sized by `rows`,
implicit grid tracks are created to hold it. This can happen either by
explicitly positioning into a row that is out of range, or by the auto-placement
algorithm creating additional rows.

```jsx {% live=true %}
<Grid columns={['1fr', '1fr']} autoRows="element.large" gap="medium">
  <Placeholder />
  <Placeholder />
  <Placeholder />
  <Placeholder />
  <Placeholder />
</Grid>
```

### Auto columns

If a grid item is positioned into a column that is not explicitly sized by
`columns`, implicit grid tracks are created to hold it. This can happen either
by explicitly positioning into a column that is out of range, or by the
auto-placement algorithm creating additional columns.

```jsx {% live=true %}
<Grid autoColumns="scale.1200" autoRows="element.large" gap="medium">
  <Placeholder gridColumn="1/4" />
  <Placeholder gridColumn="2" />
  <Placeholder />
  <Placeholder />
  <Placeholder />
</Grid>
```

## Patterns

### Explicit grids

This example shows how to build a common application layout with a header,
sidebar, content area, and footer. It uses the areas prop to define the grid
areas, along with columns and rows to define the sizes. Each child uses the
gridArea prop to declare which area it should be placed in.

```jsx {% live=true %}
<Grid
  areas={['header  header', 'sidebar content', 'footer  footer']}
  columns={['1fr', '3fr']}
  rows={['element.large', 'auto', 'element.large']}
  height="scale.3000"
  gap="medium"
>
  <Placeholder gridArea="header">Header</Placeholder>
  <Placeholder gridArea="sidebar">Sidebar</Placeholder>
  <Placeholder gridArea="content">Content</Placeholder>
  <Placeholder gridArea="footer">Footer</Placeholder>
</Grid>
```

### Implicit grids

This example creates an implicit grid. It declares the columns using the
`repeat` function to automatically generate as many columns as fit, and uses the
`autoRows` prop to set the size of the implicitly created rows. The items are
centered horizontally within the container, and have a gap between them defined
using a dimension variable. Resize your browser to see how items reflow.

```jsx {% live=true %}
<Grid
  columns={repeat('auto-fit', 'element.large')}
  autoRows="element.large"
  justifyContent="center"
  gap="medium"
>
  {Array.from({ length: 32 }).map((_, i) => (
    <Placeholder key={i} represent="image" />
  ))}
</Grid>
```

## Grid utils

JavaScript versions of the CSS functions that are often used with CSS grid area
available. These allow using variables to define dimensions, and are typed to
allow IDE autocomplete.

### repeat

The `repeat` function can be used to make a repeating fragment of the columns or
rows list.

```ts
repeat(
  count: number | 'auto-fill' | 'auto-fit',
  repeat: DimensionValue | DimensionValue[]
): string
```

### minmax

The `minmax` function defines a size range greater than or equal to min and less
than or equal to max.

```ts
minmax(min: DimensionValue, max: DimensionValue): string
```

### fitContent

The `fitContent` function clamps a given size to an available size.

```ts
fitContent(dimension: DimensionValue): string
```
