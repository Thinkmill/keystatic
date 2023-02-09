import { chain } from '@react-aria/utils';
import { action, ArgTypes, storiesOf } from '@voussoir/storybook';
import { useState } from 'react';

import { Button, ButtonGroup } from '@voussoir/button';
import { Content, Header } from '@voussoir/slots';
import { Heading, Text } from '@voussoir/typography';

import { Dialog, DialogContainer } from '../src';
import { useDialogContainer } from '../src/useDialogContainer';
import { getParagraph } from './common';

storiesOf('Components/DialogContainer', module).add(
  'default',
  (args: ArgTypes) => {
    let [isOpen, setOpen] = useState(false);

    return (
      <>
        <Button onPress={() => setOpen(true)}>Open dialog</Button>
        <DialogContainer onDismiss={() => setOpen(false)} {...args}>
          {isOpen && <ExampleDialog {...args} />}
        </DialogContainer>
      </>
    );
  },
  {
    argTypes: {
      isDismissable: {
        defaultValue: true,
        control: {
          type: 'boolean',
        },
      },
      type: {
        control: {
          type: 'select',
          options: ['modal', 'fullscreen'],
        },
      },
      size: {
        control: {
          type: 'select',
          options: ['small', 'medium', 'large'],
        },
      },
    },
  }
);

export function DialogContainerExample(props: any) {
  let [isOpen, setOpen] = useState(false);

  return (
    <>
      <Button onPress={() => setOpen(true)}>Open dialog</Button>
      <DialogContainer onDismiss={() => setOpen(false)} {...props}>
        {isOpen && <ExampleDialog {...props} />}
      </DialogContainer>
    </>
  );
}

function ExampleDialog(props: any) {
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
