import { jest, expect, it, describe } from '@jest/globals';

import { Text } from '@keystar/ui/typography';

import { fireEvent, renderWithProvider } from '#test-utils';

import { Item, NavTree } from '../index';

describe('nav-tree/NavTree', () => {
  it('renders', () => {
    const { queryByRole, queryAllByRole } = renderWithProvider(
      <NavTree>
        <Item>First</Item>
        <Item>Second</Item>
        <Item>Third</Item>
      </NavTree>
    );

    expect(queryByRole('treegrid')).toBeTruthy();
    expect(queryAllByRole('row')).toHaveLength(3);
  });
  it('items support children', () => {
    let mockClick = jest.fn();
    const { getAllByRole } = renderWithProvider(
      <NavTree>
        <Item textValue="First">
          <Text>First</Text>
          <button onClick={mockClick}>First button</button>
        </Item>
        <Item textValue="Second">
          <Text>Second</Text>
          <button>Second button</button>
        </Item>
        <Item textValue="Third">
          <Text>Third</Text>
          <button>Third button</button>
        </Item>
      </NavTree>
    );

    let buttons = getAllByRole('button');
    expect(buttons).toHaveLength(3);

    fireEvent.click(buttons[0]);
    expect(mockClick).toHaveBeenCalled();
  });
  it('supports dynamic items', () => {
    const { queryAllByRole } = renderWithProvider(
      <NavTree
        items={[{ name: 'First' }, { name: 'Second' }, { name: 'Third' }]}
      >
        {item => <Item key={item.name}>{item.name}</Item>}
      </NavTree>
    );

    expect(queryAllByRole('row')).toHaveLength(3);
  });
  it('supports nested items', () => {
    const { queryAllByRole } = renderWithProvider(
      <NavTree items={nestedItems}>
        {item => (
          <Item key={item.name} childItems={item.children}>
            {item.name}
          </Item>
        )}
      </NavTree>
    );

    expect(queryAllByRole('row')).toHaveLength(2);
  });
  it('supports expanded items', () => {
    const { queryAllByRole } = renderWithProvider(
      <NavTree
        items={nestedItems}
        expandedKeys={[
          'Category 1',
          'Subcategory 1.1',
          'Item 1.1.1',
          'Item 1.1.2',
          'Category 2',
        ]}
      >
        {item => (
          <Item key={item.name} childItems={item.children}>
            {item.name}
          </Item>
        )}
      </NavTree>
    );

    expect(queryAllByRole('row')).toHaveLength(14);
  });
});

let nestedItems = [
  {
    name: 'Category 1',
    children: [
      {
        name: 'Subcategory 1.1',
        children: [
          {
            name: 'Item 1.1.1',
            children: [
              { name: 'Subitem 1.1.1.1' },
              { name: 'Subitem 1.1.1.2' },
              { name: 'Subitem 1.1.1.3' },
            ],
          },
          {
            name: 'Item 1.1.2',
            children: [
              { name: 'Subitem 1.1.2.1' },
              { name: 'Subitem 1.1.2.2' },
            ],
          },
          { name: 'Item 1.1.3' },
        ],
      },
    ],
  },
  {
    name: 'Category 2',
    children: [
      { name: 'Subcategory 2.1' },
      { name: 'Subcategory 2.2' },
      { name: 'Subcategory 2.3' },
    ],
  },
];
