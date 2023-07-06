import { Meta } from '@storybook/react';
import { ComponentProps, Key, ReactNode, useMemo, useState } from 'react';

import { Badge } from '@keystar/ui/badge';
import { Button } from '@keystar/ui/button';
import { Icon } from '@keystar/ui/icon';
import { copyIcon } from '@keystar/ui/icon/icons/copyIcon';
import { saveIcon } from '@keystar/ui/icon/icons/saveIcon';
import { trash2Icon } from '@keystar/ui/icon/icons/trash2Icon';
import { Flex, Grid } from '@keystar/ui/layout';
import { TextLink } from '@keystar/ui/link';
import {
  Cell,
  Column,
  Row,
  SortDescriptor,
  TableBody,
  TableHeader,
  TableView,
} from '@keystar/ui/table';
import { TextField } from '@keystar/ui/text-field';
import { Heading, Text } from '@keystar/ui/typography';

import { AppShell } from './components';
import { pokemonItems } from './data';
import { breakpointQueries, css } from '@keystar/ui/style';

export default {
  title: 'Patterns / Composition',
  layout: 'fullscreen',
} as Meta;

// =============================================================================
// DASHBOARD
// =============================================================================

export const AppDashboard = () => {
  return (
    <AppShell>
      <Flex
        // backgroundColor="surface"
        direction="column"
        paddingX="xlarge"
        paddingBottom="xlarge"
        gap="regular"
        flex
      >
        <Flex
          gap="regular"
          alignItems="center"
          height="element.medium"
          marginY="medium"
        >
          <Text color="neutralEmphasis" weight="semibold">
            Something should go here, but what?
          </Text>
        </Flex>
        <Grid gap="xxlarge">
          <Heading size="large">Dashboard</Heading>

          <Heading size="medium">Lists</Heading>

          <Grid
            columns={{
              tablet: 'repeat(2, 1fr)',
              desktop: 'repeat(3, 1fr)',
              wide: 'repeat(4, 1fr)',
            }}
            gap="medium"
          >
            {['Users', 'Puppies', 'Reviews'].map(name => (
              <Flex
                minHeight="element.large"
                direction="column"
                gap="regular"
                alignItems="start"
                backgroundColor="canvas"
                borderRadius="medium"
                overflow="hidden"
                boxShadow="small regular"
                key={name}
                padding="medium"
              >
                <Heading>
                  <TextLink href="linkToStory:app-list">{name}</TextLink>
                </Heading>
                <Badge>{Math.round(Math.random() * 500)}</Badge>
              </Flex>
            ))}
          </Grid>

          <Heading size="medium">Singletons</Heading>
          <Grid
            columns={{
              tablet: 'repeat(2, 1fr)',
              desktop: 'repeat(3, 1fr)',
              wide: 'repeat(4, 1fr)',
            }}
            gap="medium"
          >
            <Flex
              minHeight="element.large"
              direction="column"
              gap="regular"
              alignItems="start"
              backgroundColor="canvas"
              borderRadius="medium"
              overflow="hidden"
              boxShadow="small regular"
              padding="medium"
            >
              <Heading>Settings</Heading>
            </Flex>
          </Grid>
        </Grid>
      </Flex>
    </AppShell>
  );
};

// =============================================================================
// LIST: Table
// =============================================================================

export const AppList = () => {
  let [selectedKeys, setSelectedKeys] = useState<Iterable<Key>>([]);
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
    <AppShell>
      <Flex
        // backgroundColor="surface"
        direction="column"
        paddingX="xlarge"
        paddingBottom="xlarge"
        gap="regular"
        flex
      >
        <Flex
          gap="regular"
          alignItems="center"
          height="element.medium"
          marginY="medium"
        >
          <Text color="neutralEmphasis" weight="semibold">
            Something should go here, but what?
          </Text>
        </Flex>

        <Grid gap="xxlarge">
          <Heading size="large" id="page-title">
            Puppies
          </Heading>

          <TableView
            aria-labelledby="page-title"
            selectionMode="multiple"
            // onRowAction={linkTo('patterns-composition--app-item')}
            // onSelectionChange={() => {}}
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
            onSortChange={setSortDescriptor}
            sortDescriptor={sortDescriptor}
          >
            <TableHeader
              columns={[
                { name: 'ID', key: 'id', width: 60 },
                { name: 'Name', key: 'name' },
                { name: 'Type', key: 'type' },
                { name: 'HP', key: 'health', width: 80 },
                { name: 'ATK', key: 'attack', width: 80 },
                { name: 'DEF', key: 'defense', width: 80 },
              ]}
            >
              {column => (
                <Column
                  align={column.width === 80 ? 'end' : undefined}
                  allowsSorting={column.key !== 'type'}
                  isRowHeader={column.key === 'name'}
                  width={column.width}
                >
                  {column.name}
                </Column>
              )}
            </TableHeader>
            <TableBody items={items.slice(0, 20)}>
              {item => (
                <Row key={item.id}>
                  {key => {
                    let value = item[key as keyof typeof item];
                    if (Array.isArray(value)) {
                      value = value.join(', ');
                    }
                    if (key === 'name') {
                      return (
                        <Cell textValue={item[key]}>
                          <Text>
                            <TextLink
                              href="linkToStory:app-item"
                              prominence="high"
                            >
                              {value}
                            </TextLink>
                          </Text>
                        </Cell>
                      );
                    }

                    return <Cell>{value}</Cell>;
                  }}
                </Row>
              )}
            </TableBody>
          </TableView>
        </Grid>
      </Flex>
    </AppShell>
  );
};

