import { jest, expect, it } from '@jest/globals';

import { firePress, renderWithProvider } from '#test-utils';

import { Tag, TagGroup, TagList } from '..';

it('renders static and dynamic tags', () => {
  let tree = renderWithProvider(
    <TagGroup aria-label="tag group">
      <TagList items={[{ id: 'one', label: 'One' }]}>
        {item => <Tag id={item.id}>{item.label}</Tag>}
      </TagList>
    </TagGroup>
  );
  expect(tree.getByRole('grid')).toHaveAttribute('aria-label', 'tag group');
  expect(tree.getByRole('row', { name: 'One' })).toBeInTheDocument();
});

it('removes a tag through the RAC remove slot', () => {
  let onRemove = jest.fn();
  let tree = renderWithProvider(
    <TagGroup aria-label="tag group" onRemove={onRemove}>
      <TagList>
        <Tag id="one">One</Tag>
      </TagList>
    </TagGroup>
  );
  firePress(tree.getByRole('button', { name: 'Remove One' }));
  expect(onRemove).toHaveBeenCalledWith(new Set(['one']));
});
