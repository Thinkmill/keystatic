import { action } from '@keystar/ui-storybook';

import { Icon } from '@keystar/ui/icon';
import { bookmarkIcon } from '@keystar/ui/icon/icons/bookmarkIcon';
import { calendarIcon } from '@keystar/ui/icon/icons/calendarIcon';
import { gaugeIcon } from '@keystar/ui/icon/icons/gaugeIcon';
import { Divider, Flex } from '@keystar/ui/layout';
import { tokenSchema } from '@keystar/ui/style';
import { Heading, Text } from '@keystar/ui/typography';
import { useState } from 'react';

import { Tab, TabList, TabPanel, TabPanels, Tabs, TabsProps } from '..';

let cupcakeIpsum =
  'Cupcake ipsum dolor sit amet cotton candy sweet donut caramels. Gummies wafer tiramisu jelly candy canes chocolate croissant. Sugar plum sugar plum biscuit cake croissant jujubes ice cream. Pudding ice cream chocolate bar sesame snaps biscuit.';

type TabItem = { name: string; children: string };
const items: TabItem[] = [
  { name: 'Tab 1', children: 'Tab body 1' },
  { name: 'Tab 2', children: 'Tab body 2' },
  { name: 'Tab 3', children: 'Tab body 3' },
  { name: 'Tab 4', children: 'Tab body 4' },
  { name: 'Tab 5', children: 'Tab body 5' },
  { name: 'Tab 6', children: 'Tab body 6' },
];

export default {
  title: 'Components/Tabs',
};

export const Default = () => render();

Default.story = {
  name: 'default',
};

export const DefaultSelectedKeyVal2 = () =>
  render({ defaultSelectedKey: 'val2' });

DefaultSelectedKeyVal2.story = {
  name: 'defaultSelectedKey: val2',
};

export const ControlledSelectedKeyVal3 = () => render({ selectedKey: 'val3' });

ControlledSelectedKeyVal3.story = {
  name: 'controlled: selectedKey: val3',
};

export const ProminenceLow = () => render({ prominence: 'low' });

ProminenceLow.story = {
  name: 'prominence: low',
};

export const OrientationVertical = () => render({ orientation: 'vertical' });

OrientationVertical.story = {
  name: 'orientation: vertical',
};

export const OrientationVerticalProminenceLow = () =>
  render({ orientation: 'vertical', prominence: 'low' });

OrientationVerticalProminenceLow.story = {
  name: 'orientation: vertical, prominence: low',
};

export const Icons = () => renderWithIcons();

Icons.story = {
  name: 'icons',
};

export const IconsOrientationVertical = () =>
  renderWithIcons({ orientation: 'vertical' });

IconsOrientationVertical.story = {
  name: 'icons, orientation: vertical',
};

export const IconsOrientationVerticalProminenceLow = () =>
  renderWithIcons({ orientation: 'vertical', prominence: 'low' });

IconsOrientationVerticalProminenceLow.story = {
  name: 'icons, orientation: vertical, prominence: low',
};

export const Disabled = () => render({ isDisabled: true });

Disabled.story = {
  name: 'disabled',
};

export const DisabledKeys = () => render({ disabledKeys: ['val2', 'val3'] });

DisabledKeys.story = {
  name: 'disabledKeys',
};

