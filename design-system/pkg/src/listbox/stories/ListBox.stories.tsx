import { useAsyncList } from 'react-aria-components';
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

import {
  ListBox,
  ListBoxCollection,
  ListBoxHeader,
  ListBoxItem,
  ListBoxLoadMoreItem,
  ListBoxSection,
} from '..';

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
    name: 'ListBoxSection 1',
    children: [
      { name: 'Copy', icon: 'CopyIcon' },
      { name: 'Cut', icon: 'CutIcon' },
      { name: 'Paste', icon: 'PasteIcon' },
    ],
  },
  {
    name: 'ListBoxSection 2',
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
    children.push({ name: `ListBoxSection ${i}, ListBoxItem ${j}` });
  }

  lotsOfSections.push({ name: 'ListBoxSection ' + i, children });
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
    {item => <ListBoxItem id={item.name}>{item.name}</ListBoxItem>}
  </ListBox>
);

Default.story = {
  name: 'default',
};

export const Sections = () => (
  <ListBox flexGrow={1} aria-labelledby="label" items={withSection}>
    {item => (
      <ListBoxSection id={item.name}>
        <ListBoxHeader>{item.name}</ListBoxHeader>
        <ListBoxCollection items={item.children}>
          {item => <ListBoxItem id={item.name}>{item.name}</ListBoxItem>}
        </ListBoxCollection>
      </ListBoxSection>
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
      <ListBoxSection id={item.name}>
        <ListBoxHeader>{item.name}</ListBoxHeader>
        <ListBoxCollection items={item.children}>
          {(item: any) => <ListBoxItem id={item.name}>{item.name}</ListBoxItem>}
        </ListBoxCollection>
      </ListBoxSection>
    )}
  </ListBox>
);

ManySections.story = {
  name: 'many sections',
};

export const SectionsNoTitle = () => (
  <ListBox flexGrow={1} aria-labelledby="label" items={withSection}>
    {item => (
      <ListBoxSection id={item.name} aria-label={item.name}>
        <ListBoxCollection items={item.children}>
          {item => <ListBoxItem id={item.name}>{item.name}</ListBoxItem>}
        </ListBoxCollection>
      </ListBoxSection>
    )}
  </ListBox>
);

SectionsNoTitle.story = {
  name: 'sections, no title',
};

export const Static = () => (
  <ListBox flexGrow={1} aria-labelledby="label">
    <ListBoxItem>One</ListBoxItem>
    <ListBoxItem>Two</ListBoxItem>
    <ListBoxItem>Three</ListBoxItem>
  </ListBox>
);

Static.story = {
  name: 'static',
};

export const StaticSections = () => (
  <ListBox flexGrow={1} aria-labelledby="label" selectionMode="multiple">
    <ListBoxSection>
      <ListBoxHeader>ListBoxSection 1</ListBoxHeader>
      <ListBoxItem>One</ListBoxItem>
      <ListBoxItem>Two</ListBoxItem>
      <ListBoxItem>Three</ListBoxItem>
    </ListBoxSection>
    <ListBoxSection>
      <ListBoxHeader>ListBoxSection 2</ListBoxHeader>
      <ListBoxItem>One</ListBoxItem>
      <ListBoxItem>Two</ListBoxItem>
      <ListBoxItem>Three</ListBoxItem>
    </ListBoxSection>
  </ListBox>
);

StaticSections.story = {
  name: 'static sections',
};

