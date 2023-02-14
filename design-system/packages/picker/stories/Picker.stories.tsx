import { useAsyncList } from '@react-stately/data';
import { action, storiesOf } from '@voussoir/storybook';
import { useState } from 'react';

import { Button } from '@voussoir/button';
import { alignCenterVerticalIcon } from '@voussoir/icon/icons/alignCenterVerticalIcon';
import { alignStartVerticalIcon } from '@voussoir/icon/icons/alignStartVerticalIcon';
import { alignEndVerticalIcon } from '@voussoir/icon/icons/alignEndVerticalIcon';
import { globeIcon } from '@voussoir/icon/icons/globeIcon';
import { boldIcon } from '@voussoir/icon/icons/boldIcon';
import { italicIcon } from '@voussoir/icon/icons/italicIcon';
import { Icon } from '@voussoir/icon';
import { Box, Flex } from '@voussoir/layout';
import { Text } from '@voussoir/typography';

import { Item, Picker, Section } from '../src';

let flatItems = [
  { id: 1, name: 'Echidna' },
  { id: 2, name: 'Dingo' },
  { id: 3, name: 'Kangaroo' },
  { id: 4, name: 'Quokka' },
  { id: 5, name: 'Platypus' },
  { id: 6, name: 'Koala' },
  { id: 7, name: 'Cassowary' },
  { id: 8, name: 'Wallaby' },
  { id: 9, name: 'Bilby' },
];

let nestedItems = [
  {
    name: 'Marsupials',
    children: [{ name: 'Bilby' }, { name: 'Kangaroo' }, { name: 'Quokka' }],
  },
  {
    name: 'Other',
    children: [{ name: 'Echidna' }, { name: 'Dingo' }, { name: 'Cassowary' }],
  },
];

