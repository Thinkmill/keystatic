import { useAsyncList } from '@react-stately/data';
import { Meta, action } from '@keystar/ui-storybook';
import { alignCenterVerticalIcon } from '@keystar/ui/icon/icons/alignCenterVerticalIcon';
import { alignStartVerticalIcon } from '@keystar/ui/icon/icons/alignStartVerticalIcon';
import { alignEndVerticalIcon } from '@keystar/ui/icon/icons/alignEndVerticalIcon';
import { copyIcon } from '@keystar/ui/icon/icons/copyIcon';
import { clipboardCopyIcon } from '@keystar/ui/icon/icons/clipboardCopyIcon';
import { scissorsIcon } from '@keystar/ui/icon/icons/scissorsIcon';
import { Icon } from '@keystar/ui/icon';

import { Flex } from '@keystar/ui/layout';
import { Kbd, Text } from '@keystar/ui/typography';

import { Item, ListBox, Section } from '..';

let iconMap = {
  AlignHorizontalCenterIcon: alignCenterVerticalIcon,
  AlignHorizontalLeftIcon: alignStartVerticalIcon,
  AlignHorizontalRightIcon: alignEndVerticalIcon,
  CopyIcon: copyIcon,
  CutIcon: scissorsIcon,
  PasteIcon: clipboardCopyIcon,
};

let hardModeProgrammatic = [
  {
    name: 'Section 1',
    children: [
      { name: 'Copy', icon: 'CopyIcon' },
      { name: 'Cut', icon: 'CutIcon' },
      { name: 'Paste', icon: 'PasteIcon' },
    ],
  },
  {
    name: 'Section 2',
    children: [
      { name: 'Left', icon: 'AlignHorizontalLeftIcon' },
      { name: 'Center', icon: 'AlignHorizontalCenterIcon' },
      { name: 'Right', icon: 'AlignHorizontalRightIcon' },
    ],
  },
];
let flatOptions = [
  { name: 'Echidna' },
  { name: 'Dingo' },
  { name: 'Kangaroo' },
  { name: 'Quokka' },
  { name: 'Platypus' },
  { name: 'Koala' },
  { name: 'Cassowary' },
  { name: 'Wallaby' },
  { name: 'Bilby' },
];

let withSection = [
  {
    name: 'Marsupials',
    children: [{ name: 'Bilby' }, { name: 'Kangaroo' }, { name: 'Quokka' }],
  },
  {
    name: 'Other',
    children: [{ name: 'Echidna' }, { name: 'Dingo' }, { name: 'Cassowary' }],
  },
];

let lotsOfSections: any[] = [];
for (let i = 0; i < 50; i++) {
  let children = [];
  for (let j = 0; j < 50; j++) {
    children.push({ name: `Section ${i}, Item ${j}` });
  }

  lotsOfSections.push({ name: 'Section ' + i, children });
}

const meta: Meta = {
  title: 'Components/ListBox',

  decorators: [
    story => (
      <>
        <Text visuallyHidden elementType="label" id="label">
          Choose an item
        </Text>
        <Flex
          // backgroundColor="surface"
          border="neutral"
          UNSAFE_style={{ minWidth: 200, maxHeight: 300 }}
        >
          {story()}
        </Flex>
      </>
    ),
  ],
};
export default meta;

export const Default = () => (
  <ListBox flexGrow={1} aria-labelledby="label" items={flatOptions}>
    {item => <Item key={item.name}>{item.name}</Item>}
  </ListBox>
);

Default.story = {
  name: 'default',
};

export const Sections = () => (
  <ListBox flexGrow={1} aria-labelledby="label" items={withSection}>
    {item => (
      <Section key={item.name} items={item.children} title={item.name}>
        {item => <Item key={item.name}>{item.name}</Item>}
      </Section>
    )}
  </ListBox>
);

Sections.story = {
  name: 'sections',
};

export const ManySections = () => (
  <ListBox
    flexGrow={1}
    aria-labelledby="label"
    selectionMode="multiple"
    items={lotsOfSections}
    onSelectionChange={action('onSelectionChange')}
  >
    {item => (
      <Section key={item.name} items={item.children} title={item.name}>
        {(item: any) => <Item key={item.name}>{item.name}</Item>}
      </Section>
    )}
  </ListBox>
);

ManySections.story = {
  name: 'many sections',
};

