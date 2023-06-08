import { action, storiesOf } from '@voussoir/storybook';
import { Key, useRef } from 'react';

import { ActionButton } from '@voussoir/button';
import { Icon } from '@voussoir/icon';
import { plusIcon } from '@voussoir/icon/icons/plusIcon';
import { Box } from '@voussoir/layout';
import { Text } from '@voussoir/typography';

import { NavTree, Item } from '../src';

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
    children: [
      {
        name: 'Bilby',
        children: [{ name: 'Greater bilby' }, { name: 'Lesser bilby' }],
      },
      {
        name: 'Kangaroo',
        children: [
          { name: 'Red kangaroo' },
          {
            name: 'Grey kangaroo',
            children: [
              { name: 'Eastern grey kangaroo' },
              { name: 'Western grey kangaroo' },
            ],
          },
          { name: 'Tree kangaroo' },
          { name: 'Wallaroo' },
        ],
      },
      {
        name: 'Quokka',
      },
      {
        name: 'Wombat',
        children: [
          { name: 'Common wombat' },
          { name: 'Northern hairy-nosed wombat' },
          { name: 'Southern hairy-nosed wombat' },
        ],
      },
    ],
  },
  {
    name: 'Other',
    children: [
      {
        name: 'Echidna',
        children: [
          { name: 'Short-beaked echidna' },
          { name: 'Long-beaked echidna' },
        ],
      },
      { name: 'Dingo' },
      {
        name: 'Cassowary',
        children: [
          { name: 'Southern cassowary' },
          { name: 'Northern cassowary' },
          { name: 'Dwarf cassowary' },
        ],
      },
      { name: 'Platypus' },
    ],
  },
];

storiesOf('Components/NavTree', module)
  .add('flat items', () => (
    <NavTree
      items={flatItems}
      onAction={action('onAction')}
      children={itemRenderer}
      selectionMode="single"
      onSelectionChange={actionOnSet('onSelectionChange')}
    />
  ))
  .add('nested items', () => {
    let scrollRef = useRef<HTMLDivElement>(null);
    return (
      <Box
        height="container.xsmall"
        width="container.xsmall"
        overflow="auto"
        ref={scrollRef}
      >
        <NavTree
          items={nestedItems}
          onAction={action('onAction')}
          onExpandedChange={actionOnSet('onExpandedChange')}
          children={itemRenderer}
          scrollRef={scrollRef}
        />
      </Box>
    );
  })
  .add('selected item', () => {
    let scrollRef = useRef<HTMLDivElement>(null);
    let selectedKey = 'Eastern grey kangaroo';
    let expandedKeys = findParents(flattenItems(nestedItems), selectedKey);

    return (
      <Box
        height="container.xsmall"
        width="container.xsmall"
        overflow="auto"
        ref={scrollRef}
      >
        <NavTree
          items={nestedItems}
          onAction={action('onAction')}
          onExpandedChange={actionOnSet('onExpandedChange')}
          onSelectionChange={actionOnSet('onSelectionChange')}
          children={itemRenderer}
          scrollRef={scrollRef}
          defaultExpandedKeys={expandedKeys}
          defaultSelectedKeys={[selectedKey]}
          selectionMode="single"
          // shouldFocusWrap
        />
      </Box>
    );
  });

function actionOnSet(name: string) {
  return (keys: 'all' | Set<Key>) => action(name)([...keys]);
}

function itemRenderer<T extends { name: string }>(
  item: T & { children?: T[] }
) {
  return (
    <Item key={item.name} childItems={item.children} textValue={item.name}>
      <Text>
        {item.name}
        {!!item.children?.length && ` (${item.children.length})`}
      </Text>
      {item.children && item.children.length && (
        <ActionButton>
          <Icon src={plusIcon} />
        </ActionButton>
      )}
    </Item>
  );
}

type WithChildren<T> = T & { children?: WithChildren<T>[] };
type Item = WithChildren<{ name: string }>;
type FlatItem = WithChildren<{ name: string; parentKey: string }>;

function findParents(allItems: FlatItem[], selectedKey: string) {
  let itemMap = new Map(allItems.map(item => [item.name, item]));

  let getParentNames = (key: string, parents: string[]): string[] => {
    let item = itemMap.get(key);
    if (!item) return parents;
    let parentItem = itemMap.get(item.parentKey);
    if (!parentItem) return parents;
    return getParentNames(parentItem.name, [...parents, parentItem.name]);
  };

  return getParentNames(selectedKey, []);
}
function flattenItems(items: Item[], parentKey = ''): FlatItem[] {
  return items.flatMap((item: Item) => {
    let { name, children } = item;
    let currentItem = { name, parentKey };
    let nestedItems = children ? flattenItems(children, name) : [];
    return [currentItem, ...nestedItems];
  });
}
