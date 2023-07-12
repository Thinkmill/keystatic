import { action } from '@keystar/ui-storybook';
import { Key, useRef, useState } from 'react';

import { ActionButton } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { plusIcon } from '@keystar/ui/icon/icons/plusIcon';
import { Box } from '@keystar/ui/layout';
import { Text } from '@keystar/ui/typography';

import { NavTree, Item, Section } from '../index';

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

let nestedItems: Item[] = [
  {
    name: 'Animals',
    children: [
      {
        name: 'Mammals',
        children: [
          {
            name: 'Carnivores',
            children: [
              { name: 'Lion' },
              { name: 'Tiger' },
              { name: 'Leopard' },
            ],
          },
          {
            name: 'Herbivores',
            children: [
              { name: 'Elephant' },
              { name: 'Giraffe' },
              {
                name: 'Kangaroo',
                children: [
                  { name: 'Red kangaroo' },
                  { name: 'Grey kangaroo' },
                  { name: 'Tree kangaroo' },
                ],
              },
            ],
          },
          {
            name: 'Primates',
            children: [
              { name: 'Chimpanzee' },
              { name: 'Gorilla' },
              { name: 'Orangutan' },
            ],
          },
        ],
      },
      {
        name: 'Birds',
        children: [
          { name: 'Eagles' },
          { name: 'Parrots' },
          {
            name: 'Water Birds',
            children: [
              { name: 'Swan' },
              {
                name: 'Duck',
                children: [
                  { name: 'Mallard Duck' },
                  { name: 'Pekin Duck' },
                  { name: 'Muscovy Duck' },
                ],
              },
              { name: 'Pelican' },
            ],
          },
        ],
      },
      {
        name: 'Reptiles',
        children: [
          { name: 'Snake' },
          { name: 'Lizard' },
          {
            name: 'Turtles',
            children: [
              { name: 'Sea Turtle' },
              { name: 'Box Turtle' },
              { name: 'Snapping Turtle' },
            ],
          },
        ],
      },
    ],
  },
  {
    name: 'Plants',
    children: [
      {
        name: 'Flowering Plants',
        children: [
          {
            name: 'Trees',
            children: [
              {
                name: 'Oak',
                children: [
                  { name: 'White Oak' },
                  { name: 'Red Oak' },
                  { name: 'Live Oak' },
                ],
              },
              { name: 'Maple' },
              { name: 'Palm' },
            ],
          },
          {
            name: 'Flowers',
            children: [
              { name: 'Rose' },
              { name: 'Sunflower' },
              { name: 'Tulip' },
            ],
          },
        ],
      },
      {
        name: 'Ferns',
        children: [
          { name: 'Maidenhair Fern' },
          { name: "Bird's Nest Fern" },
          { name: 'Tree Fern' },
        ],
      },
      {
        name: 'Cacti',
        children: [
          { name: 'Saguaro' },
          { name: 'Prickly Pear' },
          { name: 'Barrel Cactus' },
        ],
      },
    ],
  },
];

export default {
  title: 'Components/NavTree',
};

export const FlatItems = () => (
  <NavTree
    items={flatItems}
    onAction={action('onAction')}
    children={itemRenderer}
    onSelectionChange={action('onSelectionChange')}
  />
);

export const NestedItems = () => {
  let scrollRef = useRef<HTMLDivElement>(null);
  return (
    <Box height="100vh" width="scale.3400" overflow="auto" ref={scrollRef}>
      <NavTree
        items={nestedItems}
        onAction={action('onAction')}
        onExpandedChange={actionOnSet('onExpandedChange')}
        onSelectionChange={action('onSelectionChange')}
        children={itemRenderer}
        scrollRef={scrollRef}
      />
    </Box>
  );
};

export const GroupedItems = () => {
  let scrollRef = useRef<HTMLDivElement>(null);
  return (
    <Box height="100vh" width="scale.3400" overflow="auto" ref={scrollRef}>
      <NavTree
        items={nestedItems}
        onAction={action('onAction')}
        onExpandedChange={actionOnSet('onExpandedChange')}
        onSelectionChange={action('onSelectionChange')}
        scrollRef={scrollRef}
      >
        {section => (
          <Section
            key={section.name}
            items={section.children}
            title={section.name}
          >
            {item => (
              <Item
                key={item.name}
                childItems={item.children}
                textValue={item.name}
              >
                <Text>
                  {item.name}
                  {/* {!!item.children?.length && ` (${item.children.length})`} */}
                </Text>
                {item.children && item.children.length && (
                  <ActionButton>
                    <Icon src={plusIcon} />
                  </ActionButton>
                )}
              </Item>
            )}
          </Section>
        )}
      </NavTree>
    </Box>
  );
};

export const SelectedItem = () => {
  let [selectedKey, setSelectedKey] = useState<Key>('Grey kangaroo');
  let scrollRef = useRef<HTMLDivElement>(null);
  let expandedKeys = findParents(flattenItems(nestedItems), selectedKey);

  return (
    <Box height="100vh" width="scale.3400" overflow="auto" ref={scrollRef}>
      <NavTree
        items={nestedItems}
        onAction={action('onAction')}
        onExpandedChange={actionOnSet('onExpandedChange')}
        onSelectionChange={setSelectedKey}
        children={itemRenderer}
        scrollRef={scrollRef}
        defaultExpandedKeys={expandedKeys}
        selectedKey={selectedKey}
        // shouldFocusWrap
      />
    </Box>
  );
};

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
        {/* {!!item.children?.length && ` (${item.children.length})`} */}
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

function findParents(allItems: FlatItem[], selectedKey: Key) {
  let itemMap = new Map(allItems.map(item => [item.name, item]));

  let getParentNames = (key: Key, parents: Key[]): Key[] => {
    let item = itemMap.get(key as string);
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
