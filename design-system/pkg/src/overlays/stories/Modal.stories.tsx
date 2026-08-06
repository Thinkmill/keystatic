import { useState } from 'react';

import { Box, Flex, Grid } from '@keystar/ui/layout';
import { Heading, Text } from '@keystar/ui/typography';

import { Modal } from '..';

export default {
  title: 'Components/Modal',
};

export const Default = () => {
  return (
    <Modal isOpen>
      <Box padding="xlarge" width="container.xsmall">
        <Text>
          Modal is a low-level utility component for implementing things like
          dialogs and popovers, in a layer above the page.
        </Text>
      </Box>
    </Modal>
  );
};

Default.story = {
  name: 'default',
};

export const Controlled = () => {
  let [isOpen, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(open => !open)}>Open modal</button>
      <Modal isOpen={isOpen} onOpenChange={setOpen}>
        <Box padding="xlarge">
          <button onClick={() => setOpen(false)} autoFocus>
            Close
          </button>
        </Box>
      </Modal>
    </>
  );
};

Controlled.story = {
  name: 'controlled',
};

export const Dismissable = () => {
  let [isOpen, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(open => !open)}
        style={{ marginTop: -100 }}
      >
        Open modal
      </button>
      <Modal isOpen={isOpen} onOpenChange={setOpen} isDismissable>
        <Box padding="xlarge">
          <Text>Click outside to dismiss</Text>
        </Box>
      </Modal>
    </>
  );
};

Dismissable.story = {
  name: 'dismissable',
};

export const ScrollBlocking = () => {
  let [isOpen, setOpen] = useState(false);

  return (
    <>
      <Flex
        direction="column"
        padding="large"
        gap="large"
        justifyContent="center"
        height="100vh"
      >
        <Heading size="large">Scroll down</Heading>
        <button onClick={() => setOpen(open => !open)}>Open modal</button>
      </Flex>
      <div style={{ height: '100vh' }} />
      <Modal isOpen={isOpen} onOpenChange={setOpen} isDismissable>
        <Flex direction="column" padding="xlarge" gap="medium">
          <Text>Scroll should be disabled while the modal is open.</Text>
          <Text>
            Scroll position should not be impacted by the modal opening or
            closing.
          </Text>
        </Flex>
      </Modal>
    </>
  );
};

ScrollBlocking.story = {
  name: 'scroll blocking',
};

export const StyleProps = () => {
  let [isOpen, setOpen] = useState(false);

  return (
    <>
      <button onClick={() => setOpen(open => !open)}>Open modal</button>
      <Modal
        isOpen={isOpen}
        onOpenChange={setOpen}
        isDismissable
        // style props
        width="container.xsmall"
        UNSAFE_className="custom-modal"
        UNSAFE_style={{ overflow: 'auto' }}
      >
        <Grid
          autoRows="minmax(64px, auto)"
          columns="repeat(15, minmax(64px, auto))"
          pointerEvents="none"
        >
          {Array.from({ length: 300 }).map((_, i) => (
            <Box
              key={i}
              backgroundColor={i % 2 ? 'canvas' : 'surfaceSecondary'}
            />
          ))}
        </Grid>
      </Modal>
    </>
  );
};

StyleProps.story = {
  name: 'style props',
};
