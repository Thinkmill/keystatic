import { Icon } from '@keystar/ui/icon';
import { copyIcon } from '@keystar/ui/icon/icons/copyIcon';
import { pencilIcon } from '@keystar/ui/icon/icons/pencilIcon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { ListViewItem, ListView } from '@keystar/ui/list-view';
import { Text } from '@keystar/ui/typography';
import { Selection } from '@react-types/shared';
import React, { useState } from 'react';

import {
  ActionBar,
  ActionBarContainer,
  ActionBarItem,
  ActionBarProps,
} from '../index';

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
          <ListViewItem id={item.key} textValue={item.name}>
            <Text>{item.name}</Text>
          </ListViewItem>
        )}
      </ListView>
      <ActionBar
        selectedItemCount={selectedKeys === 'all' ? 'all' : selectedKeys.size}
        onClearSelection={() => setSelectedKeys(new Set())}
        {...props}
      >
        <ActionBarItem id="edit" textValue="Edit">
          <Icon src={pencilIcon} />
          <Text>Edit</Text>
        </ActionBarItem>
        <ActionBarItem id="copy" textValue="Copy">
          <Icon src={copyIcon} />
          <Text>Copy</Text>
        </ActionBarItem>
        <ActionBarItem id="delete" textValue="Delete">
          <Icon src={trash2Icon} />
          <Text>Delete</Text>
        </ActionBarItem>
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
