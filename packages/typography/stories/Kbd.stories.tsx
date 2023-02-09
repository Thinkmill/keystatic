import { storiesOf } from '@storybook/react';

import { Flex } from '@voussoir/layout';
import { SlotProvider } from '@voussoir/slots';
import { tokenSchema } from '@voussoir/style';

import { Kbd, Text } from '../src';

storiesOf('Components/Typography/Kbd', module)
  .add('default', () => <Kbd>ABC</Kbd>)
  .add('mod: alt', () => <Kbd alt>A</Kbd>)
  .add('mod: meta', () => <Kbd meta>M</Kbd>)
  .add('mod: shift', () => <Kbd shift>S</Kbd>)
  .add('mod: combined', () => (
    <Flex gap="large">
      <Kbd meta>A</Kbd>
      <Kbd alt shift>
        B
      </Kbd>
      <Kbd alt meta shift>
        C
      </Kbd>
    </Flex>
  ))
  .add('mod: stack', () => (
    <Flex direction="column" gap="regular" alignItems="end">
      <Kbd meta>A</Kbd>
      <Kbd meta shift>
        B
      </Kbd>
      <Kbd alt meta shift>
        C
      </Kbd>
      <Kbd meta>M</Kbd>
      <Kbd shift>S</Kbd>
      <Kbd alt>A</Kbd>
      <Kbd meta>1</Kbd>
      <Kbd meta>+</Kbd>
      <Kbd meta>*</Kbd>
      <Kbd meta>#</Kbd>
    </Flex>
  ))
  .add('inside text', () => (
    <Text>
      Press the <Kbd>/</Kbd> key to search.
    </Text>
  ))
  .add('as slot', () => (
    <SlotProvider
      slots={{
        kbd: {
          color: 'neutralEmphasis',
          UNSAFE_style: {
            backgroundColor: tokenSchema.color.background.surfaceSecondary,
            borderRadius: tokenSchema.size.radius.small,
            paddingBlock: tokenSchema.size.space.xsmall,
            paddingInline: tokenSchema.size.space.small,
          },
        },
      }}
    >
      <Text>
        Copy <Kbd meta>C</Kbd> the content between items.
      </Text>
    </SlotProvider>
  ));
