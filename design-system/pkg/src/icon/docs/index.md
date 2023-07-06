---
title: Icon
description:
  Icons are visual symbols used to represent ideas, objects, or actions. They
  communicate messages at a glance, afford interactivity, and draw attention to
  important information.
category: Media
---

## Example

Keystar UI uses the amazing [Lucide icons](https://lucide.dev).

```jsx {% live=true %}
<Icon src={editIcon} />
```

## Usage

### Imports

Each icon is exposed from its own entry point to reduce the bundle size and
improve performance. Icon entry points follow the pattern:

```jsx
import { nameOfTheIcon } from '@keystar/ui/icon/icons/nameOfTheIcon';
```

When you need multiple icons, import from multiple entry points:

```jsx
import { editIcon } from '@keystar/ui/icon/icons/editIcon';
import { trashCanIcon } from '@keystar/ui/icon/icons/trashCanIcon';
```

### Accessibility

Icons are a great way to communicate detail, but require formatting to ensure
that they are accessible for all users.

Content within static elements can be made accessible to assistive technologies
using the `visuallyHidden` prop on the [Text](/package/typography/text)
component.

```jsx {% live=true %}
<Flex gap="small" alignItems="center">
  <Icon color="critical" src={alertCircleIcon} />
  <Text color="critical">
    <Text visuallyHidden>Danger: </Text>This action is not reversible.
  </Text>
</Flex>
```

While interactive elements can often employ an `aria-label` or `aria-labelledby`
attribute.

```jsx
<ActionButton aria-label="Download">
  <Icon src={downloadIcon} />
</ActionButton>
```

## Props

### Color

Icons accept a semantic `color`, which is applied to the SVG stroke.

```jsx {% live=true %}
<Flex gap="regular">
  <Icon src={editIcon} color="neutralSecondary" />
  <Icon src={plusCircleIcon} color="accent" />
  <Icon src={checkCircleIcon} color="positive" />
  <Icon src={trash2Icon} color="critical" />
</Flex>
```

If no `color` prop is provided, icons will inherit the color of their parent.

```jsx {% live=true %}
<div style={{ color: 'RebeccaPurple' }}>
  <Icon src={heartIcon} />
</div>
```

### Size

Icons are available in a variety of sizes, with `"regular"` as the default.

The `size` of the icon should generally map to the size of its containing
element. The icon's stroke width is relative to the size of the icon.

```jsx {% live=true %}
<Flex gap="regular">
  <Icon src={editIcon} size="small" />
  <Icon src={editIcon} size="regular" />
  <Icon src={editIcon} size="medium" />
  <Icon src={editIcon} size="large" />
</Flex>
```

### Stroke scaling

Mostly reserved for internal components, disabling `strokeScaling` can be useful
in cases where the _visual weight_ of "small" icons needs to be stronger.

```jsx {% live=true %}
<Flex gap="large" direction="column">
  <Flex gap="regular">
    <Icon src={chevronRightIcon} size="small" strokeScaling={false} />
    <Icon src={checkIcon} size="small" strokeScaling={false} />
    <Icon src={searchIcon} size="small" strokeScaling={false} />
    <Icon src={xIcon} size="small" strokeScaling={false} />
  </Flex>
  <Flex gap="regular">
    <Icon src={chevronRightIcon} size="small" />
    <Icon src={checkIcon} size="small" />
    <Icon src={searchIcon} size="small" />
    <Icon src={xIcon} size="small" />
  </Flex>
</Flex>
```
