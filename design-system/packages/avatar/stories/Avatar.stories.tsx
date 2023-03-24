import { Flex } from '@voussoir/layout';
import { storiesOf } from '@voussoir/storybook';

import { Avatar } from '../src';

storiesOf('Components/Avatar', module)
  .add('default', () => <Avatar src="https://i.pravatar.cc/128?u=avatar" />)
  .add('with initials', () => <Avatar name="Key Static" />)
  .add('with alt', () => (
    <Avatar alt="avatar" src="https://i.pravatar.cc/128?u=avatar" />
  ))
  .add('sizes', () => (
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
  ));
