import { action, ArgTypes } from '@keystar/ui-storybook';
import { Badge } from '@keystar/ui/badge';
import { Box, Flex, VStack } from '@keystar/ui/layout';
import { TextLink } from '@keystar/ui/link';
import { tokenSchema } from '@keystar/ui/style';
import { ActionButton } from '@keystar/ui/button';
import { Switch } from '@keystar/ui/switch';
import { Heading, Text } from '@keystar/ui/typography';
import { useAsyncList } from '@react-stately/data';
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
import { ReorderExample } from './ReorderExample';

function onSelectionChange(keys: 'all' | Set<Key>) {
  const selection = typeof keys === 'string' ? keys : [...keys];
  action('onSelectionChange')(selection);
}

const scaleKeys = Object.keys(tokenSchema.size.scale)
  .filter(key => Number(key) >= 2000)
  .map(key => `scale.${key}`);
export default {
  title: 'Components/TableView',
  component: TableView,
  args: {
    prominence: 'default',
    overflowMode: 'truncate',
    density: 'regular',
    height: undefined,
    width: 'scale.6000',
    onAction: action('onAction'),
    onSelectionChange: action('onSelectionChange'),
    onSortChange: action('onSortChange'),
  },
  argTypes: {
    // intentionally added so that we can unset the default value
    // there is no argType for function
    // use the controls reset button to undo it
    // https://storybook.js.org/docs/react/essentials/controls#annotation
    onAction: {
      control: 'select',
      options: [undefined],
    },
    onSelectionChange: {
      table: {
        disable: true,
      },
    },
    onSortChange: {
      table: {
        disable: true,
      },
    },
    disabledBehavior: {
      table: {
        disable: true,
      },
    },
    disabledKeys: {
      table: {
        disable: true,
      },
    },
    selectedKeys: {
      table: {
        disable: true,
      },
    },
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
    selectionMode: {
      control: 'select',
      options: ['none', 'single', 'multiple'],
    },
    // selectionStyle: {
    //   control: 'select',
    //   options: ['checkbox', 'highlight'],
    // },
    disallowEmptySelection: {
      control: 'boolean',
    },
  },
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

StaticContents.storyName = 'static contents';

let columns = [
  { name: 'Foo', key: 'foo' },
  { name: 'Bar', key: 'bar' },
  { name: 'Baz', key: 'baz' },
];

let items = [
  { test: 'Test 1', foo: 'Foo 1', bar: 'Bar 1', yay: 'Yay 1', baz: 'Baz 1' },
  { test: 'Test 2', foo: 'Foo 2', bar: 'Bar 2', yay: 'Yay 2', baz: 'Baz 2' },
  { test: 'Test 1', foo: 'Foo 3', bar: 'Bar 1', yay: 'Yay 1', baz: 'Baz 1' },
  { test: 'Test 2', foo: 'Foo 4', bar: 'Bar 2', yay: 'Yay 2', baz: 'Baz 2' },
  { test: 'Test 1', foo: 'Foo 5', bar: 'Bar 1', yay: 'Yay 1', baz: 'Baz 1' },
  { test: 'Test 2', foo: 'Foo 6', bar: 'Bar 2', yay: 'Yay 2', baz: 'Baz 2' },
  { test: 'Test 1', foo: 'Foo 7', bar: 'Bar 1', yay: 'Yay 1', baz: 'Baz 1' },
  { test: 'Test 2', foo: 'Foo 8', bar: 'Bar 2', yay: 'Yay 2', baz: 'Baz 2' },
];

export const Dynamic = (args: ArgTypes) => (
  <TableView
    aria-label="TableView with dynamic content"
    height="scale.2400"
    width="scale.3400"
    {...args}
  >
    <TableHeader columns={columns}>
      {column => <Column>{column.name}</Column>}
    </TableHeader>
    <TableBody items={items}>
      {item => (
        <Row key={item.foo}>
          {key => <Cell>{item[key as keyof typeof item]}</Cell>}
        </Row>
      )}
    </TableBody>
  </TableView>
);

export const DisabledKeys = (args: ArgTypes) => (
  <Dynamic
    {...args}
    // @ts-expect-error
    disabledBehavior={args.selectionMode === 'none' ? 'all' : 'selection'}
  />
);
DisabledKeys.args = {
  disabledKeys: new Set(['Foo 1', 'Foo 3']),
  selectionMode: 'none',
};

export const HiddenHeader = (args: ArgTypes) => (
  <TableView
    aria-label="TableView with hidden header"
    width="scale.3400"
    // height="scale.2400"
    {...args}
  >
    <TableHeader>
      <Column key="foo" width="2fr">
        Foo
      </Column>
      <Column key="bar" width="2fr">
        Bar
      </Column>
      <Column key="baz" hideHeader width="1fr">
        Actions
      </Column>
    </TableHeader>
    <TableBody>
      <Row>
        <Cell>One</Cell>
        <Cell>Two</Cell>
        <Cell>
          <ActionButton>Three</ActionButton>
        </Cell>
      </Row>
      <Row>
        <Cell>Four</Cell>
        <Cell>Five</Cell>
        <Cell>
          <ActionButton>Six</ActionButton>
        </Cell>
      </Row>
    </TableBody>
  </TableView>
);

export const FocusableContent = (args: ArgTypes) => (
  <Flex direction="column">
    <label htmlFor="focus-before">Focus before</label>
    <input id="focus-before" />
    <TableView aria-label="TableView with focusable content" {...args}>
      <TableHeader>
        <Column key="foo">Foo</Column>
        <Column key="bar">Bar</Column>
        <Column key="baz">baz</Column>
      </TableHeader>
      <TableBody>
        <Row>
          <Cell>
            <Switch aria-label="Foo" size="small" />
          </Cell>
          <Cell>
            <TextLink
              href="https://thinkmill.com"
              target="_blank"
              prominence="high"
            >
              Thinkmill
            </TextLink>
          </Cell>
          <Cell>
            <Badge tone="neutral">Company</Badge>
          </Cell>
        </Row>
        <Row>
          <Cell>
            <Switch aria-label="Foo" size="small" />
          </Cell>
          <Cell>
            <TextLink
              href="https://keystatic.com/"
              target="_blank"
              prominence="high"
            >
              Keystatic
            </TextLink>
          </Cell>
          <Cell>
            <Badge tone="highlight">Project</Badge>
          </Cell>
        </Row>
        <Row>
          <Cell>
            <Switch aria-label="Foo" size="small" />
          </Cell>
          <Cell>
            <TextLink
              href="https://keystonejs.com/"
              target="_blank"
              prominence="high"
            >
              Keystone
            </TextLink>
          </Cell>
          <Cell>
            <Badge tone="highlight">Project</Badge>
          </Cell>
        </Row>
      </TableBody>
    </TableView>
    <label htmlFor="focus-after">Focus after</label>
    <input id="focus-after" />
  </Flex>
);

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

export const Resizing = (args: ArgTypes) => (
  <Box backgroundColor="surface" padding="large">
    <TableView
      aria-label="TableView with resizable columns"
      // width="scale.3400"
      // height="scale.2400"
      onSelectionChange={onSelectionChange}
      {...args}
    >
      <TableHeader>
        <Column allowsResizing key="foo" defaultWidth="1fr">
          Foo
        </Column>
        <Column allowsResizing key="bar" defaultWidth="2fr">
          Bar
        </Column>
        <Column allowsResizing key="baz" defaultWidth="1fr">
          Baz
        </Column>
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
  </Box>
);

export const Reorderable = (args: ArgTypes) => (
  <ReorderExample
    onDrop={action('drop')}
    onDragStart={action('dragStart')}
    onDragEnd={action('dragEnd')}
    tableViewProps={args}
  />
);

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

export const StickyCheckboxes = () => {
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
      // onAction={(...args) => {
      //   console.log('onAction', ...args);
      //   action('onAction')(...args);
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
          { name: 'Name', key: 'name', width: '33%' },
          { name: 'Type', key: 'type', width: '33%' },
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

              return <Cell>{value}</Cell>;
            }}
          </Row>
        )}
      </TableBody>
    </TableView>
  );
};

