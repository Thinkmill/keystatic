---
title: Dialog
description:
  Dialogs are windows containing contextual information, tasks, or workflows
  that appear over the user interface.
category: Overlays
---

## Example

```jsx {% live=true %}
<DialogTrigger>
  <ActionButton>Trigger</ActionButton>
  {close => (
    <Dialog>
      <Heading>Export items</Heading>
      <Content>
        <Text>
          TODO: replace this copy with some contrived form, once radio groups
          are built.
        </Text>
      </Content>
      <ButtonGroup>
        <Button onPress={close}>Cancel</Button>
        <Button prominence="high" onPress={close}>
          Export
        </Button>
      </ButtonGroup>
    </Dialog>
  )}
</DialogTrigger>
```

## Related

- [AlertDialog](/package/dialog/alert-dialog) — For confirmation of an action or
  acknowledgment.
- [DialogTrigger](/package/dialog/dialog-trigger) — A controller for dialog
  state, bound to an associated trigger.
- [DialogContainer](/package/dialog/dialog-container) — A controller for dialog
  state, without the requirement for a trigger element.

## Props

### Dismissable

[Dismissable](/package/dialog/dialog-trigger#dismissable) dialogs support an
optional `onDismiss` prop which is triggered whenever the dialog's close button
is clicked. If this event callback is not needed, the dismissiable dialog will
behave as normal without passing this callback through.

```jsx {% live=true %}
let dismiss = close => {
  close();
  alert('Dialog dismissed.');
};
return (
  <DialogTrigger isDismissable>
    <ActionButton>About</ActionButton>
    {close => (
      <Dialog onDismiss={() => dismiss(close)}>
        <Heading>Overview</Heading>
        <Content>
          <Text>
            An internationally recognised{' '}
            <strong>design & development consultancy</strong> that helps teams
            ship great apps, develop and scale Design Systems and Front-ends,
            and overcome the hard problems in software development.
          </Text>
        </Content>
      </Dialog>
    )}
  </DialogTrigger>
);
```

### Size

Only dialogs of type `"modal"` support a `size` prop. Sizes on mobile devices
are unaffected by this prop due to screen constraints.

```jsx {% live=true %}
const [size, setSize] = React.useState(null);

return (
  <>
    <ActionGroup onAction={key => setSize(old => (old ? null : key))}>
      {['small', 'medium', 'large'].map(key => (
        <Item key={key}>
          <Text casing="capitalize">{key}</Text>
        </Item>
      ))}
    </ActionGroup>
    <DialogContainer onDismiss={() => setSize(null)} isDismissable>
      {size && (
        <Dialog size={size}>
          <Heading>Heading</Heading>
          <Content>
            <Text>Text content</Text>
          </Content>
        </Dialog>
      )}
    </DialogContainer>
  </>
);
```

## Slots

Use [slots](/package/slots) to populate the dialog content by providing the
following components as children.

```jsx {% live=true %}
<DialogTrigger>
  <ActionButton>Register</ActionButton>
  {close => (
    <Dialog>
      <Heading>
        <Flex alignItems="center" gap="regular">
          <Icon src={bookIcon} size="medium" />
          <span>Register for newsletter</span>
        </Flex>
      </Heading>
      <Header>
        <TextLink href="//example.com" target="_blank" prominence="high">
          What is this?
        </TextLink>
      </Header>
      <Content>
        <Flex
          elementType="form"
          id="example-form"
          onSubmit={e => {
            e.preventDefault();
            close();
          }}
          direction="column"
          gap="large"
        >
          <TextField label="First Name" autoFocus />
          <TextField label="Last Name" />
          <TextField label="Street Address" />
          <TextField label="City" />
        </Flex>
      </Content>
      <Footer>
        <Checkbox>
          I want to receive updates for exclusive offers in my area.
        </Checkbox>
      </Footer>
      <ButtonGroup>
        <Button onPress={close}>Cancel</Button>
        <Button prominence="high" type="submit" form="example-form">
          Register
        </Button>
      </ButtonGroup>
    </Dialog>
  )}
</DialogTrigger>
```

It is important to note that the `Heading`, `Header`, `Content`, and `Footer`
components accept `React.ReactNode`, not just strings. This allows you to create
dialogs for more complex workflows.

### Heading

[Heading](/package/typography/heading) is required, it acts as the title for the
dialog, providing context for what the user should expect.

### Content

`Content` is also required. It acts as the "body" of the dialog: this is where
you'll compose children.

### Button group

Use the [ButtonGroup](/package/button/button-group) component to provide actions
for the dialog. Typically displayed below the content slot, except within
[fullscreen](/package/dialog/dialog-trigger#fullscreen) modal dialogs, where it
is displayed alongside the header.

### Header

You may optionally provide a `Header` component which will be rendered alongside
the `Heading`, except on small devices where it will stack below the `Heading`
content.

### Footer

You may optionally provide a `Footer` component which will be rendered alongside
the `ButtonGroup`, except on small devices where it will stack above the
`ButtonGroup` actions.
