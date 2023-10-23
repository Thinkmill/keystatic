import { action, ArgTypes } from '@keystar/ui-storybook';
import { tokenSchema } from '@keystar/ui/style';
import { Text } from '@keystar/ui/typography';
import { Key, useMemo, useState } from 'react';

import {
  Cell,
  Column,
  Row,
  SortDescriptor,
  TableView,
  TableBody,
  TableHeader,
} from '..';
import { pokemonItems } from './data';

function onSelectionChange(keys: 'all' | Set<Key>) {
  const selection = typeof keys === 'string' ? keys : [...keys];
  action('onSelectionChange')(selection);
}

export default {
  title: 'Components/TableView',
};

export const StaticContents = (args: ArgTypes) => (
  <TableView
    aria-label="TableView with static contents"
    // width="scale.3400"
    // height="scale.2400"
    {...args}
  >
    <TableHeader>
      <Column key="foo">Foo</Column>
      <Column key="bar">Bar</Column>
      <Column key="baz">Baz</Column>
    </TableHeader>
    <TableBody>
      <Row>
        <Cell>One</Cell>
        <Cell>Two</Cell>
        <Cell>Three</Cell>
      </Row>
      <Row>
        <Cell>Four</Cell>
        <Cell>Five</Cell>
        <Cell>Six</Cell>
      </Row>
    </TableBody>
  </TableView>
);

StaticContents.story = {
  name: 'static contents',
};

export const HiddenHeader = (args: ArgTypes) => (
  <TableView
    aria-label="TableView with hidden header"
    width="scale.3400"
    // height="scale.2400"
    {...args}
  >
    <TableHeader>
      <Column key="foo">Foo</Column>
      <Column key="bar">Bar</Column>
      <Column key="baz" hideHeader>
        Actions
      </Column>
    </TableHeader>
    <TableBody>
      <Row>
        <Cell>One</Cell>
        <Cell>Two</Cell>
        <Cell>
          <button>Three</button>
        </Cell>
      </Row>
      <Row>
        <Cell>Four</Cell>
        <Cell>Five</Cell>
        <Cell>
          <button>Six</button>
        </Cell>
      </Row>
    </TableBody>
  </TableView>
);

HiddenHeader.story = {
  name: 'hidden header',
};

export const Selection = (args: ArgTypes) => (
  <TableView
    aria-label="TableView with selection"
    // width="scale.3400"
    // height="scale.2400"
    onSelectionChange={onSelectionChange}
    {...args}
  >
    <TableHeader>
      <Column key="foo">Foo</Column>
      <Column key="bar">Bar</Column>
      <Column key="baz">Baz</Column>
    </TableHeader>
    <TableBody>
      <Row>
        <Cell>One</Cell>
        <Cell>Two</Cell>
        <Cell>Three</Cell>
      </Row>
      <Row>
        <Cell>Four</Cell>
        <Cell>Five</Cell>
        <Cell>Six</Cell>
      </Row>
    </TableBody>
  </TableView>
);

Selection.args = {
  selectionMode: 'multiple',
};
Selection.argTypes = {
  selectionMode: {
    control: 'radio',
    options: ['none', 'single', 'multiple'],
  },
};

export const TableProps = (args: ArgTypes) => (
  <TableView
    aria-label="TableView illustrating root/table props"
    selectionMode="multiple"
    onSelectionChange={onSelectionChange}
    {...args}
  >
    <TableHeader>
      <Column minWidth={240}>File Name</Column>
      <Column width={80}>Type</Column>
      <Column width={80} align="end">
        Size
      </Column>
    </TableHeader>
    <TableBody>
      <Row>
        <Cell>
          2018 Proposal with very very very very very very long long long long
          long filename
        </Cell>
        <Cell>PDF</Cell>
        <Cell>214 KB</Cell>
      </Row>
      <Row>
        <Cell>Budget</Cell>
        <Cell>XLS</Cell>
        <Cell>120 KB</Cell>
      </Row>
    </TableBody>
  </TableView>
);

const scaleKeys = Object.keys(tokenSchema.size.scale)
  .filter(key => Number(key) >= 2000)
  .map(key => `scale.${key}`);