export const SectionsNoTitle = () => (
  <ListBox flexGrow={1} aria-labelledby="label" items={withSection}>
    {item => (
      <Section key={item.name} items={item.children} aria-label={item.name}>
        {item => <Item key={item.name}>{item.name}</Item>}
      </Section>
    )}
  </ListBox>
);

SectionsNoTitle.story = {
  name: 'sections, no title',
};

export const Static = () => (
  <ListBox flexGrow={1} aria-labelledby="label">
    <Item>One</Item>
    <Item>Two</Item>
    <Item>Three</Item>
  </ListBox>
);

Static.story = {
  name: 'static',
};

export const StaticSections = () => (
  <ListBox flexGrow={1} aria-labelledby="label" selectionMode="multiple">
    <Section title="Section 1">
      <Item>One</Item>
      <Item>Two</Item>
      <Item>Three</Item>
    </Section>
    <Section title="Section 2">
      <Item>One</Item>
      <Item>Two</Item>
      <Item>Three</Item>
    </Section>
  </ListBox>
);

StaticSections.story = {
  name: 'static sections',
};

export const StaticSectionsNoTitle = () => (
  <ListBox flexGrow={1} aria-labelledby="label">
    <Section aria-label="Section 1">
      <Item>One</Item>
      <Item>Two</Item>
      <Item>Three</Item>
    </Section>
    <Section aria-label="Section 2">
      <Item>One</Item>
      <Item>Two</Item>
      <Item>Three</Item>
    </Section>
  </ListBox>
);

StaticSectionsNoTitle.story = {
  name: 'static sections, no title',
};

export const DefaultSelected = () => (
  <ListBox
    flexGrow={1}
    aria-labelledby="label"
    selectionMode="multiple"
    onSelectionChange={action('onSelectionChange')}
    items={withSection}
    defaultSelectedKeys={['Kangaroo']}
  >
    {item => (
      <Section key={item.name} items={item.children} title={item.name}>
        {item => <Item key={item.name}>{item.name}</Item>}
      </Section>
    )}
  </ListBox>
);

DefaultSelected.story = {
  name: 'default selected',
};

export const DefaultSelectedSingle = () => (
  <ListBox
    flexGrow={1}
    selectionMode="single"
    onSelectionChange={action('onSelectionChange')}
    aria-labelledby="label"
    items={flatOptions}
    defaultSelectedKeys={['Kangaroo']}
  >
    {item => <Item key={item.name}>{item.name}</Item>}
  </ListBox>
);

DefaultSelectedSingle.story = {
  name: 'default selected, single',
};

export const StaticDefaultSelection = () => (
  <ListBox
    flexGrow={1}
    aria-labelledby="label"
    selectionMode="multiple"
    onSelectionChange={action('onSelectionChange')}
    defaultSelectedKeys={['2', '3']}
  >
    <Section title="Section 1">
      <Item key="1">One</Item>
      <Item key="2">Two</Item>
      <Item key="3">Three</Item>
    </Section>
    <Section title="Section 2">
      <Item key="4">Four</Item>
      <Item key="5">Five</Item>
      <Item key="6">Six</Item>
      <Item key="7">Seven</Item>
    </Section>
  </ListBox>
);

StaticDefaultSelection.story = {
  name: 'static, default selection',
};

export const WithSelectedOptionsControlled = () => (
  <ListBox
    flexGrow={1}
    aria-labelledby="label"
    selectionMode="multiple"
    onSelectionChange={action('onSelectionChange')}
    items={withSection}
    selectedKeys={['Kangaroo']}
  >
    {item => (
      <Section key={item.name} items={item.children} title={item.name}>
        {item => <Item key={item.name}>{item.name}</Item>}
      </Section>
    )}
  </ListBox>
);

WithSelectedOptionsControlled.story = {
  name: 'with selected options (controlled)',
};

export const StaticWithSelectedOptionsControlled = () => (
  <ListBox
    flexGrow={1}
    aria-labelledby="label"
    selectionMode="multiple"
    onSelectionChange={action('onSelectionChange')}
    selectedKeys={['2']}
  >
    <Section title="Section 1">
      <Item key="1">One</Item>
      <Item key="2">Two</Item>
      <Item key="3">Three</Item>
    </Section>
    <Section title="Section 2">
      <Item key="4">Four</Item>
      <Item key="5">Five</Item>
      <Item key="6">Six</Item>
      <Item key="7">Seven</Item>
    </Section>
  </ListBox>
);

StaticWithSelectedOptionsControlled.story = {
  name: 'static with selected options (controlled)',
};