StickyCheckboxes.story = {
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
ManyCells.storyName = 'many cells';

export const EmptyState = () => {
  const [isEmpty, setEmpty] = useState(true);

  return (
    <VStack gap="large">
      <Switch onChange={setEmpty} isSelected={isEmpty}>
        Show empty state
      </Switch>
      <TableView
        aria-label="TableView with empty state"
        width="scale.6000"
        height="scale.3000"
        renderEmptyState={renderEmptyState}
      >
        <TableHeader columns={manyColumns}>
          {column => <Column minWidth={100}>{column.name}</Column>}
        </TableHeader>
        <TableBody items={isEmpty ? [] : manyRows}>
          {item => (
            <Row key={item.foo}>
              {key => <Cell>{item[key as keyof typeof item]}</Cell>}
            </Row>
          )}
        </TableBody>
      </TableView>
    </VStack>
  );
};
EmptyState.storyName = 'renderEmptyState';

export const IsLoading = () => (
  <TableView
    aria-label="TableView with loading state"
    width="scale.6000"
    height="scale.3000"
    renderEmptyState={renderEmptyState}
  >
    <TableHeader columns={manyColumns}>
      {column => <Column minWidth={100}>{column.name}</Column>}
    </TableHeader>
    <TableBody items={true ? [] : manyRows} loadingState="loading">
      {item => (
        <Row key={item.foo}>
          {key => <Cell>{item[key as keyof typeof item]}</Cell>}
        </Row>
      )}
    </TableBody>
  </TableView>
);
IsLoading.storyName = 'isLoading';

function AsyncLoadingExample(props: any) {
  interface Item {
    data: {
      id: string;
      url: string;
      title: string;
    };
  }

  let list = useAsyncList<Item>({
    getKey: item => item.data.id,
    async load({ signal, cursor }) {
      let url = new URL('https://www.reddit.com/r/upliftingnews.json');
      if (cursor) {
        url.searchParams.append('after', cursor);
      }

      let res = await fetch(url.toString(), { signal });
      let json = await res.json();
      return { items: json.data.children, cursor: json.data.after };
    },
    sort({ items, sortDescriptor }) {
      return {
        items: items.slice().sort((a, b) => {
          let cmp =
            // @ts-ignore
            a.data[sortDescriptor.column] < b.data[sortDescriptor.column]
              ? -1
              : 1;
          if (sortDescriptor.direction === 'descending') {
            cmp *= -1;
          }
          return cmp;
        }),
      };
    },
  });

  return (
    <div>
      {/* <ActionButton
        marginBottom={10}
        onPress={() => list.remove(list.items[0].data.id)}
      >
        Remove first item
      </ActionButton> */}
      <TableView
        {...props}
        sortDescriptor={list.sortDescriptor}
        onSortChange={list.sort}
        selectedKeys={list.selectedKeys}
        onSelectionChange={list.setSelectedKeys}
      >
        <TableHeader>
          <Column key="score" width={100} allowsSorting>
            Score
          </Column>
          <Column key="title" isRowHeader allowsSorting>
            Title
          </Column>
          <Column key="author" minWidth={200} allowsSorting>
            Author
          </Column>
          <Column key="num_comments" width={116} allowsSorting>
            Comments
          </Column>
        </TableHeader>
        <TableBody
          items={list.items}
          loadingState={list.loadingState}
          onLoadMore={list.loadMore}
        >
          {item => (
            <Row key={item.data.id}>
              {key =>
                key === 'title' ? (
                  <Cell textValue={item.data.title}>
                    <TextLink
                      prominence="high"
                      href={item.data.url}
                      target="_blank"
                    >
                      {item.data.title}
                    </TextLink>
                  </Cell>
                ) : (
                  <Cell>{item.data[key as keyof typeof item.data]}</Cell>
                )
              }
            </Row>
          )}
        </TableBody>
      </TableView>
    </div>
  );
}

export const AsyncLoading = (args: ArgTypes) => (
  <AsyncLoadingExample aria-label="TableView with async loading" {...args} />
);
AsyncLoading.args = {
  height: 'scale.3000',
  width: 'container.small',
  selectionMode: 'multiple',
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

// Utils
// ----------------------------------------------------------------------------

function renderEmptyState() {
  return (
    <VStack gap="large">
      <Heading align="center">No results</Heading>
      <Text align="center">Some message about why there's no results.</Text>
    </VStack>
  );
}
