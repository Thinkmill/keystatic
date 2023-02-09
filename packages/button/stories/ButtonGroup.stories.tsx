import { ArgTypes, storiesOf } from '@storybook/react';

import { Box, Flex } from '@voussoir/layout';
import { Text } from '@voussoir/typography';

import { ButtonGroup, Button } from '../src';

storiesOf('Components/ButtonGroup', module)
  .add('default', () => (
    <ButtonGroup>
      <Button prominence="high">Primary</Button>
      <Button>Secondary</Button>
    </ButtonGroup>
  ))
  .add('horizontal: wrap', () => (
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
  ))
  .add(
    'alignment',
    (args: ArgTypes) => (
      <Flex border="emphasis" borderWidth="large" width={300}>
        <ButtonGroup {...args} flex>
          <Button prominence="high">Primary</Button>
          <Button>Secondary</Button>
        </ButtonGroup>
      </Flex>
    ),
    {
      argTypes: {
        align: radioArg(['start', 'center', 'end'], 0),
        orientation: radioArg(['horizontal', 'vertical'], 0),
      },
    }
  )
  .add('disabled', () => (
    <ButtonGroup isDisabled>
      <Button prominence="high">Primary</Button>
      <Button prominence="default">Secondary</Button>
      <Button prominence="low">Tertiary</Button>
    </ButtonGroup>
  ));

function radioArg<T>(options: T[], defaultValueIndex: number = 0) {
  return {
    control: { type: 'radio', options },
    defaultValue: options[defaultValueIndex],
  };
}
