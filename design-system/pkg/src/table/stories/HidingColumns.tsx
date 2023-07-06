import React from 'react';

import { Checkbox } from '@keystar/ui/checkbox';
import { Flex } from '@keystar/ui/layout';

import {
  Cell,
  Column,
  Row,
  TableBody,
  TableHeader,
  TableView,
} from '@keystar/ui/table';
import { Text } from '@keystar/ui/typography';

export function HidingColumns() {
  let [visibleColumns, setVisibleColumns] = React.useState(
    new Set(columns.map(c => c.key))
  );
  let toggleColumn = (key: string) => {
    let columns = new Set(visibleColumns);
    if (columns.has(key)) {
      columns.delete(key);
    } else {
      columns.add(key);
    }

    setVisibleColumns(columns);
  };

  return (
    <Flex gap="large">
      <Flex direction="column">
        {columns.slice(1).map(c => (
          <Flex
            elementType="label"
            gap="regular"
            key={c.key}
            alignItems="center"
          >
            <Checkbox
              isSelected={visibleColumns.has(c.key)}
              onChange={() => toggleColumn(c.key)}
            />
            <Text>{c.title}</Text>
          </Flex>
        ))}
      </Flex>
      <TableView aria-label="Table with hideable columns" width="scale.5000">
        <TableHeader columns={columns.filter(c => visibleColumns.has(c.key))}>
          {column => <Column>{column.title}</Column>}
        </TableHeader>
        <TableBody items={data}>
          {item => (
            <Row>{key => <Cell>{item[key as keyof typeof item]}</Cell>}</Row>
          )}
        </TableBody>
      </TableView>
    </Flex>
  );
}

let columns = [
  { key: 'planName', title: 'Plan Name' },
  { key: 'audienceType', title: 'Audience Type' },
  { key: 'netBudget', title: 'Net Budget' },
  { key: 'targetOTP', title: 'Target OTP' },
  { key: 'reach', title: 'Reach' },
];

let data = [
  {
    id: 1,
    planName: 'Plan 1: $300k, digital',
    audienceType: 'Strategic',
    netBudget: '$300,000',
    targetOTP: '7.4%',
    reach: '11.52%',
  },
  {
    id: 2,
    planName: 'Plan 2: $500k, digital',
    audienceType: 'Strategic',
    netBudget: '$500,000',
    targetOTP: '22.5%',
    reach: '11.5%',
  },
  {
    id: 3,
    planName: 'Plan 3: $800k, digital',
    audienceType: 'Strategic',
    netBudget: '$800,000',
    targetOTP: '22.5%',
    reach: '11.5%',
  },
  {
    id: 4,
    planName: 'Plan 4: $300k, MRI',
    audienceType: 'Demo+strategic',
    netBudget: '$300,000',
    targetOTP: '22.5%',
    reach: '11.5%',
  },
  {
    id: 5,
    planName: 'Plan 5: $500k, MRI',
    audienceType: 'Demo+strategic',
    netBudget: '$500,000',
    targetOTP: '22.5%',
    reach: '11.5%',
  },
  {
    id: 6,
    planName: 'Plan 6: $800k, MRI',
    audienceType: 'Demo+strategic',
    netBudget: '$800,000',
    targetOTP: '22.5%',
    reach: '11.5%',
  },
];
