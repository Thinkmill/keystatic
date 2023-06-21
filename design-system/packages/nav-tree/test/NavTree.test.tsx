import '@testing-library/jest-dom';

import { renderWithProvider } from '@voussoir/test-utils';

import { Item, NavTree } from '../src';

describe('nav-tree/NavTree', () => {
  it('renders', () => {
    const { queryByText } = renderWithProvider(
      <NavTree onAction={() => {}}>
        <Item>Test</Item>
      </NavTree>
    );

    expect(queryByText('Test')).toBeTruthy();
  });
});
