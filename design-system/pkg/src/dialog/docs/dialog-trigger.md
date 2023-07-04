---
title: DialogTrigger
description:
  Serves as a wrapper around a dialog and its associated trigger, linking the
  dialog's open state with the trigger's press state. Additionally, it allows
  you to customize the type and positioning of the dialog.
category: Overlays
---

## Example

```jsx {% live=true %}
<DialogTrigger type="popover">
  <ActionButton aria-label="Notifications">
    <Icon src={bellIcon} />
  </ActionButton>
  <Dialog>
    <Heading>Notifications</Heading>
    <Content>
      <Text>You have no new notifications.</Text>
    </Content>
  </Dialog>
</DialogTrigger>
```

## Related

- [Dialog](/package/dialog) — Common layout component regardless of modality or
  type of dialog.
- [DialogContainer](/package/dialog/dialog-container) — A controller for dialog
  state, without the requirement for a trigger element.

## Usage

The `DialogTrigger` accepts exactly two children: the element which triggers
opening of the dialog and the dialog itself. The trigger must be the first child
passed into the `DialogTrigger` and should be an element that supports press
events.

If your dialog has buttons within it that should close the dialog when pressed,
you must wrap the dialog in a function in order to propagate the close function
to the dialog's children. **TODO: explain/link info about render functions.**
Dialogs that do not contain such interactive elements can simply provide the
dialog component as is to the `DialogTrigger` as its second child.

```jsx {% live=true %}
<DialogTrigger>
  <ActionButton>Checkout</ActionButton>
  {close => (
    <Dialog>
      <Heading>Confirm checkout?</Heading>
      <Content>
        <Text>You have 5 items in your cart. Proceed to checkout?</Text>
      </Content>
      <ButtonGroup>
        <Button onPress={close}>Cancel</Button>
        <Button prominence="high" onPress={close} autoFocus>
          Yes, proceed
        </Button>
      </ButtonGroup>
    </Dialog>
  )}
</DialogTrigger>
```

## Props

### Type

By providing a `type` prop, you can specify the "type" of dialog that is
rendered by your `DialogTrigger`. Note that pressing the Esc key will close the
dialog regardless of its type.

#### Modal

