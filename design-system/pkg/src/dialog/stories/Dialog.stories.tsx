import { ActionButton, Button, ButtonGroup } from '@keystar/ui/button';
import { Flex } from '@keystar/ui/layout';
import { Content, Footer, Header } from '@keystar/ui/slots';
import { Heading, Text } from '@keystar/ui/typography';
import { ReactElement } from 'react';

import { Dialog, DialogProps, DialogTrigger } from '..';

export default {
  title: 'Components/Dialog',
};

export const Default = () => render();

Default.story = {
  name: 'default',
};

export const Dismissable = () => render({ isDismissable: true });

Dismissable.story = {
  name: 'dismissable',
};

export const FooterContent = () =>
  render({
    footer: (
      <Footer>
        <Text size="small" color="neutralSecondary">
          Optional footer content
        </Text>
      </Footer>
    ),
  });

FooterContent.story = {
  name: 'footer content',
};

export const HeaderContent = () =>
  render({
    header: (
      <Header>
        <Text size="small" color="neutralSecondary">
          Optional header content
        </Text>
      </Header>
    ),
  });

HeaderContent.story = {
  name: 'header content',
};

export const WithoutHeading = () => {
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
};

WithoutHeading.story = {
  name: 'without heading',
};

export const LongContent = () => {
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
};

LongContent.story = {
  name: 'long content',
};

export const SizeSmall = () => render({ size: 'small' });

SizeSmall.story = {
  name: 'size: small',
};

export const SizeMedium = () => render({ size: 'medium' });

SizeMedium.story = {
  name: 'size: medium',
};

export const SizeLarge = () => render({ size: 'large' });

SizeLarge.story = {
  name: 'size: large',
};

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
