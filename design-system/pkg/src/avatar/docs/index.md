---
title: Avatar
description:
  An avatar is a thumbnail representation of an entity, such as a user or an
  organization.
category: Media
---

## Example

```jsx {% live=true %}
<Avatar src="https://i.pravatar.cc/128?u=avatar" />
```

## Patterns

### Alt text

By default, avatars are decorative. Standalone avatars with no surrounding
context must provide `alt` text for accessibility.

```jsx {% live=true %}
<Avatar src="https://i.pravatar.cc/128?u=avatar" alt="John Smith" />
```

## Props

### Name

The `name` prop is used to derive initials when a source image isn't available.

```jsx {% live=true %}
<Avatar name="John Smith" />
```

### Size

The `size` can be one of the predefined options to ensure alignment with other
elements in a layout.

```jsx {% live=true %}
<Flex gap="large">
  <Avatar src="https://i.pravatar.cc/128?u=avatar" size="xsmall" />
  <Avatar src="https://i.pravatar.cc/128?u=avatar" size="small" />
  <Avatar src="https://i.pravatar.cc/128?u=avatar" size="regular" />
  <Avatar src="https://i.pravatar.cc/128?u=avatar" size="medium" />
  <Avatar src="https://i.pravatar.cc/128?u=avatar" size="large" />
  <Avatar src="https://i.pravatar.cc/128?u=avatar" size="xlarge" />
</Flex>
```

When a `name` is provided the intials will scale with size of the avatar. For
`xsmall` avatars only one character is displayed.

```jsx {% live=true %}
<Flex gap="large">
  <Avatar name="John Smith" size="xsmall" />
  <Avatar name="John Smith" size="small" />
  <Avatar name="John Smith" size="regular" />
  <Avatar name="John Smith" size="medium" />
  <Avatar name="John Smith" size="large" />
  <Avatar name="John Smith" size="xlarge" />
</Flex>
```
