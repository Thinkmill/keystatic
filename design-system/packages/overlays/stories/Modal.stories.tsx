import { chain } from '@react-aria/utils';
import { useOverlayTriggerState } from '@react-stately/overlays';
import { action, storiesOf } from '@keystar-ui/storybook';
import { useRef, useState } from 'react';

import { Box, Flex, Grid } from '@keystar-ui/layout';
import { Heading, Text } from '@keystar-ui/typography';

import { Modal } from '../src';

storiesOf('Components/Modal', module)
  .add('default', () => {
    let state = useOverlayTriggerState({ isOpen: true });
    return (
      <Modal state={state}>
        <Box padding="xlarge" width="container.xsmall">
          <Text>
            Modal is a low-level utility component for implementing things like
            dialogs and popovers, in a layer above the page.
          </Text>
        </Box>
      </Modal>
    );
  })
  .add('controlled', () => {
    let [isOpen, setOpen] = useState(false);
    let state = useOverlayTriggerState({ isOpen, onOpenChange: setOpen });
    let invokeButton = useRef<HTMLButtonElement>(null);

    return (
      <>
        <button onClick={state.toggle} ref={invokeButton}>
          Open modal
        </button>
        <Modal
          state={state}
          onEnter={action('onEnter')}
          onEntered={action('onEntered')}
          onEntering={action('onEntering')}
          onExit={chain(action('onExit'), () => invokeButton.current?.focus())}
          onExited={action('onExited')}
          onExiting={action('onExiting')}
        >
          <Box padding="xlarge">
            <button onClick={() => setOpen(false)} autoFocus>
              Close
            </button>
          </Box>
        </Modal>
      </>
    );
  })
  .add('dismissable', () => {
    let state = useOverlayTriggerState({ defaultOpen: false });

    return (
      <>
        <button onClick={state.toggle} style={{ marginTop: -100 }}>
          Open modal
        </button>
        <Modal state={state} isDismissable>
          <Box padding="xlarge">
            <Text>Click outside to dismiss</Text>
          </Box>
        </Modal>
      </>
    );
  })
  .add('scroll blocking', () => {
    let state = useOverlayTriggerState({ defaultOpen: false });

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
          <button onClick={state.toggle}>Open modal</button>
        </Flex>
        <div style={{ height: '100vh' }} />
        <Modal state={state} isDismissable>
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
  })
  .add('style props', () => {
    let state = useOverlayTriggerState({ defaultOpen: false });

    return (
      <>
        <button onClick={state.toggle}>Open modal</button>
        <Modal
          state={state}
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
  });
