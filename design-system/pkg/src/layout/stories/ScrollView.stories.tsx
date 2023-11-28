import { ArgTypes } from '@keystar/ui-storybook';
import { Box, ScrollView } from '../index';

export default {
  title: 'Components/ScrollView',
};

export const Default = () => (
  <ScrollView backgroundColor="surface" height="scale.2400" width="scale.2400">
    <div>Start</div>
    <div style={{ height: 1000 }} />
    <div>End</div>
  </ScrollView>
);
Default.storyName = 'default';

export const DirectionRow = () => (
  <ScrollView
    direction="horizontal"
    backgroundColor="surface"
    height="scale.2400"
    width="scale.2400"
  >
    <div>Start</div>
    <div style={{ width: 1000 }} />
    <div>End</div>
  </ScrollView>
);
DirectionRow.storyName = 'direction=horizontal';

export const NoOverflow = () => (
  <ScrollView backgroundColor="surface" height="scale.2400" width="scale.2400">
    <div>Start</div>
    <div style={{ width: 100 }} />
    <div>End</div>
  </ScrollView>
);
NoOverflow.storyName = 'no overflow';

export const Gaps = (args: ArgTypes) => (
  <ScrollView
    backgroundColor="surface"
    height="scale.2400"
    width="scale.2400"
    gap="large"
    padding="large"
    {...args}
  >
    <div>Start</div>
    <Box
      backgroundColor="accent"
      height="element.large"
      width="element.large"
    />
    <Box
      backgroundColor="positive"
      height="element.large"
      width="element.large"
    />
    <Box
      backgroundColor="caution"
      height="element.large"
      width="element.large"
    />
    <Box
      backgroundColor="critical"
      height="element.large"
      width="element.large"
    />
    <Box
      backgroundColor="pending"
      height="element.large"
      width="element.large"
    />
    <div>End</div>
  </ScrollView>
);
Gaps.storyName = 'gaps';
Gaps.args = {
  direction: 'vertical',
};
Gaps.argTypes = {
  direction: {
    control: {
      type: 'select',
      options: ['vertical', 'horizontal'],
    },
  },
};
