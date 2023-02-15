import { storiesOf } from '@voussoir/storybook';

import { ActionButton, Button, ButtonGroup } from '@voussoir/button';
import { Flex } from '@voussoir/layout';
import { Content, Footer, Header } from '@voussoir/slots';
import { Heading, Text } from '@voussoir/typography';
import { ReactElement } from 'react';

import { Dialog, DialogProps, DialogTrigger } from '../src';

storiesOf('Components/Dialog', module)
  .add('default', () => render())
  .add('dismissable', () => render({ isDismissable: true }))
  .add('footer content', () =>
    render({
      footer: (
        <Footer>
          <Text size="small" color="neutralSecondary">
            Optional footer content
          </Text>
        </Footer>
      ),
    })
  )
  .add('header content', () =>
    render({
      header: (
        <Header>
          <Text size="small" color="neutralSecondary">
            Optional header content
          </Text>
        </Header>
      ),
    })
  )
  .add('without heading', () => {
    return (
      <DialogTrigger defaultOpen>
        <ActionButton>Open dialog</ActionButton>
        {close => (
          <Dialog aria-label="Inclusive label">
            <Content>{singleParagraph()}</Content>
            <ButtonGroup>
              <Button onPress={close}>Close</Button>
            </ButtonGroup>
          </Dialog>
        )}
      </DialogTrigger>
    );
  })
  .add('long content', () => {
    let paragraphs = Array(8).fill(singleParagraph());
    return (
      <DialogTrigger defaultOpen>
        <ActionButton>Open dialog</ActionButton>
        {close => (
          <Dialog>
            <Heading>Long content</Heading>
            <Content>
              <Flex direction="column" gap="large">
                {paragraphs}
              </Flex>
            </Content>
            <ButtonGroup>
              <Button onPress={close}>Close</Button>
            </ButtonGroup>
          </Dialog>
        )}
      </DialogTrigger>
    );
  })
  .add('size: small', () => render({ size: 'small' }))
  .add('size: medium', () => render({ size: 'medium' }))
  .add('size: large', () => render({ size: 'large' }));

function render({
  isDismissable,
  footer,
  header,
  ...props
}: Partial<DialogProps> & {
  footer?: ReactElement;
  header?: ReactElement;
} = {}) {
  return (
    <DialogTrigger isDismissable={isDismissable} defaultOpen>
      <ActionButton>Open dialog</ActionButton>
      {close => (
        <Dialog {...props}>
          <Heading>Dialog heading</Heading>
          {header}
          <Content>{singleParagraph()}</Content>
          {footer}
          {!isDismissable && (
            <ButtonGroup>
              <Button onPress={close}>Cancel</Button>
              <Button prominence="high" onPress={close}>
                Confirm
              </Button>
            </ButtonGroup>
          )}
        </Dialog>
      )}
    </DialogTrigger>
  );
}
let singleParagraph = () => (
  <Text>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin sit amet
    tristique risus. In sit amet suscipit lorem. Orci varius natoque penatibus
    et magnis dis parturient montes, nascetur ridiculus mus. In condimentum
    imperdiet metus non condimentum. Duis eu velit et quam accumsan tempus at id
    velit. Duis elementum elementum purus, id tempus mauris posuere a. Nunc
    vestibulum sapien pellentesque lectus commodo ornare.
  </Text>
);
