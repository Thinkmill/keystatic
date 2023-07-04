---
title: Aspect Ratio
description:
  Present responsive media, such as images and videos or anything embedded
  within an iframe, at a specific aspect ratio.
category: Layout
---

## Example

```jsx {% live=true %}
<AspectRatio value="2.35 / 1">
  <Placeholder>Anamorphic Scope (AKA Panavision/Cinemascope)</Placeholder>
</AspectRatio>
```

## Related

- [Image](/package/image) — Implements the `AspectRatio` component internally.

## Props

### Value

You might expect this to be a `number`, but it's actually a `string`. Because
the value is passed straight to the
[aspect-ratio CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio)
we avoid operations that may lead to rounding/precision issues, and instead let
the browser handle interpretation.

```jsx
// typical use case
<AspectRatio value="16 / 9" />

// equal width and height
<AspectRatio value="1" />

// pre-calculated 7:5 equivalent
<AspectRatio value="1.4" />
```

## Patterns

### Responsive video

One of the most common cases for `AspectRatio` is displaying media content that
responds to the width of its container. An easy way to ensure the correct ratio
for a video is to provide the value as `{width}/{height}`, which will always be
accurate.

```jsx {% live=true %}
<AspectRatio value="560 / 315">
  <iframe
    frameBorder="0"
    src="https://www.youtube.com/embed/fPWRlmedCbo"
    title="YouTube video player"
  />
</AspectRatio>
```