export const FocusablePanelChild = () => {
  let panelStyle = getPanelStyles();
  return (
    <Tabs
      aria-label="Tab example"
      maxWidth="scale.5000"
      onSelectionChange={action('onSelectionChange')}
    >
      <TabList>
        <Tab id="val1">Tab 1</Tab>
        <Tab id="val2">Tab 2</Tab>
      </TabList>
      <Divider />
      <TabPanels UNSAFE_style={panelStyle}>
        <TabPanel id="val1">
          <Heading id="heading-1">Tab 1</Heading>
          <input aria-labelledby="heading-1" />
        </TabPanel>
        <TabPanel id="val2">
          <Heading id="heading-2">Tab 2</Heading>
          <input aria-labelledby="heading-2" />
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

FocusablePanelChild.story = {
  name: 'focusable panel child',
};

export const DynamicComposition = () => {
  let [tabs, setTabs] = useState(items);
  let addTab = () => {
    let count = tabs.length + 1;
    let newTab = { name: `Tab ${count}`, children: `Tab body ${count}` };
    setTabs([...tabs, newTab]);
  };
  let removeTab = () => {
    if (tabs.length > 1) {
      setTabs(tabs.slice(0, -1));
    }
  };
  return (
    <div style={{ width: '80%' }}>
      <Tabs
        aria-label="Dynamic example"
        onSelectionChange={action('onSelectionChange')}
      >
        <Flex alignItems="center" paddingX="large">
          <TabList items={tabs} flex UNSAFE_style={{ overflow: 'hidden' }}>
            {(item: TabItem) => <Tab id={item.name}>{item.name}</Tab>}
          </TabList>

          <Flex gap="regular">
            <button onClick={addTab}>Add</button>
            <button onClick={removeTab}>Remove</button>
          </Flex>
        </Flex>
        <TabPanels
          items={tabs}
          UNSAFE_style={{
            backgroundColor: tokenSchema.color.background.surface,
            borderTop: `1px solid ${tokenSchema.color.border.neutral}`,
            padding: 16,
            display: 'grid',
            gap: 16,
          }}
        >
          {(item: TabItem) => (
            <TabPanel id={item.name}>
              <Heading>{item.children}</Heading>
              <Text>{cupcakeIpsum}</Text>
            </TabPanel>
          )}
        </TabPanels>
      </Tabs>
    </div>
  );
};

DynamicComposition.story = {
  name: 'dynamic + composition',
};

function render(props: Partial<TabsProps> = {}) {
  let panelStyle = getPanelStyles(props);
  return (
    <Tabs
      {...props}
      aria-label="Tabs example"
      maxWidth="scale.4600"
      onSelectionChange={action('onSelectionChange')}
    >
      <TabList>
        <Tab id="val1">Tab 1</Tab>
        <Tab id="val2">Tab 2</Tab>
        <Tab id="val3">Tab 3 long label</Tab>
        <Tab id="val4">Tab 4</Tab>
        <Tab id="val5">Tab 5</Tab>
      </TabList>
      <Divider orientation={props.orientation} />
      <TabPanels UNSAFE_style={panelStyle}>
        <TabPanel id="val1">
          <Heading>Tab body 1</Heading>
          <Text>{cupcakeIpsum}</Text>
        </TabPanel>
        <TabPanel id="val2">
          <Heading>Tab body 2</Heading>
          <Text>{cupcakeIpsum}</Text>
        </TabPanel>
        <TabPanel id="val3">
          <Heading>Tab body 3</Heading>
          <Text>{cupcakeIpsum}</Text>
        </TabPanel>
        <TabPanel id="val4">
          <Heading>Tab body 4</Heading>
          <Text>{cupcakeIpsum}</Text>
        </TabPanel>
        <TabPanel id="val5">
          <Heading>Tab body 5</Heading>
          <Text>{cupcakeIpsum}</Text>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

function renderWithIcons(props: Partial<TabsProps> = {}) {
  let panelStyle = getPanelStyles(props);
  return (
    <Tabs
      {...props}
      aria-label="Tabs with icons example"
      maxWidth="scale.5000"
      onSelectionChange={action('onSelectionChange')}
    >
      <TabList>
        <Tab id="dashboard">
          <Icon src={gaugeIcon} />
          <Text>Dashboard</Text>
        </Tab>
        <Tab id="calendar">
          <Icon src={calendarIcon} />
          <Text>Calendar</Text>
        </Tab>
        <Tab id="bookmark">
          <Icon src={bookmarkIcon} />
          <Text>Bookmark</Text>
        </Tab>
      </TabList>
      <Divider orientation={props.orientation} />
      <TabPanels UNSAFE_style={panelStyle}>
        <TabPanel id="dashboard">
          <Heading>Dashboard</Heading>
          <Text>{cupcakeIpsum}</Text>
        </TabPanel>
        <TabPanel id="calendar">
          <Heading>Calendar</Heading>
          <Text>{cupcakeIpsum}</Text>
        </TabPanel>
        <TabPanel id="bookmark">
          <Heading>Bookmark</Heading>
          <Text>{cupcakeIpsum}</Text>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

function getPanelStyles(props: Partial<TabsProps> = {}) {
  let padProp =
    props.orientation === 'vertical'
      ? 'paddingInlineStart'
      : 'paddingBlockStart';
  return { display: 'grid', gap: 16, [padProp]: 16 };
}
