import { action, storiesOf } from '@voussoir/storybook';

import { NavTree, Item } from '../src';

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

let nestedItems = [
  {
    name: 'Marsupials',
    children: [
      {
        name: 'Bilby',
        children: [{ name: 'Greater bilby' }, { name: 'Lesser bilby' }],
      },
      {
        name: 'Kangaroo',
        children: [
          { name: 'Red kangaroo' },
          {
            name: 'Grey kangaroo',
            children: [
              { name: 'Eastern grey kangaroo' },
              { name: 'Western grey kangaroo' },
            ],
          },
          { name: 'Tree kangaroo' },
          { name: 'Wallaroo' },
        ],
      },
      {
        name: 'Quokka',
      },
      {
        name: 'Wombat',
        children: [
          { name: 'Common wombat' },
          { name: 'Northern hairy-nosed wombat' },
          { name: 'Southern hairy-nosed wombat' },
        ],
      },
    ],
  },
  {
    name: 'Other',
    children: [
      {
        name: 'Echidna',
        children: [
          { name: 'Short-beaked echidna' },
          { name: 'Long-beaked echidna' },
        ],
      },
      { name: 'Dingo' },
      {
        name: 'Cassowary',
        children: [
          { name: 'Southern cassowary' },
          { name: 'Northern cassowary' },
          { name: 'Dwarf cassowary' },
        ],
      },
      { name: 'Platypus' },
    ],
  },
];

storiesOf('Components/NavTree', module)
  .add('default', () => (
    <NavTree
      items={flatItems}
      height="container.xsmall"
      width="container.xsmall"
      onSelectionChange={action('onSelectionChange')}
      children={itemRenderer}
    />
  ))
  .add('nested items', () => (
    <NavTree
      items={nestedItems}
      height="container.xsmall"
      width="container.xsmall"
      onSelectionChange={action('onSelectionChange')}
      children={itemRenderer}
    />
  ));

function itemRenderer<T extends { name: string }>(
  item: T & { children?: T[] }
) {
  return (
    <Item key={item.name} childItems={item.children}>
      {item.name}
    </Item>
  );
}
