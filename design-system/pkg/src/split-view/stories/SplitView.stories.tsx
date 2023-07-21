import { ActionButton } from '@keystar/ui/button';
import { Text } from '@keystar/ui/typography';
import { action } from '@keystar/ui-storybook';
import { useState } from 'react';

import { SplitView, SplitPanePrimary, SplitPaneSecondary } from '../index';

export default {
  title: 'Components/SplitView',
};

export const Default = () => (
  <SplitView defaultSize={200} minSize={100} maxSize={400} height="100vh">
    <SplitPanePrimary>
      <Text>Primary</Text>
    </SplitPanePrimary>
    <SplitPaneSecondary>
      <Text>Secondary</Text>
    </SplitPaneSecondary>
  </SplitView>
);
Default.storyName = 'default';

export const InverseOrder = () => (
  <SplitView defaultSize={200} minSize={100} maxSize={400} height="100vh">
    <SplitPaneSecondary>
      <Text>Secondary</Text>
    </SplitPaneSecondary>
    <SplitPanePrimary>
      <Text>Primary</Text>
    </SplitPanePrimary>
  </SplitView>
);
InverseOrder.storyName = 'secondary | primary';

export const ResizeHandler = () => (
  <SplitView
    defaultSize={200}
    minSize={100}
    maxSize={400}
    height="100vh"
    onResize={action('onResize')}
  >
    <SplitPanePrimary>
      <Text>Primary</Text>
    </SplitPanePrimary>
    <SplitPaneSecondary>
      <Text>Secondary</Text>
    </SplitPaneSecondary>
  </SplitView>
);
ResizeHandler.storyName = 'resize handler';

export const CollapseBehaviour = () => {
  let [isCollapsed, setCollapsed] = useState(false);
  return (
    <SplitView
      defaultSize={200}
      minSize={100}
      maxSize={400}
      height="100vh"
      onResize={action('onResize')}
      onCollapse={() => setCollapsed(true)}
      isCollapsed={isCollapsed}
    >
      <SplitPanePrimary>
        <Text>Primary</Text>
      </SplitPanePrimary>
      <SplitPaneSecondary>
        <ActionButton onPress={() => setCollapsed(b => !b)}>
          {isCollapsed ? 'Expand' : 'Collapse'}
        </ActionButton>
      </SplitPaneSecondary>
    </SplitView>
  );
};
CollapseBehaviour.storyName = 'collapse handler';

export const Storage = () => (
  <SplitView
    defaultSize={200}
    minSize={100}
    maxSize={400}
    height="100vh"
    autoSaveId="storybook"
  >
    <SplitPanePrimary>
      <Text>Primary</Text>
    </SplitPanePrimary>
    <SplitPaneSecondary>
      <Text>Secondary</Text>
    </SplitPaneSecondary>
  </SplitView>
);
Storage.storyName = 'local storage';