export const StaticSectionsNoTitle = () => (
  <ListBox flexGrow={1} aria-labelledby="label">
    <ListBoxSection aria-label="ListBoxSection 1">
      <ListBoxItem>One</ListBoxItem>
      <ListBoxItem>Two</ListBoxItem>
      <ListBoxItem>Three</ListBoxItem>
    </ListBoxSection>
    <ListBoxSection aria-label="ListBoxSection 2">
      <ListBoxItem>One</ListBoxItem>
      <ListBoxItem>Two</ListBoxItem>
      <ListBoxItem>Three</ListBoxItem>
    </ListBoxSection>
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
      <ListBoxSection id={item.name}>
        <ListBoxHeader>{item.name}</ListBoxHeader>
        <ListBoxCollection items={item.children}>
          {item => <ListBoxItem id={item.name}>{item.name}</ListBoxItem>}
        </ListBoxCollection>
      </ListBoxSection>
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
    {item => <ListBoxItem id={item.name}>{item.name}</ListBoxItem>}
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
    <ListBoxSection>
      <ListBoxHeader>ListBoxSection 1</ListBoxHeader>
      <ListBoxItem id="1">One</ListBoxItem>
      <ListBoxItem id="2">Two</ListBoxItem>
      <ListBoxItem id="3">Three</ListBoxItem>
    </ListBoxSection>
    <ListBoxSection>
      <ListBoxHeader>ListBoxSection 2</ListBoxHeader>
      <ListBoxItem id="4">Four</ListBoxItem>
      <ListBoxItem id="5">Five</ListBoxItem>
      <ListBoxItem id="6">Six</ListBoxItem>
      <ListBoxItem id="7">Seven</ListBoxItem>
    </ListBoxSection>
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
      <ListBoxSection id={item.name}>
        <ListBoxHeader>{item.name}</ListBoxHeader>
        <ListBoxCollection items={item.children}>
          {item => <ListBoxItem id={item.name}>{item.name}</ListBoxItem>}
        </ListBoxCollection>
      </ListBoxSection>
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
    <ListBoxSection>
      <ListBoxHeader>ListBoxSection 1</ListBoxHeader>
      <ListBoxItem id="1">One</ListBoxItem>
      <ListBoxItem id="2">Two</ListBoxItem>
      <ListBoxItem id="3">Three</ListBoxItem>
    </ListBoxSection>
    <ListBoxSection>
      <ListBoxHeader>ListBoxSection 2</ListBoxHeader>
      <ListBoxItem id="4">Four</ListBoxItem>
      <ListBoxItem id="5">Five</ListBoxItem>
      <ListBoxItem id="6">Six</ListBoxItem>
      <ListBoxItem id="7">Seven</ListBoxItem>
    </ListBoxSection>
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
      <ListBoxSection id={item.name}>
        <ListBoxHeader>{item.name}</ListBoxHeader>
        <ListBoxCollection items={item.children}>
          {item => <ListBoxItem id={item.name}>{item.name}</ListBoxItem>}
        </ListBoxCollection>
      </ListBoxSection>
    )}
  </ListBox>
);

DisabledOptions.story = {
  name: 'disabled options',
};

export const StaticDisabledOptions = () => (
  <ListBox flexGrow={1} aria-labelledby="label" disabledKeys={['3', '5']}>
    <ListBoxSection>
      <ListBoxHeader>ListBoxSection 1</ListBoxHeader>
      <ListBoxItem id="1">One</ListBoxItem>
      <ListBoxItem id="2">Two</ListBoxItem>
      <ListBoxItem id="3">Three</ListBoxItem>
    </ListBoxSection>
    <ListBoxSection>
      <ListBoxHeader>ListBoxSection 2</ListBoxHeader>
      <ListBoxItem id="4">Four</ListBoxItem>
      <ListBoxItem id="5">Five</ListBoxItem>
      <ListBoxItem id="6">Six</ListBoxItem>
      <ListBoxItem id="7">Seven</ListBoxItem>
    </ListBoxSection>
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
      <ListBoxSection id={item.name}>
        <ListBoxHeader>{item.name}</ListBoxHeader>
        <ListBoxCollection items={item.children}>
          {item => <ListBoxItem id={item.name}>{item.name}</ListBoxItem>}
        </ListBoxCollection>
      </ListBoxSection>
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
    <ListBoxSection>
      <ListBoxHeader>ListBoxSection 1</ListBoxHeader>
      <ListBoxItem id="1">One</ListBoxItem>
      <ListBoxItem id="2">Two</ListBoxItem>
      <ListBoxItem id="3">Three</ListBoxItem>
    </ListBoxSection>
    <ListBoxSection>
      <ListBoxHeader>ListBoxSection 2</ListBoxHeader>
      <ListBoxItem id="4">Four</ListBoxItem>
      <ListBoxItem id="5">Five</ListBoxItem>
      <ListBoxItem id="6">Six</ListBoxItem>
    </ListBoxSection>
  </ListBox>
);

MultipleSelectionStatic.story = {
  name: 'multiple selection, static',
};

export const NoSelection = () => (
  <ListBox flexGrow={1} aria-labelledby="label" items={withSection}>
    {item => (
      <ListBoxSection id={item.name}>
        <ListBoxHeader>{item.name}</ListBoxHeader>
        <ListBoxCollection items={item.children}>
          {item => <ListBoxItem id={item.name}>{item.name}</ListBoxItem>}
        </ListBoxCollection>
      </ListBoxSection>
    )}
  </ListBox>
);

NoSelection.story = {
  name: 'no selection',
};

export const NoSelectionStatic = () => (
  <ListBox flexGrow={1} aria-labelledby="label">
    <ListBoxSection>
      <ListBoxHeader>ListBoxSection 1</ListBoxHeader>
      <ListBoxItem>One</ListBoxItem>
      <ListBoxItem>Two</ListBoxItem>
      <ListBoxItem>Three</ListBoxItem>
    </ListBoxSection>
    <ListBoxSection>
      <ListBoxHeader>ListBoxSection 2</ListBoxHeader>
      <ListBoxItem>Four</ListBoxItem>
      <ListBoxItem>Five</ListBoxItem>
      <ListBoxItem>Six</ListBoxItem>
    </ListBoxSection>
  </ListBox>
);

