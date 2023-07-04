---
title: Heading
description:
  The heading component is a typographic device used to communicate levels of
  hierarchy between text.
category: Typography
---

## Example

```jsx {% live=true %}
<Heading>Heading</Heading>
```

## Related

- [Text](/package/typography/text) — For body copy.

## Props

### Size

Heading sizes influence more than just font-size to distinguish a clear visual
pattern for users to follow.

We use T-shirt sizing to describe each `"size"`, avoiding a direct correlation
to the [underlying HTML elements](#element-type), which could otherwise make
semantic definitions awkward.

#### Large

The `"large"` size is reserved for the title of a screen. There should be no
more than one "large" heading per screen.

```jsx {% live=true %}
<Heading size="large">Large — The five boxing wizards jump quickly.</Heading>
```

#### Medium

Only use `"medium"` sized headings for titling prominent interface elements,
like empty-states and dialogs.

```jsx {% live=true %}
<Heading size="medium">Medium — The five boxing wizards jump quickly.</Heading>
```

#### Regular

Use `"regular"` headings for titling various sections within a screen.

```jsx {% live=true %}
<Heading size="regular">
  Regular — The five boxing wizards jump quickly.
</Heading>
```

#### Small

Use the `"small"` heading size for subtitles.

```jsx {% live=true %}
<Heading size="small">Small — The five boxing wizards jump quickly.</Heading>
```

### Element type

If you need the semantic element to be different from the appearance, you can
provide the desired HTML tag using the `elementType` prop.

```jsx {% live=true %}
<Heading size="medium" elementType="span">
  This looks like an H2, but it’s actually a span.
</Heading>
```

By default, the semantic heading level is derived from the visual size, e.g.
`<Heading size="medium">` will render an `h2` element:

```yaml
large: h1
medium: h2
regular: h3
small: h4
```

### Truncate

Limit the contents of the element to the specified number of lines, or provide a
shorthand boolean to conveniently express a single line.

Only `truncate` user-generated content that may not fit within a particular
layout. Learn more about
[how and when to truncate text](/package/typography/concepts#truncating-cropping-text)
in the typographic concepts guide.

```jsx {% live=true %}
<Heading truncate>
  A voussoir (/vuˈswɑːr/) is a wedge-shaped element, typically a stone, which is
  used in building an arch or vault. Although each unit in an arch or vault is a
  voussoir, two units are of distinct functional importance: the keystone and
  the springer. The keystone is the centre stone or masonry unit at the apex of
  an arch. The springer is the lowest voussoir on each side, located where the
  curve of the arch springs from the vertical support or abutment of the wall or
  pier.
</Heading>
```
