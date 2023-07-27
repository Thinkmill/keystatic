import { Flex } from '@keystar/ui/layout';

import { StatusLight } from '..';

export default {
  title: 'Components/StatusLight',
};

export const Default = () => <StatusLight>Status light</StatusLight>;

Default.story = {
  name: 'default',
};

export const NoVisibleLabel = () => (
  <StatusLight aria-label="Approved" tone="positive" role="status" />
);

NoVisibleLabel.story = {
  name: 'no visible label',
};

export const Tones = () => (
  <Flex gap="large" padding="large" wrap>
    <StatusLight tone="neutral">Neutral</StatusLight>
    <StatusLight tone="accent">Accent</StatusLight>
    <StatusLight tone="positive">Positive</StatusLight>
    <StatusLight tone="caution">Caution</StatusLight>
    <StatusLight tone="critical">Critical</StatusLight>
    <StatusLight tone="pending">Pending</StatusLight>
  </Flex>
);

Tones.story = {
  name: 'tones',
};