// =============================================================================
// ITEM VIEW
// =============================================================================

export const AppItem = () => {
  return (
    <AppShell>
      <Flex
        // backgroundColor="surface"
        direction="column"
        paddingX="xlarge"
        paddingBottom="xlarge"
        gap="regular"
        flex
      >
        <Flex
          gap="regular"
          alignItems="center"
          height="element.medium"
          marginY="medium"
        >
          <Text color="neutralEmphasis" weight="semibold">
            Breadcrumbs
          </Text>
          <Text color="color.alias.borderDisabled" role="presentation">
            /
          </Text>
          <Text color="neutralEmphasis" weight="semibold">
            Would
          </Text>
          <Text color="color.alias.borderDisabled" role="presentation">
            /
          </Text>
          <Text color="color.alias.foregroundDisabled" weight="semibold">
            Go here
          </Text>
        </Flex>

        <Flex gap="xlarge" direction={{ mobile: 'column', desktop: 'row' }}>
          <Flex gap="large" direction="column" flex>
            <Heading size="large" minHeight="element.large">
              My dog is cool
            </Heading>
            <Flex gap="xlarge" direction="column">
              {[
                'Cheesecake',
                'Gummi bears',
                'Jelly beans',
                'Lollipop',
                'Marzipan',
                'Soufflé',
                'Sweet plum',
              ].map((item, index) => (
                <TextField
                  key={item}
                  label={item}
                  isRequired={index < 2}
                  description={Math.random() > 0.6 && paragraph()}
                />
              ))}
            </Flex>
          </Flex>
          <Flex
            gap="xxlarge"
            direction="column"
            minWidth={0}
            UNSAFE_className={css({
              [breakpointQueries.above.desktop]: {
                width: 280,
              },
            })}
          >
            <Flex gap="regular" minHeight="element.large">
              <Button flex={{ desktop: true }} prominence="high">
                <Icon src={saveIcon} />
                <Text>Save</Text>
              </Button>
              <Button flex={{ desktop: true }}>Reset</Button>
              <Button aria-label="Duplicate" prominence="low">
                <Icon src={copyIcon} />
              </Button>
              <Button aria-label="Delete" prominence="low" tone="critical">
                <Icon src={trash2Icon} />
              </Button>
            </Flex>

            <MetaData>
              <MetaDataItem title="Id">
                <Text>62da59019696b112cf8440c6</Text>
              </MetaDataItem>

              <MetaDataItem title="URL">
                <Text>
                  <TextLink href="https://acme.com/api/categories/62da59019696b112cf8440c69696b112cf8440c6">
                    https://acme.com/api/categories/62da59019696b112cf8440c69696b112cf8440c6
                  </TextLink>
                </Text>
              </MetaDataItem>

              <MetaDataItem title="Created">
                <Text>Mar 19 2018, 10:55</Text>
              </MetaDataItem>

              <MetaDataItem title="Updated">
                <Text>Feb 1 2022, 16:45</Text>
              </MetaDataItem>
            </MetaData>
          </Flex>
        </Flex>
      </Flex>
    </AppShell>
  );
};

// Utils
// -----------------------------------------------------------------------------

function paragraph(count?: number) {
  let paragraphs = [
    'Jelly beans pie jelly-o carrot cake cake.',
    'Cookie gummi bears sesame snaps biscuit sweet roll icing dragée pie candy.',
    'Sugar plum marzipan sweet soufflé lollipop cheesecake caramels.',
    'Tart halvah toffee tart wafer.',
    'Sweet roll pastry sweet candy dessert cake brownie tiramisu tiramisu.',
    'Jelly halvah cupcake chocolate cake chocolate apple pie.',
    'Jelly-o cotton candy bonbon donut carrot cake gingerbread.',
    'Donut bonbon gingerbread donut carrot cake cupcake.',
    'Sesame snaps sugar plum oat cake lemon drops marshmallow carrot cake sweet.',
    'Dessert shortbread muffin cupcake carrot cake dragée cheesecake carrot cake.',
    'Jujubes sugar plum caramels bear claw tiramisu marzipan.',
    'Cotton candy apple pie cookie biscuit liquorice halvah cheesecake.',
  ];

  if (count) {
    paragraphs = paragraphs.slice(0, count);
  }

  return paragraphs[Math.floor(Math.random() * paragraphs.length)];
}

// Styled components
// -----------------------------------------------------------------------------

const MetaData = (props: ComponentProps<typeof Flex>) => (
  <>
    <Text visuallyHidden elementType="h2">
      Meta data
    </Text>
    <Flex gap="xxlarge" direction="column" elementType="ul" {...props} />
  </>
);

const MetaDataItem = ({
  title,
  children,
}: {
  title: ReactNode;
} & ComponentProps<typeof Flex>) => (
  <Flex gap="regular" direction="column" elementType="li">
    <Text
      elementType="h3"
      weight="bold"
      color="neutralEmphasis"
      casing="uppercase"
      size="small"
    >
      {title}
    </Text>
    {children}
  </Flex>
);
