import '@testing-library/jest-dom';

import { globeIcon } from '@voussoir/icon/icons/globeIcon';
import { Icon } from '@voussoir/icon';
import { renderWithProvider } from '@voussoir/test-utils';

import { Badge } from '../src';

describe('badge/Badge', () => {
  it('renders', () => {
    const { queryByText } = renderWithProvider(<Badge>Test</Badge>);

    expect(queryByText('Test')).toBeTruthy();
  });

  it('renders children', () => {
    const { getByRole } = renderWithProvider(
      <Badge>
        <Icon src={globeIcon} />
      </Badge>
    );

    expect(getByRole('img', { hidden: true })).toBeTruthy();
  });

  it('accepts dom props', () => {
    const { getByTestId } = renderWithProvider(
      <Badge data-testid="foo" id="bar">
        Test
      </Badge>
    );

    expect(getByTestId('foo')).toHaveAttribute('id', 'bar');
  });
});
