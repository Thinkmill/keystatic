import { action } from '@keystar/ui-storybook';
import { useAsyncList, useListData } from '@react-stately/data';
import { ItemDropTarget } from '@react-types/shared';
import React from 'react';

import { ActionGroup } from '@keystar/ui/action-group';
import { useDragAndDrop } from '@keystar/ui/drag-and-drop';
import { Icon } from '@keystar/ui/icon';
import { copyIcon } from '@keystar/ui/icon/icons/copyIcon';
import { listPlusIcon } from '@keystar/ui/icon/icons/listPlusIcon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { Image } from '@keystar/ui/image';
import { Flex } from '@keystar/ui/layout';
import { TextLink } from '@keystar/ui/link';
import { Text } from '@keystar/ui/typography';

import { Item, ListView } from '..';

let getAllowedDropOperationsAction = action('getAllowedDropOperationsAction');

export default {
  title: 'Components/ListView',
  args: {
    density: 'regular',
    selectionMode: 'multiple',
    selectionStyle: 'checkbox',
    overflowMode: 'truncate',
  },
  argTypes: {
    selectionMode: {
      control: 'radio',
      options: ['none', 'single', 'multiple'],
    },
    selectionStyle: {
      control: 'radio',
      options: ['checkbox', 'highlight'],
    },
    density: {
      control: 'select',
      options: ['compact', 'regular', 'spacious'],
    },
    overflowMode: {
      control: 'radio',
      options: ['truncate', 'wrap'],
    },
  },
};

export const Default = (args: any) => (
  <ListView
    width="alias.singleLineWidth"
    aria-label="list view example"
    {...args}
  >
    <Item>Design Systems</Item>
    <Item>Product Development</Item>
    <Item>Team Augmentation</Item>
    <Item>API Platforms</Item>
  </ListView>
);

Default.story = {
  name: 'default',
};

export const Actions = (args: any) => (
  <ListView
    width="alias.singleLineWidth"
    aria-label="list view actions example"
    onAction={action('onAction')}
    {...args}
  >
    <Item key="design-systems">Design Systems</Item>
    <Item key="product-development">Product Development</Item>
    <Item key="team-augmentation">Team Augmentation</Item>
    <Item key="api-platforms">API Platforms</Item>
  </ListView>
);

Actions.story = {
  name: 'actions',
};

export const DynamicItems = (args: any) => (
  <ListView
    aria-label="list view dynamic items example"
    items={complexItems}
    width="container.xsmall"
    height="alias.singleLineWidth"
    onAction={action('onAction')}
    {...args}
  >
    {(item: any) => (
      <Item key={item.key} textValue={item.name}>
        <Text>{item.name}</Text>
        <ActionGroup
          buttonLabelBehavior="hide"
          onAction={action(`actionGroup/${item.key}`)}
        >
          <Item key="duplicate">
            <Icon src={copyIcon} />
            <Text>Duplicate</Text>
          </Item>
          <Item key="delete">
            <Icon src={trash2Icon} />
            <Text>Delete</Text>
          </Item>
        </ActionGroup>
      </Item>
    )}
  </ListView>
);

DynamicItems.args = {
  selectionMode: 'none',
};

export const EmptyList = (args: any) => (
  <ListView
    aria-label="empty ListView"
    width="container.xsmall"
    height="alias.singleLineWidth"
    renderEmptyState={renderEmptyState}
    {...args}
  >
    {[]}
  </ListView>
);

EmptyList.story = {
  name: 'empty list',
};

export const Loading = (args: any) => (
  <ListView
    aria-label="loading ListView"
    width="container.xsmall"
    height="alias.singleLineWidth"
    loadingState="loading"
    {...args}
  >
    {[]}
  </ListView>
);

Loading.story = {
  name: 'loading',
};

export const LoadingMore = (args: any) => (
  <ListView
    aria-label="loading more ListView"
    width="alias.singleLineWidth"
    height="alias.singleLineWidth"
    loadingState="loadingMore"
    {...args}
  >
    <Item>Design Systems</Item>
    <Item>Product Development</Item>
    <Item>Team Augmentation</Item>
    <Item>API Platforms</Item>
  </ListView>
);

