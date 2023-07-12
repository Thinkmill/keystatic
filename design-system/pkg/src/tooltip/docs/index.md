---
title: Tooltip
description:
  Tooltips are floating text labels used to concisely describe the function of
  their associated element.
category: Overlays
---

## Example

```jsx {% live=true %}
<TooltipTrigger>
  <ActionButton>
    <Icon src={bellIcon} />
  </ActionButton>
  <Tooltip>Notifications</Tooltip>
</TooltipTrigger>
```

## Related

- [Popover](/package/dialog/dialog-trigger#popover) — For instances that require
  long content or interactive elements.

## Patterns

### Content

The `TooltipTrigger` accepts exactly two children: the trigger element and the
tooltip itself. The trigger elements **must be interactive** (focusable and
hoverable) to ensure that all users can activate them.

```jsx {% live=true %}
<TooltipTrigger>
  <ActionButton aria-label="More information">
    <Icon src={infoIcon} />
  </ActionButton>
  <Tooltip>
    This tooltip shows roughly the maximum amount of content that should appear
    inside. If more space is needed consider using a popover instead.
  </Tooltip>
</TooltipTrigger>
```

### Delay

Tooltips are shown after a delay when using a mouse, and immediately when
invoked by keyboard focus. For mouse interactions there is a "cooldown" period,
where other tooltips can be immediately shown when their associated element is
hovered over.

```jsx {% live=true %}
<Flex gap="regular">
  <TooltipTrigger>
    <ActionButton>Hover me</ActionButton>
    <Tooltip>I appear after a delay.</Tooltip>
  </TooltipTrigger>
  <TooltipTrigger>
    <ActionButton>Then me</ActionButton>
    <Tooltip>I appear immediately.</Tooltip>
  </TooltipTrigger>
</Flex>
```

## Props

### Disabled

A `Tooltip` will not be shown if its associated element is disabled.

```jsx {% live=true %}
<TooltipTrigger>
  <ActionButton isDisabled>Trigger</ActionButton>
  <Tooltip>Inaccessible tooltip.</Tooltip>
</TooltipTrigger>
```

A `TooltipTrigger` can be disabled without disabling the trigger it displays on.

```jsx {% live=true %}
<TooltipTrigger isDisabled>
  <ActionButton>Trigger</ActionButton>
  <Tooltip>Inaccessible tooltip.</Tooltip>
</TooltipTrigger>
```

### Placement

Use the `placement` prop to set a preferred placement. The tooltip will move
automatically if it is near the edge of the screen.

```jsx {% live=true %}
<TooltipTrigger placement="end">
  <ActionButton>Placement</ActionButton>
  <Tooltip>Horizontally after the trigger.</Tooltip>
</TooltipTrigger>
```
