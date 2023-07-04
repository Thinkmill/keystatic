---
title: TextArea
description:
  Text areas allow users to input multiple lines of text with a keyboard. Use
  when you want to allow users to enter a sizeable amount of free-form text.
category: Forms
---

## Example

```jsx {% live=true %}
<TextArea label="Comment" />
```

## Related

- [TextField](/package/text-field) — Use a when the expected input is a single
  line of text.

## Props

### Label

Every text area must have a label.

```jsx {% live=true %}
<TextArea label="Comment" />
```

If you do not provide a visible label, you must specify an `aria-label` or
`aria-labelledby` attribute for accessibility.

```jsx {% live=true %}
<TextArea aria-label="Comment" />
```

### Required

A text area can be marked as required by setting the `isRequired` prop.

The asterisk symbol used to visually indicate a required field is not part of
the label text itself, and will not be read by assistive technology.

```jsx {% live=true %}
<TextArea label="Comment" isRequired />
```

### Description

The `description` communicates a hint or helpful information, such as specific
requirements for correctly filling out the field.

```jsx {% live=true %}
<TextArea
  label="Comment"
  description="Your comment may contain up to 280 characters."
/>
```

### Error message

The `errorMessage` communicates validation errors when field requirements aren’t
met. Prompting the user to adjust their input.

```jsx {% live=true %}
<TextArea label="Comment" isRequired errorMessage="This field is required." />
```

### Disabled

A text area can be disabled by setting the `isDisabled` prop. This can be used
to maintain layout continuity and communicate that a field may become available
later.

```jsx {% live=true %}
<TextArea label="Comment" isDisabled value="Jane Smith" />
```

### Read only

The `isReadOnly` prop makes a field's text content immutable. Unlike
`isDisabled`, the field remains focusable and the contents can still be copied.

```jsx {% live=true %}
<TextArea label="Comment" isReadOnly value="Jane Smith" />
```

## Patterns

### Help text punctuation

Help text (e.g. [descriptions](#description) and
[error messages](#error-message)) should be written as a complete sentence, with
a period at the end. This is to ensure that assistive technology pauses at the
end of each block of text, making it easier to understand for the user.

```jsx
<TextArea
  label="Comment"
  description="Your comment may contain up to 280 characters."
  errorMessage="This field is required."
/>
```

### Dimensions

By default, the height of the `TextArea` will grow and shrink to fit the content
as the user types.

```jsx {% live=true %}
<TextArea
  label="Dynamic height"
  description="Add or remove text to see the height change."
  defaultValue="A voussoir (/vuˈswɑːr/) is a wedge-shaped element, typically a stone, which is used in building an arch or vault."
  width="container.xsmall"
  maxWidth="100%"
/>
```

Providing a `height` prop will set the height of the `TextArea` to a fixed
value, and allow the user to scroll the content.

```jsx {% live=true %}
<TextArea
  label="Fixed height"
  description="Scroll to see the rest of the content."
  defaultValue="Although each unit in an arch or vault is a voussoir, two units are of distinct functional importance: the keystone and the springer. The keystone is the centre stone or masonry unit at the apex of an arch. The springer is the lowest voussoir on each side, located where the curve of the arch springs from the vertical support or abutment of the wall or pier."
  height="scale.1250"
  width="container.xsmall"
  maxWidth="100%"
/>
```