LoadingMore.story = {
  name: 'loadingMore',
};

export const AsyncLoading = (args: any) => <AsyncList {...args} />;

AsyncLoading.story = {
  name: 'async loading',
};

export const Thumbnails = (args: any) => (
  <ListView
    width="alias.singleLineWidth"
    items={thumbnailItems}
    aria-label="ListView with thumbnails"
    {...args}
  >
    {(item: any) => (
      <Item textValue={item.title}>
        {item.url && <Image aspectRatio="1" src={item.url} alt="" />}
        {item.illustration}
        <Text>{item.title}</Text>
        {item.url && <Text slot="description">JPG</Text>}
      </Item>
    )}
  </ListView>
);

Thumbnails.story = {
  name: 'thumbnails',
};

export const LongText = (args: any) => (
  <ListView width="alias.singleLineWidth" {...args}>
    <Item>Safe hands for your bold product plans</Item>
    <Item textValue="Expertise & Capabilities">
      <Text>Expertise & Capabilities</Text>
      <Text slot="description">
        Functional products and cross-functional teams form the basis of how we
        make compelling software.
      </Text>
    </Item>
    <Item textValue="How we engage">
      <Text>How we engage</Text>
      <Text slot="description">
        Simple and nimble engagement structures. We can work with your team, or
        be your team.
      </Text>
    </Item>
  </ListView>
);

LongText.story = {
  name: 'long text',
};

export const DragWithinListReorder = (args: any) => (
  <Flex direction="row" wrap alignItems="center">
    <ReorderExample
      {...args}
      disabledKeys={['1']}
      onDrop={action('drop')}
      onDragStart={action('dragStart')}
      onDragEnd={action('dragEnd')}
    />
  </Flex>
);

DragWithinListReorder.story = {
  name: 'drag within list (reorder)',
};

// Data
// ------------------------------

const complexItems: any = [
  { key: 'a', name: 'Keystone', type: 'file' },
  { key: 'b', name: 'React Select', type: 'file' },
  {
    key: 'c',
    name: 'Documents',
    type: 'folder',
    children: [
      { key: 1, name: 'Sales Pitch' },
      { key: 2, name: 'Demo' },
      { key: 3, name: 'Taxes' },
    ],
  },
  { key: 'd', name: 'Classnames', type: 'file' },
  {
    key: 'e',
    name: 'Utilities',
    type: 'folder',
    children: [{ key: 1, name: 'Activity Monitor' }],
  },
  { key: 'f', name: 'Changesets', type: 'file' },
  { key: 'g', name: 'Manypkg', type: 'file' },
  { key: 'h', name: 'TS GQL', type: 'file' },
  { key: 'i', name: 'Emery', type: 'file' },
  { key: 'j', name: 'Magical Types', type: 'file' },
  { key: 'k', name: 'Elemental UI', type: 'file' },
  { key: 'l', name: 'Markings', type: 'file' },
  {
    key: 'm',
    name: 'Pictures',
    type: 'folder',
    children: [
      { key: 1, name: 'Yosemite' },
      { key: 2, name: 'Jackson Hole' },
      { key: 3, name: 'Crater Lake' },
    ],
  },
  { key: 'n', name: 'Untitled Docs', type: 'file' },
];

// taken from https://random.dog/
const thumbnailItems = [
  {
    key: '1',
    title: 'tree line',
    url: 'https://picsum.photos/id/10/128/128',
  },
  {
    key: '2',
    title: 'laptop',
    url: 'https://picsum.photos/id/20/128/128',
  },
  {
    key: '3',
    title: 'coffee mug',
    url: 'https://picsum.photos/id/30/128/128',
  },
  {
    key: '4',
    title: 'cat nose',
    url: 'https://picsum.photos/id/40/128/128',
  },
  {
    key: '5',
    title: 'cormorant',
    url: 'https://picsum.photos/id/50/128/128',
  },
  {
    key: '6',
    title: 'desktop',
    url: 'https://picsum.photos/id/60/128/128',
  },
  {
    key: '7',
    title: 'avenue',
    url: 'https://picsum.photos/id/70/128/128',
  },
  {
    key: '8',
    title: 'pine cones',
    url: 'https://picsum.photos/id/80/128/128',
  },
];

