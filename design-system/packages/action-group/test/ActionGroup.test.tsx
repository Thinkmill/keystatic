import '@testing-library/jest-dom';
import { renderWithProvider } from '@keystar-ui/test-utils';

import { ActionGroup, Item } from '../src';

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
