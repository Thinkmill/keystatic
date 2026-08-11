import { Flex } from '@keystar/ui/layout';
import { Kbd, Numeral, Text } from '@keystar/ui/typography';

import { Tooltip, TooltipTrigger } from '..';
import { ActionButton } from '@keystar/ui/button';

const placements = ['start', 'end', 'right', 'left', 'top', 'bottom'] as const;

export default {
  title: 'Components/Tooltip',
};

export const Default = () => <OpenTooltip>Tooltip</OpenTooltip>;

Default.story = {
  name: 'default',
};

export const Placement = () => (
  <Flex alignItems="start" gap="large" wrap>
    {placements.map(p => (
      <OpenTooltip placement={p} key={p}>
        {p}
      </OpenTooltip>
    ))}
  </Flex>
);

Placement.story = {
  name: 'placement',
};

export const LongContent = () => (
  <OpenTooltip>
    <Flex direction="column" gap="medium">
      <Text>
        Cupcake ipsum dolor sit amet <strong>tootsie roll</strong> marzipan
        danish marshmallow. Tiramisu chupa chups pie shortbread muffin.
      </Text>
      <Text>
        Apple pie muffin cookie <em>icing sugar</em> plum halvah chocolate cake
        cookie.
      </Text>
    </Flex>
  </OpenTooltip>
);

LongContent.story = {
  name: 'long content',
};

export const ComplexContent = () => (
  <Flex gap="medium" alignItems="start">
    <OpenTooltip>
      <Numeral value={1234} abbreviate />
    </OpenTooltip>
    <OpenTooltip>
      <Text>Copy</Text>
      <Kbd meta>C</Kbd>
    </OpenTooltip>
  </Flex>
);

ComplexContent.story = {
  name: 'complex content',
};

function OpenTooltip(props: any) {
  return (
    <TooltipTrigger defaultOpen>
      <ActionButton>Trigger</ActionButton>
      <Tooltip UNSAFE_style={{ position: 'static' }} {...props} />
    </TooltipTrigger>
  );
}
