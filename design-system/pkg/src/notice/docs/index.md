---
title: Notice
description:
  Use notices to highlight information that affects a section, feature or page.
  Draw attention without interrupting users from their current task.
category: Feedback
---

## Example

The `Notice` is composed of [slot components](/package/slots).

```jsx {% live=true %}
<Notice>
  <Content>
    <Text>
      One of the most appealing features of React is component composition.
      Using existing components, like the{' '}
      <TextLink href="/package/typography/concepts#primitives">
        typographic primitives
      </TextLink>
      , should feel familiar.
    </Text>
    <Text>
      Pretty neat, right? <Emoji symbol="🎉" />
    </Text>
  </Content>
  <div>
    <Heading>
      The notice is <Numeral value={3 / 4} format="percent" /> composition
    </Heading>
  </div>
</Notice>
```

## Props

### Tone

Influencing icons and colours, tone is used to communicate the intent and
importance of a notice to users.

#### Neutral (default)

Let users know about a change or give them advice.

```jsx {% live=true %}
<Notice tone="neutral">
  Information needs to be communicated to the user.
</Notice>
```

#### Positive

Prefer toasts for "positive" messages. Unless the feedback requires a call to
action.

```jsx {% live=true %}
<Notice tone="positive">Something was successful!</Notice>
```

#### Caution

Display information that needs attention or that users need to take action on.

These notices can be stressful for users so use them sparingly.

```jsx {% live=true %}
<Notice tone="caution">
  The user should be aware and possibly exercise caution.
</Notice>
```

#### Critical

Communicate problems that have to be resolved _immediately_ for users to
complete a task. Typically used in form validation, providing a place to
aggregate feedback related to multiple fields.

These notices can be stressful for users so use them sparingly.

```jsx {% live=true %}
<Notice tone="critical">
  An error has occurred, here's feedback on how to proceed.
</Notice>
```

## Accessibility

Notices provide context and assist workflows:

- Critical and caution notices have a role of ”alert” and are announced by
  assistive technologies when they appear. Other notices have a role of
  ”status”, which is read after any critical announcements.
- All notices have an `aria-live` attribute and are announced by assistive
  technologies when their content is updated.
- Notices use `aria-describedby` to describe their purpose to assistive
  technologies, and additionally `aria-labelledby` when a `Heading` is provided.
- The root element has a tabindex of ”0” and displays a keyboard focus
  indicator. Users can discover notices while tabbing through an interface, and
  developers can programmatically move focus to notices.

## Best practices

Use notices thoughtfully and sparingly, for only the most important information.

### Placement

Notices should be placed in the appropriate context:

- Notices relevant to an entire page should be placed at the top of that page,
  below the page header, and occupy the entire content area.
- Notices related to a section within a page (like a card, popover, or modal)
  should be placed inside that section, below any section heading.

### Message content

The message content should:

- Be kept to 1 to 2 sentences where possible.
- Be written in sentence case and use appropriate punctuation.
- Avoid repeating the heading.
- Explain how to resolve the issue.
