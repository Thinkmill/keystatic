import { Icon } from '@keystar/ui/icon';
import { copyIcon } from '@keystar/ui/icon/icons/copyIcon';
import { pencilIcon } from '@keystar/ui/icon/icons/pencilIcon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { Item, ListView } from '@keystar/ui/list-view';
import { Text } from '@keystar/ui/typography';
import { Selection } from '@react-types/shared';
import React, { useState } from 'react';

import { ActionBar, ActionBarContainer, ActionBarProps } from '../index';

export const ListExample = (props: Partial<ActionBarProps<any>>) => {
  let [selectedKeys, setSelectedKeys] = useState<Selection>(new Set());
  return (
    <ActionBarContainer height="scale.3400">
      <ListView
        aria-label="list view dynamic items example"
        items={complexItems}
        width="container.xsmall"
        selectionMode="multiple"
        onSelectionChange={setSelectedKeys}
        selectedKeys={selectedKeys}
      >
        {(item: any) => (
          <Item key={item.key} textValue={item.name}>
            <Text>{item.name}</Text>
          </Item>
        )}
      </ListView>
      <ActionBar
        selectedItemCount={selectedKeys === 'all' ? 'all' : selectedKeys.size}
        onClearSelection={() => setSelectedKeys(new Set())}
        {...props}
      >
        <Item key="edit" textValue="Edit">
          <Icon src={pencilIcon} />
          <Text>Edit</Text>
        </Item>
        <Item key="copy" textValue="Copy">
          <Icon src={copyIcon} />
          <Text>Copy</Text>
        </Item>
        <Item key="delete" textValue="Delete">
          <Icon src={trash2Icon} />
          <Text>Delete</Text>
        </Item>
      </ActionBar>
    </ActionBarContainer>
  );
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