TableProps.args = {
  prominence: 'default',
  overflowMode: 'truncate',
  density: 'regular',
  height: undefined,
  width: 'scale.6000',
};
TableProps.argTypes = {
  prominence: {
    control: 'inline-radio',
    options: ['default', 'low'],
  },
  overflowMode: {
    control: 'inline-radio',
    options: ['truncate', 'wrap'],
  },
  density: {
    control: 'radio',
    options: ['compact', 'regular', 'spacious'],
  },
  height: {
    control: 'select',
    options: [undefined, ...scaleKeys],
  },
  width: {
    control: 'select',
    options: [undefined, ...scaleKeys],
  },
};

export const DynamicContents = () => {
  let [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });

  const items = useMemo(() => {
    const key = sortDescriptor.column as keyof (typeof pokemonItems)[0];
    if (!key) {
      return pokemonItems;
    }

    return pokemonItems.sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];
      let modifier = sortDescriptor.direction === 'ascending' ? 1 : -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * modifier;
      }

      if (aVal < bVal) return -1 * modifier;
      if (aVal > bVal) return 1 * modifier;

      return 0;
    });
  }, [sortDescriptor]);

  return (
    <TableView
      aria-label="TableView with dynamic contents"
      width="scale.6000"
      height="scale.2400"
      selectionMode="multiple"
      // onRowAction={(...args) => {
      //   console.log('onRowAction', ...args);
      //   action('onRowAction')(...args);
      // }}
      onSelectionChange={onSelectionChange}
      onSortChange={descriptor => {
        setSortDescriptor(descriptor);
        action('onSortChange')(descriptor);
      }}
      sortDescriptor={sortDescriptor}
    >
      <TableHeader
        columns={[
          // { name: 'ID', key: 'id', width: 55 },
          { name: 'Name', key: 'name', width: '50%' },
          { name: 'Type', key: 'type' },
          { name: 'HP', key: 'health', align: 'end' as const },
          { name: 'ATK', key: 'attack', align: 'end' as const },
          { name: 'DEF', key: 'defense', align: 'end' as const },
        ]}
      >
        {({ name, key, ...column }) => (
          <Column allowsSorting={key !== 'type'} {...column}>
            {name}
          </Column>
        )}
      </TableHeader>
      <TableBody items={items}>
        {item => (
          <Row key={item.id}>
            {key => {
              let value = item[key as keyof typeof item];
              if (Array.isArray(value)) {
                value = value.join(', ');
              }
              // if (key === 'name') {
              //   return (
              //     <Cell textValue={value}>
              //       <Text>
              //         <TextLink href="https://keystonejs.com/">
              //           {value}
              //         </TextLink>
              //       </Text>
              //     </Cell>
              //   );
              // }

              return (
                <Cell>
                  <Text overflow="nowrap">{value}</Text>
                </Cell>
              );
            }}
          </Row>
        )}
      </TableBody>
    </TableView>
  );
};

DynamicContents.story = {
  name: 'dynamic contents',
};

export const ManyCells = () => {
  return (
    <TableView
      aria-label="TableView with many cells"
      width="scale.6000"
      height="scale.3600"
    >
      <TableHeader columns={manyColumns}>
        {column => <Column minWidth={100}>{column.name}</Column>}
      </TableHeader>
      <TableBody items={manyRows}>
        {item => <Row key={item.foo}>{key => <Cell>{item[key]}</Cell>}</Row>}
      </TableBody>
    </TableView>
  );
};

ManyCells.story = {
  name: 'many cells',
};

// Data
// ----------------------------------------------------------------------------

let manyColumns: any[] = [];
for (let i = 0; i < 100; i++) {
  manyColumns.push({ name: 'Column ' + i, key: 'C' + i });
}

let manyRows: any[] = [];
for (let i = 0; i < 1000; i++) {
  let row = { key: 'R' + i };
  for (let j = 0; j < 100; j++) {
    // @ts-ignore
    row['C' + j] = `${i}, ${j}`;
  }

  manyRows.push(row);
}
