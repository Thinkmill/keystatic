import { expect, it, describe } from '@jest/globals';

import { render } from '@testing-library/react';

import { NavList } from '..';

describe('nav-list/NavList', () => {
  it('should render a list <ul> with children', () => {
    const { getByRole } = render(<NavList>Child</NavList>);

    expect(getByRole('list')).toHaveTextContent('Child');
  });
  it('should render a labellable <nav> element', () => {
    const { getByRole } = render(
      <NavList aria-label="nav-label">Child</NavList>
    );

    expect(getByRole('navigation')).toHaveAccessibleName('nav-label');
  });
});