Modal dialogs include a blanket that blocks access to the underlying interface
until the dialog is closed. Sizing options can be found on the
[Dialog page](/package/dialog#size). Focus is "trapped" inside the dialog until
it's closed.

The term "modal" is sometimes used interchangeably with "dialog", but this is a
misnomer. A dialog is considered modal if it
[blocks interaction](https://en.wikipedia.org/wiki/Modal_window) with the rest
of the application.

```jsx {% live=true %}
<DialogTrigger type="modal">
  <ActionButton>Unlink</ActionButton>
  {close => (
    <Dialog>
      <Heading>Unlinking email</Heading>
      <Content>
        <Text>
          This will unlink your email from your profile "TestUser". Are you
          sure?
        </Text>
      </Content>
      <ButtonGroup>
        <Button onPress={close}>Cancel</Button>
        <Button prominence="high" onPress={close} autoFocus>
          Confirm
        </Button>
      </ButtonGroup>
    </Dialog>
  )}
</DialogTrigger>
```

#### Popover

If a dialog without a blanket is needed, consider using a `"popover"` type
dialog. See dialog [placement](#placement) for how you can customize the
positioning. Note that popovers are automatically rendered as modals on mobile
by default. See the [mobile type](#mobile-type) prop for more information.

```jsx {% live=true %}
<DialogTrigger type="popover">
  <ActionButton>Info</ActionButton>
  <Dialog>
    <Heading>Version Info</Heading>
    <Content>
      <Text>Version 1.0.0, Copyright 2020</Text>
    </Content>
  </Dialog>
</DialogTrigger>
```

#### Tray

Tray dialogs are typically used to portray information on mobile devices or
smaller screens. They should only ever be displayed on devices with small
screens, for interfaces where popovers wouldn't be appropriate.

```jsx {% live=true %}
<DialogTrigger type="tray">
  <ActionButton>Check Messages</ActionButton>
  <Dialog>
    <Heading>New Messages</Heading>
    <Content>
      <Text>You have 5 new messages.</Text>
    </Content>
  </Dialog>
</DialogTrigger>
```

#### Fullscreen

Fullscreen dialogs are a fullscreen variant of the "modal" dialog, only
revealing a small portion of the page behind the blanket. Use this variant for
more complex workflows that do not fit in the available modal dialog sizes. This
variant does not support `isDismissible`.

```jsx {% live=true %}
<DialogTrigger type="fullscreen">
  <ActionButton>See Details</ActionButton>
  {close => (
    <Dialog>
      <Heading>Package details</Heading>
      <Content>
        <Text>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit
          amet tristique risus. In sit amet suscipit lorem. Orci varius natoque
          penatibus et magnis dis parturient montes, nascetur ridiculus mus. In
          condimentum imperdiet metus non condimentum. Duis eu velit et quam
          accumsan tempus at id velit. Duis elementum elementum purus, id tempus
          mauris posuere a. Nunc vestibulum sapien pellentesque lectus commodo
          ornare.
        </Text>
      </Content>
      <ButtonGroup>
        <Button onPress={close}>Cancel</Button>
        <Button prominence="high" onPress={close} autoFocus>
          Buy
        </Button>
      </ButtonGroup>
    </Dialog>
  )}
</DialogTrigger>
```

### Mobile type

The `mobileType` prop allows you to specify what kind of Dialog should be
displayed when viewed on mobile devices or smaller viewports. Note that on
mobile, Popovers are not supported and will display as modals by default.

The example below renders as a Popover on desktop but switches to a Tray on
mobile.

```jsx {% live=true %}
<DialogTrigger type="popover" mobileType="tray">
  <ActionButton>Info</ActionButton>
  <Dialog>
    <Heading>Version Info</Heading>
    <Content>
      <Text>Version 1.0.0, Copyright 2020</Text>
    </Content>
  </Dialog>
</DialogTrigger>
```

### Placement

The popover's placement with respect to its anchor element can be adjusted using
the `placement` prop.

```jsx {% live=true %}
<DialogTrigger type="popover" placement="right top">
  <ActionButton>Trigger</ActionButton>
  <Dialog>
    <Heading>The Heading</Heading>
    <Content>
      <Text>
        This is a popover placed to the right of its trigger and offset so the
        arrow is at the top of the dialog.
      </Text>
    </Content>
  </Dialog>
</DialogTrigger>
```

### Dismissable

If your `"modal"` dialog doesn't require the user to make a confirmation, you
can set `isDismissable` on the `DialogTrigger`. In addition to the added close
button, users can press the blanket to dismiss the dialog.

```jsx {% live=true %}
<DialogTrigger isDismissable type="modal">
  <ActionButton>Status</ActionButton>
  <Dialog>
    <Heading>Post status</Heading>
    <Content>
      <Text>Last edited: Wednesday 9, November 2022</Text>
    </Content>
  </Dialog>
</DialogTrigger>
```

### Offset and cross offset

The popover dialog's offset with respect to its anchor element can be adjusted
using the `offset` and `crossOffset` props. The `offset` prop controls the
spacing applied along the main axis between the element and its anchor element
whereas the `crossOffset` prop handles the spacing applied along the cross axis.

Below is a popover offset by an additional 50px above the trigger.

```jsx {% live=true %}
<DialogTrigger type="popover" placement="top" offset={50}>
  <ActionButton>Trigger</ActionButton>
  <Dialog>
    <Heading>Offset</Heading>
    <Content>
      <Text>Offset by an additional 50px.</Text>
    </Content>
  </Dialog>
</DialogTrigger>
```

Below is a popover cross offset by an additional 100px to the right of the
trigger.

```jsx {% live=true %}
<DialogTrigger type="popover" placement="top" crossOffset={100}>
  <ActionButton>Trigger</ActionButton>
  <Dialog>
    <Heading>Cross offset</Heading>
    <Content>
      <Text>Offset by an additional 100px.</Text>
    </Content>
  </Dialog>
</DialogTrigger>
```

### Open state

`DialogTrigger` accepts an `onOpenChange` handler which is triggered whenever
the dialog is opened or closed.

The example below uses `onOpenChange` to update a separate element with the
current open state of the dialog.

```jsx {% live=true %}
let [state, setState] = React.useState(false);

return (
  <Flex alignItems="center" gap="regular">
    <DialogTrigger
      type="popover"
      placement="top"
      onOpenChange={isOpen => setState(isOpen)}
    >
      <ActionButton>Messages</ActionButton>
      <Dialog>
        <Heading>Messages</Heading>
        <Content>
          <Text>You have 0 new messages.</Text>
        </Content>
      </Dialog>
    </DialogTrigger>
    <Text>Current open state: {state.toString()}</Text>
  </Flex>
);
```
