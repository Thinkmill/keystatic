---
title: DialogContainer
description:
  Accepts a single Dialog as a child, and manages showing and hiding it in a
  modal. Useful in cases where there is no trigger element or when the trigger
  unmounts while the dialog is open.
category: Overlays
---

## Example

```jsx {% live=true %}
let [isOpen, setOpen] = React.useState(false);

return (
  <>
    <ActionButton onPress={() => setOpen(true)}>Delete</ActionButton>
    <DialogContainer onDismiss={() => setOpen(false)}>
      {isOpen && (
        <AlertDialog
          tone="critical"
          title="Delete post"
          primaryActionLabel="Yes, delete"
          cancelLabel="Cancel"
        >
          Are you sure you want to delete this post? You can't undo this action.
        </AlertDialog>
      )}
    </DialogContainer>
  </>
);
```

## Related

- [Dialog](/package/dialog) — Common layout component regardless of modality or
  type of dialog.
- [DialogTrigger](/package/dialog/dialog-trigger) — A controller for dialog
  state, bound to an associated trigger.

## Usage

TODO: document usage
