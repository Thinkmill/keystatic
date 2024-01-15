import { renderWithProvider } from '#test-utils';

import { ActionGroup, Item } from '..';
import { expect, describe, it } from '@jest/globals';

describe('action-group/ActionGroup', () => {
  it('renders', () => {
    const { getByRole, getAllByRole } = renderWithProvider(
      <ActionGroup data-testid="test-id">
        <Item>Child one</Item>
        <Item>Child two</Item>
      </ActionGroup>
    );

    expect(getByRole('toolbar')).toBeTruthy();
    expect(getAllByRole('button')).toHaveLength(2);
  });
});
