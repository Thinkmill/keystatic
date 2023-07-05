import { Flex } from '@keystar/ui/layout';

import { Avatar } from '..';

export default {
  title: 'Components/Avatar',
};

export const Default = () => (
  <Avatar src="https://i.pravatar.cc/128?u=avatar" />
);

Default.story = {
  name: 'default',
};

export const WithInitials = () => <Avatar name="Key Static" />;

WithInitials.story = {
  name: 'with initials',
};

export const WithAlt = () => (
  <Avatar alt="avatar" src="https://i.pravatar.cc/128?u=avatar" />
);

WithAlt.story = {
  name: 'with alt',
};

export const Sizes = () => (
  <Flex direction="column" gap="large">
    <Flex gap="large">
      <Avatar name="Key Static" size="xsmall" />
      <Avatar name="Key Static" size="small" />
      <Avatar name="Key Static" size="regular" />
      <Avatar name="Key Static" size="medium" />
      <Avatar name="Key Static" size="large" />
      <Avatar name="Key Static" size="xlarge" />
    </Flex>
    <Flex gap="large">
      <Avatar src="https://i.pravatar.cc/128?u=avatar" size="xsmall" />
      <Avatar src="https://i.pravatar.cc/128?u=avatar" size="small" />
      <Avatar src="https://i.pravatar.cc/128?u=avatar" size="regular" />
      <Avatar src="https://i.pravatar.cc/128?u=avatar" size="medium" />
      <Avatar src="https://i.pravatar.cc/128?u=avatar" size="large" />
      <Avatar src="https://i.pravatar.cc/128?u=avatar" size="xlarge" />
    </Flex>
  </Flex>
);

Sizes.story = {
  name: 'sizes',
};
