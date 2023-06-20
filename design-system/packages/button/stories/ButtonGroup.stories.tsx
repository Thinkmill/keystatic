import { ArgTypes, storiesOf } from '@voussoir/storybook';

import { Box, Flex } from '@voussoir/layout';
import { Text } from '@voussoir/typography';

import { ButtonGroup, Button } from '../src';

export default {
  title: 'Components/ButtonGroup',
};

export const Default = () => (
  <ButtonGroup>
    <Button prominence="high">Primary</Button>
    <Button>Secondary</Button>
  </ButtonGroup>
);

Default.story = {
  name: 'default',
};

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

HorizontalWrap.story = {
  name: 'horizontal: wrap',
};

export const Alignment = (args: ArgTypes) => (
  <Flex border="emphasis" borderWidth="large" UNSAFE_style={{ width: 300 }}>
    <ButtonGroup {...args} flex>
      <Button prominence="high">Primary</Button>
      <Button>Secondary</Button>
    </ButtonGroup>
  </Flex>
);

Alignment.story = {
  name: 'alignment',

  parameters: {
    argTypes: {
      align: radioArg(['start', 'center', 'end'], 0),
      orientation: radioArg(['horizontal', 'vertical'], 0),
    },
  },
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

function radioArg<T>(options: T[], defaultValueIndex: number = 0) {
  return {
    control: { type: 'radio', options },
    defaultValue: options[defaultValueIndex],
  };
}
