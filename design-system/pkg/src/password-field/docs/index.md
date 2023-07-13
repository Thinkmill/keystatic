---
title: PasswordField
description: Password fields are text fields for entering secure text.
category: Forms
---

## Example

```jsx {% live=true %}
<PasswordField label="Password" />
```

## Related

- [TextField](/package/text-field) — Use for typical text input.

## Props

### Label

Every password field must have a label.

```jsx {% live=true %}
<PasswordField label="Password" />
```

If you do not provide a visible label, you must specify an `aria-label` or
`aria-labelledby` attribute for accessibility.

```jsx {% live=true %}
<PasswordField aria-label="Password" />
```

### Description

The `description` communicates a hint or helpful information, such as specific
requirements for correctly filling out the field.

```jsx {% live=true %}
<PasswordField
  label="Password"
  description="A password must be at least 8 characters."
/>
```

### Error message

The `errorMessage` communicates validation errors when field requirements aren’t
met. Prompting the user to adjust their input.

```jsx {% live=true %}
<PasswordField
  label="Password"
  isRequired
  errorMessage="A password is required to create an account."
  value=""
/>
```

### Disabled

A password field can be disabled by setting the `isDisabled` prop. This can be
used to maintain layout continuity and communicate that a field may become
available later.

```jsx {% live=true %}
<PasswordField label="Password" isDisabled value="super secret" />
```

### Read only

The `isReadOnly` prop makes a field's text content immutable. Unlike
`isDisabled`, the field remains focusable and the contents can still be copied.

```jsx {% live=true %}
<PasswordField label="Password" isReadOnly value="super secret" />
```

## Patterns

### Auto complete

By default the `autoComplete` prop is set to `"current-password"`. For "sign up"
forms it should be set to `"new-password"`.

**Note:** In most modern browsers, setting autocomplete to "off" will not
prevent a password manager from asking the user if they would like to save
username and password information, or from automatically filling in those values
in a site's login form.

### Text reveal

The input is masked by default, which can be toggled using an optional reveal
button. Use the `allowTextReveal` prop to hide the reveal button.

```jsx {% live=true %}
<PasswordField label="Password" allowTextReveal={false} />
```
