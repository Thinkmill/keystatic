import { expect, it, describe } from '@jest/globals';
import { render } from '@testing-library/react';

import { NavGroup } from '..';

describe('nav-list/NavGroup', () => {
  it('should render a list <ul> with children', () => {
    const { getByRole } = render(
      <NavGroup title="group-label">Child</NavGroup>
    );

    expect(getByRole('list')).toHaveTextContent('Child');
  });
  it('should label the list via a heading element', () => {
    const { getByRole } = render(
      <NavGroup title="group-label">Child</NavGroup>
    );

    expect(getByRole('heading')).toHaveTextContent('group-label');
    expect(getByRole('list')).toHaveAccessibleName('group-label');
  });
});
