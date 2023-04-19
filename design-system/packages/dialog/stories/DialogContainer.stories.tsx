import { chain } from '@react-aria/utils';
import { action, storiesOf } from '@keystar-ui/storybook';
import { useReducer } from 'react';

import { ActionButton, Button, ButtonGroup } from '@keystar-ui/button';
import { Content, Header } from '@keystar-ui/slots';
import { Heading, Text } from '@keystar-ui/typography';

import {
  Dialog,
  DialogContainer,
  DialogProps,
  useDialogContainer,
} from '../src';
import { getParagraph } from './common';

storiesOf('Components/Dialog/DialogContainer', module)
  .add('default', () => {
    let [isOpen, toggleOpen] = useReducer(b => !b, false);

    return (
      <>
        <ActionButton onPress={toggleOpen}>Open dialog</ActionButton>
        <DialogContainer onDismiss={toggleOpen}>
          {isOpen && <ExampleDialog />}
        </DialogContainer>
      </>
    );
  })
  .add('isDismissable', () => {
    let [isOpen, toggleOpen] = useReducer(b => !b, false);

    return (
      <>
        <ActionButton onPress={toggleOpen}>Open dialog</ActionButton>
        <DialogContainer isDismissable onDismiss={toggleOpen}>
          {isOpen && <ExampleDialog />}
        </DialogContainer>
      </>
    );
  })
  .add('type=fullscreen', () => {
    let [isOpen, toggleOpen] = useReducer(b => !b, false);

    return (
      <>
        <ActionButton onPress={toggleOpen}>Open dialog</ActionButton>
        <DialogContainer type="fullscreen" onDismiss={toggleOpen}>
          {isOpen && <ExampleDialog />}
        </DialogContainer>
      </>
    );
  })
  .add('size=small', () => {
    let [isOpen, toggleOpen] = useReducer(b => !b, false);

    return (
      <>
        <ActionButton onPress={toggleOpen}>Open dialog</ActionButton>
        <DialogContainer onDismiss={toggleOpen}>
          {isOpen && <ExampleDialog size="small" />}
        </DialogContainer>
      </>
    );
  })
  .add('size=large', () => {
    let [isOpen, toggleOpen] = useReducer(b => !b, false);

    return (
      <>
        <ActionButton onPress={toggleOpen}>Open dialog</ActionButton>
        <DialogContainer onDismiss={toggleOpen}>
          {isOpen && <ExampleDialog size="large" />}
        </DialogContainer>
      </>
    );
  });

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
