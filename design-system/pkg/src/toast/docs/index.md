---
title: Toasts
description:
  Toasts display brief, temporary notifications of actions, errors, or other
  events in an application.
category: Feedback
---

## Example

Include the `Toaster` component at the root of your application.

```jsx
<Toaster />
```

You can then queue a toast from anywhere.

```jsx {% live=true %}
<ActionButton
  onPress={() => {
    toastQueue.positive('Toast is ready!');
  }}
>
  Show toast
</ActionButton>
```

## Patterns

### Accessibility

Toasts are automatically displayed in a
[landmark region](https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/)
labeled "Notifications". The label can be overridden using the `aria-label` prop
of the `Toaster` component. Landmark regions can be navigated using the keyboard
by pressing the `F6` key to move forward, and the `Shift + F6` key to move
backward. This provides an easy way for keyboard users to jump to the toasts
from anywhere in the app. When the last toast is closed, keyboard focus is
restored.

### Programmatic dismissal

Toasts may be programmatically dismissed if they become irrelevant before the
user manually closes them. Each method of `toastQueue` returns a function which
can be used to close that toast.

```jsx {% live=true %}
let [close, setClose] = React.useState(null);

return (
  <ActionButton
    onPress={() => {
      if (!close) {
        let close = toastQueue.critical('Unable to delete entry', {
          onClose: () => setClose(null),
        });
        setClose(() => close);
      } else {
        close();
      }
    }}
  >
    {close ? 'Hide' : 'Show'} toast
  </ActionButton>
);
```

## API

### Actions

Toasts can include an optional action by specifying the `actionLabel` and
`onAction` options when queueing a toast. In addition, the `onClose` event is
triggered when the toast is dismissed. The `shouldCloseOnAction` option
automatically closes the toast when an action is performed.

```jsx {% live=true %}
<ActionButton
  onPress={() =>
    toastQueue.info('A new version is available', {
      actionLabel: 'Update',
      onAction: () => alert('Updating!'),
      shouldCloseOnAction: true,
    })
  }
>
  Show toast
</ActionButton>
```

### Timeout

Toasts support a `timeout` option to automatically hide them after a certain
amount of time. For accessibility, toasts have a minimum timeout of 5 seconds,
and [actionable toasts](#actions) will not auto dismiss. Timers will pause when
the user focuses or hovers over a toast.

Be sure only to automatically dismiss toasts when the information is not
important, or may be found elsewhere. Some users may require additional time to
read a toast message, and screen zoom users may miss toasts entirely.

```jsx {% live=true %}
<ActionButton
  onPress={() =>
    toastQueue.positive('Toast is done, in 5 seconds!', { timeout: 5000 })
  }
>
  Show toast
</ActionButton>
```

### Tones

Toasts are shown according to a priority queue, depending on their `tone`.
[Actionable toasts](#actions) are prioritized over non-actionable toasts, and
errors are prioritized over other types of notifications. Only one toast is
displayed at a time.

```jsx {% live=true %}
<Flex gap="regular">
  <ActionButton onPress={() => toastQueue.neutral('3 items archived')}>
    <Text>Neutral</Text>
  </ActionButton>
  <ActionButton onPress={() => toastQueue.info('A new version is available')}>
    <Icon src={infoIcon} color="accent" />
    <Text>Info</Text>
  </ActionButton>
  <ActionButton onPress={() => toastQueue.positive('File uploaded')}>
    <Icon src={checkCircle2Icon} color="positive" />
    <Text>Positive</Text>
  </ActionButton>
  <ActionButton onPress={() => toastQueue.critical('Unable to delete entry')}>
    <Icon src={alertTriangleIcon} color="critical" />
    <Text>Critical</Text>
  </ActionButton>
</Flex>
```
