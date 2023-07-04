import { arrowUpRightIcon } from '@keystar/ui/icon/icons/arrowUpRightIcon';
import { Icon } from '@keystar/ui/icon';
import { Flex } from '@keystar/ui/layout';
import { Numeral } from '@keystar/ui/typography';

import { Badge } from '..';

export default {
  title: 'Components/Badge',
};

export const Default = () => <Badge>Badge</Badge>;

Default.story = {
  name: 'default',
};

export const ComplexChildren = () => (
  <Badge tone="positive">
    <Icon src={arrowUpRightIcon} />
    <Numeral value={1234} abbreviate />
  </Badge>
);

ComplexChildren.story = {
  name: 'complex children',
};

export const Tones = () => (
  <Flex gap="large" padding="large" wrap>
    <Badge tone="neutral">Neutral</Badge>
    <Badge tone="accent">Accent</Badge>
    <Badge tone="positive">Positive</Badge>
    <Badge tone="caution">Caution</Badge>
    <Badge tone="critical">Critical</Badge>
    <Badge tone="highlight">Highlight</Badge>
    <Badge tone="pending">Pending</Badge>
  </Flex>
);

Tones.story = {
  name: 'tones',
};

export const StyleProps = () => (
  <Badge
    UNSAFE_className="foo"
    UNSAFE_style={{ background: 'wheat' }}
    position="absolute"
    insetTop="medium"
    insetStart="medium"
  >
    Badge
  </Badge>
);

StyleProps.story = {
  name: 'style props',
};
