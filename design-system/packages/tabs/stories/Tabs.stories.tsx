import { action, storiesOf } from '@keystar-ui/storybook';

import { Icon } from '@keystar-ui/icon';
import { bookmarkIcon } from '@keystar-ui/icon/icons/bookmarkIcon';
import { calendarIcon } from '@keystar-ui/icon/icons/calendarIcon';
import { gaugeIcon } from '@keystar-ui/icon/icons/gaugeIcon';
import { Divider, Flex } from '@keystar-ui/layout';
import { tokenSchema } from '@keystar-ui/style';
import { Heading, Text } from '@keystar-ui/typography';
import { useState } from 'react';

import { Item, TabList, TabPanels, Tabs, TabsProps } from '../src';

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

storiesOf('Components/Tabs', module)
  .add('default', () => render())
  .add('defaultSelectedKey: val2', () => render({ defaultSelectedKey: 'val2' }))
  .add('controlled: selectedKey: val3', () => render({ selectedKey: 'val3' }))
  .add('prominence: low', () => render({ prominence: 'low' }))
  .add('orientation: vertical', () => render({ orientation: 'vertical' }))
  .add('orientation: vertical, prominence: low', () =>
    render({ orientation: 'vertical', prominence: 'low' })
  )
  .add('icons', () => renderWithIcons())
  .add('icons, orientation: vertical', () =>
    renderWithIcons({ orientation: 'vertical' })
  )
  .add('icons, orientation: vertical, prominence: low', () =>
    renderWithIcons({ orientation: 'vertical', prominence: 'low' })
  )
  .add('disabled', () => render({ isDisabled: true }))
  .add('disabledKeys', () => render({ disabledKeys: ['val2', 'val3'] }))
  .add('focusable panel child', () => {
    let panelStyle = getPanelStyles();
    return (
      <Tabs
        aria-label="Tab example"
        maxWidth="scale.5000"
        onSelectionChange={action('onSelectionChange')}
      >
        <TabList>
          <Item key="val1">Tab 1</Item>
          <Item key="val2">Tab 2</Item>
        </TabList>
        <Divider />
        <TabPanels UNSAFE_style={panelStyle}>
          <Item key="val1">
            <Heading id="heading-1">Tab 1</Heading>
            <input aria-labelledby="heading-1" />
          </Item>
          <Item key="val2">
            <Heading id="heading-2">Tab 2</Heading>
            <input aria-labelledby="heading-2" />
          </Item>
        </TabPanels>
      </Tabs>
    );
  })
  .add('dynamic + composition', () => {
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
          items={tabs}
          onSelectionChange={action('onSelectionChange')}
        >
          <Flex alignItems="center" paddingX="large">
            <TabList flex UNSAFE_style={{ overflow: 'hidden' }}>
              {(item: TabItem) => <Item key={item.name}>{item.name}</Item>}
            </TabList>

            <Flex gap="regular">
              <button onClick={addTab}>Add</button>
              <button onClick={removeTab}>Remove</button>
            </Flex>
          </Flex>
          <TabPanels
            UNSAFE_style={{
              backgroundColor: tokenSchema.color.background.surface,
              borderTop: `1px solid ${tokenSchema.color.border.neutral}`,
              padding: 16,
              display: 'grid',
              gap: 16,
            }}
          >
            {(item: TabItem) => (
              <Item key={item.name}>
                <Heading>{item.children}</Heading>
                <Text>{cupcakeIpsum}</Text>
              </Item>
            )}
          </TabPanels>
        </Tabs>
      </div>
    );
  });

function render<T>(props: Partial<TabsProps<T>> = {}) {
  let panelStyle = getPanelStyles(props);
  return (
    <Tabs
      {...props}
      aria-label="Tabs example"
      maxWidth="scale.4600"
      onSelectionChange={action('onSelectionChange')}
    >
      <TabList>
        <Item key="val1">Tab 1</Item>
        <Item key="val2">Tab 2</Item>
        <Item key="val3">Tab 3 long label</Item>
        <Item key="val4">Tab 4</Item>
        <Item key="val5">Tab 5</Item>
      </TabList>
      <Divider orientation={props.orientation} />
      <TabPanels UNSAFE_style={panelStyle}>
        <Item key="val1">
          <Heading>Tab body 1</Heading>
          <Text>{cupcakeIpsum}</Text>
        </Item>
        <Item key="val2">
          <Heading>Tab body 2</Heading>
          <Text>{cupcakeIpsum}</Text>
        </Item>
        <Item key="val3">
          <Heading>Tab body 3</Heading>
          <Text>{cupcakeIpsum}</Text>
        </Item>
        <Item key="val4">
          <Heading>Tab body 4</Heading>
          <Text>{cupcakeIpsum}</Text>
        </Item>
        <Item key="val5">
          <Heading>Tab body 5</Heading>
          <Text>{cupcakeIpsum}</Text>
        </Item>
      </TabPanels>
    </Tabs>
  );
}

function renderWithIcons<T>(props: Partial<TabsProps<T>> = {}) {
  let panelStyle = getPanelStyles(props);
  return (
    <Tabs
      {...props}
      aria-label="Tabs with icons example"
      maxWidth="scale.5000"
      onSelectionChange={action('onSelectionChange')}
    >
      <TabList>
        <Item key="dashboard">
          <Icon src={gaugeIcon} />
          <Text>Dashboard</Text>
        </Item>
        <Item key="calendar">
          <Icon src={calendarIcon} />
          <Text>Calendar</Text>
        </Item>
        <Item key="bookmark">
          <Icon src={bookmarkIcon} />
          <Text>Bookmark</Text>
        </Item>
      </TabList>
      <Divider orientation={props.orientation} />
      <TabPanels UNSAFE_style={panelStyle}>
        <Item key="dashboard">
          <Heading>Dashboard</Heading>
          <Text>{cupcakeIpsum}</Text>
        </Item>
        <Item key="calendar">
          <Heading>Calendar</Heading>
          <Text>{cupcakeIpsum}</Text>
        </Item>
        <Item key="bookmark">
          <Heading>Bookmark</Heading>
          <Text>{cupcakeIpsum}</Text>
        </Item>
      </TabPanels>
    </Tabs>
  );
}

function getPanelStyles<T>(props: Partial<TabsProps<T>> = {}) {
  let padProp =
    props.orientation === 'vertical'
      ? 'paddingInlineStart'
      : 'paddingBlockStart';
  return { display: 'grid', gap: 16, [padProp]: 16 };
}
