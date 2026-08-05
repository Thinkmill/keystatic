import { expect, it } from '@jest/globals';

import { renderWithProvider } from '#test-utils';

import {
  NavTree,
  NavTreeCollection,
  NavTreeItem,
  NavTreeItemContent,
} from '..';

it('renders nested dynamic items', () => {
  let items = [
    {
      id: 'parent',
      name: 'Parent',
      children: [{ id: 'child', name: 'Child' }],
    },
  ];
  let tree = renderWithProvider(
    <NavTree
      aria-label="Navigation"
      items={items}
      defaultExpandedKeys={['parent']}
    >
      {item => (
        <NavTreeItem id={item.id} textValue={item.name}>
          <NavTreeItemContent>{item.name}</NavTreeItemContent>
          <NavTreeCollection items={item.children}>
            {child => (
              <NavTreeItem id={child.id} textValue={child.name}>
                <NavTreeItemContent>{child.name}</NavTreeItemContent>
              </NavTreeItem>
            )}
          </NavTreeCollection>
        </NavTreeItem>
      )}
    </NavTree>
  );
  expect(
    tree.getByRole('treegrid', { name: 'Navigation' })
  ).toBeInTheDocument();
  expect(tree.getAllByRole('row')).toHaveLength(2);
});
