import { chain } from '@react-aria/utils';
import { useOverlayTriggerState } from '@react-stately/overlays';
import { action } from '@keystar/ui-storybook';
import { useRef, useState } from 'react';

import { Box, Divider, Flex, Grid } from '@keystar/ui/layout';
import { Heading, Text } from '@keystar/ui/typography';

import { Tray } from '..';

export default {
  title: 'Components/Tray',
};

export const Default = () => {
  let state = useOverlayTriggerState({ isOpen: true });
  return (
    <Tray state={state}>
      <Box padding="xlarge">
        <Text>
          Trays are containers that display transient content such as menus
          options, additional actions, etc. They should only ever be used on
          devices with small screens, for interfaces that may be too
          overwhelming in a popover.
        </Text>
      </Box>
    </Tray>
  );
};

Default.story = {
  name: 'default',
};

export const Controlled = () => {
  let [isOpen, setOpen] = useState(false);
  let state = useOverlayTriggerState({ isOpen, onOpenChange: setOpen });
  let invokeButton = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button onClick={state.toggle} ref={invokeButton}>
        Open tray
      </button>
      <Tray
        state={state}
        onEnter={action('onEnter')}
        onEntered={action('onEntered')}
        onEntering={action('onEntering')}
        onExit={chain(action('onExit'), () => invokeButton.current?.focus())}
        onExited={action('onExited')}
        onExiting={action('onExiting')}
      >
        <Box padding="xlarge">
          <Text>Click outside to dismiss</Text>
        </Box>
      </Tray>
    </>
  );
};

Controlled.story = {
  name: 'controlled',
};

export const ScrollBlocking = () => {
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
        <button onClick={state.toggle}>Open tray</button>
      </Flex>
      <div style={{ height: '100vh' }} />
      <Tray state={state}>
        <Flex direction="column" padding="xlarge" gap="medium">
          <Text>Scroll should be disabled while the tray is open.</Text>
          <Text>
            Scroll position should not be impacted by the tray opening or
            closing.
          </Text>
        </Flex>
      </Tray>
    </>
  );
};

ScrollBlocking.story = {
  name: 'scroll blocking',
};

export const FixedHeight = () => {
  let [paragraphs, setParagraphs] = useState(1);
  let state = useOverlayTriggerState({ defaultOpen: false });

  return (
    <>
      <button onClick={state.toggle}>Open tray</button>
      <Tray
        state={state}
        isFixedHeight
        // style props
        UNSAFE_className="custom-tray"
      >
        <Flex direction="column" maxHeight="inherit">
          <Flex gap="regular" padding="large">
            <button
              aria-label="Add paragraph"
              onClick={() => setParagraphs(curr => curr + 1)}
            >
              +
            </button>
            <button
              aria-label="Remove paragraph"
              disabled={paragraphs === 1}
              onClick={() =>
                setParagraphs(curr => (curr > 1 ? curr - 1 : curr))
              }
            >
              -
            </button>
          </Flex>
          <Divider />
          <Grid gap="large" padding="large" overflow="auto" flex>
            {Array.from({ length: paragraphs }).map((_, i) => (
              <Text key={i}>
                Cupcake ipsum dolor sit amet tootsie roll marzipan danish
                marshmallow. Tiramisu chupa chups pie shortbread muffin. Apple
                pie muffin cookie icing sugar plum halvah chocolate cake cookie.
              </Text>
            ))}
          </Grid>
        </Flex>
      </Tray>
    </>
  );
};

FixedHeight.story = {
  name: 'fixed height',
};
