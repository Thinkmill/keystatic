import { action, ArgTypes, storiesOf } from '@keystar-ui/storybook';
import { Key, useMemo, useState } from 'react';

import {
  Cell,
  Column,
  Row,
  SortDescriptor,
  TableView,
  TableBody,
  TableHeader,
} from '../src';
import { pokemonItems } from './data';

function onSelectionChange(keys: 'all' | Set<Key>) {
  const selection = typeof keys === 'string' ? keys : [...keys];
  action('onSelectionChange')(selection);
}

storiesOf('Components/TableView', module)
  .add(
    'static contents',
    (args: ArgTypes) => (
      <TableView aria-label="TableView with static contents" {...args}>
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
    ),
    {
      argTypes: {},
    }
  )

  .add(
    'selection',
    (args: ArgTypes) => (
      <TableView
        aria-label="TableView with selection"
        width="scale.3400"
        height="scale.2400"
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
    ),
    { argTypes: { selectionMode: radioArg(['none', 'single', 'multiple'], 2) } }
  )
  .add(
    'column props',
    (args: ArgTypes) => (
      <TableView
        aria-label="TableView illustrating column props"
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
              2018 Proposal with very very very very very very long long long
              long long filename
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
    ),
    {
      argTypes: {
        overflowMode: radioInlineArg(['truncate', 'wrap'], 1),
        density: radioArg(['compact', 'regular', 'spacious'], 1),
        width: numberRangeArg({ min: 400, max: 940, step: 10 }, 620),
        height: numberArg(200),
      },
    }
  )
  .add(
    'table props',
    (args: ArgTypes) => (
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
              2018 Proposal with very very very very very very long long long
              long long filename
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
    ),
    {
      argTypes: {
        overflowMode: radioInlineArg(['truncate', 'wrap'], 1),
        density: radioArg(['compact', 'regular', 'spacious'], 1),
        width: numberRangeArg({ min: 400, max: 940, step: 10 }, 620),
        height: numberArg(200),
      },
    }
  )
  .add('dynamic contents', () => {
    let [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
      column: 'id',
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
            { name: 'ID', key: 'id', width: 55 },
            { name: 'Name', key: 'name' },
            { name: 'Type', key: 'type' },
            { name: 'HP', key: 'health', width: 60 },
            { name: 'ATK', key: 'attack', width: 60 },
            { name: 'DEF', key: 'defense', width: 60 },
          ]}
        >
          {column => (
            <Column
              allowsSorting={column.key !== 'type'}
              width={column.width}
              align={column.width === 60 ? 'end' : undefined}
            >
              {column.name}
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

                return <Cell>{value}</Cell>;
              }}
            </Row>
          )}
        </TableBody>
      </TableView>
    );
  });

// Utils
// ----------------------------------------------------------------------------

// TODO: move to some common place

function numberArg(defaultValue: number) {
  return { control: 'number', defaultValue };
}
function numberRangeArg(
  { min = 0, max = 100, step = 0 }: { min: number; max: number; step: number },
  defaultValue: number
) {
  return {
    control: { type: 'range', min, max, step },
    defaultValue,
  };
}
function radioArg<T>(options: T[], defaultValueIndex: number = 0) {
  return {
    control: { type: 'radio', options },
    defaultValue: options[defaultValueIndex],
  };
}
function radioInlineArg<T>(options: T[], defaultValueIndex: number = 0) {
  return {
    control: { type: 'inline-radio', options },
    defaultValue: options[defaultValueIndex],
  };
}

// Data
// ----------------------------------------------------------------------------

let manyColumns = [];
for (let i = 0; i < 100; i++) {
  manyColumns.push({ name: 'Column ' + i, key: 'C' + i });
}

let manyRows = [];
for (let i = 0; i < 1000; i++) {
  let row = { key: 'R' + i };
  for (let j = 0; j < 100; j++) {
    // @ts-ignore
    row['C' + j] = `${i}, ${j}`;
  }

  manyRows.push(row);
}
