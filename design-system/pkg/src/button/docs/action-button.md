---
title: ActionButton
description:
  Action buttons allow users to perform an action. They’re used for similar,
  task-based options within a workflow, and are ideal for interfaces where
  buttons aren’t meant to draw a lot of attention.
category: Feedback
---

## Example

```jsx {% live=true %}
<ActionButton>Button</ActionButton>
```

## Props

### Disabled

To disable a button, use the `isDisabled` prop.

```jsx {% live=true %}
<ActionButton isDisabled>Disabled button</ActionButton>
```

### Prominence

#### Low prominence

By default, action buttons have a visible background. This variant works best in
a dense array of controls where the background helps to separate action buttons
from the surrounding container, or to give visibility to isolated buttons.

Alternatively, "low" `prominence` action buttons have no visible background
until they’re interacted with. This variant works best when a clear layout
(vertical stack, table, grid) makes it easy to parse the buttons.

```jsx {% live=true %}
<ActionButton prominence="low">Low prominence</ActionButton>
```

## Slots

Buttons are composed of [slot components](/package/slots).

### Icon

Place an [Icon](/package/icon) next to the label to both clarify an action and
call attention to a button.

```jsx {% live=true %}
<Flex gap="regular" wrap>
  <ActionButton>
    <Icon src={downloadIcon} />
    <Text>Download</Text>
  </ActionButton>
  <ActionButton prominence="low">
    <Text>Next</Text>
    <Icon src={chevronRightIcon} />
  </ActionButton>
</Flex>
```

When accompanying an icon, button labels must be wrapped with a
[Text](/package/typography/text) component.

#### Icon only

If no label is provided (e.g. an icon only button), an alternative text label
must be provided to identify the control for accessibility. This should be added
using the `aria-label` prop.

```jsx {% live=true %}
<ActionButton aria-label="Download">
  <Icon src={downloadIcon} />
</ActionButton>
```

You could also wrap the button with a [Tooltip](/package/tooltip), which will
provide the appropriate accessibility attributes to the button.
