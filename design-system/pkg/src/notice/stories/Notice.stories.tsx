import { Flex } from '@keystar/ui/layout';
import { Content } from '@keystar/ui/slots';
import { Heading, Text } from '@keystar/ui/typography';

import { Notice } from '..';

export default {
  title: 'Components/Notice',
};

export const Default = () => <Notice>Notice</Notice>;
Default.storyName = 'default';

export const Tones = () => (
  <Flex gap="large" padding="large" wrap>
    <Notice tone="neutral">Neutral</Notice>
    <Notice tone="positive">Positive</Notice>
    <Notice tone="caution">Caution</Notice>
    <Notice tone="critical">Critical</Notice>
  </Flex>
);
Tones.storyName = 'tones';

export const ComplexChildren = () => (
  <Notice>
    <Heading>Cupcake ipsum dolor sit amet sugar plum.</Heading>
    <Content>
      <Text>
        Bear claw gummies apple pie sweet caramels gummi bears dragée lollipop
        lemon drops. Chocolate jelly beans topping marzipan tart. Fruitcake
        bonbon marshmallow icing soufflé biscuit. Danish gummies cheesecake
        wafer cupcake. Soufflé cupcake macaroon sweet roll pudding powder dragée
        shortbread. Soufflé dragée caramels jelly-o dragée powder. Topping lemon
        drops lemon drops candy canes gummi bears carrot cake chocolate halvah
        topping.
      </Text>
    </Content>
  </Notice>
);
ComplexChildren.storyName = 'complex children';
