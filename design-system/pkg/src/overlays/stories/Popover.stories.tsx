import { useRef, useState } from 'react';
import { ArgTypes } from '@keystar/ui-storybook';

import { ActionButton } from '@keystar/ui/button';
import { Box, Flex } from '@keystar/ui/layout';
import { Text } from '@keystar/ui/typography';

import { Placement as PlacementType, Popover } from '..';

export default {
  title: 'Components/Popover',
};

export const Default = () => {
  let triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <ActionButton ref={triggerRef}>Always open</ActionButton>
      <Popover isOpen triggerRef={triggerRef}>
        <Box padding="xlarge" maxWidth="100%" UNSAFE_style={{ width: 320 }}>
          <Text>
            Popovers are small overlays that open on demand. They let users
            access additional content and actions without cluttering the page.
          </Text>
        </Box>
      </Popover>
    </>
  );
};

Default.story = {
  name: 'default',
};

export const Placement = (args: ArgTypes) => {
  let placement = args.placement as unknown as PlacementType;
  let targetRef = useRef<HTMLButtonElement>(null);
  let overlayRef = useRef<HTMLDivElement>(null);

  let [isOpen, setOpen] = useState(false);

  return (
    <Flex direction="column" gap="regular">
      <ActionButton onPress={() => setOpen(open => !open)} ref={targetRef}>
        Toggle
      </ActionButton>
      <Popover
        triggerRef={targetRef}
        isOpen={isOpen}
        onOpenChange={setOpen}
        ref={overlayRef}
        {...args}
      >
        <Flex direction="column" padding="large" gap="regular">
          <Text weight="semibold" color="neutralEmphasis" casing="capitalize">
            {placement}
          </Text>
          <Text>Adjust placement from the control panel.</Text>
        </Flex>
      </Popover>
    </Flex>
  );
};

Placement.args = {
  hideArrow: false,
  placement: 'bottom',
};
Placement.argTypes = {
  placement: {
    control: {
      type: 'select',
    },
    options: [
      'bottom',
      'bottom left',
      'bottom right',
      'bottom start',
      'bottom end',
      'top',
      'top left',
      'top right',
      'top start',
      'top end',
      'left',
      'left top',
      'left bottom',
      'start',
      'start top',
      'start bottom',
      'right',
      'right top',
      'right bottom',
      'end',
      'end top',
      'end bottom',
    ],
  },
};
