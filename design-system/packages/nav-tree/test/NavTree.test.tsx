import '@testing-library/jest-dom';

import { renderWithProvider } from '@voussoir/test-utils';

import { NavTree } from '../src';

describe('nav-tree/NavTree', () => {
  it('renders', () => {
    const { queryByText } = renderWithProvider(<NavTree>Test</NavTree>);

    expect(queryByText('Test')).toBeTruthy();
  });
});
