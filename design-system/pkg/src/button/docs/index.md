---
title: Button
description:
  Buttons are pressable elements that are used to trigger actions, their label
  should express what action will occur when the user interacts with it.
category: Feedback
---

## Example

```jsx {% live=true %}
<Button>Button</Button>
```

## Props

### Disabled

To disable a button, use the `isDisabled` prop.

```jsx {% live=true %}
<Button isDisabled>Disabled button</Button>
```

### Prominence

#### High prominence

Highlight important actions and establish a clear hierarchy with buttons of
"high" `prominence`. Avoid using more than 1-2 in the same view, which could
dilute their effectiveness.

```jsx {% live=true %}
<Button prominence="high">High prominence</Button>
```

#### Low prominence

Pair "low" `prominence` buttons with other buttons to surface less prominent
actions. Also appropriate for dense interfaces, like a toolbar, that would
appear crowded by other button styles.

```jsx {% live=true %}
<Button prominence="low">Low prominence</Button>
```

### Tone

The default button prominence is only available in the "neutral" `tone`.

#### Critical tone

The "critical" `tone` is for emphasizing actions that can be destructive or have
negative consequences if taken. Use it sparingly.

```jsx {% live=true %}
<Flex gap="regular" wrap>
  <Button tone="critical" prominence="high">
    Critical
  </Button>
  <Button tone="critical">Critical</Button>
  <Button tone="critical" prominence="low">
    Critical
  </Button>
</Flex>
```

#### Accent tone

The [high prominence](#high-prominence) button receives an "accent" tone by
default. The "accent" `tone` can be used to differentiate low prominence
actions.

```jsx {% live=true %}
<Flex gap="regular" wrap>
  <Button tone="accent" prominence="high">
    Accent
  </Button>
  <Button tone="accent">Accent</Button>
  <Button tone="accent" prominence="low">
    Accent
  </Button>
</Flex>
```

## Slots

Buttons are composed of [slot components](/package/slots).

### Icon

Place an [Icon](/package/icon) next to the label to both clarify an action and
call attention to a button.

```jsx {% live=true %}
<Flex gap="regular" wrap>
  <Button prominence="high">
    <Icon src={saveIcon} />
    <Text>Save</Text>
  </Button>
  <Button>
    <Icon src={downloadIcon} />
    <Text>Download</Text>
  </Button>
  <Button>
    <Text>Next</Text>
    <Icon src={chevronRightIcon} />
  </Button>
  <Button tone="critical" prominence="low">
    <Icon src={trash2Icon} />
    <Text>Delete</Text>
  </Button>
</Flex>
```

When accompanying an icon, button labels must be wrapped with a
[Text](/package/typography/text) component.