let simpleItems = [
  { id: '1', type: 'item', textValue: 'Item One' },
  {
    id: '2',
    type: 'item',
    textValue: 'Item Two',
    description: 'Description text',
  },
  { id: '3', type: 'item', textValue: 'Item Three' },
  { id: '4', type: 'item', textValue: 'Item Four' },
  { id: '5', type: 'item', textValue: 'Item Five' },
  { id: '6', type: 'item', textValue: 'Item Six' },
];

// Utils
// ------------------------------

function renderEmptyState() {
  return (
    <Flex
      direction="column"
      gap="large"
      alignItems="center"
      justifyContent="center"
      height="100%"
      padding="regular"
    >
      <Icon src={listPlusIcon} color="neutral" size="large" />
      <Text elementType="h3" align="center" size="large" weight="semibold">
        No items
      </Text>
      <Text align="center" color="neutralSecondary">
        There's no items yet. You can{' '}
        <TextLink onPress={action('linkPress')}>add your first item</TextLink>{' '}
        to get started.
      </Text>
    </Flex>
  );
}

// Example components
// ------------------------------

function AsyncList(props: any) {
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
    <ListView
      aria-label="example async loading list"
      width="alias.singleLineWidth"
      height="alias.singleLineWidth"
      items={list.items}
      loadingState={list.loadingState}
      onLoadMore={list.loadMore}
      {...props}
    >
      {(item: any) => {
        return (
          <Item key={item.name} textValue={item.name}>
            {item.name}
          </Item>
        );
      }}
    </ListView>
  );
}

function ReorderExample(props: any) {
  let {
    onDrop,
    onDragStart,
    onDragEnd,
    disabledKeys = ['2'],
    ...otherprops
  } = props;
  let list = useListData({
    initialItems: props.items || simpleItems,
  });

  // Use a random drag type so the items can only be reordered within this list and not dragged elsewhere.
  let dragType = React.useMemo(
    () => `keys-${Math.random().toString(36).slice(2)}`,
    []
  );

  let onMove = (keys: React.Key[], target: ItemDropTarget) => {
    if (target.dropPosition === 'before') {
      list.moveBefore(target.key, keys);
    } else {
      list.moveAfter(target.key, keys);
    }
  };

  let { dragAndDropHooks } = useDragAndDrop({
    getItems(keys) {
      return [...keys].map(key => {
        key = JSON.stringify(key);
        return {
          [dragType]: key,
          'text/plain': key,
        };
      });
    },
    getAllowedDropOperations() {
      getAllowedDropOperationsAction();
      return ['move', 'cancel'];
    },
    onDragStart: onDragStart,
    onDragEnd: onDragEnd,
    async onDrop(e) {
      onDrop(e);
      if (e.target.type !== 'root' && e.target.dropPosition !== 'on') {
        let keys = [];
        for (let item of e.items) {
          if (item.kind === 'text') {
            let key;
            if (item.types.has(dragType)) {
              key = JSON.parse(await item.getText(dragType));
              keys.push(key);
            } else if (item.types.has('text/plain')) {
              // Fallback for Chrome Android case: https://bugs.chromium.org/p/chromium/issues/detail?id=1293803
              // Multiple drag items are contained in a single string so we need to split them out
              key = await item.getText('text/plain');
              keys = key.split('\n').map(val => val.replaceAll('"', ''));
            }
          }
        }
        onMove(keys, e.target);
      }
    },
    getDropOperation(target) {
      if (target.type === 'root' || target.dropPosition === 'on') {
        return 'cancel';
      }

      return 'move';
    },
  });

  return (
    <ListView
      aria-label="reorderable list view"
      width="alias.singleLineWidth"
      height="100%"
      items={list.items}
      disabledKeys={disabledKeys}
      dragAndDropHooks={dragAndDropHooks}
      // onAction={action('onAction')}
      // onSelectionChange={action('onSelectionChange')}
      {...otherprops}
    >
      {(item: any) => (
        <Item>
          <Text>{item.textValue}</Text>
          {item.description && (
            <Text slot="description">{item.description}</Text>
          )}
        </Item>
      )}
    </ListView>
  );
}
