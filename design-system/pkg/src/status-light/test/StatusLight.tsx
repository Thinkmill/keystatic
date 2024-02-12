import { expect, it, describe } from '@jest/globals';

import { renderWithProvider } from '#test-utils';

import { StatusLight } from '..';

describe('status-light/StatusLight', () => {
  it('renders', () => {
    const { queryByText } = renderWithProvider(<StatusLight>Test</StatusLight>);

    expect(queryByText('Test')).toBeTruthy();
  });

  it('accepts dom props', () => {
    const { getByTestId } = renderWithProvider(
      <StatusLight data-testid="foo" id="bar">
        Test
      </StatusLight>
    );

    expect(getByTestId('foo')).toHaveAttribute('id', 'bar');
  });
});