NoSelectionStatic.story = {
  name: 'no selection, static',
};

export const AutoFocusTrue = () => (
  <ListBox flexGrow={1} aria-labelledby="label" items={withSection} autoFocus>
    {item => (
      <ListBoxSection id={item.name}>
        <ListBoxHeader>{item.name}</ListBoxHeader>
        <ListBoxCollection items={item.children}>
          {item => <ListBoxItem id={item.name}>{item.name}</ListBoxItem>}
        </ListBoxCollection>
      </ListBoxSection>
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
      <ListBoxSection id={item.name}>
        <ListBoxHeader>{item.name}</ListBoxHeader>
        <ListBoxCollection items={item.children}>
          {item => <ListBoxItem id={item.name}>{item.name}</ListBoxItem>}
        </ListBoxCollection>
      </ListBoxSection>
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
      <ListBoxSection id={item.name}>
        <ListBoxHeader>{item.name}</ListBoxHeader>
        <ListBoxCollection items={item.children}>
          {item => <ListBoxItem id={item.name}>{item.name}</ListBoxItem>}
        </ListBoxCollection>
      </ListBoxSection>
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
      <ListBoxSection id={item.name}>
        <ListBoxHeader>{item.name}</ListBoxHeader>
        <ListBoxCollection items={item.children}>
          {item => <ListBoxItem id={item.name}>{item.name}</ListBoxItem>}
        </ListBoxCollection>
      </ListBoxSection>
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
      <ListBoxSection id={item.name}>
        <ListBoxHeader>{item.name}</ListBoxHeader>
        <ListBoxCollection items={item.children}>
          {item => <ListBoxItem id={item.name}>{item.name}</ListBoxItem>}
        </ListBoxCollection>
      </ListBoxSection>
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
    <ListBoxSection>
      <ListBoxHeader>ListBoxSection 1</ListBoxHeader>
      <ListBoxItem textValue="One" key="1">
        <Icon src={copyIcon} />
        <Text>One</Text>
        <Kbd meta>C</Kbd>
      </ListBoxItem>
      <ListBoxItem textValue="Two" key="2">
        <Icon src={scissorsIcon} />
        <Text>Two</Text>
      </ListBoxItem>
      <ListBoxItem textValue="Three" key="3">
        <Icon src={clipboardCopyIcon} />
        <Text>Three</Text>
      </ListBoxItem>
    </ListBoxSection>
    <ListBoxSection>
      <ListBoxHeader>ListBoxSection 2</ListBoxHeader>
      <ListBoxItem textValue="Four" key="4">
        <Icon src={alignStartVerticalIcon} />
        <Text>Four</Text>
        <Text slot="description">Four description that's really long</Text>
      </ListBoxItem>
      <ListBoxItem textValue="Five has really long text that wraps" key="5">
        <Icon src={alignCenterVerticalIcon} />
        <Text>Five has really long text that wraps</Text>
      </ListBoxItem>
      <ListBoxItem textValue="Six" key="6">
        <Icon src={alignEndVerticalIcon} />
        <Text>Six</Text>
      </ListBoxItem>
    </ListBoxSection>
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
      <ListBoxSection id={item.name}>
        <ListBoxHeader>{item.name}</ListBoxHeader>
        <ListBoxCollection items={item.children}>
          {item => customOption(item)}
        </ListBoxCollection>
      </ListBoxSection>
    )}
  </ListBox>
);

WithElementsDynamic.story = {
  name: 'with elements (dynamic)',
};

export const IsLoading = () => (
  <ListBox flexGrow={1} aria-labelledby="label">
    <ListBoxLoadMoreItem isLoading />
  </ListBox>
);

IsLoading.story = {
  name: 'isLoading',
};

export const IsLoadingMore = () => (
  <ListBox flexGrow={1} aria-labelledby="label">
    <ListBoxCollection items={flatOptions}>
      {item => <ListBoxItem id={item.name}>{item.name}</ListBoxItem>}
    </ListBoxCollection>
    <ListBoxLoadMoreItem isLoading />
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
    <ListBoxItem textValue={item.name} key={item.name}>
      {item.icon && <Icon src={icon} />}
      <Text>{item.name}</Text>
    </ListBoxItem>
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
    <ListBox flexGrow={1} aria-labelledby="label">
      <ListBoxCollection items={list.items}>
        {item => <ListBoxItem id={item.name}>{item.name}</ListBoxItem>}
      </ListBoxCollection>
      <ListBoxLoadMoreItem
        isLoading={list.isLoading}
        onLoadMore={list.loadMore}
      />
    </ListBox>
  );
}
