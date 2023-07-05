import { Flex } from '@keystar/ui/layout';
import { SlotProvider } from '@keystar/ui/slots';
import { tokenSchema } from '@keystar/ui/style';

import { Kbd, Text } from '..';

export default {
  title: 'Components/Typography/Kbd',
};

export const Default = () => <Kbd>ABC</Kbd>;

Default.story = {
  name: 'default',
};

export const ModAlt = () => <Kbd alt>A</Kbd>;

ModAlt.story = {
  name: 'mod: alt',
};

export const ModMeta = () => <Kbd meta>M</Kbd>;

ModMeta.story = {
  name: 'mod: meta',
};

export const ModShift = () => <Kbd shift>S</Kbd>;

ModShift.story = {
  name: 'mod: shift',
};

export const ModCombined = () => (
  <Flex gap="large">
    <Kbd meta>A</Kbd>
    <Kbd alt shift>
      B
    </Kbd>
    <Kbd alt meta shift>
      C
    </Kbd>
  </Flex>
);

ModCombined.story = {
  name: 'mod: combined',
};

export const ModStack = () => (
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
);

ModStack.story = {
  name: 'mod: stack',
};

export const InsideText = () => (
  <Text>
    Press the <Kbd>/</Kbd> key to search.
  </Text>
);

InsideText.story = {
  name: 'inside text',
};

export const AsSlot = () => (
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
);

AsSlot.story = {
  name: 'as slot',
};