export const DisabledOptions = () => (
  <ListBox
    flexGrow={1}
    aria-labelledby="label"
    items={withSection}
    disabledKeys={['Kangaroo', 'Echidna']}
  >
    {item => (
      <Section key={item.name} items={item.children} title={item.name}>
        {item => <Item key={item.name}>{item.name}</Item>}
      </Section>
    )}
  </ListBox>
);

DisabledOptions.story = {
  name: 'disabled options',
};

export const StaticDisabledOptions = () => (
  <ListBox flexGrow={1} aria-labelledby="label" disabledKeys={['3', '5']}>
    <Section title="Section 1">
      <Item key="1">One</Item>
      <Item key="2">Two</Item>
      <Item key="3">Three</Item>
    </Section>
    <Section title="Section 2">
      <Item key="4">Four</Item>
      <Item key="5">Five</Item>
      <Item key="6">Six</Item>
      <Item key="7">Seven</Item>
    </Section>
  </ListBox>
);

StaticDisabledOptions.story = {
  name: 'static, disabled options',
};

export const MultipleSelection = () => (
  <ListBox
    flexGrow={1}
    aria-labelledby="label"
    items={withSection}
    onSelectionChange={action('onSelectionChange')}
    selectionMode="multiple"
    defaultSelectedKeys={['Bilby', 'Kangaroo']}
    disabledKeys={['Dingo', 'Cassowary']}
  >
    {item => (
      <Section key={item.name} items={item.children} title={item.name}>
        {item => <Item key={item.name}>{item.name}</Item>}
      </Section>
    )}
  </ListBox>
);

MultipleSelection.story = {
  name: 'multiple selection',
};

export const MultipleSelectionStatic = () => (
  <ListBox
    flexGrow={1}
    aria-labelledby="label"
    onSelectionChange={action('onSelectionChange')}
    selectionMode="multiple"
    defaultSelectedKeys={['2', '5']}
    disabledKeys={['1', '3']}
  >
    <Section title="Section 1">
      <Item key="1">One</Item>
      <Item key="2">Two</Item>
      <Item key="3">Three</Item>
    </Section>
    <Section title="Section 2">
      <Item key="4">Four</Item>
      <Item key="5">Five</Item>
      <Item key="6">Six</Item>
    </Section>
  </ListBox>
);

MultipleSelectionStatic.story = {
  name: 'multiple selection, static',
};

export const NoSelection = () => (
  <ListBox flexGrow={1} aria-labelledby="label" items={withSection}>
    {item => (
      <Section key={item.name} items={item.children} title={item.name}>
        {item => <Item key={item.name}>{item.name}</Item>}
      </Section>
    )}
  </ListBox>
);

NoSelection.story = {
  name: 'no selection',
};

export const NoSelectionStatic = () => (
  <ListBox flexGrow={1} aria-labelledby="label">
    <Section title="Section 1">
      <Item>One</Item>
      <Item>Two</Item>
      <Item>Three</Item>
    </Section>
    <Section title="Section 2">
      <Item>Four</Item>
      <Item>Five</Item>
      <Item>Six</Item>
    </Section>
  </ListBox>
);

NoSelectionStatic.story = {
  name: 'no selection, static',
};

export const AutoFocusTrue = () => (
  <ListBox flexGrow={1} aria-labelledby="label" items={withSection} autoFocus>
    {item => (
      <Section key={item.name} items={item.children} title={item.name}>
        {item => <Item key={item.name}>{item.name}</Item>}
      </Section>
    )}
  </ListBox>
);

AutoFocusTrue.story = {
  name: 'autoFocus=true',
};

export const AutoFocusDefaultSelection = () => (
  <ListBox
    flexGrow={1}
    aria-labelledby="label"
    items={withSection}
    autoFocus
    defaultSelectedKeys={['Snake']}
    selectionMode="single"
  >
    {item => (
      <Section key={item.name} items={item.children} title={item.name}>
        {item => <Item key={item.name}>{item.name}</Item>}
      </Section>
    )}
  </ListBox>
);

AutoFocusDefaultSelection.story = {
  name: 'autoFocus, default selection',
};

export const AutoFocusFirst = () => (
  <ListBox
    flexGrow={1}
    aria-labelledby="label"
    items={withSection}
    selectionMode="multiple"
    onSelectionChange={action('onSelectionChange')}
    autoFocus="first"
  >
    {item => (
      <Section key={item.name} items={item.children} title={item.name}>
        {item => <Item key={item.name}>{item.name}</Item>}
      </Section>
    )}
  </ListBox>
);

