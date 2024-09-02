import { action } from '@keystar/ui-storybook';
import { useListData } from '@react-stately/data';
import { ItemDropTarget, Key } from '@react-types/shared';
import React from 'react';

import { useDragAndDrop } from '@keystar/ui/drag-and-drop';

import { Cell, Column, Row, TableBody, TableHeader, TableView } from '../index';

let columns = [
  { name: 'First name', key: 'first_name', width: '25%', isRowHeader: true },
  { name: 'Last name', key: 'last_name', width: '25%', isRowHeader: true },
  { name: 'Email', key: 'email', minWidth: 200 },
  { name: 'Department', key: 'department', width: 200 },
  { name: 'Job Title', key: 'job_title', width: 180 },
  { name: 'IP Address', key: 'ip_address', minWidth: 140 },
];

export let items = [
  {
    id: 'a',
    first_name: 'Vin',
    last_name: 'Charlet',
    email: 'vcharlet0@123-reg.co.uk',
    ip_address: '18.45.175.130',
    department: 'Services',
    job_title: 'Analog Circuit Design manager',
  },
  {
    id: 'b',
    first_name: 'Lexy',
    last_name: 'Maddison',
    email: 'lmaddison1@xinhuanet.com',
    ip_address: '238.210.151.48',
    department: 'Research and Development',
    job_title: 'Analog Circuit Design manager',
  },
  {
    id: 'c',
    first_name: 'Robbi',
    last_name: 'Persence',
    email: 'rpersence2@hud.gov',
    ip_address: '130.2.120.99',
    department: 'Business Development',
    job_title: 'Analog Circuit Design manager',
  },
  {
    id: 'd',
    first_name: 'Dodie',
    last_name: 'Hurworth',
    email: 'dhurworth3@webs.com',
    ip_address: '235.183.154.184',
    department: 'Training',
    job_title: 'Account Coordinator',
  },
  {
    id: 'e',
    first_name: 'Audrye',
    last_name: 'Hember',
    email: 'ahember4@blogtalkradio.com',
    ip_address: '136.25.192.37',
    department: 'Legal',
    job_title: 'Operator',
  },
  {
    id: 'f',
    first_name: 'Beau',
    last_name: 'Oller',
    email: 'boller5@nytimes.com',
    ip_address: '93.111.22.12',
    department: 'Business Development',
    job_title: 'Speech Pathologist',
  },
  {
    id: 'g',
    first_name: 'Roarke',
    last_name: 'Gration',
    email: 'rgration6@purevolume.com',
    ip_address: '234.221.23.241',
    department: 'Product Management',
    job_title: 'Electrical Engineer',
  },
  {
    id: 'h',
    first_name: 'Cathy',
    last_name: 'Lishman',
    email: 'clishman7@constantcontact.com',
    ip_address: '181.158.213.202',
    department: 'Research and Development',
    job_title: 'Assistant Professor',
  },
  {
    id: 'i',
    first_name: 'Enrika',
    last_name: 'Soitoux',
    email: 'esoitoux8@google.com.hk',
    ip_address: '51.244.20.173',
    department: 'Support',
    job_title: 'Teacher',
  },
  {
    id: 'j',
    first_name: 'Aloise',
    last_name: 'Tuxsell',
    email: 'atuxsell9@jigsy.com',
    ip_address: '253.46.84.168',
    department: 'Training',
    job_title: 'Financial Advisor',
  },
];

let getAllowedDropOperationsAction = action('getAllowedDropOperationsAction');

export function ReorderExample(props: any) {
  let { onDrop, onDragStart, onDragEnd, tableViewProps, ...otherProps } = props;
  let list = useListData({
    initialItems: (props.items as typeof items) || items,
    getKey: item => item.id,
  });

  // Use a random drag type so the items can only be reordered within this table and not dragged elsewhere.
  let dragType = React.useMemo(
    () => `keys-${Math.random().toString(36).slice(2)}`,
    []
  );

  let onMove = (keys: Key[], target: ItemDropTarget) => {
    console.log('onMove', keys, target);
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
    <TableView
      aria-label="Reorderable TableView"
      selectionMode="multiple"
      width="scale.6000"
      height="scale.2400"
      dragAndDropHooks={dragAndDropHooks}
      {...tableViewProps}
      {...otherProps}
    >
      <TableHeader columns={columns}>
        {column => (
          <Column
            minWidth={column.minWidth}
            width={column.width}
            isRowHeader={column.isRowHeader}
          >
            {column.name}
          </Column>
        )}
      </TableHeader>
      <TableBody items={list.items}>
        {item => (
          <Row>{key => <Cell>{item[key as keyof typeof item]}</Cell>}</Row>
        )}
      </TableBody>
    </TableView>
  );
}
