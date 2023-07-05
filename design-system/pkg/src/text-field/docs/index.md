---
title: TextField
description:
  Text fields allow users to input text with a keyboard. Use when the expected
  input is a single line of text.
category: Forms
---

## Example

```jsx {% live=true %}
<TextField label="Name" />
```

## Related

- [TextArea](/package/text-field/text-area) — Use when you want to allow users
  to enter a sizeable amount of free-form text.

## Props

### Label

Every text field must have a label.

```jsx {% live=true %}
<TextField label="Name" />
```

If you do not provide a visible label, you must specify an `aria-label` or
`aria-labelledby` attribute for accessibility.

```jsx {% live=true %}
<TextField aria-label="Name" />
```

### Required

A text field can be marked as required by setting the `isRequired` prop.

The asterisk symbol used to visually indicate a required field is not part of
the label text itself, and will not be read by assistive technology.

```jsx {% live=true %}
<TextField label="Name" isRequired />
```

### Description

The `description` communicates a hint or helpful information, such as specific
requirements for correctly filling out the field.

```jsx {% live=true %}
<TextField
  label="Name"
  description="This is the name that will appear on your account."
/>
```

### Error message

The `errorMessage` communicates validation errors when field requirements aren’t
met. Prompting the user to adjust their input.

```jsx {% live=true %}
<TextField label="Name" isRequired errorMessage="This field is required." />
```

### Disabled

A text field can be disabled by setting the `isDisabled` prop. This can be used
to maintain layout continuity and communicate that a field may become available
later.

```jsx {% live=true %}
<TextField label="Name" isDisabled value="Jane Smith" />
```

### Read only

The `isReadOnly` prop makes a field's text content immutable. Unlike
`isDisabled`, the field remains focusable and the contents can still be copied.

```jsx {% live=true %}
<TextField label="Name" isReadOnly value="Jane Smith" />
```

## Patterns

### Help text punctuation

Help text (e.g. [descriptions](#description) and
[error messages](#error-message)) should be written as a complete sentence, with
a period at the end. This is to ensure that assistive technology pauses at the
end of each block of text, making it easier to understand for the user.

```jsx
<TextField
  label="Name"
  description="This is the name that will appear on your account."
  errorMessage="This field is required."
/>
```

### Avoid placeholder text

Putting instructions for how to complete a field, requirements, or any other
essential information into placeholder text is not accessible. Instead, use the
[description](#description) to convey requirements or to show any formatting
examples that will aid user input.
