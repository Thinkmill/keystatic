import { expect, it, describe } from '@jest/globals';

import { render } from '@testing-library/react';

import { NavItem } from '..';

describe('nav-list/NavItem', () => {
  it('should render a link <a> with children', () => {
    const { getByRole } = render(<NavItem href="/item/path">Child</NavItem>);

    expect(getByRole('link')).toHaveAttribute('href', '/item/path');
    expect(getByRole('link')).toHaveTextContent('Child');
  });
  it('should be addressable', () => {
    const { getByTestId } = render(
      <NavItem href="#" data-testid="item-test-id" id="item-id">
        Child
      </NavItem>
    );

    expect(getByTestId('item-test-id')).toHaveAttribute('id', 'item-id');
  });
});
