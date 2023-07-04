---
title: Image
description:
  A wrapper around the native image tag with support for common behaviour.
category: Media
---

## Example

```jsx {% live=true %}
<Image
  src="/example-landscape-colour.jpg"
  aspectRatio="1920 / 1317"
  alt="Photograph of a foggy pasture framed by a large archway with iron gates. The interior is dimly lit with hues of gold and teal, revealing a well worn cobblestone floor leading to the archway. This photograph was taken at Kalemegdan Fortress Beograd, Serbia by Nikola Knezevic."
/>
```

## Related

- [AspectRatio](/package/layout/aspect-ratio) — For displaying other responsive
  media.

## Props

### Alt text

Add `alt` text for screen readers, or set `alt=""` to indicate that the image is
decorative or redundant with displayed text and should not be announced by
screen readers.

### Aspect ratio

A proportional relationship between the image's width and height. You might
expect this to be a `number`, but it's actually a `string`. Because the value is
passed straight to the
[aspect-ratio CSS property](https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio)
we avoid operations that may lead to rounding/precision issues, and instead let
the browser handle interpretation.

See how the aspect ratio can be used to implement
[adaptive media in layout](#adaptive-media-in-layout).

```jsx {% live=true %}
<Grid columns="repeat(3, 1fr)" gap="large">
  <Image
    alt="aspect-ratio example—16:9"
    src="/example-landscape-colour.jpg"
    aspectRatio="16/9"
  />
  <Image
    alt="aspect-ratio example—1:1"
    src="/example-landscape-colour.jpg"
    aspectRatio="1"
  />
  <Image
    alt="aspect-ratio example—5:7"
    src="/example-landscape-colour.jpg"
    aspectRatio="5/7"
  />
</Grid>
```

### Fit

How the image should be resized to fit its container. The `fit` property
defaults to `"cover"` so image content fills the available space afforded by the
[aspect ratio](#aspect-ratio).

```jsx {% live=true %}
<Grid columns="repeat(3, 1fr)" gap="large">
  <Image
    alt="fit:cover example"
    src="/example-landscape-colour.jpg"
    fit="cover"
    aspectRatio="1"
  />
  <Image
    alt="fit:contain example"
    src="/example-landscape-colour.jpg"
    fit="contain"
    aspectRatio="1"
  />
</Grid>
```

### Children

You can overlay content on an `Image` by passing it children.

```jsx {% live=true %}
<Image alt="" src="/example-landscape-colour.jpg" aspectRatio="3/2">
  <Flex alignItems="end" justifyContent="end">
    <Box padding="medium" backgroundColor="canvas">
      <Text>
        Kalemegdan Fortress by{' '}
        <TextLink href="https://unsplash.com/@nknezevic">
          Nikola Knezevic
        </TextLink>
      </Text>
    </Box>
  </Flex>
</Image>
```

### Loading

The `loading` property provides a hint to the browser on how to handle the
loading of the image which is currently outside the viewport. This helps to
optimize the loading of the document's contents by postponing loading the image
until it's expected to be needed, rather than immediately during the initial
page load.

#### Eager

The default behavior, `"eager"` tells the browser to load the image as soon as
the `<img>` element is processed.

#### Lazy

A value of `"lazy"` tells the browser to hold off on loading the image until
shortly before it will appear in the viewport.

## Accessibility

### Appropriate alt text

Imagine that you’re reading the contents of the page aloud over the phone to
someone who needs to understand the page. This should help you decide what (if
any) information or function an image has. If an image appears to have no
informative value and isn't a link or button, it may be safe to
[indicate that the image is decorative](#alt-text).

The `alt` text should be the most concise description possible of the image’s
purpose. Prioritize information by putting the most important details at the
beginning.

### Reflow

Providing an [aspect ratio](#aspect-ratio) is required to prevent "reflow",
especially with regard to [lazy-loaded images](#loading).

When a user scrolls and images are lazy-loaded, those `<img>` elements go from a
height of `0` pixels to whatever they need to be. This causes reflow, where the
content below or around the image gets pushed to make room for the freshly
loaded image.

Reflow is a problem because it’s a user-blocking operation. It slows down the
browser by forcing it to recalculate the layout of any elements that are
affected by that image’s shape.

## Patterns

### Adaptive media in layout

The `aspectRatio` prop supports
[responsive syntax](/package/style#responsive-props), which means you can adapt
the ratio to suit your layout depending on the viewport.

```jsx {% live=true %}
<Flex
  backgroundColor="canvas"
  borderRadius="medium"
  boxShadow="small regular"
  direction={{ mobile: 'column', tablet: 'row' }}
  overflow="hidden"
  width={{ mobile: 'scale.3000', tablet: 'auto' }}
>
  <Image
    alt=""
    src="/example-landscape-colour.jpg"
    aspectRatio={{ mobile: '16/9', tablet: '1', medium: '4/3' }}
    flex={{ mobile: 'auto', tablet: 1 }}
    minWidth="scale.1600"
  />
  <Box direction="column" gap="large" padding="large" flex={3}>
    <Text>
      Photograph of a foggy pasture framed by a large archway with iron gates.
      The interior is dimly lit with hues of gold and teal, revealing a well
      worn cobblestone floor leading to the archway.
    </Text>
  </Box>
</Flex>
```
