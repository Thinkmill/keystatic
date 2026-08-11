import { useAsyncList } from 'react-aria-components';
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

import {
  Picker,
  PickerCollection,
  PickerHeader,
  PickerItem,
  PickerLoadMoreItem,
  PickerSection,
} from '..';

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
  <Picker label="Test" onChange={action('change')}>
    <PickerItem id="One">One</PickerItem>
    <PickerItem id="Two">Two</PickerItem>
    <PickerItem id="Three has a long label that will wrap">
      Three has a long label that will wrap
    </PickerItem>
  </Picker>
);

Default.story = {
  name: 'default',
};

export const Sections = () => (
  <Picker label="Test" onChange={action('change')}>
    <PickerSection>
      <PickerHeader>Marsupials</PickerHeader>
      <PickerItem id="Bilby">Bilby</PickerItem>
      <PickerItem id="Kangaroo">Kangaroo</PickerItem>
      <PickerItem id="Quokka">Quokka</PickerItem>
    </PickerSection>
    <PickerSection>
      <PickerHeader>Other</PickerHeader>
      <PickerItem id="Echidna">Echidna</PickerItem>
      <PickerItem id="Dingo">Dingo</PickerItem>
      <PickerItem id="Cassowary">Cassowary</PickerItem>
    </PickerSection>
  </Picker>
);

Sections.story = {
  name: 'sections',
};

export const Dynamic = () => (
  <Picker label="Test" items={flatItems} onChange={action('change')}>
    {item => <PickerItem>{item.name}</PickerItem>}
  </Picker>
);

Dynamic.story = {
  name: 'dynamic',
};

export const DynamicWithSections = () => (
  <Picker label="Test" items={nestedItems} onChange={action('change')}>
    {item => (
      <PickerSection id={item.name}>
        <PickerHeader>{item.name}</PickerHeader>
        <PickerCollection items={item.children}>
          {item => <PickerItem id={item.name}>{item.name}</PickerItem>}
        </PickerCollection>
      </PickerSection>
    )}
  </Picker>
);

DynamicWithSections.story = {
  name: 'dynamic with sections',
};

export const Disabled = () => (
  <Flex gap="large" direction="column">
    <Picker label="Disabled" isDisabled onChange={action('change')}>
      <PickerItem id="One">One</PickerItem>
      <PickerItem id="Two">Two</PickerItem>
      <PickerItem id="Three">Three</PickerItem>
    </Picker>
    <Picker
      label="Disabled with selection"
      isDisabled
      value="One"
      onChange={action('change')}
    >
      <PickerItem id="One" textValue="One">
        <Icon src={globeIcon} />
        <Text>One</Text>
      </PickerItem>
      <PickerItem id="Two" textValue="Two">
        <Icon src={globeIcon} />
        <Text>Two</Text>
      </PickerItem>
      <PickerItem id="Three" textValue="Three">
        <Icon src={globeIcon} />
        <Text>Three</Text>
      </PickerItem>
    </Picker>
    <Picker
      label="Disabled keys"
      disabledKeys={['Three']}
      onChange={action('change')}
    >
      <PickerItem id="One">One</PickerItem>
      <PickerItem id="Two">Two</PickerItem>
      <PickerItem id="Three">Three</PickerItem>
    </Picker>
  </Flex>
);

Disabled.story = {
  name: 'disabled',
};

export const Required = () => (
  <Picker label="Test" isRequired onChange={action('change')}>
    <PickerItem id="One">One</PickerItem>
    <PickerItem id="Two">Two</PickerItem>
    <PickerItem id="Three">Three</PickerItem>
  </Picker>
);

Required.story = {
  name: 'required',
};

export const ComplexItems = () => (
  <Picker label="Test" onChange={action('change')}>
    <PickerSection>
      <PickerHeader>PickerSection 1</PickerHeader>
      <PickerItem textValue="Bold">
        <Icon src={boldIcon} />
        <Text>Bold</Text>
      </PickerItem>
      <PickerItem textValue="Italic">
        <Icon src={italicIcon} />
        <Text>Italic</Text>
      </PickerItem>
    </PickerSection>
    <PickerSection>
      <PickerHeader>PickerSection 3</PickerHeader>
      <PickerItem textValue="Left">
        <Icon src={alignStartVerticalIcon} />
        <Text>Left</Text>
        <Text slot="description">The description text for left is long</Text>
      </PickerItem>
      <PickerItem textValue="Center has a long label that wraps">
        <Icon src={alignCenterVerticalIcon} />
        <Text>Center has a long label that wraps</Text>
      </PickerItem>
      <PickerItem textValue="Right">
        <Icon src={alignEndVerticalIcon} />
        <Text>Right</Text>
      </PickerItem>
    </PickerSection>
  </Picker>
);

ComplexItems.story = {
  name: 'complex items',
};

export const LongItemText = () => (
  <Picker label="Test" onChange={action('change')}>
    <PickerItem id="short">text</PickerItem>
    <PickerItem id="long">your text here long long long long</PickerItem>
    <PickerItem id="underscores">your_text_here_long_long_long_long</PickerItem>
    <PickerItem id="hyphens">your-text-here-long-long-long-long</PickerItem>
    <PickerItem id="singleWord">
      pneumonoultramicroscopicsilicovolcanoconiosis
    </PickerItem>
  </Picker>
);

LongItemText.story = {
  name: 'long item text',
};