storiesOf('Components/Picker', module)
  .add('default', () => (
    <Picker label="Test" onSelectionChange={action('selectionChange')}>
      <Item key="One">One</Item>
      <Item key="Two">Two</Item>
      <Item key="Three has a long label that will wrap">
        Three has a long label that will wrap
      </Item>
    </Picker>
  ))
  .add('sections', () => (
    <Picker label="Test" onSelectionChange={action('selectionChange')}>
      <Section title="Marsupials">
        <Item key="Bilby">Bilby</Item>
        <Item key="Kangaroo">Kangaroo</Item>
        <Item key="Quokka">Quokka</Item>
      </Section>
      <Section title="Other">
        <Item key="Echidna">Echidna</Item>
        <Item key="Dingo">Dingo</Item>
        <Item key="Cassowary">Cassowary</Item>
      </Section>
    </Picker>
  ))
  .add('dynamic', () => (
    <Picker
      label="Test"
      items={flatItems}
      onSelectionChange={action('selectionChange')}
    >
      {item => <Item>{item.name}</Item>}
    </Picker>
  ))
  .add('dynamic with sections', () => (
    <Picker
      label="Test"
      items={nestedItems}
      onSelectionChange={action('selectionChange')}
    >
      {item => (
        <Section key={item.name} items={item.children} title={item.name}>
          {item => <Item key={item.name}>{item.name}</Item>}
        </Section>
      )}
    </Picker>
  ))
  .add('disabled', () => (
    <Flex gap="large" direction="column">
      <Picker
        label="Disabled"
        isDisabled
        onSelectionChange={action('selectionChange')}
      >
        <Item key="One">One</Item>
        <Item key="Two">Two</Item>
        <Item key="Three">Three</Item>
      </Picker>
      <Picker
        label="Disabled with selection"
        isDisabled
        selectedKey="One"
        onSelectionChange={action('selectionChange')}
      >
        <Item key="One" textValue="One">
          <Icon src={globeIcon} />
          <Text>One</Text>
        </Item>
        <Item key="Two" textValue="Two">
          <Icon src={globeIcon} />
          <Text>Two</Text>
        </Item>
        <Item key="Three" textValue="Three">
          <Icon src={globeIcon} />
          <Text>Three</Text>
        </Item>
      </Picker>
      <Picker
        label="Disabled keys"
        disabledKeys={['Three']}
        onSelectionChange={action('selectionChange')}
      >
        <Item key="One">One</Item>
        <Item key="Two">Two</Item>
        <Item key="Three">Three</Item>
      </Picker>
    </Flex>
  ))
  .add('required', () => (
    <Picker
      label="Test"
      isRequired
      onSelectionChange={action('selectionChange')}
    >
      <Item key="One">One</Item>
      <Item key="Two">Two</Item>
      <Item key="Three">Three</Item>
    </Picker>
  ))
  .add('complex items', () => (
    <Picker label="Test" onSelectionChange={action('selectionChange')}>
      <Section title="Section 1">
        <Item textValue="Bold">
          <Icon src={boldIcon} />
          <Text>Bold</Text>
        </Item>
        <Item textValue="Italic">
          <Icon src={italicIcon} />
          <Text>Italic</Text>
        </Item>
      </Section>
      <Section title="Section 3">
        <Item textValue="Left">
          <Icon src={alignStartVerticalIcon} />
          <Text>Left</Text>
          <Text slot="description">The description text for left is long</Text>
        </Item>
        <Item textValue="Center has a long label that wraps">
          <Icon src={alignCenterVerticalIcon} />
          <Text>Center has a long label that wraps</Text>
        </Item>
        <Item textValue="Right">
          <Icon src={alignEndVerticalIcon} />
          <Text>Right</Text>
        </Item>
      </Section>
    </Picker>
  ))
  .add('long item text', () => (
    <Picker label="Test" onSelectionChange={action('selectionChange')}>
      <Item key="short">text</Item>
      <Item key="long">your text here long long long long</Item>
      <Item key="underscores">your_text_here_long_long_long_long</Item>
      <Item key="hyphens">your-text-here-long-long-long-long</Item>
      <Item key="singleWord">
        pneumonoultramicroscopicsilicovolcanoconiosis
      </Item>
    </Picker>
  ))
  .add('no visible label', () => (
    <Picker aria-label="Test" onSelectionChange={action('selectionChange')}>
      <Item>One</Item>
      <Item>Two</Item>
      <Item>Three</Item>
    </Picker>
  ))
  .add('with description', () => (
    <Picker
      label="Test"
      description="Please select an item."
      onSelectionChange={action('selectionChange')}
    >
      <Item>One</Item>
      <Item>Two</Item>
      <Item>Three</Item>
    </Picker>
  ))
  .add('with error message', () => (
    <Picker
      label="Test"
      errorMessage="Please select a valid item."
      validationState="invalid"
      onSelectionChange={action('selectionChange')}
    >
      <Item>One</Item>
      <Item>Two</Item>
      <Item>Three</Item>
    </Picker>
  ))
  .add('custom widths', () => (
    <Flex gap="large" direction="column">
      <Picker
        label="Test"
        width={120}
        onSelectionChange={action('selectionChange')}
      >
        <Item>One</Item>
        <Item>Two</Item>
        <Item>Three</Item>
      </Picker>
      <Picker
        label="Test"
        width={400}
        onSelectionChange={action('selectionChange')}
      >
        <Item>One</Item>
        <Item>Two</Item>
        <Item>Three</Item>
      </Picker>
    </Flex>
  ))
  .add('custom menu widths', () => (
    <Flex gap="large" direction="column">
      <Picker
        label="Test"
        menuWidth={100}
        onSelectionChange={action('selectionChange')}
      >
        <Item>One</Item>
        <Item>Two</Item>
        <Item>Three</Item>
      </Picker>
      <Picker
        label="Test"
        menuWidth={400}
        onSelectionChange={action('selectionChange')}
      >
        <Item>One</Item>
        <Item>Two</Item>
        <Item>Three</Item>
      </Picker>
    </Flex>
  ))
  .add('align', () => (
    <Picker
      label="Test"
      menuWidth={400}
      align="end"
      onSelectionChange={action('selectionChange')}
    >
      <Item>One</Item>
      <Item>Two</Item>
      <Item>Three</Item>
    </Picker>
  ))
  .add('direction', () => (
    <Picker
      label="Test"
      direction="top"
      onSelectionChange={action('selectionChange')}
    >
      <Item>One</Item>
      <Item>Two</Item>
      <Item>Three</Item>
    </Picker>
  ))
  .add('isOpen (controlled)', () => (
    <Picker
      label="Test"
      isOpen
      onOpenChange={action('onOpenChange')}
      onSelectionChange={action('selectionChange')}
    >
      <Item>One</Item>
      <Item>Two</Item>
      <Item>Three</Item>
    </Picker>
  ))
  .add('defaultOpen (uncontrolled)', () => (
    <Picker
      label="Test"
      defaultOpen
      onOpenChange={action('onOpenChange')}
      onSelectionChange={action('selectionChange')}
    >
      <Item>One</Item>
      <Item>Two</Item>
      <Item>Three</Item>
    </Picker>
  ))
  .add('selectedKey (controlled)', () => (
    <Picker
      label="Test"
      selectedKey="One"
      onSelectionChange={action('selectionChange')}
    >
      <Item key="One">One</Item>
      <Item key="Two">Two</Item>
      <Item key="Three">Three</Item>
    </Picker>
  ))
  .add('defaultSelectedKey (uncontrolled)', () => (
    <Picker
      label="Test"
      defaultSelectedKey="One"
      onSelectionChange={action('selectionChange')}
    >
      <Item key="One">One</Item>
      <Item key="Two">Two</Item>
      <Item key="Three">Three</Item>
    </Picker>
  ))
  .add('loading', () => (
    <Picker label="Test" isLoading items={[]}>
      {() => <div />}
    </Picker>
  ))
  .add('loading more', () => (
    <Picker label="Test" isLoading items={flatItems}>
      {item => <Item>{item.name}</Item>}
    </Picker>
  ))
  .add('async loading', () => <AsyncLoadingExample />)
  .add('focus', () => (
    <div style={{ display: 'flex', width: 'auto' }}>
      <label htmlFor="focus-before">Focus before</label>
      <input id="focus-before" />
      <Picker
        label="Focus test"
        items={flatItems}
        autoFocus
        onFocus={action('focus')}
        onBlur={action('blur')}
        onKeyDown={action('keydown')}
        onKeyUp={action('keyup')}
      >
        {item => <Item>{item.name}</Item>}
      </Picker>
      <label htmlFor="focus-after">Focus after</label>
      <input id="focus-after" />
    </div>
  ))
  .add('resize', () => <ResizePicker />)
  .add('scrolling container', () => (
    <Box
      backgroundColor="surface"
      border="neutral"
      width={200}
      height={100}
      overflow="auto"
    >
      <Box width={400} height={200}>
        <Picker label="Test" autoFocus>
          <Item key="One">One</Item>
          <Item key="Two">Two</Item>
          <Item key="Three">Three</Item>
        </Picker>
      </Box>
    </Box>
  ));