AutoFocusFirst.story = {
  name: 'autoFocus="first"',
};

export const AutoFocusLast = () => (
  <ListBox
    flexGrow={1}
    aria-labelledby="label"
    items={withSection}
    selectionMode="multiple"
    onSelectionChange={action('onSelectionChange')}
    autoFocus="last"
  >
    {item => (
      <Section key={item.name} items={item.children} title={item.name}>
        {item => <Item key={item.name}>{item.name}</Item>}
      </Section>
    )}
  </ListBox>
);

AutoFocusLast.story = {
  name: 'autoFocus="last"',
};

export const KeyboardSelectionWrapping = () => (
  <ListBox
    flexGrow={1}
    aria-labelledby="label"
    items={withSection}
    selectionMode="multiple"
    onSelectionChange={action('onSelectionChange')}
    shouldFocusWrap
  >
    {item => (
      <Section key={item.name} items={item.children} title={item.name}>
        {item => <Item key={item.name}>{item.name}</Item>}
      </Section>
    )}
  </ListBox>
);

KeyboardSelectionWrapping.story = {
  name: 'keyboard selection wrapping',
};

export const WithElementsStatic = () => (
  <ListBox
    flexGrow={1}
    aria-labelledby="label"
    selectionMode="multiple"
    onSelectionChange={action('onSelectionChange')}
    disabledKeys={['3', '5']}
  >
    <Section title="Section 1">
      <Item textValue="One" key="1">
        <Icon src={copyIcon} />
        <Text>One</Text>
        <Kbd meta>C</Kbd>
      </Item>
      <Item textValue="Two" key="2">
        <Icon src={scissorsIcon} />
        <Text>Two</Text>
      </Item>
      <Item textValue="Three" key="3">
        <Icon src={clipboardCopyIcon} />
        <Text>Three</Text>
      </Item>
    </Section>
    <Section title="Section 2">
      <Item textValue="Four" key="4">
        <Icon src={alignStartVerticalIcon} />
        <Text>Four</Text>
        <Text slot="description">Four description that's really long</Text>
      </Item>
      <Item textValue="Five has really long text that wraps" key="5">
        <Icon src={alignCenterVerticalIcon} />
        <Text>Five has really long text that wraps</Text>
      </Item>
      <Item textValue="Six" key="6">
        <Icon src={alignEndVerticalIcon} />
        <Text>Six</Text>
      </Item>
    </Section>
  </ListBox>
);

WithElementsStatic.story = {
  name: 'with elements (static)',
};

export const WithElementsDynamic = () => (
  <ListBox
    flexGrow={1}
    aria-labelledby="label"
    items={hardModeProgrammatic}
    onSelectionChange={action('onSelectionChange')}
    selectionMode="multiple"
  >
    {item => (
      <Section key={item.name} items={item.children} title={item.name}>
        {item => customOption(item)}
      </Section>
    )}
  </ListBox>
);

WithElementsDynamic.story = {
  name: 'with elements (dynamic)',
};

export const IsLoading = () => (
  <ListBox flexGrow={1} aria-labelledby="label" items={[]} isLoading>
    {/* @ts-ignore */}
    {item => <Item>{item.name}</Item>}
  </ListBox>
);

IsLoading.story = {
  name: 'isLoading',
};

export const IsLoadingMore = () => (
  <ListBox flexGrow={1} aria-labelledby="label" items={flatOptions} isLoading>
    {item => <Item key={item.name}>{item.name}</Item>}
  </ListBox>
);

IsLoadingMore.story = {
  name: 'isLoading more',
};

export const AsyncLoading = () => <AsyncLoadingExample />;

AsyncLoading.story = {
  name: 'async loading',
};

let customOption = (item: { name: string; icon: string }) => {
  let icon = iconMap[item.icon as keyof typeof iconMap];
  return (
    <Item textValue={item.name} key={item.name}>
      {item.icon && <Icon src={icon} />}
      <Text>{item.name}</Text>
    </Item>
  );
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
      return {
        items: json.results,
        cursor: json.next,
      };
    },
  });

  return (
    <ListBox
      flexGrow={1}
      aria-labelledby="label"
      items={list.items}
      isLoading={list.isLoading}
      onLoadMore={list.loadMore}
    >
      {item => <Item key={item.name}>{item.name}</Item>}
    </ListBox>
  );
}
