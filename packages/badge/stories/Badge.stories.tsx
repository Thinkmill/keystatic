import { storiesOf } from '@voussoir/storybook';
import { arrowUpRightIcon } from '@voussoir/icon/icons/arrowUpRightIcon';
import { Icon } from '@voussoir/icon';
import { Flex } from '@voussoir/layout';
import { Numeral } from '@voussoir/typography';

import { Badge } from '../src';

storiesOf('Components/Badge', module)
  .add('default', () => <Badge>Badge</Badge>)
  .add('complex children', () => (
    <Badge tone="positive">
      <Icon src={arrowUpRightIcon} />
      <Numeral value={1234} abbreviate />
    </Badge>
  ))
  .add('tones', () => (
    <Flex gap="large" padding="large" wrap>
      <Badge tone="neutral">Neutral</Badge>
      <Badge tone="accent">Accent</Badge>
      <Badge tone="positive">Positive</Badge>
      <Badge tone="caution">Caution</Badge>
      <Badge tone="critical">Critical</Badge>
      <Badge tone="highlight">Highlight</Badge>
      <Badge tone="pending">Pending</Badge>
    </Flex>
  ))
  .add('style props', () => (
    <Badge
      UNSAFE_className="foo"
      UNSAFE_style={{ background: 'wheat' }}
      position="absolute"
      insetTop="medium"
      insetStart="medium"
    >
      Badge
    </Badge>
  ));