function AsyncLoadingExample() {
  interface Pokemon {
    name: string;
    url: string;
  }

  let list = useAsyncList<Pokemon>({
    async load({ signal, cursor }) {
      let res = await fetch(cursor || 'https://pokeapi.co/api/v2/pokemon', {
        signal,
      });
      let json = await res.json();
      // The API is too fast sometimes; make it take longer so we can see the spinner
      await new Promise(resolve => setTimeout(resolve, cursor ? 500 : 2000));
      return {
        items: json.results,
        cursor: json.next,
      };
    },
  });

  return (
    <Picker
      label="Pick a Pokemon"
      items={list.items}
      isLoading={list.isLoading}
      onLoadMore={list.loadMore}
    >
      {item => <Item key={item.name}>{item.name}</Item>}
    </Picker>
  );
}

function ResizePicker() {
  const [state, setState] = useState(true);

  return (
    <Flex gap="large" direction="column" alignItems="start">
      <div style={{ width: state ? '200px' : '300px' }}>
        <Picker label="Choose A" width="100%">
          <Item key="A1">A1</Item>
          <Item key="A2">A2</Item>
          <Item key="A3">A3</Item>
        </Picker>
      </div>
      <Button onPress={() => setState(!state)}>Toggle size</Button>
    </Flex>
  );
}
