import { chain } from '@react-aria/utils';
import { action } from '@keystar/ui-storybook';
import { useReducer } from 'react';

import { ActionButton, Button, ButtonGroup } from '@keystar/ui/button';
import { Content, Header } from '@keystar/ui/slots';
import { Heading, Text } from '@keystar/ui/typography';

import { Dialog, DialogContainer, DialogProps, useDialogContainer } from '..';
import { getParagraph } from './common';

export default {
  title: 'Components/Dialog/DialogContainer',
};

export const Default = () => {
  let [isOpen, toggleOpen] = useReducer(b => !b, false);

  return (
    <>
      <ActionButton onPress={toggleOpen}>Open dialog</ActionButton>
      <DialogContainer onDismiss={toggleOpen}>
        {isOpen && <ExampleDialog />}
      </DialogContainer>
    </>
  );
};

Default.story = {
  name: 'default',
};

export const IsDismissable = () => {
  let [isOpen, toggleOpen] = useReducer(b => !b, false);

  return (
    <>
      <ActionButton onPress={toggleOpen}>Open dialog</ActionButton>
      <DialogContainer isDismissable onDismiss={toggleOpen}>
        {isOpen && <ExampleDialog />}
      </DialogContainer>
    </>
  );
};

IsDismissable.story = {
  name: 'isDismissable',
};

export const TypeFullscreen = () => {
  let [isOpen, toggleOpen] = useReducer(b => !b, false);

  return (
    <>
      <ActionButton onPress={toggleOpen}>Open dialog</ActionButton>
      <DialogContainer type="fullscreen" onDismiss={toggleOpen}>
        {isOpen && <ExampleDialog />}
      </DialogContainer>
    </>
  );
};

TypeFullscreen.story = {
  name: 'type=fullscreen',
};

export const SizeSmall = () => {
  let [isOpen, toggleOpen] = useReducer(b => !b, false);

  return (
    <>
      <ActionButton onPress={toggleOpen}>Open dialog</ActionButton>
      <DialogContainer onDismiss={toggleOpen}>
        {isOpen && <ExampleDialog size="small" />}
      </DialogContainer>
    </>
  );
};

SizeSmall.story = {
  name: 'size=small',
};

export const SizeLarge = () => {
  let [isOpen, toggleOpen] = useReducer(b => !b, false);

  return (
    <>
      <ActionButton onPress={toggleOpen}>Open dialog</ActionButton>
      <DialogContainer onDismiss={toggleOpen}>
        {isOpen && <ExampleDialog size="large" />}
      </DialogContainer>
    </>
  );
};

SizeLarge.story = {
  name: 'size=large',
};

function ExampleDialog(props: Partial<DialogProps>) {
  let container = useDialogContainer();

  return (
    <Dialog {...props}>
      <Heading>Dialog title</Heading>
      <Header>
        <Text size="small" color="neutralSecondary">
          Optional header content
        </Text>
      </Header>
      <Content>
        <Text>{getParagraph(3)}</Text>
      </Content>
      {!props.isDismissable && (
        <ButtonGroup>
          <Button onPress={chain(container.dismiss, action('cancel'))}>
            Cancel
          </Button>
          <Button
            prominence="high"
            onPress={chain(container.dismiss, action('confirm'))}
          >
            Confirm
          </Button>
        </ButtonGroup>
      )}
    </Dialog>
  );
}
