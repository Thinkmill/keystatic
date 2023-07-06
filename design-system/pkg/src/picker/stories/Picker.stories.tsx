import { useAsyncList } from '@react-stately/data';
import { action } from '@keystar/ui-storybook';
import { useState } from 'react';

import { Button } from '@keystar/ui/button';
import { alignCenterVerticalIcon } from '@keystar/ui/icon/icons/alignCenterVerticalIcon';
import { alignStartVerticalIcon } from '@keystar/ui/icon/icons/alignStartVerticalIcon';
import { alignEndVerticalIcon } from '@keystar/ui/icon/icons/alignEndVerticalIcon';
import { globeIcon } from '@keystar/ui/icon/icons/globeIcon';
import { boldIcon } from '@keystar/ui/icon/icons/boldIcon';
import { italicIcon } from '@keystar/ui/icon/icons/italicIcon';
import { Icon } from '@keystar/ui/icon';
import { Box, Flex } from '@keystar/ui/layout';
import { Text } from '@keystar/ui/typography';

import { Item, Picker, Section } from '..';

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

export default {
  title: 'Components/Picker',
};

export const Default = () => (
  <Picker label="Test" onSelectionChange={action('selectionChange')}>
    <Item key="One">One</Item>
    <Item key="Two">Two</Item>
    <Item key="Three has a long label that will wrap">
      Three has a long label that will wrap
    </Item>
  </Picker>
);

Default.story = {
  name: 'default',
};

export const Sections = () => (
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
);

Sections.story = {
  name: 'sections',
};

export const Dynamic = () => (
  <Picker
    label="Test"
    items={flatItems}
    onSelectionChange={action('selectionChange')}
  >
    {item => <Item>{item.name}</Item>}
  </Picker>
);

Dynamic.story = {
  name: 'dynamic',
};

export const DynamicWithSections = () => (
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
);

DynamicWithSections.story = {
  name: 'dynamic with sections',
};

export const Disabled = () => (
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
);

Disabled.story = {
  name: 'disabled',
};

export const Required = () => (
  <Picker label="Test" isRequired onSelectionChange={action('selectionChange')}>
    <Item key="One">One</Item>
    <Item key="Two">Two</Item>
    <Item key="Three">Three</Item>
  </Picker>
);

Required.story = {
  name: 'required',
};

export const ComplexItems = () => (
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
);

ComplexItems.story = {
  name: 'complex items',
};

export const LongItemText = () => (
  <Picker label="Test" onSelectionChange={action('selectionChange')}>
    <Item key="short">text</Item>
    <Item key="long">your text here long long long long</Item>
    <Item key="underscores">your_text_here_long_long_long_long</Item>
    <Item key="hyphens">your-text-here-long-long-long-long</Item>
    <Item key="singleWord">pneumonoultramicroscopicsilicovolcanoconiosis</Item>
  </Picker>
);

LongItemText.story = {
  name: 'long item text',
};

export const NoVisibleLabel = () => (
  <Picker aria-label="Test" onSelectionChange={action('selectionChange')}>
    <Item>One</Item>
    <Item>Two</Item>
    <Item>Three</Item>
  </Picker>
);

NoVisibleLabel.story = {
  name: 'no visible label',
};

export const WithDescription = () => (
  <Picker
    label="Test"
    description="Please select an item."
    onSelectionChange={action('selectionChange')}
  >
    <Item>One</Item>
    <Item>Two</Item>
    <Item>Three</Item>
  </Picker>
);

WithDescription.story = {
  name: 'with description',
};

export const WithErrorMessage = () => (
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
);

WithErrorMessage.story = {
  name: 'with error message',
};

export const CustomWidths = () => (
  <Flex gap="large" direction="column">
    <Picker
      label="Test"
      onSelectionChange={action('selectionChange')}
      UNSAFE_style={{ width: 120 }}
    >
      <Item>One</Item>
      <Item>Two</Item>
      <Item>Three</Item>
    </Picker>
    <Picker
      label="Test"
      width="auto"
      onSelectionChange={action('selectionChange')}
    >
      <Item>One</Item>
      <Item>Two</Item>
      <Item>Three</Item>
    </Picker>
  </Flex>
);

CustomWidths.story = {
  name: 'custom widths',
};

export const CustomMenuWidths = () => (
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
);

CustomMenuWidths.story = {
  name: 'custom menu widths',
};

export const Align = () => (
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
);

Align.story = {
  name: 'align',
};

export const Direction = () => (
  <Picker
    label="Test"
    direction="top"
    onSelectionChange={action('selectionChange')}
  >
    <Item>One</Item>
    <Item>Two</Item>
    <Item>Three</Item>
  </Picker>
);

Direction.story = {
  name: 'direction',
};

export const IsOpenControlled = () => (
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
);

IsOpenControlled.story = {
  name: 'isOpen (controlled)',
};

export const DefaultOpenUncontrolled = () => (
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
);

DefaultOpenUncontrolled.story = {
  name: 'defaultOpen (uncontrolled)',
};

export const SelectedKeyControlled = () => (
  <Picker
    label="Test"
    selectedKey="One"
    onSelectionChange={action('selectionChange')}
  >
    <Item key="One">One</Item>
    <Item key="Two">Two</Item>
    <Item key="Three">Three</Item>
  </Picker>
);

SelectedKeyControlled.story = {
  name: 'selectedKey (controlled)',
};

export const DefaultSelectedKeyUncontrolled = () => (
  <Picker
    label="Test"
    defaultSelectedKey="One"
    onSelectionChange={action('selectionChange')}
  >
    <Item key="One">One</Item>
    <Item key="Two">Two</Item>
    <Item key="Three">Three</Item>
  </Picker>
);

DefaultSelectedKeyUncontrolled.story = {
  name: 'defaultSelectedKey (uncontrolled)',
};

export const Loading = () => (
  <Picker label="Test" isLoading items={[]}>
    {() => <div />}
  </Picker>
);

Loading.story = {
  name: 'loading',
};

export const LoadingMore = () => (
  <Picker label="Test" isLoading items={flatItems}>
    {item => <Item>{item.name}</Item>}
  </Picker>
);

LoadingMore.story = {
  name: 'loading more',
};

export const AsyncLoading = () => <AsyncLoadingExample />;

AsyncLoading.story = {
  name: 'async loading',
};

export const Focus = () => (
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
);

Focus.story = {
  name: 'focus',
};

export const Resize = () => <ResizePicker />;

Resize.story = {
  name: 'resize',
};

export const ScrollingContainer = () => (
  <Box
    backgroundColor="surface"
    border="neutral"
    width="scale.2400"
    height="scale.1200"
    overflow="auto"
  >
    <Box width="scale.5000" height="scale.2400">
      <Picker label="Test" autoFocus>
        <Item key="One">One</Item>
        <Item key="Two">Two</Item>
        <Item key="Three">Three</Item>
      </Picker>
    </Box>
  </Box>
);

ScrollingContainer.story = {
  name: 'scrolling container',
};

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