export const NoVisibleLabel = () => (
  <Picker aria-label="Test" onChange={action('change')}>
    <PickerItem>One</PickerItem>
    <PickerItem>Two</PickerItem>
    <PickerItem>Three</PickerItem>
  </Picker>
);

NoVisibleLabel.story = {
  name: 'no visible label',
};

export const WithDescription = () => (
  <Picker
    label="Test"
    description="Please select an item."
    onChange={action('change')}
  >
    <PickerItem>One</PickerItem>
    <PickerItem>Two</PickerItem>
    <PickerItem>Three</PickerItem>
  </Picker>
);

WithDescription.story = {
  name: 'with description',
};

export const WithErrorMessage = () => (
  <Picker
    label="Test"
    errorMessage="Please select a valid item."
    isInvalid
    onChange={action('change')}
  >
    <PickerItem>One</PickerItem>
    <PickerItem>Two</PickerItem>
    <PickerItem>Three</PickerItem>
  </Picker>
);

WithErrorMessage.story = {
  name: 'with error message',
};

export const CustomWidths = () => (
  <Flex gap="large" direction="column">
    <Picker
      label="Test"
      onChange={action('change')}
      UNSAFE_style={{ width: 120 }}
    >
      <PickerItem>One</PickerItem>
      <PickerItem>Two</PickerItem>
      <PickerItem>Three</PickerItem>
    </Picker>
    <Picker label="Test" width="auto" onChange={action('change')}>
      <PickerItem>One</PickerItem>
      <PickerItem>Two</PickerItem>
      <PickerItem>Three</PickerItem>
    </Picker>
  </Flex>
);

CustomWidths.story = {
  name: 'custom widths',
};

export const CustomMenuWidths = () => (
  <Flex gap="large" direction="column">
    <Picker label="Test" menuWidth={100} onChange={action('change')}>
      <PickerItem>One</PickerItem>
      <PickerItem>Two</PickerItem>
      <PickerItem>Three</PickerItem>
    </Picker>
    <Picker label="Test" menuWidth={400} onChange={action('change')}>
      <PickerItem>One</PickerItem>
      <PickerItem>Two</PickerItem>
      <PickerItem>Three</PickerItem>
    </Picker>
  </Flex>
);

CustomMenuWidths.story = {
  name: 'custom menu widths',
};

export const Align = () => (
  <Picker label="Test" menuWidth={400} align="end" onChange={action('change')}>
    <PickerItem>One</PickerItem>
    <PickerItem>Two</PickerItem>
    <PickerItem>Three</PickerItem>
  </Picker>
);

Align.story = {
  name: 'align',
};

export const Direction = () => (
  <Picker label="Test" direction="top" onChange={action('change')}>
    <PickerItem>One</PickerItem>
    <PickerItem>Two</PickerItem>
    <PickerItem>Three</PickerItem>
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
    onChange={action('change')}
  >
    <PickerItem>One</PickerItem>
    <PickerItem>Two</PickerItem>
    <PickerItem>Three</PickerItem>
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
    onChange={action('change')}
  >
    <PickerItem>One</PickerItem>
    <PickerItem>Two</PickerItem>
    <PickerItem>Three</PickerItem>
  </Picker>
);

DefaultOpenUncontrolled.story = {
  name: 'defaultOpen (uncontrolled)',
};

export const ValueControlled = () => (
  <Picker label="Test" value="One" onChange={action('change')}>
    <PickerItem id="One">One</PickerItem>
    <PickerItem id="Two">Two</PickerItem>
    <PickerItem id="Three">Three</PickerItem>
  </Picker>
);

ValueControlled.story = {
  name: 'value (controlled)',
};

export const DefaultValueUncontrolled = () => (
  <Picker label="Test" defaultValue="One" onChange={action('change')}>
    <PickerItem id="One">One</PickerItem>
    <PickerItem id="Two">Two</PickerItem>
    <PickerItem id="Three">Three</PickerItem>
  </Picker>
);

DefaultValueUncontrolled.story = {
  name: 'defaultValue (uncontrolled)',
};

export const Loading = () => (
  <Picker label="Test">
    <PickerLoadMoreItem isLoading />
  </Picker>
);

Loading.story = {
  name: 'loading',
};

export const LoadingMore = () => (
  <Picker label="Test">
    <PickerCollection items={flatItems}>
      {item => <PickerItem id={item.id}>{item.name}</PickerItem>}
    </PickerCollection>
    <PickerLoadMoreItem isLoading />
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
      {item => <PickerItem>{item.name}</PickerItem>}
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
        <PickerItem id="One">One</PickerItem>
        <PickerItem id="Two">Two</PickerItem>
        <PickerItem id="Three">Three</PickerItem>
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
    <Picker label="Pick a Pokemon">
      <PickerCollection items={list.items}>
        {item => <PickerItem id={item.name}>{item.name}</PickerItem>}
      </PickerCollection>
      <PickerLoadMoreItem
        isLoading={list.isLoading}
        onLoadMore={list.loadMore}
      />
    </Picker>
  );
}

function ResizePicker() {
  const [state, setState] = useState(true);

  return (
    <Flex gap="large" direction="column" alignItems="start">
      <div style={{ width: state ? '200px' : '300px' }}>
        <Picker label="Choose A" width="100%">
          <PickerItem id="A1">A1</PickerItem>
          <PickerItem id="A2">A2</PickerItem>
          <PickerItem id="A3">A3</PickerItem>
        </Picker>
      </div>
      <Button onPress={() => setState(!state)}>Toggle size</Button>
    </Flex>
  );
}
