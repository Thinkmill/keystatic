---
title: AlertDialog
description:
  Alert dialogs are a specific type of dialog, which display important
  information that users must acknowledge.
category: Overlays
---

## Example

Unlike the standard [Dialog](/package/dialog) the `AlertDialog` is very
deliberate, with the exception of `children` its layout is prescriptive.

```jsx {% live=true %}
<DialogTrigger>
  <ActionButton>Trigger</ActionButton>
  <AlertDialog title="Low disk space" primaryActionLabel="Okay">
    You are running low on disk space. Delete unnecessary files to free up
    space.
  </AlertDialog>
</DialogTrigger>
```

## Related

- [Dialog](/package/dialog) — For generic dialog requirements.
- [Notice](/package/notice) — For displaying non-modal messages to the user.

## Props

### Actions

The `AlertDialog` supports up to three buttons in its footer: a primary button,
a secondary button, and a cancel button.

#### Labels

Each button can be rendered by providing a string to the `primaryActionLabel`,
`secondaryActionLabel`, and `cancelLabel` respectively. Be sure to localize any
strings provided to the `AlertDialog` and to the button labels as well.

#### Handlers

AlertDialog accepts an `onPrimaryAction`, `onSecondaryAction` and `onCancel`
prop, triggered when the `AlertDialog`'s confirm or cancel buttons are pressed
respectively.

```jsx {% live=true %}
let onPrimaryAction = () => alert('Primary button pressed.');
let onSecondaryAction = () => alert('Secondary button pressed.');
let onCancel = () => alert('Cancel button pressed.');

return (
  <DialogTrigger>
    <ActionButton>Publish</ActionButton>
    <AlertDialog
      title="Confirm publish"
      primaryActionLabel="Yes, publish"
      secondaryActionLabel="Save as draft"
      cancelLabel="Cancel"
      onCancel={onCancel}
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
    >
      Are you sure you want to publish this document?
    </AlertDialog>
  </DialogTrigger>
);
```

### Tone

Use the `"critical"` tone for destructive alert dialogs. Reserve destructive
alerts for situations where a user needs to confirm an action that will impact
their data in a destructive way.

```jsx {% live=true %}
<DialogTrigger>
  <ActionButton>Delete</ActionButton>
  <AlertDialog
    tone="critical"
    title="Delete post"
    primaryActionLabel="Yes, delete"
    cancelLabel="Cancel"
  >
    Are you sure you want to delete this post? You can't undo this action.
  </AlertDialog>
</DialogTrigger>
```

### Title

Alert dialogs must have a visible title, required by passing a string as the
`title` prop. The title string should be localised.

### Focus

Using the `autoFocusButton` prop you can spcify which button, if any, should be
focused when the dialog opens.

```jsx {% live=true %}
<DialogTrigger>
  <ActionButton>Publish</ActionButton>
  <AlertDialog
    title="Confirm publish"
    primaryActionLabel="Yes, publish"
    secondaryActionLabel="Save as draft"
    cancelLabel="Cancel"
    autoFocusButton="primary"
  >
    Are you sure you want to publish this document?
  </AlertDialog>
</DialogTrigger>
```
