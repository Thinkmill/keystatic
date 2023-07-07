---
title: Typography
description:
  Typography is an important part of the design system—type could account for
  85-90% of any given screen. Use Keystar UI's typographic patterns, guidelines,
  and components to create an accessible and effective content hierarchy.
category: Concepts
---

## Components

### Styling

Styles, _including resets_, are **only** provided to Keystar UI components. We
do this to avoid polluting the global CSS scope, so third-party and consumer
styles aren't unexpectedly affected by our styling opinions (and vice versa).

These styling decisions are especially important when considering how
[spacing](#spacing) behaves between typographic elements.

```jsx {% live=true %}
<>
  <Text>Text component</Text>
  <p>Paragraph element</p>
</>
```

### Primitives

Voussour exports two typographic primitives [Text](/package/typography/text) and
[Heading](/package/typography/heading), which should be used in most cases when
rendering text elements in an interface.

### Utilities

Utility components `Emoji` and `Numeral` can be composed together with the
typographic primitives. Use [Emoji](/package/typography/emoji) to display emoji
characters accessibly. Use [Numeral](/package/typography/numeral) to format
numeric content.

## Formatting

### Emphasis

Use emphasis `<em>` for placing emphasis on part of a sentence, rendering the
text as italic.

Do NOT use underline for emphasis. Underline text is reserved for
[text links](/package/link/text-link).

```jsx {% live=true %}
<Text>
  I <em>love</em> building interfaces with Keystar UI.
</Text>
```

### Strong

Use strong emphasis `<strong>` for placing importance on part of a sentence,
rendering the text at a heavier font weight.

```jsx {% live=true %}
<Text>
  This document contains <strong>sensitive information</strong>.
</Text>
```

## Layout and appearance

### Platform scales

Platform scales ensure that different sizes of text work together harmoniously,
on both desktop and mobile.

A medium scale for devices with fine grained pointers (e.g. mouses), and a large
scale for devices with coarser input (e.g. touch). Typographic primitives
automatically switch between scales according to these device characteristics.

### Semantic elements

By default, `Text` renders a span element. You can customise this using the
`elementType` prop.

```jsx {% live=true %}
<Text elementType="p">Paragraph text</Text>
```

### Style props

The typographic primitives provide a handful of common style props. These style
props are recommended where possible to reduce the amount of custom CSS in your
application.

```jsx {% live=true %}
<Flex direction="column">
  <Text alignSelf="end">Text content</Text>
</Flex>
```

### Spacing

Voussour's typographic primitives implement
[Capsize](https://seek-oss.github.io/capsize/), letting us control leading-trim.

```jsx {% live=true %}
<>
  <Heading>What is a design system?</Heading>
  <Text>
    A set of interconnected patterns and shared practices coherently organised.
  </Text>
  <Text>Aiding the design and development of applications and websites.</Text>
</>
```

You’ll notice that there's no space between the elements by default, which is
intentional! Spacing between elements should be owned by layout primitives, like
[Flex](/package/layout/flex) and [Grid](/package/layout/grid), ensuring the
system is composable while keeping white space predictable.

```jsx {% live=true %}
<Flex direction="column" gap="large">
  <Heading>What is a design system?</Heading>
  <Text>
    A set of interconnected patterns and shared practices coherently organised.
  </Text>
  <Text>Aiding the design and development of applications and websites.</Text>
</Flex>
```

## Truncating (cropping) text

Use `truncate` for displaying user-generated content that may not fit within a
particular layout, by limiting the contents of the element to the specified
number of lines.

```jsx {% live=true %}
<Grid gap="large">
  <Heading truncate>
    A voussoir (/vuˈswɑːr/) is a wedge-shaped element, typically a stone, which
    is used in building an arch or vault. Although each unit in an arch or vault
    is a voussoir, two units are of distinct functional importance: the keystone
    and the springer. The keystone is the centre stone or masonry unit at the
    apex of an arch. The springer is the lowest voussoir on each side, located
    where the curve of the arch springs from the vertical support or abutment of
    the wall or pier.
  </Heading>
  <Text truncate={3}>
    A voussoir (/vuˈswɑːr/) is a wedge-shaped element, typically a stone, which
    is used in building an arch or vault. Although each unit in an arch or vault
    is a voussoir, two units are of distinct functional importance: the keystone
    and the springer. The keystone is the centre stone or masonry unit at the
    apex of an arch. The springer is the lowest voussoir on each side, located
    where the curve of the arch springs from the vertical support or abutment of
    the wall or pier.
  </Text>
</Grid>
```

### When to truncate

Generally, you should only truncate content that isn’t essential to users'
comprehension of a task or interface. In these cases you may want to indicate
that more content is available, and allow the user to reveal the complete
content via some interaction.

Allow text to wrap when the user needs to see the full text to understand what
is expected. Note that some languages have longer line lengths.

Don't truncate text in UI controls like buttons and menus, where it will impede
users' understanding of what is expected. Note that touch devices won’t have
tooltips on hover.

### Content disclosure

The `title` attribute is populated automatically when `children` is a string. If
`children` contains elements or components use the `title` prop to manually set
the title attribute.

<!-- prettier is fighting itself -->
<!-- prettier-ignore -->
```jsx {% live=true %}
<Flex direction="column" gap="large" width="scale.3000">
  <Text truncate>
    The title attribute is automatically added to this example because children
    is a string.
  </Text>
  <Text truncate>
    This example contains <strong>complex children</strong>, but doesn't set a
    title.
  </Text>
  <Text
    truncate
    title="This example contains complex children, and manually sets the title."
  >
    This example contains <TextLink href="#truncate">complex children</TextLink>
    , and manually sets the title.
  </Text>
</Flex>
```
