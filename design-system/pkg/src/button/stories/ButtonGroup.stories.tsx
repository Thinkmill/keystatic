import { ArgTypes } from '@keystar/ui-storybook';

import { Box, Flex } from '@keystar/ui/layout';
import { Text } from '@keystar/ui/typography';

import { ButtonGroup, Button } from '..';

export default {
  title: 'Components/ButtonGroup',
};

export const Default = () => (
  <ButtonGroup>
    <Button prominence="high">Primary</Button>
    <Button>Secondary</Button>
  </ButtonGroup>
);

export const HorizontalWrap = () => (
  <>
    <Box position="absolute" padding="large" insetBottom={0} insetEnd={0}>
      <Text>Resize this frame so the buttons won't fit on a single row.</Text>
    </Box>
    <ButtonGroup>
      <Button prominence="high">Primary long label</Button>
      <Button prominence="default">Secondary long label</Button>
      <Button prominence="low">Tertiary long label</Button>
    </ButtonGroup>
  </>
);

export const Alignment = (args: ArgTypes) => (
  <Flex border="emphasis" borderWidth="large" UNSAFE_style={{ width: 300 }}>
    <ButtonGroup {...args} flex>
      <Button prominence="high">Primary</Button>
      <Button>Secondary</Button>
    </ButtonGroup>
  </Flex>
);

Alignment.args = {
  align: 'start',
  orientation: 'horizontal',
};
Alignment.argTypes = {
  align: radioArg(['start', 'center', 'end']),
  orientation: radioArg(['horizontal', 'vertical']),
};

export const Disabled = () => (
  <ButtonGroup isDisabled>
    <Button prominence="high">Primary</Button>
    <Button prominence="default">Secondary</Button>
    <Button prominence="low">Tertiary</Button>
  </ButtonGroup>
);

Disabled.story = {
  name: 'disabled',
};

function radioArg<T>(options: T[]) {
  return { control: { type: 'radio' }, options };
}
